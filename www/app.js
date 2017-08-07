
mmir.ready(function () { require(['jquery'], function(){

	test_isNetworkAvailable();


	//use virtual event-names, if jQuery mobile is loaded:
	var isJqm = !!$.jqmData;

	//prepare app-module object for public export of functions etc.
	mmir.app = {
			click_name: (isJqm? 'v' : '') + 'click',
			mousedown_name: (isJqm? 'v' : '') + 'mousedown',
			mouseup_name: (isJqm? 'v' : '') + 'mouseup',
			mousecancel_name: (isJqm? 'v' : '') + 'mousecancel',
	};

	var logger = require('mmirf/logger').create('app');

	//initialize BACK-BUTTON handling:
	initHistoryBackHandler();
	//set default behavior for buttons:
	mmir.dialog.setOnPageRenderedHandler(executeAfterEachPageIsLoaded);

	// load/initialize the app asynchronously, an then "signal" the framework
	// that it should start with the first page by firing the "init" event
	require(['apprenderer', 'mmirf/env'], function(renderFactory, env){

		//NOTE: need to set the canvas element in controller's on_page_load()
		mmir.app.renderer = renderFactory.createMicRenderer();
		mmir.app.renderer.id = 'mic-renderer';
		mmir.app.renderer.repaint = function(val, isForce){

			if(typeof val !== 'number'){
				val = 0;
			}

			var $canvas = $('#'+this.id);
			mmir.app.renderer.draw(val, $canvas, isForce);
		};

		mmir.app.renderer.initPage = function(){

			//set-up render for microphone-levels
			var canvas = $('#'+mmir.app.rendererId);
			if(canvas.length < 1){
				var micBtn = $('#mic_button');
				micBtn.html('<canvas id="'+this.id+'" height="'+micBtn.height()+'" width="'+micBtn.width()+'"></canvas>');
				canvas = $('#'+this.id);
			}
			this.set(canvas);
			this.repaint(0, true);
		};

		var isCordova = env.isCordovaEnv;
		var isNuanceSpeech = false;
		var cordovaSpeechModules = mmir.conf.get('mediaManager.plugins.cordova', null);
		if(cordovaSpeechModules){
			for(var i=cordovaSpeechModules.length-1; i <= 0; --i){
				if(/nuanceAudioInput\.js/i.test(cordovaSpeechModules[i])){
					isNuanceSpeech = true;
					break;
				}
			}
		}

		mmir.media.on('miclevelchanged', function(micLevel){

			var max = 90;
			if(isCordova){

				//unfortunately we have to do some normalization for the various Speech plugins...

				//convert to positive values, if necessary (we are only interested in the absolute values)
				if(micLevel < 0){
					micLevel = -micLevel;
				}

				//normalize very small values to zero
				if(micLevel < 1){
					micLevel = 0;
				} else if(isNuanceSpeech){
					max -= 20;
					micLevel -= 20;
				}

			}
			var scale = max/4;

			//map float-value [0, 90] to integer [0, 4]
			var val = parseInt(micLevel / scale);
			mmir.app.renderer.repaint(val);
		});

		var doStartApp = function(){
			//start app by triggering INIT event on dialog-engine:
			mmir.dialog.raise('init');
		};

		if(isCordova){
			document.addEventListener("deviceready", doStartApp, false);
		} else {
			$(doStartApp);
		}

	});


	//setup handler for BACK button (and for swipe-left gesture)
	function initHistoryBackHandler() {

		var isCordovaEnv = ! mmir.const.isBrowserEnv();

		//generic BACK handler:
		var backButtonHandler = function (event){

			if(isCordovaEnv || ( ! isCordovaEnv && event.state)){

				//FIX for browser-env.: to popstate-event is triggered not only when back-button is pressed in browser (however, in this case it seems, that the event.state is empty...)
				if( ! isCordovaEnv && ! event.state){
					event.preventDefault();
					return false; /////////////////////////// EARLY EXIT ///////////////////////////////////
				}
				triggerClickFeedback({haptic : false});//vibration is already triggered by system for this back-button...
				mmir.dialog.raise('back', {
					nativeBackButton : 'true'
				});
			}
			else if(event){
				event.preventDefault();
				return false;
			}
		};

		//register BACK-handler for environments and gesture:

		if(isCordovaEnv){
			//overwrite BACK-event for Android/cordova environment:
			document.addEventListener("backbutton", backButtonHandler, true);
		}
		else {
			//overwrite BACK-event in Browser environment:
			window.addEventListener("popstate", backButtonHandler, true);
		}


		//also trigger BACK on swipe-right gesture:
		var $ = require('jquery');
		$(document).on('swiperight', backButtonHandler);

	}

	//function that will be registered with the DialogManager to be executed
	// each time after a view was rendered
	function executeAfterEachPageIsLoaded() {

		//add a generic click-handler for BUTTONs
		//  generates a click-input for the InputEngine based on the button's name-attribute
		$("button").each(function(index, el) {
			var tis = $(this);
			var eventName;
			tis.bind(mmir.app.click_name, function(event) {

				event.preventDefault();

				eventName = "click_on_" + tis.attr("name");

				triggerClickFeedback();

				mmir.input.raise("touch_input_event");
				mmir.input.raise(eventName);

				return false;
			});
		});

	};

	//set up the handler for the microphone button:
	// we register this handler on the document, so this needs to be done only once
	$(document).on(mmir.app.click_name, '#mic_button', function(event){

		event.preventDefault();

		triggerClickFeedback();

		microClicked();
	});


	/////////////////////////////////////////////////// SPEECH INPUT / OUTPUT EXAMPLE //////////////////////////////

	var IS_WITH_END_OF_SPEECH_DETECTION = true;

	//TODO deal with view-change:
	//
	//		* EITTHER cancel before/on view change
	//		* OR set active-state of microphone button in new view
	//
	/*
	 * This is an example function for speech interaction:
	 *
	 *  * starts (and stops) the speech input
	 *  * processes the result via the SemanticInterpreter (grammar-based)
	 *  * "mirrors" the recognized text via text-to-speech
	 *
	 * Also the microphone button's state is update to active/inactive state on
	 * start/stop of speech input.
	 *
	 * There are two modes
	 *   * with silence detection (i.e. end-of-speech-detection)
	 *   * without silence detection
	 *
	 * If mode is with-silence-detection, then the recognizer will
	 * try to detect automatically the end of speech end terminates
	 * itself.
	 *
	 * If started in mode without-silence-detection the user must
	 * press the microphone button a 2nd time in order to complete the
	 * speech input.
	 *
	 *
	 */
	function microClicked(){

		var notification = mmir.notifier;
		notification.vibrate(500);

		var isUseEndOfSpeechDetection = IS_WITH_END_OF_SPEECH_DETECTION;

		var setActive = function(isActive){

			//add or remove the  active-class to mic-button:
			var func = isActive? 'add' : 'remove';
			$('#mic_button')[func+'Class']('footer_button_clicked');

			//reset microphone-levels visualization to 0
			mmir.app.renderer.repaint(0);
		};

		var isActive = function(){
			return $('#mic_button').hasClass('footer_button_clicked');
		};

		var evalSemantics = function(asr_result, isRaiseSemanticEvent){

			mmir.semantic.interpret(asr_result, function(result){

				var semantic;
				if(result.semantic != null) {
					semantic = result.semantic;
					semantic.phrase = asr_result;
					console.log("semantic : " + result.semantic);
				}
				else {

					//create "no-match" semantic-object:
					semantic = {
							"NoMatch": {
								"phrase": asr_result
							}
					};
				}

				if(isRaiseSemanticEvent){
					mmir.input.raise("speech_input_event",  semantic);
				}
			});

		};

		var successFunc = function recognizeSuccess(asr_result, asr_score, asr_type, asr_alternatives, asr_unstable){

			logger.info('[AudioInput] recoginition ('+asr_type+'): '  + JSON.stringify(asr_result));

			if(asr_type === 'RECORDING_BEGIN'){

				//... do something(?): speech recognition is now fully prepared and active

			} else if(asr_type === 'RECORDING_DONE' || asr_type === 'FINAL'){

				//mark microphone button as in-active when recording is finished
				setActive(false);
			}

			if(asr_result){

				if(
						// a final ASR result
						asr_type === 'FINAL'

							// an intermediate ASR result; may not be supported by all speech-recognition modules (in recording-mode ~ "sentences" during dictation)
							||	(!isUseEndOfSpeechDetection && asr_type === 'INTERMEDIATE')

							// an interim ASR results; may not be supported by all speech-recognition modules (these are possibly unstable interim results)
							//DISABLED do not read interim results, since these will come in while recognition is still active
//							||	asr_type === 'INTERIM'
				){

					mmir.media.textToSpeech(asr_result,

							function onFinished(){

						console.debug('Synthesized "'+asr_result+'".');

						//after TTS finished, evaluate the semantics for the ASR result:
						evalSemantics(asr_result, true);

					},
					function onError(err){

						console.error('Could not synthesize "'+asr_result+'": '+err);

						//if there was an TTS error, try to evaluate the semantics anyway:
						evalSemantics(asr_result);

					},
					function onPrepared(){
						console.debug('prepared TTS audio for "'+asr_result+'", starting to read now... ');
					}
					);

				}
				else {
					//if ASR is not an "end-result", try to evaluate the semantics for the ASR result anyway:
					evalSemantics(asr_result);
				}

			}

		};

		var errorFunc = function recognizeError (err){

			setActive(false);

			console.error('[AudioInput] Error while finishing recoginition: '+JSON.stringify(err));


			var msg = JSON.stringify(err);//mmir.lang.getText('did_not_understand_msg');
			mmir.media.textToSpeech(msg, null, null);
		};

		if(isUseEndOfSpeechDetection === false){


			//WITHOUT end-of-speech-detection (i.e. manual stop by user interaction):
			if (isActive()){

				console.log("[AudioInput] stop recoginition without automtic END OF SPEECH detection");

				mmir.media.stopRecord(successFunc, errorFunc);

			}
			else {

				console.log("[AudioInput] start recoginition without automtic END OF SPEECH detection");

				setActive(true);

				mmir.media.startRecord(
						successFunc, //FIXME should have different call for start/start-and-receive-intermediate-results ...
						function onError(err){
							var args = arguments;
							setTimeout(function(){errorFunc.apply(null, args);}, 5);
							alert('tts failed: '+err);
						}
				);
			}

		}
		else {
			//WITH end-of-speech-detection (i.e. automatic stop by silence detection):

			console.log("[AudioInput] start recoginition with automatic END OF SPEECH detection");

			if (isActive()){

				console.log("[AudioInput] speech recoginition with automtic END OF SPEECH detection: already in progress, stopping now...");

				mmir.media.stopRecord(
						function onResult(res){
							console.log("[AudioInput] MANUALLY stopped recoginition: "  + JSON.stringify(res));
							successFunc.apply(null, arguments);
						}, function onError(err){
							console.log("[AudioInput] failed to MANUALLY stop recoginition: "  + err);
							var args = arguments;
							setTimeout(function(){errorFunc.apply(null, args);}, 5);
							alert('tts failed: '+err);
						}
				);

			}
			else {

				console.log("[AudioInput] starting recoginition with automatic END OF SPEECH detection now...");

				setActive(true);

				mmir.media.recognize(successFunc, errorFunc);
			}
		}
	}


	///////////////////////////////////////// CLICK FEEDBACK EXAMPLE ////////////////////////////////////////

	var IS_SOUND_FEEDBACK  = true;
	var IS_HAPTIC_FEEDBACK = true;
	//default time-duration for click-feedback vibration
	var CLICK_VIBRATE_DURATION = 50;//ms

	function isSoundFeedbackEnabled() {
		var isSound = mmir.conf.get('soundFeedbackEnabled');
		if(typeof isSound === 'undefined'){
			isSound = IS_SOUND_FEEDBACK;
		}
		return isSound;
	}

	function isHapticFeedbackEnabled() {
		var isHaptic = mmir.conf.get('hapticFeedbackEnabled');
		if(typeof isHaptic === 'undefined'){
			isHaptic = IS_HAPTIC_FEEDBACK;
		}
		return isHaptic;
	}
	/**
	 *
	 * @param config (optional) cofiguration object with fields
	 * 			config.audio BOOLEAN set if sound should be included in this feedback
	 * 			config.haptic BOOLEAN set if vibration should be included in this feedback
	 */
	function triggerClickFeedback(config){

		var isSound  = config && typeof config.sound  !== 'undefined'? config.sound  : true;
		var isHaptic = config && typeof config.haptic !== 'undefined'? config.haptic : true;


		//TODO haptic and sound feedback should be run in parallel, not sequential (... use 'threads'?)
		if(isHaptic && isHapticFeedbackEnabled()){
			triggerHapticFeedback();
		}

		if(isSound && isSoundFeedbackEnabled()){
			triggerSoundFeedback();
		}
	}

	function triggerHapticFeedback(){
		setTimeout(function(){
			mmir.notifier.vibrate(CLICK_VIBRATE_DURATION);
		},0);
	}

	function triggerSoundFeedback(){
		//do not block function, return immediatly using setTimeout
		setTimeout(function(){
			mmir.notifier.beep(1);
		},0);
	}

	function triggerErrorFeedback(){
		triggerMulitpleVibrationFeedback(3);
	}

	function triggerMulitpleVibrationFeedback(number){

		var doTriggerErrorVibrateFeedback = function(){
			setTimeout(function(){
				triggerClickFeedback();
				++count;
				if(count < number){
					doTriggerErrorVibrateFeedback();
				}
			}, 4*CLICK_VIBRATE_DURATION);
		};

		triggerClickFeedback();
		var count = 1;
		if(count < number){
			doTriggerErrorVibrateFeedback();
		}
	}

	//export feedback-function:
		mmir.app.triggerClickFeedback = triggerClickFeedback;

		///////////////////////////////////////// TEST and DEBUG functions ////////////////////////////////////////

		function test_isNetworkAvailable(){

			// Check if a network connection is established.
			if (mmir.util.checkNetworkConnection() == false){
				alert("No network connection enabled.\nPlease enable network access.");
			} else {
				console.log("Network access is available.");
			}

		};


})});
