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
 * @module mobileDS.javascripts.gesture
 * 
 */
var mobileDS = window.mobileDS ||
{};

/**
 * A class for monitoring the input from the compass. <br>
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.CompassHandler.getInstance()</code>
 * @class CompassHandler
 * @category core
 */
mobileDS.CompassHandler = (function(){
    //private members
    /**
     * Object containing the instance of the class {@link mobileDS.CompassHandler} 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance;

    /**
     * A Timer object to repeatedly execute a specific function - in this case: the method {@link mobileDS.CompassHandler-constructor.startWatch}.
     * 
     * @property restartTimer
     * @type Timer|Object
     * @private
     */
    var restartTimer;
    
    
	/**
	 * Constructor-Method of Class {@link mobileDS.CompassHandler}.<br>
	 * Sets the default behavior of the compass.
	 * @constructor
	 */
  //private methods
    function constructor(){
  
    	   restartTimer = new Timer();
           restartTimer.Interval = 1000;
           
    	// The watch id references the current `watchHeading`
        var watchID = null;
        var options = {
            frequency: 500
        };
        
    	/**
    	 * Callback function - logs the current heading to the console.<br>
    	 * 
    	 * @function onSuccess
    	 * @param {Object} heading Object containing the heading data
    	 * @private
    	 */
       // onSuccess: Get the current heading
        //
        function onSuccess(heading) {
        	
        	if(IS_DEBUG_ENABLED) console.debug('Heading: ' + heading.magneticHeading);//debug
        }

    	/**
    	 * Callback function to handle the errors while reading the compass heading.    
    	 * 
    	 * @function onError
    	 * @param {Object} compassError Error object
    	 * @private
    	 */
        // onError: Failed to get the heading
        //
        function onError(compassError) {
            alert('Compass error: ' + compassError.code);
        }
        
        return { //public members and methods
            
          	/**
              	 * Starts to watch the compass every INTERVAL(=500) ms.
              	 * 
              	 * @function startWatch
              	 * @public
              	 */
        	// Start watching the compass
            startWatch: function(){
            	watchID = navigator.compass.watchHeading(onSuccess, onError, options);
            },
            
        	/**
        	 * Stops the watch of the compass.
        	 * 
        	 * @function stopWatch
        	 * @public
        	 */
            //Stop watching the compass
            stopWatch: function(){
            	if (watchID) {
                    navigator.compass.clearWatch(watchID);
                    watchID = null;
                }
            }
        };
    }
     return {
         /**
          * Get the object containing the instance of the class {@link mobileDS.CompassHandler}.<br>
          * At the very first call of this method, the constructor  is invoked and the restartTimer initialised and therefore the watch over the compass begins.  
          * 
          * @function getInstance
          * @returns {Object} Object containing the instance of the class {@link mobileDS.CompassHandler}
          * @public
          */
        getInstance: function(){
            if (!instance) {
                instance = constructor();
                restartTimer.Tick = instance.startWatch;
            }
            return instance;
        }
    };
})();