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
 * @module mobileDS.javascripts.manager.input
 * 
 */
var mobileDS = window.mobileDS ||
{};


/**
 * A class for managing the input of the application. <br>
 * It's purpose is to handle all input of the application and call the appropriate functions of the app.
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.ControllerManager.getInstance()</code>
 * @class InputManager
 * @category core
 */
mobileDS.InputManager = (function(){

    /**
     * Object containing the instance of the class {@link mobileDS.InputManager}
     * 
     * @property instance
     * @type Object
     * @private
     */
	var instance = null;
    /**
     * Array containing all previous state names
     * 
     * @property stateHistory
     * @type Array
     * @private
     */	
	var stateHistory = new Array();	

	/**
	 * Constructor-Method of Class {@link mobileDS.InputManager}<br>
	 * It instantiates a state-machine handling every input. 
	 * 
	 * @constructor
	 */
	function constructor(){
		
		var interpreter = null;
		var isInitialized = false;
		var scion = require('scion');
		scion.urlToModel("config/statedef/input_manager_scxml.xml",function(err,model){

            if(err) throw err;

            //instantiate the interpreter
            interpreter = new scion.SCXML(model);

            var listener = {
    			onEntry : function(stateName) {
    				stateHistory.push(stateName);
    				if(IS_DEBUG_ENABLED) console.debug('InputManager State Entry: "' + stateName + '"');//debug
    
    			},
    			onExit : function(stateName) {
    				stateHistory.pop();
    				if(IS_DEBUG_ENABLED) console.debug('InputManager State Exit: "' + stateName + '"');//debug
    			},
    			onTransition : function(sourceState, targetStatesArray) {
    				if(IS_DEBUG_ENABLED) console.debug('InputManager State Transition: "' + sourceState + '"->"' + targetStatesArray + '"');//debug
    				
    				//currently, only 1-target transitions are supported:
    				if(targetStatesArray && targetStatesArray.length > 1){
    					console.warn('InputManager State Transition: multiple target states!');
    				}
    			}
    		};
    		interpreter.registerListener(listener);
    		
        });
		
		return {
            /**
    		 * This function initializes the state-machine, which will handle the input. 
    		 * 
    		 * @function initializeDialog
    		 * @public
    		 */
			initializeDialog: function(){
				
				if(isInitialized){
					if(IS_DEBUG_ENABLED) console.warn('InputManager.initializeDialog(): already initialized!'+' '+new Error().stack);//debug  (use Error for retrieving call-hierarchy using its stack-trace) 
					return; ////////////////////// EARLY EXIT //////////////////////////////////
				}
				
				if(interpreter){
					isInitialized = true;
					interpreter.start();
//	                console.error('InputManager init: '+(new Date() - startUpTime)+' '+new Error().stack);//debug : for testing, must initialize startUpTime with new Date(), first thing in index.html! 
				}
				else {
					var isTimeout = false;
					var startTime = new Date();
					var timeout = 10000;//10 sec. TODO setting this global/by configuration?
					
					//self-calling wait-function with timeout
					//  (waiting for interpreter to become != null):
					var waitForInit = function(){
						isTimeout = new Date() - startTime > timeout;
						if(!interpreter && !isTimeout){
							setTimeout(function(){waitForInit();},50);
						}
						else if(interpreter){
							isInitialized = true;
							interpreter.start();
//			                console.error('InputManager init: '+(new Date() - startUpTime)+' '+new Error().stack);//debug : for testing, must initialize startUpTime with new Date(), first thing in index.html! 
						}
						else {
							if(confirm){
								var result = confirm('Could not initialize InputManager (time out).\nContinue to wait another\n '+ (timeout/1000).toFixed(3) +' seconds?');
								if(result){
									startTime = new Date();
									setTimeout(function(){waitForInit();},50);
								}
								else{
									console.error('Could not initialize InputManager (time out).');
								}
							}
							else {
								console.error('Could not initialize InputManager (time out).');
							}
						}
					};
					
					waitForInit();
				}
			},

            /**
    		 * This function raises an arbitrary Event.
    		 * 
    		 * @function raiseEvent
    		 * @param {String} eventName Name of the event to be raised
    		 * @param {Object} data Data of the event
    		 * @public
    		 */
			raiseEvent: function(eventName, data){	
				
				if(IS_DEBUG_ENABLED) console.debug("InputManager raising event : '" + eventName + "'");//debug
										
//				if (!(typeof input_manager_state_chart_instance[eventName] === "undefined")) {
//					input_manager_state_chart_instance[eventName](data);
//				}
//				else {
//					console.warn("no possible transition for " + eventName);
//                }
				//TODO is there a way to check, if eventName is defined in interpreter-model?
				interpreter.gen(eventName, data);

            }
	            
        };
    }
	    
    return {
        /**
         * Object containing the instance of the class {@link mobileDS.InputManager} 
         * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.InputManager}
         * @public
         */
    	getInstance: function(){
    		if (!instance) {
    			instance = constructor();
            }
            return instance;
        }
    };
})();






