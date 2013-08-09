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

/**
 * 
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 */
mobileDS.MediaManager = (function(){

    var instance = null;
    var pluginsToLoad = {
    		'browser': new Array('html5AudioOutput.js',
    		          'html5AudioInput.js',
    		          'maryTextToSpeech.js'),
    		'android': new Array('cordovaAudioOutput.js',
    		          'nuanceAudioInput.js',
    		          'maryTextToSpeech.js')
    };
    var loadPlugin = function loadPlugin (filePath, successCallback, failureCallback){
    	try {
    		mobileDS.CommonUtils.getInstance().loadScript(mobileDS.constants.getMediaPluginPath()+filePath, function(){
	    		//TODO keine globale Variable
	    		if (typeof newMediaPlugin !== 'undefined' && newMediaPlugin){
	    			newMediaPlugin.initialize(function(functions){
	    					jQuery.extend(true,instance,functions);
	    					newMediaPlugin = null;
							if (successCallback) successCallback();
	    			});
	    		}
			});
    	}catch (e){
    		console.log('Error loading MediaPlugin '+filePath);
    		console.log(e);
    		if (failureCallback) failureCallback();
    	}
	
    };
    //those are the standard audioInput procedures, that should be implemented by a loaded file
    function constructor(){
    	return {
    			//TODO add API documentation
    		
    			//audio input API:
    			recognize: function(blob, successCallBack, failureCallBack){
    				if(failureCallBack){
    					failureCallBack("Audio Input: Speech Recognition is not supported.");
    				}
    				else {
    					console.error("Audio Input: Speech Recognition is not supported.");
    				}
    			},
    			startRecord: function(successCallBack,failureCallBack){
    				if(failureCallBack){
    					failureCallBack("Audio Input: Speech Recognition (recording) is not supported.");
    				}
    				else {
    					console.error("Audio Input: Speech Recognition (recording) is not supported.");
    				}
    			},
    			stopRecord: function(successCallBack,failureCallBack){
    				if(failureCallBack){
    					failureCallBack("Audio Input: Speech Recognition (recording) is not supported.");
    				}
    				else {
    					console.error("Audio Input: Speech Recognition (recording) is not supported.");
    				}
    	   		},
    	   		//audio output API:
    	   		playWAV: function(blob, successCallBack, failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: play audio is not supported.");
    				}
    				else {
    					console.error("Audio Output: play audio is not supported.");
    				}
    			},
    			/**
    			 * parameter: string OR string Array OR object with attributes:
    			 * 		text: string OR string Array, text that should be read aloud
    			 * 		pauseLength: Length of the pauses between sentences in milliseconds
    			 * 		forceSingleSentence: boolean, if true, a string Array will be turned into a single string
    			 * 		split: boolean, if true and the text is a single string, it will be split using a splitter function
    			 * 		splitter: function, replaces the default splitter-function. It takes a simple string as input and gives a string Array as output
    			 */
    			textToSpeech: function(parameter, successCallBack,failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: Text To Speech is not supported.");
    				}
    				else {
    					console.error("Audio Output: Text To Speech is not supported.");
    				}
    			},
    			
    			//ADDITIONAL functions: 
    			cancelSpeech: function(successCallBack,failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: canceling Text To Speech is not supported.");
    				}
    				else {
    					console.error("Audio Output: canceling Text To Speech is not supported.");
    				}
    			},
    			playURL: function(url, successCallback, failureCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: play audio from URL is not supported.");
    				}
    				else {
    					console.error("Audio Output: play audio from URL is not supported.");
    				}
    			},
    			getURLAsAudio: function(url, successCallback, failureCallBack, onLoadedCallBack){
    	   			if(failureCallBack){
    					failureCallBack("Audio Output: create audio from URL is not supported.");
    				}
    				else {
    					console.error("Audio Output: create audio from URL is not supported.");
    				}
    			}
    	};
    };
    function getPluginsToLoad(){
    	var env = null;
    	var pluginArray = new Array();
    	if (forBrowser) {
    		env = 'browser';
    	} else {
    		env = 'android';
    	}
    	var dataFromConfig = mobileDS.ConfigurationManager.getInstance().get('mediaPlugins');
    	if (dataFromConfig && dataFromConfig[env]){
    		pluginArray = pluginArray.concat(dataFromConfig[env]);
    	} else{
    		pluginArray = pluginArray.concat(pluginsToLoad[env]);
    	}
    	return pluginArray;
    }
    
    function loadAllPlugins(pluginArray, successCallback,failureCallback){
    	if (pluginArray == null || pluginArray.length<1){
    		if (successCallback) {
    			successCallback();
    		}
    		return;
    	}
    	var newPluginName = pluginArray.pop();
    	loadPlugin(newPluginName, function (){console.log(newPluginName+' loaded!');loadAllPlugins(pluginArray,successCallback, failureCallback);}, failureCallback);
    }
    	
    
    return {
        /**
         * Object containing the instance of the class {{#crossLink "audioInput"}}{{/crossLink}} 
         * 
         * @method getInstance
         * @return {Object} Object containing the instance of the class {{#crossLink "MediaManager"}}{{/crossLink}}
         * @public
         */
        create: function(successCallback, failureCallback){
            if (instance === null) {
            	jQuery.extend(true,this,constructor());
                instance = this;
            	var pluginArray = getPluginsToLoad();
                loadAllPlugins(pluginArray,successCallback, failureCallback);

            }
            return this;
        },
        getInstance: function(){
            return this.create(null, null);
        },
        /**
         * loads a file. If the file implements a function initialize(f)
         * where the function f is called with a set of functions e, then those functions in e 
         * are added to the visibility of audioInput, and will from now on be applicable by calling
         * mobileDS.MediaManager.getInstance().<function name>.
         */
    	loadFile: function(filePath,successCallback, failureCallback){
    		if (instance=== null) {
    			this.create();
    		}
    		
    		loadPlugin(filePath,sucessCallback, failureCallback);
			
    	}
    };
}) ();
