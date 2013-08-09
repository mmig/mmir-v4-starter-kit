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


newMediaPlugin = {
		initialize: function(callBack){
			var counter = 0;
			var callbackArray = new Array();
			callBack({
					playWav: function(blob, successCallback, failureCallback){
				    	try {
				    	     var blobURL = window.URL.createObjectURL(blob);
				    		 var my_media = new Media(
				    				 blobURL,
				    				 function(){ 
				    					 console.log('WAV Audio created');
		
							    		 my_media.release();//TODO if my_media object is to be re-used, do not release immediately...
							    		 if(successCallback){
							                successCallback();
							    		 }
				    				 },failureCallback
				    		);
				    		 
				            my_media.play();
				            
				    	} catch (e){
				    		if(failureCallback){
				    			failureCallback(e);
				    		}
				    	}
				    },
				    playURL: function(url, successCallback, failureCallback){
				    	try {
				    		 console.log(url);
				    		 var my_media = new Media(
				    				 url, 
				    				 function(){ 
				    					 console.log('Audio created');

							    		 my_media.release();//TODO if my_media object is to be re-used, do not release immediately...
							    		 if(successCallback){
							                successCallback();
							    		 }
				    				 } ,
				    				 failureCallback
				    		 );

				    		 my_media.play();
				    	} catch (e){
				    		if(failureCallback){
				    			failureCallback(e);
				    		}
				    	}
				    },
				    getURLAsAudio: function(url, onEnd, failureCallback, onCanPlay){
				    	//if (onCanPlay) onCanPlay();
				    	//successCallBack = function (){console.log("this isgetURLAsAudio"); successCallBack();};
			//	    	console.log(successCallBack);
			//	    	var onCanPlay = function (){ console.log("oncanplay ");
			//	    		successCallBack();
			//	    	};
				    	try {
				    		var onEndId = counter++;
				    		var onCanPlayId = counter++;
				    		var onFailureId = counter++;
				    		callbackArray.push(onEnd);
				    		callbackArray.push(onCanPlay);
				    		callbackArray.push(failureCallback);
	//			    		var playOnReady = false;
				    		 console.log(url);
				    		 var my_media = null;
				    		 
				    			 	my_media = new Media(
				    				 url,function(){console.log('native onReady CB');}
				    				 ,
				    				 failureCallback,
				    				 function(status){
				    					 console.log("status change!"+status);
				    					 //status = state;
				    					 if (status==1){
				    						 var onCanPlay = mobileDS.MediaManager.getInstance().getCallback(onCanPlayId);
				    						 if (onCanPlay) onCanPlay();
				    					 } else if (status==2)
				    						 {
				    						 console.log("Audio starting");
				    						 }
				    					 else if(status == 4){
				    						 var onEnd = mobileDS.MediaManager.getInstance().getCallback(onEndId);
				    						 if (onEnd) onEnd();				    					 
				    						 }
				    				 	}
				    		 );
				    		 var enabled = true;
				    		 return {
				    			 play: function(){
				    				 if (enabled){
					    				 my_media.play();
				    				 };
				    			 },
				    			 enable: function(){
				    				 enabled = true;
				    			 },
				    			 disable: function(){
				    				 my_media.stop();
				    				 enabled = false;
				    			 },
				    			 release: function(){
				    				 enabled= false;
				    				 callbackArray[onEndId] = null;
				    				 callbackArray[onCanPlayId] = null;
				    				 callbackArray[onFailureId] = null;
				    				
				    			 }
				    		 };
				    	} catch (e){
				    		console.log(e);
				    		if(failureCallback){
				    			failureCallback(e);
				    		}
				    	}
				    },
				    getCallback: function(id){
				    	return callbackArray[id];
				    }
				});	
		}
}