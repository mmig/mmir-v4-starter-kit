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



/**
 *  
 * @return Instance of NuancePlugin
 */
var NuancePlugin = function() { 

};

/**
 * @param username
 * @param password 
 * @param successCallback The callback which will be called when directory listing is successful
 * @param failureCallback The callback which will be called when directory listing encouters an error
 */
NuancePlugin.prototype.init = function(successCallback, failureCallback) {

	
    return cordova.exec(successCallback,     //Callback which will be called when directory listing is successful
    					 failureCallback,     //Callback which will be called when directory listing encounters an error
    					 'NuanceAndroidPlugin',      //Telling cordova that we want to run "NuancePlugin" Plugin
    					 'init',              //Telling the plugin, which action we want to perform
    					 []);                 //Passing a list of arguments to the plugin
};

NuancePlugin.prototype.speak = function(text, successCallback, failureCallback, language){
	
	 return cordova.exec(successCallback,     //Callback which will be called when directory listing is successful
   					 failureCallback,      //Callback which will be called when directory listing encounters an error
   					 'NuanceAndroidPlugin',       //Telling cordova that we want to run "NuancePlugin" Plugin
   					 'tts',                //Telling the plugin, which action we want to perform
   					 [text,language]);                  //Passing a list of arguments to the plugin
};


NuancePlugin.prototype.recognize = function(language, successCallback, failureCallback){

	 return cordova.exec(successCallback,     //Callback which will be called when directory listing is successful
   					 failureCallback,      //Callback which will be called when directory listing encounters an error
   					 'NuanceAndroidPlugin',       //Telling cordova that we want to run "NuancePlugin" Plugin
   					 'asr',                //Telling the plugin, which action we want to perform
   					 [language]);                  //Passing a list of arguments to the plugin
};

NuancePlugin.prototype.recognizeNoEOS = function(language, successCallback, failureCallback){

	 return cordova.exec(successCallback,     //Callback which will be called when directory listing is successful
  					 failureCallback,      //Callback which will be called when directory listing encounters an error
  					 'NuanceAndroidPlugin',       //Telling cordova that we want to run "NuancePlugin" Plugin
  					 'asr-no-eos-detection',                //Telling the plugin, which action we want to perform
  					 [language]);                  //Passing a list of arguments to the plugin
};

NuancePlugin.prototype.stopRecord = function(successCallback, failureCallback){

	 return cordova.exec(successCallback,     //Callback which will be called when directory listing is successful
 					 failureCallback,      //Callback which will be called when directory listing encounters an error
 					 'NuanceAndroidPlugin',       //Telling cordova that we want to run "NuancePlugin" Plugin
 					 'stop-rec',                //Telling the plugin, which action we want to perform
 					 []);                  //Passing a list of arguments to the plugin
};

NuancePlugin.prototype.cancel = function(successCallback, failureCallback){

	 return cordova.exec(successCallback,     //Callback which will be called when directory listing is successful
   					 failureCallback,      //Callback which will be called when directory listing encounters an error
   					 'NuanceAndroidPlugin',       //Telling cordova that we want to run "NuancePlugin" Plugin
   					 'cancel',                //Telling the plugin, which action we want to perform
   					 []);                  //Passing a list of arguments to the plugin
};
/**
 * <ul>
 * <li>Register the Voice2Social Javascript plugin.</li>

 * </ul>
 */
//cordova.addConstructor(function() {
//	 
//	//Register the javascript plugin with cordova
//	cordova.addPlugin('nuancePlugin', new  NuancePlugin());
//	
//	
//});

//Cordova 2.x plugin registration:
if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.nuancePlugin) {
    window.plugins.nuancePlugin = new NuancePlugin();
}