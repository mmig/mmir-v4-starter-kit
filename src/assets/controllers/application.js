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
	this.registerUsers = new Object();

//	register the default user, using the default values in login-view
//	(NOTE: really, you should never store passwords in plain text!)
	this.registerUsers['MMIG-User'] = 'mmig-user';
};


Application.prototype.on_page_load = function (){

	//set-up render for microphone-levels
	mmir.app.renderer.initPage();

	//FIX jqm > 1.4.3 needs explicit call for updating header/footer
	//    padding after dynamically inserting page
	$('#pageHeader').toolbar('updatePagePadding');
	$('#pageFooter').toolbar('updatePagePadding');

};

Application.prototype.on_page_load_login = function (){

	var self = this;

	//handle language selection:
	$('#languageListView li')
	.bind('vmousedown',           function(){	
		$(this).addClass(	'ui-focus ui-btn-active ui-btn-down-a');
	})
	.bind('vmouseup vmousecancel',function(){
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
	.bind('click', function(event){

		var lang = $(this).attr('lang');

		//see app.js:
		mmir.app.triggerClickFeedback();

		var isChanged = self.changeLanguage(lang);

		mmir.InputManager.raise('touch_input_event');
		mmir.InputManager.raise('language_choosen', {changed: isChanged});

		return false;
	});

	//handle click on language-button in footer
	$('#lang_button').on('vclick', function(e){
		e.preventDefault();

		mmir.app.triggerClickFeedback();

		mmir.InputEngine.raise('touch_input_event');
		mmir.InputEngine.raise('click_on_language_btn');
		return false;
	});

	//handle click on modal-layer
	// (visible when language menu is open)
	$('#modal').on('vclick', function(e){
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

	var setActive = function(button, setToActive){
		var label = 'start';
		var theming = 'a';//<- jQuery UI theme
		if(setToActive === true){
			label = 'stop';
			theming = 'b';
		}

		//use jQuery Mobile function to change button-label:
		button.text(label);

		//change theme (i.e. marking as active/inactive)
		button.buttonMarkup({theme: theming});
	};

	$('#asr').on('vclick', function(event) {

		//switch ASR activation state


		//set text in textarea
		var textElement = $('#asr-text');


		//text += ' set-ASR-to_'+(isAsrActive? 'active' : 'INactive');
		if (!isAsrActive){
			mmir.MediaManager.getInstance().startRecord(function(text, idInfo){
				
				var textSoFar = textElement.val();
				textSoFar += ' '+ text;
				textElement.val( textSoFar );
				
			}, function(e){
				
				console.error('Error using startRecord: '+ e);
				
			}, true //<- isUseIntermediateResultsMode
			);
		} else {
			mmir.MediaManager.getInstance().stopRecord(function(text, idInfo){
				var textSoFar = textElement.val();
				textSoFar += ' '+ text;
				textElement.val( textSoFar );
			}, function(e){
				console.error('Error using stopGetRecord: '+e);
			});

		}


		isAsrActive = ! isAsrActive;
		//change button in order to indicate active/inactive ASR state
		setActive( $('#asr'), isAsrActive);
	});

	$('#asr-normal').on('vclick', function(event) {

		//switch ASR activation state


		//set text in textarea
		var textElement = $('#asr-text');


		//text += ' set-ASR-to_'+(isAsrActive? 'active' : 'INactive');
		if (!isAsrActive){
			mmir.MediaManager.getInstance().startRecord(function(text, idInfo){
				var textSoFar = textElement.val();
				textSoFar += ' '+ text;
				textElement.val( textSoFar );
			}, function(e){
				console.error('Error using startRecord: '+ e);
			}
			, true //isUseIntermediateResultsMode
			);
		} else {
			mmir.MediaManager.getInstance().stopRecord(function(text, idInfo){
				var textSoFar = textElement.val();
				textSoFar += ' '+ text;
				textElement.val( textSoFar );
			}, function(e){
				console.error('Error using stopGetRecord: '+e);
			});

		}


		isAsrActive = ! isAsrActive;
		//change button in order to indicate active/inactive ASR state
		setActive( $('#asr-normal'), isAsrActive);
	});

	$('#clear').on('vclick', function(event) {
		$('#asr-text').val('');
	});  
};

Application.prototype.login = function(){
	var email = $('#emailField #email').val();
	var password = $('#passwordField #password').val();
	if(this.verify(email,password)){
		mmir.ModelManager.getModel('User').create(email);
		mmir.DialogManager.raise("user_logged_in");
	}
	else {
		alert('Wrong user name or password.\n\nDir you register?');
		mmir.DialogManager.raise("login_failed");
	}
};

Application.prototype.register = function(){
	var email = $('#registration-form #email').val();
	var password = $('#registration-form #password').val();

	this.registerUsers[email] = password;
	mmir.ModelManager.getModel('User').create(email);

	mmir.DialogManager.raise("user_logged_in");
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

	var currLang = mmir.LanguageManager.getInstance().getLanguage();
	var newLang = mmir.LanguageManager.getInstance().setLanguage(newLang);

	//also set the new language for jqm plugin datebox:
	jQuery.mobile.datebox.prototype.options.useLang = newLang;

	return currLang != newLang;
};