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
mobileDS.AudioOutput = (function(){

    var instance = null;
    
    //those are the standard audioOutput procedures, that should be implemented by a loaded file
    function constructor(){
    	return {
    			playWAV: function(blob, successCallBack, failureCallBack){
    				alert("Audio Output is not supported.");
    			},
    			textToSpeach: function(text, successCallBack,failureCallBack){
    				alert("Audio Output is not supported.");
    			}
    	};
    };
    	
    
    return {
        /**
         * Object containing the instance of the class {{#crossLink "audioOutput"}}{{/crossLink}} 
         * 
         * @method getInstance
         * @return {Object} Object containing the instance of the class {{#crossLink "CommonUtils"}}{{/crossLink}}
         * @public
         */
        getInstance: function(){
            if (instance === null) {
                instance = constructor();
            }
            return instance;
        },
        /**
         * loads a file. If the file implements a function newAudioOutput.initialize(f)
         * where the function f is called with a set of functions e, then those functions in e 
         * are added to the visibility of audioOutput, and will from now on be applicable by calling
         * audioOutput.getInstance.<function name>.
         */
    	loadFile: function(filePath,callBack){
    		mobileDS.CommonUtils.getInstance().loadScript(filePath, function(){
		    		if (instance === null) {
		                instance = constructor();
		            }
		    		if (newAudioOutput){
		    			newAudioOutput.initialize(function(functions){
		    					jQuery.extend(true,instance,functions);
								callBack();
		    			});
		    		}
    			});
			
    	}
    };
}) ();
