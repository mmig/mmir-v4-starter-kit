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
 * @return Instance of MultitouchPlugin
 */
var MultitouchPlugin = function() { 

};

/**
 * @param eventtype - type of the event - see enum EventType... "Pinch"
 * @param eventname - name of the event
 * @param eventsource - where to raise the event - id
 * @param frequency - how often to send events in ms
 * @param failureCallback The callback which will be called when directory listing encouters an error
 * 
 * example, adding event named "pinch" for the Pinch-gesture: 
 * window.plugins.multitouchPlugin.addEventListener(
 * 	"Pinch",      // eventtype
 * 	"pinch",      // eventname
 * 	"map_canvas", // element, where the event will be raised
 * 	"200",        // period in ms for the events
 * 	function(r){  // function to be called if success
 * 		console.log(r)
 * 	},
 * 	function(e){  // function to be called if failed
 * 		console.log("Error:" + e);
 * 	}
 * );
 */
MultitouchPlugin.prototype.addEventListener = function(eventtype, eventname, eventsource, frequency, successCallback, failureCallback) {
	return cordova.exec(successCallback,    //Callback which will be called when directory listing is successful
			failureCallback,     //Callback which will be called when directory listing encounters an error
			'MultitouchPlugin',  //Telling cordova that we want to run "DirectoryListing" Plugin
			'addMultitouchListener',              //Telling the plugin, which action we want to perform
			[eventtype, eventname, eventsource, frequency]);        //Passing a list of arguments to the plugin, in this case this is the directory path
};

/**
 * @param eventtype - type of the event - see enum EventType... "PINCH"
 */
MultitouchPlugin.prototype.removeEventListener = function(eventtype, successCallback, failureCallback) {
	return cordova.exec(successCallback,    //Callback which will be called when directory listing is successful
			failureCallback,     //Callback which will be called when directory listing encounters an error
			'MultitouchPlugin',  //Telling cordova that we want to run "DirectoryListing" Plugin
			'removeMultitouchListener',              //Telling the plugin, which action we want to perform
			[eventtype]);        //Passing a list of arguments to the plugin, in this case this is the directory path
};

/**
 * @param frequency - how often to send events in ms
 */
MultitouchPlugin.prototype.setUpdateFrequency = function(frequency, successCallback, failureCallback) {
    return cordova.exec(successCallback,    //Callback which will be called when directory listing is successful
    					failureCallback,     //Callback which will be called when directory listing encounters an error
    					'MultitouchPlugin',  //Telling cordova that we want to run "DirectoryListing" Plugin
    					'changeMultitouchListenerFrequency',              //Telling the plugin, which action we want to perform
    					[frequency]);        //Passing a list of arguments to the plugin, in this case this is the directory path
};

/**
 * <ul>
 * <li>Register the Directory Listing Javascript plugin.</li>
 * <li>Also register native call which will be called when this plugin runs</li>
 * </ul>
 */
//cordova.addConstructor(function() {
//	//Register the javascript plugin with cordova
//	cordova.addPlugin('multitouchPlugin', new MultitouchPlugin());
//});

//Cordova 2.x plugin registration:
if(!window.plugins) {
  window.plugins = {};
}
if (!window.plugins.multitouchPlugin) {
  window.plugins.multitouchPlugin = new MultitouchPlugin();
}

console.log("[Plugins] MultiTouch loaded.");
