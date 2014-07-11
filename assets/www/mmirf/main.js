/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


var mobileDS = window.mobileDS ||
{};

var commonUtils;
var pm;
var viewFactory;
var motionDetector;
var dialogManager;
var inputManager;
var controllerManager;
var semanticInterpreter;
var modelManager;
var initialized = false;
var audioInput;
var applicationLanguage;
var langManager;
var appConfiguration;

var fileSys = '';
var content = '';

var IS_DEBUG_ENABLED = true;

var ACTIVE_TEXT_ELEMENT = null;

//devault time-duration for click-feedback vibration
var CLICK_VIBRATE_DURATION = 50;//ms

jQuery(document).ready(function(){
	if (forBrowser) onDeviceReady();
	else document.addEventListener("deviceready", onDeviceReady, false);
});


function fail(error) {
	console.log("Error! " + error.code);
}
//LOGGING end

function onDeviceReady(){
    console.log("device is ready");

    //overwrite BACK-event for Android/cordova environment:
    document.addEventListener("backbutton", backKeyDown, true);
    
    if(forBrowser){
	    //overwrite BACK-event in Browser environment:
	    window.addEventListener("popstate", backKeyDown, true);
    }
    
    commonUtils = mobileDS.CommonUtils.getInstance().initialize(initializeApplication);
}


function initializeApplication(){
	console.log("initialize Application.");
	
    commonUtils = mobileDS.CommonUtils.getInstance();
    
    commonUtils.loadCompiledGrammars(mobileDS.constants.getInstance(forBrowser).getGeneratedGrammarsPath(), function(){
    		
    
	    if (!forBrowser){
	
	    	// Check if a network connection is established.
	    	if (mobileDS.CommonUtils.getInstance().checkNetworkConnection() == false){
	    		alert("No network connection enabled.\nPlease enable network access.");
	//    		return false;
	    	} else {
	    		if(IS_DEBUG_ENABLED) console.log("Network access is available.");
	    	}
	    	
			mobileDS.CommonUtils.getInstance().loadAllPhonegapPlugins(mobileDS.constants.getInstance(forBrowser).getPluginsPath(), function(){
			        try {
			            for (var prop in window.plugins) {
			                console.log("Loaded plugin '" + prop + "'");
			            }
			        } 
			        catch (e) {
			            console.log("Exception: " + e);
			        }
			        loadManagers();
			});
	    }
	    else {
	    	loadManagers();
	    }
    });

}

function loadManagers(){
    mobileDS.ConfigurationManager.getInstance();
    
    langManager = mobileDS.LanguageManager.getInstance(mobileDS.ConfigurationManager.getInstance().get('language'));
    
    semanticInterpreter = mobileDS.SemanticInterpreter.getInstance();
    
    //this is a "dummy" listener for the on allowrecording event -> triggered when user allows getUserMedia (HTML5)
    // we need this, in case the browser has a permanent "allow" permission
    // -> 	then the event i striggered as soon as teh MediaManager (or more precisely html5AudioInput)
    //		is loaded/executed, i.e. before the "real" implementation for the listener in controller/application
    //		is loaded
    //		... so we use this "dummy" listener to catch the data that is delivered by the event, and use
    //			it later in controller/application (if this dummy was not triggered by then, it will be removed
    //			and discarded)
    MEDIA_ON_ALLOW_RECORD_LISTENER = function(recordingStream, audioContextImpl, recorderInstance){
		if(recordingStream){
			MEDIA_RECORDING_STREAM = recordingStream;
		}
		if(audioContextImpl){
			MEDIA_AUDIO_CONTEXT = audioContextImpl;
		}
		if(recorderInstance){
			MEDIA_RECORDER_INSTANCE = recorderInstance;
		}
		
		if(typeof MEDIA_RECORDING_STREAM !== 'undefined' && typeof MEDIA_AUDIO_CONTEXT !== 'undefined'){
			return {
				recordingStream : MEDIA_RECORDING_STREAM,
				audioContext : MEDIA_AUDIO_CONTEXT,
				recorderInstance: MEDIA_RECORDER_INSTANCE
			};
		}
		return null;
    };
    
    mobileDS.MediaManager.create(function(){
    		console.log('All Media-Plugins Loaded');
    		 mobileDS.SCIONExtension.getInstance();
    		    
//    	    controllerManager = //NOTE: create() has no return value any more! -> set controllerManager variable in callback
    	    	mobileDS.ControllerManager.create(afterLoadingControllers);
    	}, function (e) {
    		console.log('Error loading Media plugins');
    		if (e) console.log(e);
	},
		[{ name: 'onallowrecord', listener: MEDIA_ON_ALLOW_RECORD_LISTENER }]
	);
   
    	
}

function backKeyDown(event){
	if(!forBrowser || (forBrowser && event.state)){//if(IS_BACK_ACTIVE){
		
		//FIX for browser-env.: to popstate-event is triggered not only when back-button is pressed in browser (however, in this case it seems, that the event.state is empty...)
		if(forBrowser && !event.state){
			return; /////////////////////////// EARLY EXIT ///////////////////////////////////
		}
		triggerClickFeedback({haptic : false});//vibration is already triggered by system for this back-button...
		mobileDS.DialogEngine.getInstance().raise('back', { nativeBackButton : 'true'});
	}
}

function showLoader(){
	mobileDS.DialogEngine.getInstance().showWaitDialog();
//    $('.ui-loader').css('display', 'block');
}


function hideLoader(){
	mobileDS.DialogEngine.getInstance().hideWaitDialog();
//    $('.ui-loader').css('display', 'none');
}


function afterLoadingControllers(ctrlManager){
	
	mobileDS.InputEngine.create(function(engineInstance){
	    inputManager = engineInstance;
		inputManager.startEngine();
	
	    console.log("initialization finished");
	    /// callback end
	   
//	    var cm = mobileDS.CompassHandler.getInstance();
//	    cm.startWatch();

	
		controllerManager = ctrlManager;
		
		mobileDS.Notification.getInstance().initBeep();
		
	    pm = mobileDS.PresentationManager.getInstance();
	    
	    mobileDS.DialogEngine.create(function(engineInstance){
		    dialogManager = engineInstance;
		    
		    mobileDS.ModelManager.create(function(modelManagerInstance){
		    	modelManager = modelManagerInstance;
		    	
			    dialogManager.setOnPageRenderedHandler(exectueAfterEachPageIsLoaded);
			    dialogManager.startEngine();
			    var appLayout = pm.getLayout("Application");
			    var headerContents = appLayout.getHeaderContents();
			    var header = $("head");
			    header.append(headerContents);
			    $('#applications_dialogs').appendTo($.mobile.pageContainer).css({});
			    
		    });
		    
	    });//END: DialogEngine.create()
	    
	});//END: InputEngine.create()
    
}

function exectueAfterEachPageIsLoaded(ctrlName,viewName,data){
	//register "automatic" event handlers for buttons
	$("button").each(function(index, el){
	  var tis = $(this);
	  var eventName;
	  tis.bind('vmousedown', function(event){
	      tis.parent().addClass('ui-focus ui-btn-active ui-btn-down-a');
	      eventName = "touch_start_on_" + tis.attr("name");
	      mobileDS.InputEngine.getInstance().raise("touch_input_event");
	      mobileDS.InputEngine.getInstance().raise(eventName);
	  });
	  tis.bind('vclick', function(event){
		  event.preventDefault();
		  triggerClickFeedback();
	      eventName = "click_on_" + tis.attr("name");
	      mobileDS.InputEngine.getInstance().raise("touch_input_event");
	      mobileDS.InputEngine.getInstance().raise(eventName);
	  });
	  tis.bind('vmouseup', function(event){
		  tis.parent().removeClass('ui-focus ui-btn-active ui-btn-down-a');
		  eventName = "touch_end_on_" + tis.attr("name");
		  mobileDS.InputEngine.getInstance().raise("touch_input_event");
		  mobileDS.InputEngine.getInstance().raise(eventName);
	  });
	});
}

var IS_SOUND_FEEDBACK  = true;
var IS_HAPTIC_FEEDBACK = true;
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
	if(isHaptic && IS_HAPTIC_FEEDBACK){
		triggerHapticFeedback();
	}
	
	if(isSound && IS_SOUND_FEEDBACK){
		triggerSoundFeedback();
	}
}

function triggerHapticFeedback(){
//	if( ! forBrowser){
		//do not block function, return immediatly using setTimeout
		setTimeout(function(){
	    	mobileDS.Notification.getInstance().vibrate(CLICK_VIBRATE_DURATION);
		},0);
//	}
}

function triggerSoundFeedback(){
	//do not block function, return immediatly using setTimeout
	setTimeout(function(){
    	mobileDS.Notification.getInstance().beep(1);
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

function micClick(){
	var notification = mobileDS.Notification.getInstance();
	if (!forBrowser) notification.vibrate(500);
	
	var isUseEndOfSpeechDetection = false;
	
	var successFunc = function recognizeSuccess (res){
		
		console.log("[AudioInput] finished recoginition: "  + JSON.stringify(res));

		var asr_result = res;
		if(res['result']){
			asr_result = res['result'];
		}
		
		mobileDS.MediaManager.getInstance().textToSpeech(asr_result, function(){}, function(){});

		var result = mobileDS.SemanticInterpreter.getInstance().getASRSemantic(asr_result);
		var semantic;

		$('#mic_button').removeClass('footer_button_clicked');
				
		if (result.semantic != null) {
			semantic = JSON.parse(result.semantic);
			semantic.phrase = res;
			console.log("semantic : " + result.semantic);
		}
		else {
			semantic = JSON.parse('{ "NoMatch": { "phrase": "'+asr_result+'" }}');
		}
		inputManager.raise("speech_input_event",  semantic);
		if(ACTIVE_TEXT_ELEMENT && semantic && semantic.value){
			var str = semantic.value;
			var child = semantic.title;
			while(child && child.value){
				str += ' ' +child.value;
				child = child.title;
			}

			ACTIVE_TEXT_ELEMENT.val(str);
		}
	};
	
	var errorFunc = function recognizeError (err){
		$('#mic_button').removeClass('footer_button_clicked');
		console.error('[AudioInput] Error while finishing recoginition: '+JSON.stringify(err));
		

   		var msg = JSON.stringify(err);//mobileDS.LanguageManager.getInstance().getText('did_not_understand_msg');
		mobileDS.MediaManager.getInstance().textToSpeech(msg, null, null);
	};
	
	if(isUseEndOfSpeechDetection === false){

		
		//WITHOUT end-of-speech-detection (i.e. manual stop by user interaction):	
		if ($('#mic_button').hasClass('footer_button_clicked')){

			console.log("[AudioInput] stop recoginition without automtic END OF SPEECH detection");
			
			mobileDS.MediaManager.getInstance().stopRecord(successFunc, errorFunc);
	
		}
		else {
			
			console.log("[AudioInput] start recoginition without automtic END OF SPEECH detection");
			
			$('#mic_button').addClass('footer_button_clicked');
			mobileDS.MediaManager.getInstance().startRecord(
				function printResult(res){
					console.log("[AudioInput] start recoginition: "  + res);
				}, function(err){
					$('#mic_button').removeClass('footer_button_clicked');
					setTimeout(function(){errorFunc(err);}, 0);
					alert('tts failed: '+err);
				}
			);
		}
		
	}
	else {
		//WITH end-of-speech-detection (i.e. automatic stop by silence detection):

		console.log("[AudioInput] start recoginition with automatic END OF SPEECH detection");
		
		if ($('#mic_button').hasClass('footer_button_clicked')){

			console.log("[AudioInput] speech recoginition with automtic END OF SPEECH detection: already in progress, stopping now...");
			
			
			mobileDS.MediaManager.getInstance().stopRecord(
				function printResult(res){
					console.log("[AudioInput] MANUALLY stopped recoginition: "  + JSON.stringify(res));
					successFunc(res);
				}, function(err){
					console.log("[AudioInput] failed to MANUALLY stop recoginition: "  + err);
					setTimeout(function(){errorFunc(err);}, 0);
					alert('tts failed: '+err);
				}
			);
			
		}
		else {
			
			console.log("[AudioInput] starting recoginition with automatic END OF SPEECH detection now...");
			
			$('#mic_button').addClass('footer_button_clicked');
			setTimeout(function(){
				mobileDS.MediaManager.getInstance().recognize(successFunc, errorFunc);
			}, 1000);
		}
	}
}

function show_phrase (event) {
   var phrase_view = jQuery('div.phrase-view'),
	pDiv = jQuery('<div>'),
	phrase;

   try {
	if (typeof(event) !== 'string') {
	    phrase = event.phrase;
	} else {
	    phrase = event;
	}
	if (typeof(phrase) === 'undefined') {
	    phrase = event.NoMatch.phrase;
	}
   } catch (e) {
	console.log("Failed to read phrase: " + e);
   }
   
   phrase_view.append(pDiv);
   pDiv.text(phrase);
   pDiv.hide().slideDown(800);
   pDiv.delay(2500).slideUp(400);
}

jQuery(document).bind("mobileinit", function(){
    jQuery.mobile.ajaxEnabled = true;
    
});
