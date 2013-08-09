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


newConcurrentSCION = {
		initialize: function(callBack){
						var callBackList = [];
						function successCallBackHandler(args){
							if (args.length=2){
								callBackList[args[0]](args[1]);
							}
						}
						callBack({
					    	newConcurrentSCION: function(scion, failureCallBack){
					    		var id = callBackList.length;
					    		callBackList.push(function(data){
					    			//	console.log('raising:'+ data.event);
					    				var generatedState = scion.gen(data.event, data.eventData);
					    				plugins.queuePlugin.readyForJob(id, successCallBackHandler, failureCallBack);
					    		});
					    		plugins.queuePlugin.newQueue(id, function(args){console.log('Queue '+id+' created.');},failureCallBack);
					    		
					    		return {
					    			gen: function (event, eventData){
						    		//	console.log('new Job:'+ event);
						    			plugins.queuePlugin.newJob(id, {event: event, eventData: eventData}, successCallBackHandler,failureCallBack);
						    			}
					    		};
						}
				});
		}
};
		
