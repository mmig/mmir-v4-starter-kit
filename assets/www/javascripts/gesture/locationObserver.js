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
 * A class for monitoring the geolocation of the device.<br>
 * To retrieve the current location, use (from cordova):
 * 
	navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options)
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.LocationObserver.getInstance()</code>
 * @class LocationObserver
 * @category core
 * 
 * @see mobileDS.LocationObserver#constructor
 */
mobileDS.LocationObserver = (function(){
    //private members
    /**
     * Object containing the instance of the class {@link mobileDS.LocationObserver} 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance;
    
    
    
  //private methods
	/**
	 * Constructor-Method of Class {@link mobileDS.LocationObserver}.<br>
	 * Sets the default behavior of the gesture detection.
	 * @constructor
	 * @augments mobileDS.LocationObserver
	 * @memberOf mobileDS.LocationObserver.prototype
	 */
    function constructor(){
    
    	// The watch id references the current `watchHeading`
        var watchID = null;
        var options = {
            frequency: 500
        };
        
    	/**
    	 * Callback function - logs the current position to the console.<br>
    	 * 
    	 * @function onSuccess
    	 * @param {Position|Object} position Object containing the acceleration data
    	 * @private
    	 */
        var onSuccess = function(position) {
        	if(IS_DEBUG_ENABLED) console.debug(
                  'Latitude: '          + position.coords.latitude          + '\n' +
                  'Longitude: '         + position.coords.longitude         + '\n' +
                  'Altitude: '          + position.coords.altitude          + '\n' +
                  'Accuracy: '          + position.coords.accuracy          + '\n' +
                  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
                  'Heading: '           + position.coords.heading           + '\n' +
                  'Speed: '             + position.coords.speed             + '\n' +
                  'Timestamp, '         + new Date(position.timestamp)      + '\n');//debug
        };

    	/**
    	 * Callback function to handle the errors while reading the position.    
    	 * 
    	 * @function onError
    	 * @param {PositionError|Object} error A PositionError object
    	 * @private
    	 */
        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
        }
        
    	/** @lends mobileDS.LocationObserver.prototype */
        return { //public members and methods
            
        	/**
        	 * Starts to read the geolocation every INTERVAL(=500) ms.
        	 * 
        	 * @function startWatch
        	 * @public
        	 */
        	// Start watching the compass
            startWatch: function(){
            	watchId = navigator.geolocation.watchPosition(onSuccess,
            			onError,
                        options);
                
            },
            
        	/**
        	 * Stops the watch of the geolocation.
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
         * Get the object containing the instance of the class {@link mobileDS.LocationObserver}.<br>
         * At the very first call of this method, the constructor  is invoked and the restartTimer initialised and therefore the watch over the compass begins.  
         * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.LocationObserver}
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