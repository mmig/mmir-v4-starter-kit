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



var mmir = window.mmir ||
{};

var Application = function(){
	this.name = "Application";

//	stub for simulating user-registry
	this.registerUsers = {};

//	register the default user, using the default values in login-view
//	(NOTE: really, you should never store passwords in plain text!)
	this.registerUsers['MMIG-User'] = 'mmig-user';
};

Application.prototype._init = function(){

	if(!this._isInit){

		this._isInit = true;
		this.app = mmir.app;
	}
};

Application.prototype.on_page_load = function (){

	this._init();

	//set-up render for microphone-levels
	mmir.app.renderer.initPage();

	//FIX jqm > 1.4.3 needs explicit call for updating header/footer
	//    padding after dynamically inserting page
  if($.jqmData){
		$('#pageHeader').toolbar('updatePagePadding');
		$('#pageFooter').toolbar('updatePagePadding');
	}

};

Application.prototype.on_page_load_login = function (){

	var self = this;

	//handle language selection:
	$('#languageListView li')
	.on(this.app.mousedown_name,           function(){
		$(this).addClass(	'ui-focus ui-btn-active ui-btn-down-a');
	})
	.on([this.app.mouseup_name, this.app.mousecancel_name].join(' '),function(){
		$(this).removeClass('ui-focus ui-btn-active ui-btn-down-a');
	})
	//
	//NOTE: we need to use 'click' here due to default event-handling of browser
	//		  touchend -> tap/vclick -> click [delayed]
	//		when using tap or vclick here, the click event is triggered,
	//		regardless whether or not the tap/vclick.event.preventDefault()
	//		is invoked
	//		=> if there is a clickable element "under" the the clicked item of
	//		the language menu, it will be triggered after the language menu closes!
	//		Using the click event here does not have this side effect, obviously.
	//
	.on('click', function(event){

		var lang = $(this).attr('lang');

		//see app.js:
		mmir.app.triggerClickFeedback();

		var isChanged = self.changeLanguage(lang);

		mmir.input.raise('touch_input_event');
		mmir.input.raise('language_choosen', {changed: isChanged});

		return false;
	});

	//handle click on language-button in footer
	$('#lang_button').on(this.app.click_name, function(e){
		e.preventDefault();

		mmir.app.triggerClickFeedback();

		mmir.input.raise('touch_input_event');
		mmir.input.raise('click_on_language_btn');
		return false;
	});

	//handle click on modal-layer
	// (visible when language menu is open)
	$('#modal').on(this.app.click_name, function(e){
		e.preventDefault();

		mmir.app.triggerClickFeedback();

		self.slide_up_language_menu();
		return false;
	});

	this.initAsrTestInput();
};

Application.prototype.initAsrTestInput = function(){

	//TODO need to track ASR active/inactive state across pages
	//     cancel ASR on page-change (and app-pause)?

	var isAsrActive = false;

	var isUseEndOfSpeechDetection = false;

	//for setting text in ASR deticated textarea
	var textElement = $('#asr-text');

	var asrModeCtrl = $('#asr-mode');
	asrModeCtrl.on(this.app.click_name, function(event){
		var tis = $(this);
		isUseEndOfSpeechDetection = !isUseEndOfSpeechDetection;

		console.log('isUseEndOfSpeechDetection ' + isUseEndOfSpeechDetection);

		//change jQuery Mobile icon
		var addIcon = isUseEndOfSpeechDetection? 'ui-icon-check' : 'ui-icon-forbidden';
		var removeIcon = isUseEndOfSpeechDetection? 'ui-icon-forbidden' : 'ui-icon-check';
		tis.removeClass(removeIcon).addClass(addIcon);

		var func = isUseEndOfSpeechDetection? 'add' : 'remove';
		tis[func+'Class']('ui-btn-active');
	});

	var setActive = function(button, setToActive){
		var label = 'Start';
		var theming = 'a';//<- jQuery UI theme

		if(setToActive === true){
			label = 'Stop';
			theming = 'b';
		}

		//use jQuery Mobile function to change button-label:
		button.text(label);

		//change jQuery Mobile icon
		var removeIcon = setToActive? 'ui-icon-carat-r' : 'ui-icon-power';
		var addIcon = setToActive? 'ui-icon-power' : 'ui-icon-carat-r';
		button.removeClass(removeIcon).addClass(addIcon);

		//change theme (i.e. marking as active/inactive)
		button.buttonMarkup({theme: theming});
	};

	$('#asr-status').css({
		'background-color': 'bisque',
		'font-style': 'italic'
	});

	var showUnstableResult = function(unstable){
		var status = $('#asr-status');
		status.stop(true);
		status.show().text(unstable);
		status.fadeOut(3000);
	}

	var handleAsr = function(asr_result, asr_score, asr_type, asr_alternatives, asr_unstable){

		console.log('handle ASR '+asr_type+'...');

		if(asr_type === 'INTERMEDIATE' || asr_type === 'FINAL'){

			if(asr_result){

				var textSoFar = textElement.val();

				if(!/\s$/.test(textSoFar)){
					textSoFar += ' ';
				}
				textSoFar += asr_result;

				textElement.val( textSoFar );
			}

		} else if(asr_type === 'INTERIM'){

			showUnstableResult(asr_result  + (asr_unstable? ' ' + asr_unstable : ''));

		}

		if(asr_type === 'RECORDING_BEGIN'){

			isAsrActive = true;
			setActive( $('#asr'), isAsrActive);

		} else if(asr_type === 'RECORDING_DONE' || asr_type === 'FINAL'){

			isAsrActive = false;
			setActive( $('#asr'), isAsrActive);

			if(isUseEndOfSpeechDetection){
				mmir.app.triggerClickFeedback({haptic: false});
			}

		}
	};

	var handleError = function(action, error){
		console.error('Error using '+action+': '+ error);
		isAsrActive = false;
		setActive( $('#asr'), isAsrActive);
	};

	$('#asr').on(this.app.click_name, function(event) {

		//switch ASR activation state

		var options = {
			success: handleAsr,
			error: null,
			intermediate: true	//<- isUseIntermediateResultsMode
		};

		if (!isAsrActive){

			options.error = function(e){
				handleError('startRecord', e);
			};

			if(isUseEndOfSpeechDetection){
				mmir.media.recognize(options);
			} else {
				mmir.media.startRecord(options);
			}

		} else {

			options.error = function(e){
				handleError('stopRecord', e);
			};

			mmir.media.stopRecord(options);
		}

		isAsrActive = ! isAsrActive;
		//change button in order to indicate active/inactive ASR state
		setActive( $(this), isAsrActive);

	});

	$('#clear').on(this.app.click_name, function(event) {
		$('#asr-text').val('');
		$('#asr-status').stop(true).text('');
	});
};

Application.prototype.login = function(){
	var email = $('#emailField #email').val();
	var password = $('#passwordField #password').val();
	if(this.verify(email,password)){
		mmir.model.get('User').create(email);
		mmir.dialog.raise("user_logged_in");
	}
	else {
		alert('Wrong user name or password.\n\nDir you register?');
		mmir.dialog.raise("login_failed");
	}
};

Application.prototype.register = function(){
	var email = $('#registration-form #email').val();
	var password = $('#registration-form #password').val();

	this.registerUsers[email] = password;
	mmir.model.get('User').create(email);

	mmir.dialog.raise("user_logged_in");
};

Application.prototype.verify = function(name, pw){
	if(typeof this.registerUsers[name] === 'string'){
		return pw === this.registerUsers[name];
	}
	return false;
};


Application.prototype.slide_down_language_menu = function() {
	var langMenu = $('#language-menu-panel');
	langMenu.slideDown(function(){$('#modal').show();});
};

Application.prototype.slide_up_language_menu = function() {
	$('#modal').hide();
	$('#language-menu-panel').slideUp();
};

/**
 *
 * This function changes the application language.
 *
 * NOTE: the current view needs to updated separately (if necessary).
 *
 * @function changeLanguage
 * @param {String} newLang The new language which is to be used
 * @returns {Boolean} <code>true</code> if the language has change, <code>false</code> otherwise
 * @public
 */
Application.prototype.changeLanguage = function(newLang) {

	console.debug("[Language] selected " + newLang);//debug

	var currLang = mmir.lang.getLanguage();
	var newLang = mmir.lang.setLanguage(newLang);

	//also set the new language for jqm plugin datebox:
	jQuery.mobile.datebox.prototype.options.useLang = newLang;

	return currLang != newLang;
};
