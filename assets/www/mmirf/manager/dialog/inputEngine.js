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
 * @module mobileDS.manager.input
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
 * @class InputEngine
 * @category core
 */
mobileDS.InputEngine = (function(){

    /**
     * Object containing the instance of the class {@link mobileDS.InputEngine}
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
	 * Constructor-Method of Class {@link mobileDS.InputEngine}<br>
	 * It instantiates a state-machine handling every input. 
	 * 
	 * @constructor
	 * @augments mobileDS.InputEngine
	 * @memberOf mobileDS.InputEngine.prototype
	 */
	function constructor(callbackFunction){
		
		var interpreter = null;
		var eventGenerator = null;
		var isInitialized = false;
		var scion = require('scion');
		scion.urlToModel("config/statedef/inputDescriptionSCXML.xml",function(err,model){

            if(err) throw err;

            //instantiate the interpreter
            interpreter = new scion.SCXML(model);

            var listener = {
    			onEntry : function(stateName) {
    				stateHistory.push(stateName);
    				if(IS_DEBUG_ENABLED) console.debug('InputEngine State Entry: "' + stateName + '"');//debug
    
    			},
    			onExit : function(stateName) {
    				stateHistory.pop();
    				if(IS_DEBUG_ENABLED) console.debug('InputEngine State Exit: "' + stateName + '"');//debug
    			},
    			onTransition : function(sourceState, targetStatesArray) {
    				if(IS_DEBUG_ENABLED) console.debug('InputEngine State Transition: "' + sourceState + '"->"' + targetStatesArray + '"');//debug
    				
    				//currently, only 1-target transitions are supported:
    				if(targetStatesArray && targetStatesArray.length > 1){
    					console.warn('InputEngine State Transition: multiple target states!');
    				}
    			}
    		};
    		interpreter.registerListener(listener);
    		eventGenerator = mobileDS.SCIONExtension.getInstance().newSCIONExtension(interpreter,
					function(e){console.log('ERROR creating SCIONExtension');}
    		);
    		
    		if(typeof callbackFunction !== 'undefined' && callbackFunction !== null){
    			callbackFunction(instance);
            }
        });
		
		/** @lends mobileDS.InputEngine.prototype */
		return {
            /**
    		 * This function initializes the state-machine, which will handle the input. 
    		 * 
    		 * @function startEngine
    		 * @public
    		 */
			startEngine: function(){
				
				if(isInitialized){
					if(IS_DEBUG_ENABLED) console.warn('InputEngine.startEngine(): already initialized!'+' '+new Error().stack);//debug  (use Error for retrieving call-hierarchy using its stack-trace) 
					return; ////////////////////// EARLY EXIT //////////////////////////////////
				}
				
				if(interpreter){
					isInitialized = true;
					interpreter.start();
//	                console.error('InputEngine init: '+(new Date() - startUpTime)+' '+new Error().stack);//debug : for testing, must initialize startUpTime with new Date(), first thing in index.html! 
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
//			                console.error('InputEngine init: '+(new Date() - startUpTime)+' '+new Error().stack);//debug : for testing, must initialize startUpTime with new Date(), first thing in index.html! 
						}
						else {
							if(confirm){
								var result = confirm('Could not initialize InputEngine (time out).\nContinue to wait another\n '+ (timeout/1000).toFixed(3) +' seconds?');
								if(result){
									startTime = new Date();
									setTimeout(function(){waitForInit();},50);
								}
								else{
									console.error('Could not initialize InputEngine (time out).');
								}
							}
							else {
								console.error('Could not initialize InputEngine (time out).');
							}
						}
					};
					
					waitForInit();
				}
			},

            /**
    		 * This function raises an arbitrary Event.
    		 * 
    		 * @function raise
    		 * @param {String} eventName Name of the event to be raised
    		 * @param {Object} data Data of the event
    		 * @public
    		 */
			raise: function(eventName, data){	
				
				if(IS_DEBUG_ENABLED) console.debug("InputEngine raising event : '" + eventName + "' in state '"+ stateHistory[stateHistory.length-1] + "' with data "+JSON.stringify(data));//debug
										
//				if (!(typeof InputDescription_instance[eventName] === "undefined")) {
//					InputDescription_instance[eventName](data);
//				}
//				else {
//					console.warn("no possible transition for " + eventName);
//                }
				//TODO is there a way to check, if eventName is defined in interpreter-model?
				eventGenerator.gen(eventName, data);

            }
	            
        };
    }
	    
    return {
        /**
         * Object containing the instance of the class {@link mobileDS.InputEngine} 
         * 
         * 
         * <div class="box important">
		 * <b>Note:</b>
		 * The InputEngine must first be initialized {@link mobileDS.InputEngine#create};
		 * the instance of the singleton InputEngine is available, when the callback (i.e. the argument
		 * for the <tt>create</tt> function) is invoked.
		 * </div>
		 * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.InputEngine}
         * @public
         */
    	getInstance: function(){
    		if (instance === null) {
                alert("Error: InputEngine not initialized!\nCall create(CallbackFunction)");
                return null;
            }
            return instance;
        },
        /**
		 * This function must be called before using the {@link mobileDS.InputEngine}. The Initialization process is asynchronous, 
		 * because file resources must be loaded.<br>   
		 * 
		 * <div class="box important">
		 * <b>Note:</b>
		 * The callback function should contain all (!) instructions which require the prior loading of the InputEngine.<br> 
		 * The callback mechanism is necessary, because loading the DialogDescription is asynchronous.<br><br>
		 * If provided, the callback function is invoked with 1 argument, the InputEngine instance:<br>
		 * <code> callbackFunction(inputEngineInstance) </code>
		 * </div>
		 * 
		 * @function create
		 * @param {Function} [callbackFunction] The function which should be called after initialization has finished
		 * @example
		 * 	function afterCreatingInputEngine(inputEngineInstance){
		 * 		inputEngineInstance.raise('someEvent',{data: 'value'});
		 * 		//do something...
		 * 	} 
		 * 	mobileDS.InputEngine.create(afterCreatingInputEngine);
		 * @public
		 */
        create: function(callbackFunction){
        	if (instance === null) {
            	instance = constructor(callbackFunction);
            }
            return instance;
        }
    };
})();






