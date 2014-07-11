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
 * 
 *  @class mobileDS.SCIONExtension
 */
mobileDS.SCIONExtension = (function(){
	var initializers = {
			browser: function(){

				return {
					newSCIONExtension: function(scion, failureCallBack){
						var newWorker = new Worker(mobileDS.constants.getInstance().getWorkerPath()+'ScionQueueWorker.js');
						newWorker.onmessage= function(e){
							if	(e.data.command == "toDo"){
//								console.log('raising:'+ e.data.toDo.event);
								var generatedState = scion.gen(e.data.toDo.event, e.data.toDo.eventData);
								//console.info('processed event '+ e.data.toDo.event+' -> new state: '+JSON.stringify(generatedState));
								newWorker.postMessage({command: 'readyForJob'});
							};
						};
						return {
							gen: function (event, eventData){
								console.log('new Job:'+ event);
								newWorker.postMessage({
									command: 'newJob', 
									job: {event: event, eventData: eventData}
								});
							}
						};
					}//END: newSCIONExtension
				};//END: return
			},//END: browser
			android: function(){
				var callBackList = [];
				function successCallBackHandler(args){
					if (args.length=2){
						callBackList[args[0]](args[1]);
					}
				}
				return{
			    	newSCIONExtension: function(scion, failureCallBack){
			    		var id = callBackList.length;
			    		callBackList.push(function(data){
//			    				console.log('raising:'+ data.event);
			    				var generatedState = scion.gen(data.event, data.eventData);
			    				//console.info('processed event '+ e.data.toDo.event+' -> new state: '+JSON.stringify(generatedState));
			    				plugins.queuePlugin.readyForJob(id, successCallBackHandler, failureCallBack);
			    		});
			    		plugins.queuePlugin.newQueue(id, function(args){console.log('Queue '+id+' created.');},failureCallBack);
			    		
			    		return {
			    			gen: function (event, eventData){
//				    			console.log('new Job:'+ event);
				    			plugins.queuePlugin.newJob(id, {event: event, eventData: eventData}, successCallBackHandler,failureCallBack);
				    		}
			    		};
			    	}
				};//END: return
			},//END: android
			fallBack: function(){
				return {
					newSCIONExtension: function(scion, failureCallback){
						return { 
							gen: function (event, eventData){
								setTimeout(function(){
									scion.gen(event, eventData);
								}, 0);
							}
						};
					}
				};
			}
	};
    var instance = null;
  //those are the standard SCIONExtension procedures, that should be returned by the initialize function of a loaded file
    
    function constructor() {
    	var env = 'android';
    	if (forBrowser) {
    		env = 'browser';
    	}
    	try {
    		instance = initializers[env]();
    	} catch (e){
    		console.log("Error loading SCIONExtension: "+e);
    		instance = initializers.fallBack();
    		console.warn("Loaded default fallback for SCIONExtension");
    	}
    	return instance;
    	/**return {
	    			newSCIONExtension: function(interpreter, failureCallBack){
	    				failureCallBack('No SCIONExtension implementation loaded.');
	    				return {
	    					gen: function(eventName, data){
	    						interpreter.gen(eventName, data);
	    					}
	    				};
	    			}
    			};**/
    };
    
    	
    
    return {
        /**
         * Object containing the instance of the class {{#crossLink "SCIONExtension"}}{{/crossLink}} 
         * 
         * @method getInstance
         * @return {Object} Object containing the instance of the class {{#crossLink "CommonUtils"}}{{/crossLink}}
         * @public
         */
        getInstance: function(){
            if (instance === null) {
                constructor();
            }
            return instance;
        },
        /**
         * loads a file. If the file implements a function newSCIONExtension.initialize(f)
         * where the function f is called with a set of functions e, then those functions in e 
         * are added to the visibility of SCIONExtension, and will from now on be applicable by calling
         * SCIONExtension.getInstance.<function name>.
         */
    	loadFile: function(filePath,callBack){
    		mobileDS.CommonUtils.getInstance().loadScript(filePath, function(){
		    		if (instance === null) {
		                instance = constructor();
		            }
		    		if (newSCIONExtension){
		    			newSCIONExtension.initialize(function(functions){
		    					jQuery.extend(true,instance,functions);
								callBack();
		    			});
		    		}
    			});
			
    	}
    };
}) ();
