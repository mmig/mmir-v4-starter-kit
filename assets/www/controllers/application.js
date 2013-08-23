﻿/*
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

  var current_asr_result;

  var Application = function(){
      this.name = "Application";
      
      //stub for simulating user-registry
      this.registerUsers = new Object();
      
      //register the default user, using the default values in login-view
      // (NOTE: really, you should never store passwords in plain text!)
      this.registerUsers['MMIG-User'] = 'mmig-user';
  };


  Application.prototype.on_page_load = function (){
	  
  };
  
  Application.prototype.on_page_load_login = function (){
		
		var isUseAlphaMagLanguageSelection = mobileDS.ConfigurationManager.getInstance().get('ALPHA_MapLanguageSelection');

		var self = this;
		
		//handle language selection:
		$('#languageListView li')
			.bind('vmousedown',           function(){	$(this).addClass(	'ui-focus ui-btn-active ui-btn-down-a');})
			.bind('vmouseup vmousecancel',function(){	$(this).removeClass('ui-focus ui-btn-active ui-btn-down-a');})
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
		
//				console.log('lang-clicked: ' + lang);
		
				var isChanged = self.changeLanguage(lang, false);
				
				if(isUseAlphaMagLanguageSelection){
					showLoader();//actually this does not really work, but at least something is shown...
					//TODO: replace/set calendar's language specific resources
				}
				mobileDS.InputEngine.getInstance().raise('touch_input_event');
				mobileDS.InputEngine.getInstance().raise('language_choosen', {changed: isChanged});
				
				return false;
		});
		
//		if(isUseAlphaMagLanguageSelection){
//			showLoader();//actually this does not really work, but at least something is shown...
//			mobileDS.DialogEngine.getInstance().performHelper('GoogleMap', 'update_map_language');
//		}
		
	};

	//DISABLED: now a @-statement within the template-definition is used
//  Application.prototype.on_page_load_welcome = function (){
//	  if(typeof mobileDS.User.getInstance() !== 'undefined'){
//		  var userName = mobileDS.User.getInstance().getName();
//		  if(userName){
//			  $('#user-name').text(', '+userName);
//		  }
//	  }
//  };
  
  Application.prototype.login = function(){
      var email = $('#emailField #email').val();
      var password = $('#passwordField #password').val();
      if(this.verify(email,password)){
    	  mobileDS.User.create(email);
    	  mobileDS.DialogEngine.getInstance().raise("user_logged_in");
      }
      else {
    	  alert('Wrong user name or password.\n\nDir you register?');
    	  mobileDS.DialogEngine.getInstance().raise("login_failed");
      }
  };

  Application.prototype.register = function(){
      var email = $('#registration-form #email').val();
      var password = $('#registration-form #password').val();
      
      this.registerUsers[email] = password;
      mobileDS.User.create(email);
 	  
      mobileDS.DialogEngine.getInstance().raise("user_logged_in");
  };
  
  Application.prototype.verify = function(name, pw){
	  if(typeof this.registerUsers[name] === 'string'){
		  return pw === this.registerUsers[name];
	  }
	  return false;
  };
  

  Application.prototype.slide_down_language_menu = function() {
	  var langMenu = $('#language-menu-panel');
	  langMenu.slideDown();
  };

  Application.prototype.slide_up_language_menu = function() {
	  $('#language-menu-panel').slideUp();
  };

  /**
   * 
   * 
   * This function changes the application language and, if requested, renders the current view again, so that 
   * the change of the language is applied to the currently displayed view. 
   * <br>DISABLED: After changing the language (and re-rendering the view) an event "language_choosen" is raised
   * on the DialogEngine.<br>
   * 
   * <div class="box important">
   * <b>Note:</b>
   * Momentarily this function is used by 'controllers/application.js' in the generated language menu, when the user selects a new language.<br>
   * This should better be implemented as a partial.
   * </div>
   * 
   * @function changeLanguage
   * @param {String} newLang The new language which is to be used henceforth
   * @param {Boolean} doReRenderView Should the currently displayed view be rendered again in the new language?
   * @returns {String} The translation of the keyword
   * @public
   * 
   * @see mobileDS.LanguageManager#setToCompatibilityMode#changeLanguage
   */
  Application.prototype.changeLanguage = function(newLang, doReRenderView) {

	  if(IS_DEBUG_ENABLED) console.debug("[Language] selected " + newLang);//debug

	  var currLang = mobileDS.LanguageManager.getInstance().getLanguage();
	  var newLang = mobileDS.LanguageManager.getInstance().setLanguage(newLang);

	  if (doReRenderView == true){
		  mobileDS.PresentationManager.getInstance().reRenderView();
	  }
//	  mobileDS.DialogEngine.getInstance().raise("language_choosen", newLang);
	  return currLang != newLang;
  };