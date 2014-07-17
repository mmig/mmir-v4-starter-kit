define(['constants', 'scionEngine'], function(constants, scionEngine) {

	var _instance = null;

	//TODO remove/update: needs to be updated, so it works in Cordova/Android env!
//	var _simple = {
//
//		name : 'simple_engine',
//
//		doc : null,
//
//		evalScript : false,
//
//		onload : function(scion, deferred) {
//
//			$.extend(true, _instance, scion);
//
//			_instance.raise = function(eventName, data) {
//
//				if ((typeof data !== 'undefined') && (typeof data.Data === 'undefined')) {
//					
//					data = JSON.parse('{ "Data": { "data": '+ JSON.stringify(data) + ' }}');
//				}
//
//				if (		typeof data !== 'undefined'
//						&& 	typeof data.Data !== 'undefined'
//						&& 	typeof data.Data.data !== 'undefined'
//				) {
//					
//					scion.gen(eventName, data.Data.data);
//					
//				}
//				else {
//					scion.gen(eventName, data);
//				}
//
//				_instance.onraise();
//			};
//
//			//FIXME @russa: is this a general functionality? should this be removed?
//			if (!_instance.evalScript){
//				_instance.ignoreScript();
//			}
//
//			// delete _instance.gen;
//			delete _instance.evalScript;
//
//			_instance.start();
//			deferred.resolve(_instance);
//			
//		},//END: onload
//
//		onraise : function() {
//
//			if (IS_DEBUG_ENABLED) {
//				
//				console.debug('[%s] current state:', _instance.name, _instance.getStates());// debug
//
//				console.debug('[%s] active states:', _instance.name, _instance.getActiveStates());// debug
//
//				console.debug('[%s] active events:', _instance.name, _instance.getActiveEvents());// debug
//
//				console.debug('[%s] active transitions:', _instance.name, _instance.getStates()+ ":"+ JSON.stringify(_instance.getActiveTransitions()));// debug
//
//			}
//		}
//
//	};
//	var _extended = {
//
//		name : 'extended_engine',
//
//		doc : null,
//
//		onraise : function() {
//
//			if (IS_DEBUG_ENABLED) {
//				
//				console.debug('[%s] current state:', _instance.name, _instance.getStates());// debug
//
//				console.debug('[%s] active states:', _instance.name, _instance.getActiveStates());// debug
//
//				console.debug('[%s] active events:', _instance.name, _instance.getActiveEvents());// debug
//
//				console.debug('[%s] active transitions:', _instance.name, _instance.getStates() + ":"+ JSON.stringify(_instance.getActiveTransitions()));// debug
//			};
//
//		},
//
//		evalScript : true,
//
//		onload : function(scion, deferred) {
//
//			$.extend(true, _instance, scion);
//
//			_instance.worker = (function(gen) {
//				
//				var scionQueueWorker = new Worker(
//						constants.getWorkerPath()+ 'ScionQueueWorker.js'
//				);
//				
//				scionQueueWorker.onmessage = function(e) {
//					
//					if (e.data.command == "toDo") {
//						
//						console.log('raising:' + e.data.toDo.event);//FIXME DEBUG
//						
//						gen(e.data.toDo.event, e.data.toDo.eventData);
//
//						// @chsc03: attention if something goes wrong along the transition,
//						// the worker is not ready for any incoming jobs
//						_instance.worker.postMessage({
//							command : 'readyForJob'
//						});
//
//						_instance.onraise();
//					}
//				};
//
//				return scionQueueWorker;
//				
//			}(_instance.gen));
//
//			//FIXME @russa: is this a general functionality? should this be removed?
//			if (!_instance.evalScript){
//				_instance.ignoreScript();
//			}
//
//			// delete _instance.gen;
//			delete _instance.evalScript;
//
//			_instance.start();
//
//			deferred.resolve(_instance);
//			
//		},//END: onload
//
//		raise : function(event, eventData) {
//
//			if (eventData)
//				console.log('new Job:' + event);
//
//			_instance.worker.postMessage({
//				command : 'newJob',
//				job : {
//					event : event,
//					eventData : eventData
//				}
//			});
//		}
//	};
///////////////////////////////////////////////////////// START import from SCIONExtension /////////////////////////////
//	var initializers = {
//			browser: function(){
//
//				return {
//					newSCIONExtension: function(scion, failureCallBack){
//						var newWorker = new Worker(constants.getWorkerPath()+'ScionQueueWorker.js');
//						newWorker.onmessage= function(e){
//							if	(e.data.command == "toDo"){
////								console.log('raising:'+ e.data.toDo.event);
//								var generatedState = scion.gen(e.data.toDo.event, e.data.toDo.eventData);
//								//console.info('processed event '+ e.data.toDo.event+' -> new state: '+JSON.stringify(generatedState));
//								newWorker.postMessage({command: 'readyForJob'});
//							};
//						};
//						return {
//							gen: function (event, eventData){
//								console.log('new Job:'+ event);
//								newWorker.postMessage({
//									command: 'newJob', 
//									job: {event: event, eventData: eventData}
//								});
//							}
//						};
//					}//END: newSCIONExtension
//				};//END: return
//			},//END: browser
//			android: function(){
//				var callBackList = [];
//				function successCallBackHandler(args){
//					if (args.length=2){
//						callBackList[args[0]](args[1]);
//					}
//				}
//				return{
//			    	newSCIONExtension: function(scion, failureCallBack){
//			    		var id = callBackList.length;
//			    		callBackList.push(function(data){
////			    				console.log('raising:'+ data.event);
//			    				var generatedState = scion.gen(data.event, data.eventData);
//			    				//console.info('processed event '+ e.data.toDo.event+' -> new state: '+JSON.stringify(generatedState));
//			    				plugins.queuePlugin.readyForJob(id, successCallBackHandler, failureCallBack);
//			    		});
//			    		plugins.queuePlugin.newQueue(id, function(args){console.log('Queue '+id+' created.');},failureCallBack);
//			    		
//			    		return {
//			    			gen: function (event, eventData){
////				    			console.log('new Job:'+ event);
//				    			plugins.queuePlugin.newJob(id, {event: event, eventData: eventData}, successCallBackHandler,failureCallBack);
//				    		}
//			    		};
//			    	}
//				};//END: return
//			},//END: android
//			fallBack: function(){
//				return {
//					newSCIONExtension: function(scion, failureCallback){
//						return { 
//							gen: function (event, eventData){
//								setTimeout(function(){
//									scion.gen(event, eventData);
//								}, 0);
//							}
//						};
//					}
//				};
//			}
//	};
//	var instance = null;
//	//those are the standard SCIONExtension procedures, that should be returned by the initialize function of a loaded file  
//	function constructor() {
//    	var env = 'android';
//    	if (forBrowser) {
//    		env = 'browser';
//    	}
//    	try {
//    		instance = initializers[env]();
//    	} catch (e){
//    		console.log("Error loading SCIONExtension: "+e);
//    		instance = initializers.fallBack();
//    		console.warn("Loaded default fallback for SCIONExtension");
//    	}
//    	return instance;
//    };
///////////////////////////////////////////////////////// END import from SCIONExtension /////////////////////////////

    var _browser = {

    		name : 'extended_engine',

    		doc : null,

    		onraise : function() {

    			if (IS_DEBUG_ENABLED) {
    				
    				console.debug('[%s] current state:', _instance.name, _instance.getStates());// debug

    				console.debug('[%s] active states:', _instance.name, _instance.getActiveStates());// debug

    				console.debug('[%s] active events:', _instance.name, _instance.getActiveEvents());// debug

    				console.debug('[%s] active transitions:', _instance.name, _instance.getStates() + ":"+ JSON.stringify(_instance.getActiveTransitions()));// debug
    			};

    		},

    		evalScript : true,

    		onload : function(scion, deferred) {

    			$.extend(true, _instance, scion);

    			_instance.worker = (function(gen) {
    				
    				var scionQueueWorker = new Worker(
    						constants.getWorkerPath()+ 'ScionQueueWorker.js'
    				);
    				
    				scionQueueWorker.onmessage = function(e) {
    					
    					if (e.data.command == "toDo") {
    						
    						console.log('raising:' + e.data.toDo.event);//FIXME DEBUG
    						
    						gen(e.data.toDo.event, e.data.toDo.eventData);

    						// @chsc03: attention if something goes wrong along the transition,
    						// the worker is not ready for any incoming jobs
    						_instance.worker.postMessage({
    							command : 'readyForJob'
    						});

    						_instance.onraise();
    					}
    				};

    				return scionQueueWorker;
    				
    			}(_instance.gen));

    			//FIXME @russa: is this a general functionality? should this be removed?
    			if (!_instance.evalScript){
    				_instance.ignoreScript();
    			}

    			// delete _instance.gen;
    			delete _instance.evalScript;

    			_instance.start();

    			deferred.resolve(_instance);
    			
    		},//END: onload

    		raise : function(event, eventData) {

    			if (eventData)
    				console.log('new Job:' + event);

    			_instance.worker.postMessage({
    				command : 'newJob',
    				job : {
    					event : event,
    					eventData : eventData
    				}
    			});
    		}
    	};
    
    var _android = {

    		name : 'extended_engine',

    		doc : null,

    		onraise : function() {

    			if (IS_DEBUG_ENABLED) {
    				
    				console.debug('[%s] current state:', _instance.name, _instance.getStates());// debug

    				console.debug('[%s] active states:', _instance.name, _instance.getActiveStates());// debug

    				console.debug('[%s] active events:', _instance.name, _instance.getActiveEvents());// debug

    				console.debug('[%s] active transitions:', _instance.name, _instance.getStates() + ":"+ JSON.stringify(_instance.getActiveTransitions()));// debug
    			};

    		},

    		evalScript : true,

    		onload : function(scion, deferred) {

    			$.extend(true, _instance, scion);

    			
//    			_instance.worker = (function(gen) {
//    				
//    				var scionQueueWorker = new Worker(
//    						constants.getWorkerPath()+ 'ScionQueueWorker.js'
//    				);
//    				
//    				scionQueueWorker.onmessage = function(e) {
//    					
//    					if (e.data.command == "toDo") {
//    						
//    						console.log('raising:' + e.data.toDo.event);//FIXME DEBUG
//    						
//    						gen(e.data.toDo.event, e.data.toDo.eventData);
//
//    						// @chsc03: attention if something goes wrong along the transition,
//    						// the worker is not ready for any incoming jobs
//    						_instance.worker.postMessage({
//    							command : 'readyForJob'
//    						});
//
//    						_instance.onraise();
//    					}
//    				};
//
//    				return scionQueueWorker;
//    				
//    			}(_instance.gen));
//
//    			//FIXME @russa: is this a general functionality? should this be removed?
//    			if (!_instance.evalScript){
//    				_instance.ignoreScript();
//    			}
//
//    			// delete _instance.gen;
//    			delete _instance.evalScript;
    			
    			var android = (function(){
    				var callBackList = [];
    				function successCallBackHandler(args){
    					if (args.length=2){
    						callBackList[args[0]](args[1]);
    					}
    				}
    				return{
    			    	newSCIONExtension: function(gen, failureCallBack){
    			    		var id = callBackList.length;
    			    		callBackList.push(function(data){
//    			    				console.log('raising:'+ data.event);
    			    				var generatedState = gen(data.event, data.eventData);
    			    				//console.info('processed event '+ e.data.toDo.event+' -> new state: '+JSON.stringify(generatedState));
    			    				plugins.queuePlugin.readyForJob(id, successCallBackHandler, failureCallBack);
    			    				
    			    				_instance.onraise();
    			    		});
    			    		plugins.queuePlugin.newQueue(id, function(args){console.log('Queue '+id+' created.');},failureCallBack);
    			    		
    			    		return {
    			    			raiseAndroid: function (event, eventData){
//    				    			console.log('new Job:'+ event);
    				    			plugins.queuePlugin.newJob(id, {event: event, eventData: eventData}, successCallBackHandler,failureCallBack);
    				    		}
    			    		};
    			    	}
    				};//END: return
    			})();//END: android
    			
    			_instance.worker = android.newSCIONExtension(_instance.gen, function(){
    				
    				console.error('failed to initialize SCION extension for ANDROID evn');
    				_instance.worker = (function(gen){
    					return { 
    						raiseAndroid: function fallback(event, eventData){
								setTimeout(function(){
									gen(event, eventData);
								}, 1);
							}
						};
    				})();//END: fallback
    				
    			});

    			_instance.start();

    			deferred.resolve(_instance);
    			
    		},//END: onload

    		raise : function(event, eventData) {

    			if (eventData)
    				console.log('new Job:' + event);

    			_instance.worker.raiseAndroid(event, eventData);
    		}
    	};
    
    function getScionConfig(isCordovaEnv){
    	if(isCordovaEnv){
    		return _android;
    	}
    	else {
    		return _browser;
    	}
    }
    
	return function(url, _mode) {

//		switch (_mode) {
//		
//		case 'extended':
//			_extended.doc = url;
//			_instance = scionEngine(_extended);
//			return _instance;
//			break;
//			
//		case 'simple':
//		default:
//			_simple.doc = url;
//			_instance = scionEngine(_simple);
//			return _instance;
//			break;
//		}
		
		var scionConfig = getScionConfig( !constants.isBrowserEnv());

		scionConfig.doc = url;
		_instance = scionEngine(scionConfig);
		return _instance;
	};

});
