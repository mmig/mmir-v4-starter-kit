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
 * @module mobileDS.scxml
 * 
 */
var mobileDS = window.mobileDS ||
{};
	
	
/**
 * A class for managing the controllers of the application. <br>
 * It's purpose is to load the controllers and their views / partials and provide functions to find controllers or
 * perform actions or helper-actions.
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.DialogEngine.getInstance()</code>
 * @class DialogEngine
 * @category core
 */
mobileDS.DialogEngine = (function(){
    /**
     * Object containing the instance of the class {@link mobileDS.DialogEngine} 
     * 
     * @property instance
     * @type Object
     * @private
     */
	var instance = null;

	
    /**
     * <b>unused</b><br>
     * An array containing all states visited until now. 
     * 
     * @property stateHistory
     * @type Array
     * @private
     */
	var stateHistory = new Array();
	
	/**
     * An array containing all states active. 
     * 
     * @property statesActive
     * @type Array
     * @private
     */
	var statesActive = new Array();
	    
	/**
	 * A function that is executed after a page was loaded.
	 * The on_page_loade(string,string,object) function is executed after the view's on_page_load() function.
	 */
	var onPageRenderedFunc;
	
	/**
	 * Writes a log entry to the log-file
	 * 
	 * @function writeLogEntry
	 * @param eventName {String} the name of the event
	 * @param eventData {Object} the event data (may be undefined or null), otherwise eventData.Data must be defined! 
	 */
	var writeLogEntry = function(eventName, eventData){
		var userName = '';
		//date
		var inputType = '';
		var asrResult = '';
		var theEventName = '';
		var theEventData = '';
		var logFileWriter = mobileDS.LogFileWriter.getInstance();
		
		var currentState = logFileWriter.toCsvString(statesActive[statesActive.length-1]);
		
		if(typeof eventName === 'string'){
			theEventName = logFileWriter.toCsvString(eventName);
		}
		
		if (typeof mobileDS.User !== 'undefined') {
			userName = mobileDS.User.getInstance().getName();
			if (typeof userName === 'undefined') {
				userName = '';
			}
			else {
				userName = logFileWriter.toCsvString(userName);
			}
		}
        
        if (typeof eventData != "undefined") {
        	if (typeof eventData.Emma === "undefined") {
        		inputType = "system";
            }
            else {
            	inputType = eventData.Emma.mode;
            }
        	if (inputType === "voice") {
            	asrResult = logFileWriter.toCsvString(eventData.Data.asr_result);
            }
        	
        	theEventData = logFileWriter.toCsvString(JSON.stringify(eventData.Data.data));
        }
        else {
        	inputType = "system";
        }
        
//        console.warn('write log-entry for '+eventName);//FIXM
        //columns: user-name | date&time | modality-type | speech-recognition result | event-name | event-data | current state-name
        logFileWriter.append(userName + ", " + (new Date()).toISOString()+ ", \"" + inputType + "\", " + asrResult + ", " + theEventName + ", " + theEventData +  ", "+ currentState + "\r\n");
	};
	    
	/**
	 * Constructor-Method of Class {@link mobileDS.DialogEngine}.<br>
	 * Initializes the statechart-automata which is described by **DialogDescription.xml** and handles the logic/flow of the application. 
	 * 
	 * @constructor
	 * @augments mobileDS.DialogEngine
	 * @memberOf mobileDS.DialogEngine.prototype
	 */
	// listener for transitions / state-changes:
	function constructor(callbackFunction){
		
			var interpreter = null;
			var eventGenerator = null;
			var isInitialized = false;
			var scion = require('scion');
			
			scion.urlToModel("config/statedef/dialogDescriptionSCXML.xml",function(err,model){
	
	            if(err) throw err;
	
	            //instantiate the interpreter
	            interpreter = new scion.SCXML(model);
	
				// listener for transitions / state-changes:
				var listener = {
					onEntry : function(stateName) {
						statesActive.push(stateName);
						
						if(IS_DEBUG_ENABLED) console.debug('Dialog State Entry: "' + stateName + '"');//debug
					},
					onExit : function(stateName) {
						statesActive.pop();
						
						if(IS_DEBUG_ENABLED) console.debug('Dialog State Exit: "' + stateName + '"');//debug
					},
					onTransition : function(sourceState, targetStatesArray) {
						if(IS_DEBUG_ENABLED) console.debug('Dialog State Transition: "'
								+ sourceState + '"->"' + targetStatesArray + '"');//debug

	    				//currently, only 1-target transitions are supported:
						if(targetStatesArray && targetStatesArray.length > 1){
	    					console.warn('Dialog State Transition: multiple target states!');
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
			
			/** @lends mobileDS.DialogEngine.prototype */
	        return {
	            /**
	    		 * This function initializes the statechart automata instance and then raises the 'init' event. 
	    		 * 
	    		 * @function startEngine
	    		 * @public
	    		 */
	            startEngine: function(){
	                
	            	if(isInitialized){
						if(IS_DEBUG_ENABLED) console.warn('DialogEngine.startEngine(): already initialized!'+' '+new Error().stack);//debug (use Error for retrieving call-hierarchy using its stack-trace) 
						return; ////////////////////// EARLY EXIT //////////////////////////////////
					}
	            	
	                if(interpreter){
	                	isInitialized = true;
						interpreter.start();
//		                console.error('DialogEngine init: '+(new Date() - startUpTime));//debug : for testing, must initialize startUpTime with new Date(), first thing in index.html! 
		                this.raise('init');
					}
					else {
						var isTimeout = false;
						var startTime = new Date();
						var timeout = 10000;//10 sec. TODO setting this global/by configuration?
						
						var self = this;
						
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
//				                console.error('DialogEngine init: '+(new Date() - startUpTime));//debug : for testing, must initialize startUpTime with new Date(), first thing in index.html! 
				                self.raise('init');
							}
							else {
								if(confirm){
									var result = confirm('Could not initialize DialogEngine (time out).\nContinue to wait another\n '+ (timeout/1000).toFixed(3) +' seconds?');
									if(result){
										startTime = new Date();
										setTimeout(function(){waitForInit();},50);
									}
									else {
										console.error('Could not initialize DialogEngine (time out).');
									}
								}
								else {
									console.error('Could not initialize DialogEngine (time out).');
								}
							}
						};
						
						//start waiting:
						waitForInit();
					}
	                
	            },

	            /**
	    		 * This function raises an event. 
	    		 * 
	    		 * @function raise
	    		 * @param {String} eventName The name of the event which is to be raised
	    		 * @param {Object} data Data belonging to the event
	    		 * @throws {Error} if invoked when the internal event/state engine is not initialized yet
	    		 * @public
	    		 */
	            raise: function(eventName, data){	
	            	
	            	if(!isInitialized){
	            		throw new Error('DialogEngine is not initialized yet, cannot process event "'+eventName+'"!');
	            	}
	            	
	            	if ((typeof data !== 'undefined') && (typeof data.Data === 'undefined')) {
	            		// Has data but didn't go through inputmanager
	            		data = JSON.parse('{ "Data": { "data": '+JSON.stringify(data)+' }}');
	            	}
	            	
	            	if(IS_DEBUG_ENABLED) console.debug("raising event : '" + eventName + "' in state '"+ statesActive[statesActive.length-1] + "' with data "+JSON.stringify(data));//debug
	            	
	            	// if (!(typeof data === "undefined")) {
	                        // alert("data " + data);
	                // } else
	            	
//	                if (eventName == 'exit') {
//	                	if (navigator != null) {
//	                		if(IS_DEBUG_ENABLED) console.debug('[DEBUG] now app is exiting!');//debug
//	                		
//	                        navigator.app.exitApp();
//	                	}
//	                }
	            	
//	                else if (!(typeof dialogStateChartInstance[eventName] === 'undefined')) {
//	                	if (typeof data !== 'undefined' && typeof data.Data !== 'undefined' && typeof data.Data.data !== 'undefined') {
//	                		dialogStateChartInstance[eventName](data.Data.data);  
//	                	}
//	                	else {
//	                		dialogStateChartInstance[eventName](data);
//	                	}
//	                		
//  	                }
//  	                else {
//  	                    console.warn('no possible transition for ' + eventName + ' in state '+ statesActive[statesActive.length-1]);
//  	                }

					//TODO is there a way to check, if eventName is defined in interpreter-model?
//	                else 
	                	if (typeof data !== 'undefined' && typeof data.Data !== 'undefined' && typeof data.Data.data !== 'undefined') {
	                	eventGenerator.gen(eventName, data.Data.data);
                	}
                	else {
                		eventGenerator.gen(eventName, data);
                	}
	                
	                //Logging
	                //writeLogEntry(eventName, data); FIXME disabled for BROWSER compatibility ... (how could this be done with Browsers?)
//	                if (typeof mobileDS.User !== 'undefined') {
//	        			name = mobileDS.User.getInstance().getName();
//	        			if (typeof name === 'undefined') {
//	        				name = "";
//	        			}
//	        			else {
//	        				name = logStringify(name);
//	        			}
//	        		}
//	                
//	                if (typeof data != "undefined") {
//	                	if (typeof data.Emma === "undefined") {
//	                		inputType = "system";
//		                }
//		                else {
//		                	inputType = data.Emma.mode;
//		                }
//	                	if (inputType === "voice") {
//		                	asr_result = logStringify(data.Data.asr_result);
//		                }
//	                }
//	                else {
//	                	inputType = "system";
//	                }
//	                
//	                if (typeof data != "undefined") {
//	                	appendToLogFile(name + ", " + (new Date()).toISOString()+ ", \"" + inputType + "\", " + asr_result + ", " + logStringify(eventName) + ", " + logStringify(JSON.stringify(data.Data.data)) +  ", "+ logStringify(statesActive[statesActive.length-1]) + "\r\n");
//	                }            
//	            	else {
//	            		appendToLogFile(name + ", " + (new Date()).toISOString()+ ", \"" + inputType + "\", " + asr_result + ", " + logStringify(eventName) + ", , " + logStringify(statesActive[statesActive.length-1]) + "\r\n");
//	            	}
                	//Logging
	                
  	            },


	            /**
				 * This function performs an action of a controller
				 * by calling the method {@link mobileDS.ControllerManager#perform} of the {@link mobileDS.ControllerManager}   
	    		 * 
	    		 * @function perform
				 * @param {String} ctrlName Name of the controller to which the action belongs
				 * @param {String} actionName Name of the action that should be performed
				 * @param {Object} data optional data that can be submitted to the action
				 * @returns {Object} the return object of the performed action
	    		 * @public
	    		 */
  	            perform: function(ctrlName, actionName, data){
  	            	if(IS_DEBUG_ENABLED) console.debug("going to perform ('" + ctrlName + "','" + actionName + "')");//debug
  	            	
  	                return mobileDS.ControllerManager.getInstance().perform(ctrlName, actionName, data);
  	            },


	            /**
	             * This function performs an action of a helper-class for a controller 
				 * by calling the method {@link mobileDS.ControllerManager#performHelper} of the {@link mobileDS.ControllerManager}   
	    		 * 
	    		 * @function performHelper
				 * @param {String} ctrlName Name of the controller to which the helper action belongs
				 * @param {String} helper_method_name Name of the action that should be performed by the helper
				 * @param {Object} data optional data that can be submitted to the action
				 * @returns {Object} the return object of the performed action
	    		 * @public
	    		 */
  	            performHelper: function(ctrlName, helper_method_name, data){
                	if(arguments.length > 3){
      	            	return mobileDS.ControllerManager.getInstance().performHelper(ctrlName, helper_method_name, data, arguments[3]);
                	}
                	else {
      	            	return mobileDS.ControllerManager.getInstance().performHelper(ctrlName, helper_method_name, data);
                	}
  	            },
  	            

	            /**
	             * This function displays a dialog of a controller
				 * by calling the method {@link mobileDS.PresentationManager#showDialog} of the {@link mobileDS.PresentationManager}   
	    		 * 
	    		 * @function showDialog
				 * @param {String} ctrlName Name of the controller to which the dialog belongs
				 * @param {String} dialogId Id of the dialog that should be displayed
				 * @param {Object} data Optional data that can be submitted to the dialog
	    		 * @public
	    		 */
  	            showDialog: function(ctrlName, dialogId, data){
  	            	
  	            	var eventData;
  	            	if(data){
  	            		if(!data.Data){
		  	            	eventData = new Object();
		  	            	eventData.Data = data;
  	            		}
  	            		else {
  	            			eventData = data;
  	            		}
  	            	}
//  	            	writeLogEntry('showDialog_'+ctrlName+'_'+dialogId, eventData); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)
  	            	
  	            	 mobileDS.PresentationManager.getInstance().showDialog(ctrlName, dialogId, data);
  	            },
  	            

	            /**
	             * This function closes a dialog of a controller
				 * by calling the method {@link mobileDS.PresentationManager#hideCurrentDialog} of the {@link mobileDS.PresentationManager}   
	    		 * 
	    		 * @function hideCurrentDialog
	    		 * @public
	    		 */
  	            hideCurrentDialog: function(){
  	            	
//  	            	writeLogEntry('hideCurrentDialog'); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)
  	            	
  	            	mobileDS.PresentationManager.getInstance().hideCurrentDialog();
  	            } ,
  	            /**
  	             * Show a "wait" dialog, indicating work-in-progress.
  	             * 
  	             * @function showWaitDialog
  	             * @public
  	             * @requires jQuery Mobile
  	             * 
  	             * @see mobileDS.DialogEngine#hideWaitDialog
  	             */
  	            showWaitDialog : function(){
  	            	

					if($('.ui-loading').length == 0){
						//only write log-entry, if waiting-dialog is newly opened with this call
//						console.debug('show loading');//FIXM
//						writeLogEntry('showWaitingDialog'); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)
					}
  	            	
  	            	var loadingText = mobileDS.LanguageManager.getInstance().getText('loadingText');
					if (loadingText !== null && loadingText.length > 0) {
//						console.log('[DEBUG] setting loading text to: "'+loadingText+'"');
						$.mobile.loading('show', {
							text : loadingText,
							textVisible : true
						});
					} else {
						$.mobile.loading('show');
					}
					
					// layout-fix: the icon is not animated on itself (PNG) -> add
					// CSS spin-animator class
					$('.ui-loader .ui-icon-loading').addClass('spin');
  	            },
  	            
  	            /**
  	             * Hides / closes the "wait" dialog.
  	             * 
  	             * @function hideWaitDialog
  	             * @public
  	             * @requires jQuery Mobile
  	             * 
  	             * @see mobileDS.DialogEngine#showWaitDialog
  	             */
  	            hideWaitDialog : function(){
  	            	
  	            	if($('.ui-loading').length > 0){
						//only write log-entry, if waiting-dialog is currently open
//						writeLogEntry('closeWaitingDialog'); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)
					}
  	            	
  	            	$.mobile.loading('hide');
  	            	
  	            },
  	            
	            /**
	             * This function displays a view of a controller
				 * by calling the method {@link mobileDS.PresentationManager#renderView} of the {@link mobileDS.PresentationManager}.<br>
				 * And after rendering binds event listeners to all buttons of the view.
	    		 * 
	    		 * @function render
				 * @param {String} ctrlName Name of the controller to which the view belongs
				 * @param {String} viewName Name of the view that should be rendered
				 * @param {Object} data Optional data that can be submitted to the generation of the view
	    		 * @public
	    		 */
  	            render: function(ctrlName, viewName, data){
  	                mobileDS.PresentationManager.getInstance().renderView(ctrlName, viewName, data);
  	                
  	                if(typeof onPageRenderedFunc === 'function'){
  	                	onPageRenderedFunc(ctrlName, viewName, data);
  	                }
 	            },
 	            /**
 	             * Get the current on-page-rendered hook function (if it was set).
 	             * 
 	             * @function getOnPageRenderedHandler
 	             * @param {Function} the onPageRendered handler (NOTE: this may not be set, i.e. <tt>undefined</tt>)
 	             */
 	            getOnPageRenderedHandler : function(){
  	            	return onPageRenderedFunc;
  	            },
 	            /**
 	             * Set the on_page_loaded callback function.
 	             * 
 	             * If <code>onPageRenderedHook</code> is a function object, it will be executed after a view is rendered and
 	             * after the view's controller on_page_load function(s) has/have been executed.
 	             * 
 	             * <p>This function will be executed after the view's on_page_load()-function.<br>
 	             * 											The <code>onPageRenderedHook</code> function takes 3 arguments that
 	             * 											refer to the parameters with which the render-function was invoked:
				 * <br><code>{String} ctrlName </code> Name of the controller to which the view belongs
				 * <br><code>{String} viewName</code> Name of the view that should be rendered
				 * <br><code>{Object} [data]</code> <em>Optional</em> data that can be submitted to the generation of the view
 	             * 
 	             * @function setOnPageRenderedHandler
 	             * @param {Function} onPageRenderedHook a callback function that will be executed after a view was rendered
 	             * 											i.e. after a page was loaded.
 	             */
 	            setOnPageRenderedHandler : function(onPageRenderedHook){
 	            	onPageRenderedFunc =  onPageRenderedHook;
 	            }
	        };
	    }
	
	    return {
	        /**
	         * Get the object containing the instance of the class {@link mobileDS.DialogEngine} 
	         * 
	         * <div class="box important">
			 * <b>Note:</b>
			 * The DialogEngine must first be initialized {@link mobileDS.DialogEngine#create};
			 * the instance of the singleton DialogEngine is available, when the callback (i.e. the argument
			 * for the <tt>create</tt> function) is invoked.
			 * </div>
			 * 
	         * @function getInstance
	         * @returns {Object} Object containing the instance of the class {@link mobileDS.DialogEngine}
	         * @public
	         */
	        getInstance: function(){
	        	if (instance === null) {
	                alert("Error: DialogEngine not initialized!\nCall create(CallbackFunction)");
	                return null;
	            }
		        return instance;
	        },
	        /**
			 * This function must be called before using the {@link mobileDS.DialogEngine}. The Initialization process is asynchronous, 
			 * because file resources must be loaded.<br>   
			 * 
			 * <div class="box important">
			 * <b>Note:</b>
			 * The callback function should contain all (!) instructions which require the prior loading of the DialogEngine.<br> 
			 * The callback mechanism is necessary, because loading the DialogDescription is asynchronous.<br><br>
			 * If provided, the callback function is invoked with 1 argument, the DialogEngine instance:<br>
			 * <code> callbackFunction(dialogEngineInstance) </code>
			 * </div>
			 * 
			 * @function create
			 * @param {Function} [callbackFunction] The function which should be called after initialization has finished
			 * @example
			 * 	function afterCreatingDialogEngine(dialogEngineInstance){
			 * 		var appCtrl = dialogEngineInstance.perform('Application','getPropertyX');
			 * 		//do something...
			 * 	} 
			 * 	mobileDS.DialogEngine.create(afterCreatingDialogEngine);
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