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
 * @module mobileDS.javacsripts.gesture
 * 
 */
var mobileDS = window.mobileDS ||
{};

/**
 * A class for monitoring the input gestures via accelerometers. <br>
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.AccelerometerGestureDetector.getInstance()</code>
 * @class AccelerometerGestureDetector
 * @category core
 */

mobileDS.AccelerometerGestureDetector = (function(){
    //private members
    /**
     * Object containing the instance of the class {@link mobileDS.AccelerometerGestureDetector} 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance;

    
    /**
     * A Timer object to repeatedly execute a specific function - in this case: the method {@link mobileDS.AccelerometerGestureDetector-constructor.startWatch} of {@link mobileDS.AccelerometerGestureDetector-constructor}.
     * 
     * @property restartTimer
     * @type Timer|Object
     * @private
     */
    var restartTimer;
    
    
	/**
	 * Constructor-Method of Class {@link mobileDS.AccelerometerGestureDetector}.<br>
	 * Sets the default behavior of the gesture detection.
	 * 
	 * @constructor constructor
	 */
    //private methods
    function constructor(){
        restartTimer = new Timer();
        restartTimer.Interval = 1000;
        
        //restartTimer.Tick = mobileDS.AccelerometerGestureDetector.getInstance().startWatch;
        
        // minimal force to detect as motion (arbitrate value, which gives good results)
        var FORCE_THRESHOLD_MIN = 0.06;
        var FORCE_THRESHOLD_MAX = 10.3;
        var RIGHT_TILT_THRESHOLD = -3;
        var LEFT_TILT_THRESHOLD = 3;
        var INTERVAL = 50;
        var SHAKE_DURATION = 400;
        var options = {
        	// every X ms the acceleration data should be watched
            frequency: INTERVAL
        };
        var watchID = null;
        
        var lastX = null;
        var lastY = null;
        var lastZ = null;
        
        var currX = null;
        var currY = null;
        var currZ = null;
        
        var startX = null;
        var startY = null;
        var startZ = null;
        
        var endX = null;
        var endY = null;
        var endZ = null;
        
        var deltaD = null;
        var deltaT = null;
        var deltaX = null;
        var deltaY = null;
        var deltaZ = null;
        var xForce = null;
        var yForce = null;
        var zForce = null;
        
        var now = null;
        var lastUpdate = null;
        var timeDiff = null;
        var lastUpdate = null;
        var lastShake = null;
        var motionStartTime = null;
        
        var force = null;
        var motionAlreadyStarted = false;
        
        var motionPointsX = new Array();
        var motionPointsY = new Array();
        var motionPointsZ = new Array();
        
        var motionPointIndex = 0;
        var cycleWithoutMotion = 0;
        
    	/**
    	 * Resets all the values for the gesture detection.    
    	 * 
    	 * @function reset
    	 * @private
    	 */
        function reset(){
            lastX = null;
            lastY = null;
            lastZ = null;
            
            currX = null;
            currY = null;
            currZ = null;
            
            startX = null;
            startY = null;
            startZ = null;
            
            endX = null;
            endY = null;
            endZ = null;
            
            deltaD = null;
            deltaT = null;
            deltaX = null;
            deltaY = null;
            deltaZ = null;
            xForce = null;
            yForce = null;
            zForce = null;
            
            
            now = null;
            lastUpdate = null;
            timeDiff = null;
            lastUpdate = null;
            lastShake = null;
            motionStartTime = null;
            force = null;
            motionAlreadyStarted = false;
            
            motionPointsX = new Array();
            motionPointsY = new Array();
            motionPointsZ = new Array();
            motionPointIndex = 0;
            cycleWithoutMotion = 0;
            
        }
        
        
    	/**
    	 * Callback function to handle the errors while reading the acceleration.    
    	 * 
    	 * @function onError
    	 * @private
    	 */
        // onError: Failed to get the acceleration
        function onError(){
            alert('onError!');
        }
        
    	/**
		 * <b>unused</b><br>
    	 * Callback function for the use of a compass functionality - not used.    
    	 * 
    	 * @function compOnSuccess
    	 * @param {Object} heading Object containing the heading data
    	 * @private
    	 */
        function compOnSuccess(heading){
        	if(IS_DEBUG_ENABLED) console.debug(heading);//debug
        }
        
    	/**
    	 * Callback function - checks, which gesture is being performed.<br>
    	 * If new gestures are to be implemented: here is the right place.
    	 * 
    	 * @function onSuccess
    	 * @param {Object} accel Object containing the acceleration data
    	 * @private
    	 */
        // onSuccess: successfully got the acceleration
        function onSuccess(accel){
        
            now = accel.timestamp;
            currX = accel.x.toFixed(3);
            currY = accel.y.toFixed(3);
            currZ = accel.z.toFixed(3);
            
            // is it the first time we measure the acceleration?
            // if yes: don't to anything except store the acceleration values.
            if (lastUpdate == null) {
                lastUpdate = now;
                lastShake = now;
                lastX = currX;
                lastY = currY;
                lastZ = currZ;
            }
            else {
                timeDiff = now - lastUpdate;
                // console.log("point(" + currX + "," + currY + "," + currZ + ")");
                if (timeDiff > 0) {
                    deltaD = Math.abs(currX - lastX) + Math.abs(currY - lastY) + Math.abs(currZ - lastZ);
                    force = Math.abs(deltaD) / timeDiff;
                    if (force > FORCE_THRESHOLD_MIN) {
                        var ft = deltaD * timeDiff;
                        motionDetected = true;
                        if (!motionAlreadyStarted) {
                            startX = lastX;
                            startY = lastY;
                            startZ = lastZ;
                            
                            if(IS_DEBUG_ENABLED) console.verbose("start(" + startX + "," + startY + "," + startZ + ")");//debug
                            
                            motionAlreadyStarted = true;
                            motionStartTime = now;
                            motionPointsX = new Array();
                            motionPointsY = new Array();
                            motionPointsZ = new Array();
                            motionPointIndex = 0;
                            
                        }
                        
                        motionPointsX[motionPointIndex] = currX;
                        motionPointsY[motionPointIndex] = currY;
                        motionPointsZ[motionPointIndex] = currZ;
                        motionPointIndex++;
                        cycleWithoutMotion = 0;
                    }
                    else 
                        if (cycleWithoutMotion < 2 && force < FORCE_THRESHOLD_MIN) {
                            //console.log("nomotion(" + currX + "," + currY + "," + currZ + ")");
                            cycleWithoutMotion++;
                            motionDetected = false;
                            motionPointsX[motionPointIndex] = currX;
                            motionPointsY[motionPointIndex] = currY;
                            motionPointsZ[motionPointIndex] = currZ;
                            motionPointIndex++;
                            
                            endX = currX;
                            endY = currY;
                            endZ = currZ;
                            lastShake = now;
                        }
                        else 
                            if (motionAlreadyStarted) {
                                motionDetected = false;
                                //  console.log("end(" + endX + "," + endY + "," + endZ + ")");
                                deltaT = lastShake - motionStartTime;
                                if (deltaT >= 250) {
                                    var motionXAvg = 0;
                                    var motionYAvg = 0;
                                    var motionZAvg = 0;
                                    
                                    var maxXDivIndex = 0;
                                    var maxYDivIndex = null;
                                    var maxZDivIndex = null;
                                    
                                    var maxXDiv = 0;
                                    var maxYDiv = 0;
                                    var maxZDiv = 0;
                                    var i = 0;
                                    if (motionPointsX.length > 2) {
                                        i = 2;
                                        maxXDivIndex = 2;
                                    }
                                    for (; i < motionPointsX.length; i++) {
                                        var xD = Math.abs(startX - parseFloat(motionPointsX[i]));
                                        var yD = Math.abs(startY - parseFloat(motionPointsY[i]));
                                        // console.log("point(" + motionPointsX[i] + "," + motionPointsY[i] + "): xD "+xD + " yD "+ yD );
                                        if (xD > maxXDiv) {
                                            maxXDiv = xD;
                                            maxXDivIndex = i;
                                        }
                                        
                                        if (yD > maxYDiv) {
                                            maxYDiv = yD;
                                            maxYDivIndex = i;
                                        }
                                        
                                    }
                                    
                                    
                                    
                                    deltaX = (startX - motionPointsX[maxXDivIndex]);
                                    deltaY = (startY - motionPointsY[maxYDivIndex]);
                                    //deltaZ = (startZ - motionPointsZ[maxXDivIndex]);
                                    xForce = deltaX / deltaT;
                                    yForce = deltaY / deltaT;
                                    
                                    
                                   if ((SHAKE_DURATION <= deltaT && Math.abs(deltaY) >= 4.1) || (Math.abs(deltaX) + Math.abs(deltaY)) > 20) {
                                	   if(IS_DEBUG_ENABLED) console.debug("Shake");//debug
                                       // mobileDS.DialogEngine.getInstance().raiseEvent("exit");
                                    }
                                   // else 
                                        if ((deltaX > 1 && startZ >= 0) || (deltaX < -1 && startZ <= 0)) {
                                        	if(IS_DEBUG_ENABLED) console.debug("tilt to the right");//debug
										    //mobileDS.DialogEngine.getInstance().raiseEvent("next");
                                        }
                                        else 
                                            if ((deltaX < -1 && startZ >= 0) || (deltaX > 1 && startZ <= 0)) {
                                            	if(IS_DEBUG_ENABLED) console.debug("tilt to the left");//debug
                                                mobileDS.DialogEngine.getInstance().raiseEvent("back");
                                            }
                                            else {
                                            	if(IS_DEBUG_ENABLED) console.debug("could not specify motion mode " + deltaX + ":" + deltaZ);//debug
                                            }
                                    mobileDS.AccelerometerGestureDetector.getInstance().stopWatch();
                                    motionAlreadyStarted = false;
                                    restartTimer.Start();
                                    
                                }
                                reset();
                                
                            }
                    
                }
                
                lastX = currX;
                lastY = currY;
                lastZ = currZ;
                lastUpdate = now;
            }
            
        }
        
        return { //public members and methods
            // Start watching the acceleration
        	/**
        	 * Stops the timer which was started at the creation of the instance ({@link mobileDS.AccelerometerGestureDetector.getInstance}) and starts to watch the acceleration every INTERVAL(=50) ms.
        	 * 
        	 * @function startWatch
        	 * @public
        	 */
            startWatch: function(){
                restartTimer.Stop();
                watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
                
            },
            
        	/**
        	 * Stops the watch of the acceleration.
        	 * 
        	 * @function stopWatch
        	 * @public
        	 */
            //Stop watching the acceleration
            stopWatch: function(){
                if (watchID) {
                    navigator.accelerometer.clearWatch(watchID);
                    watchID = null;
                }
            }
        };
        
        
        
    }
    
    return {
        /**
         * Get the object containing the instance of the class {@link mobileDS.AccelerometerGestureDetector}.<br>
         * At the very first call of this method, the constructor  is invoked and the restartTimer initialised and therefore the watch over the acceleration begins.  
         * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.AccelerometerGestureDetector}
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
