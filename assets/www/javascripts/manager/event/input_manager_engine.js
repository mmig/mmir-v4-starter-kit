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
		var input_manager_state_chart_instance = new inputStatechartExecutionContext();
		
        /**
         * Listener Object which defines which functions have to be called by certain events - for the usage of the stateHistory.
         * 
         * @property listener
         * @type Object
         * @private
         */
		// listener for transitions / state-changes:
		var listener = {
			onEntry : function(stateName) {
				stateHistory.push(stateName);
				if(IS_DEBUG_ENABLED) console.debug('InputManager State Entry: "' + stateName + '"');//debug

			},
			onExit : function(stateName) {
				stateHistory.pop();
				if(IS_DEBUG_ENABLED) console.debug('InputManager State Exit: "' + stateName + '"');//debug
			},
			onTransition : function(name, sourceState, targetState) {
				if(IS_DEBUG_ENABLED) console.debug('InputManager State Transition "' + name + '": "' + sourceState + '"->"' + targetState + '"');//debug
			}
		};
		input_manager_state_chart_instance.addListener(listener);
		
		return {
            /**
    		 * This function initializes the state-machine, which will handle the input. 
    		 * 
    		 * @function initializeDialog
    		 * @public
    		 */
			initializeDialog: function(){
				input_manager_state_chart_instance.initialize();
				// this.raiseEvent('init');
			},

            /**
    		 * This function raises an arbitrary Event.
    		 * 
    		 * @function initializeDialog
    		 * @param {String} eventName Name of the event to be raised
    		 * @param {Object} data Data of the event
    		 * @public
    		 */
			raiseEvent: function(eventName, data){	
				
				if(IS_DEBUG_ENABLED) console.debug("InputManager raising event : '" + eventName + "'");//debug
										
				if (!(typeof input_manager_state_chart_instance[eventName] === "undefined")) {
					input_manager_state_chart_instance[eventName](data);
				}
				else {
					console.warn("no possible transition for " + eventName);
                }   				

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






