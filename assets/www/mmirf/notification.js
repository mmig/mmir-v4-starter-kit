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
 * @class Notification
 */
mobileDS.Notification = (function(){
    //private members
	
	/** @private */
    var instance = null;
    
    
    //private methods
    
    /**
	 * Constructor-Method of Class {@link mobileDS.Notification}.<br> 
	 * 
	 * @constructor
	 * @augments mobileDS.Notification
	 * @memberOf mobileDS.Notification.prototype
	 */
    function constructor(){
    	
    	function createAudio(url, success, fail){
    		return mobileDS.MediaManager.getInstance().getURLAsAudio(url, success, fail);
    	}
    	
    	
    	var beepAudio = null;
    	var timesToPlay = 0;
    	function playBeepAudio(times){
    		//create beep-audio-object, if not existing yet
    		if (times<1) {
    		//	beepAudio.release();
    		//	beepAudio = null;
    			return;
    		}
    		timesToPlay = times
    		if(beepAudio === null){
    			beepAudio = createAudio(
    					mobileDS.constants.getInstance().getBeepUrl(),
    					function(){
    						playBeepAudio(--timesToPlay);}, 
    					function(e){console.log('Error playing the beep: '+e);}
    			);
    		}
    		beepAudio.play();
    	}
    	//on Android: release resources on pause/exit, since they are limited
    	if(!forBrowser){
    		document.addEventListener(
    				"pause", 
    				function(event){
    					if(beepAudio !== null){
    						beepAudio.release();
    						beepAudio = null;
    						console.info('Notification: released media resources for beep.');
    					}
    				},
    				false
    		);
    	}
        
    	/** @lends mobileDS.Notification.prototype */
        return { //public members and methods
            
        	/**
        	 * Trigger a haptic vibration feedback.
        	 * 
        	 * <p>Note: The device / execution environment may not support haptic vibration feedback 
        	 * 
        	 * @function vibrate
        	 * @param milliseconds {Number} duration for vibration in milliseconds
        	 * @public
        	 */
            vibrate: function(milliseconds){
            	if (!forBrowser){
            		navigator.notification.vibrate(milliseconds);
            	}
            },
            /**
             * Opens a (native) notification dialog.
             * 
             * @function alert
             * @public
             */
            alert: function(message, alertCallback, title, buttonName){
            	navigator.notification.alert(message, alertCallback, title, buttonName);
            },
            /**
             * Opens a (native) confirmation dialog.
             * 
             * @function confirm
             * @public
             */
            confirm: function(message, confirmCallback, title, buttonLabels){
            	navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
            },
            /**
             * Trigger a beep notification sound.
             * 
             * @function beep
             * @param times {Number} how many times should to beep repeated
             * @public
             */
            beep: function(times){
        		if (times>0){
        			playBeepAudio(times);
        		}
            }
        };
    }
    return {
        /**
         * Get the instance of the singleton {@link mobileDS.Notification} 
         * 
         * @function getInstance
         * @returns {Object} the instance for singleton {@link mobileDS.Notification}
         * @public
         */
        getInstance: function(){
            if (instance === null) {
                instance = constructor();
            }
            return instance;
        }
    };
})();