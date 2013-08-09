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
					
					var audio_context=null;							    				
	    			try {
				        // unify the different kinds of HTML5 implementations
		    			//window.AudioContext = window.AudioContext || window.webkitAudioContext;
		    			//window.URL = window.URL || window.webkitURL;
		    			audio_context = new webkitAudioContext;
		    		} 
		    		catch (e) {
		    			console.error('No web audio support in this browser!');
		    		}
		    		
		    		callBack({
		    			playWAV: function(blob, successCallback, failureCallback){
		    				try {
			    				blobURL = window.webkitURL.createObjectURL(blob);
			    				var my_audio = new Audio(blobURL,null,failureCallback);
			    				if(successCallback){
			    					my_audio.addEventListener('ended', successCallack, false);
			    				}
			    				my_audio.play();
					    	} catch (e){
					    		if(failureCallBack){
					    			failureCallBack(e);
					    		}
					    	}
		    			},
					    playURL: function(url, onEnd, failureCallBack, successCallback){
					    	try {
					    		
					    		 var my_media = new Audio(url,null,failureCallback);
					    		 my
					    		 if(successCallback){
					    			 my_media.addEventListener('ended', onEnd, false);
						    		 my_media.addEventListener('canplay', successCallback, false);
					    		 }
					                my_media.play();
					    	} catch (e){
					    		if(failureCallback){
					    			failureCallback(e);
					    		}
					    	}
					    },
		    			getURLAsAudio: function(url, onEnd,  failureCallback, successCallback){
					    	try {
					    		var ready = false;
					    		 var my_media = new Audio(url,null,failureCallback);
					    		 if (onEnd){
					    			 my_media.addEventListener('ended', onEnd, false);
					    		 }

					    		 my_media.addEventListener('canplay', function(){
					    			 	ready = true;
					    			 	console.log("sound is ready!");
					    			 	if (successCallback) successCallback();
					    			 }, false);
				    			 var enabled = true;
					    		 return {
					    			 play: function(){
					    				 if (enabled){
					    					// if (ready){
							    				 my_media.play();
					    					// } else {
					    					//	 my_media.addEventListener('canplay', my_media.play, false);
					    				// }

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
					    				 my_media=null;
					    			 }
					    		 };
					    	} catch (e){
					    		if(failureCallback){
					    			failureCallback(e);
					    		}
					    	}
					    }
		    		});
		}
};
		
