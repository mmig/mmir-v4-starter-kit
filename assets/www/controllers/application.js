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

  Application.prototype.on_page_load_welcome = function (){
	  if(typeof mobileDS.User.getInstance() !== 'undefined'){
		  var userName = mobileDS.User.getInstance().getName();
		  if(userName){
			  $('#user-name').text(', '+userName);
		  }
	  }
  };
  
  Application.prototype.login = function(){
      var email = $('#emailField #email').val();
      var password = $('#passwordField #password').val();
      if(this.verify(email,password)){
    	  mobileDS.User.create(email);
    	  //need to invoke this asynchronously, since this function is called from within the dialogEngine
    	  setTimeout(function(){mobileDS.DialogEngine.getInstance().raiseEvent("user_logged_in");},0);
      }
      else {
    	  alert('Wrong user name or password.\n\nDir you register?');
    	  //need to invoke this asynchronously, since this function is called from within the dialogEngine
    	  setTimeout(function(){mobileDS.DialogEngine.getInstance().raiseEvent("login_failed");},0);
      }
  };

  Application.prototype.register = function(){
      var email = $('#registration-form #email').val();
      var password = $('#registration-form #password').val();
      
      this.registerUsers[email] = password;
      mobileDS.User.create(email);
 	  
    //need to invoke this asynchronously, since this function is called from within the dialogEngine
	  setTimeout(function(){mobileDS.DialogEngine.getInstance().raiseEvent("user_logged_in");},0);
  };
  
  Application.prototype.verify = function(name, pw){
	  if(typeof this.registerUsers[name] === 'string'){
		  return pw === this.registerUsers[name];
	  }
	  return false;
  };
  