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


newAudioOutput = {
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
		    			playWAV: function(blob, successCallBack, failureCallBack){
		    				try {
			    				blobURL = window.webkitURL.createObjectURL(blob);
			    				var my_audio = new Audio(blobURL,null,failureCallBack);
			    				if(successCallBack){
			    					my_audio.addEventListener('ended', successCallBack, false);
			    				}
			    				my_audio.play();
					    	} catch (e){
					    		if(failureCallBack){
					    			failureCallBack(e);
					    		}
					    	}
		    			},
		    			textToSpeech: function(text,successCallBack,failureCallBack, startCallBack){
		    				try {
			    				text = text.replace(/\s/g, '%20');
			    				 var speaker = window.mobileDS.LanguageManager.getInstance().getSpeaker();
			    				 var lang = speaker["lang_simple"];
			    				 var voice = speaker["speaker"];
			    				 
			    	             var my_media = new Audio(
			    	            		 window.mobileDS.ConfigurationManager.getInstance().get("HTML5OutputServerBasePath")+'process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=' + text + '&LOCALE='+lang+'&VOICE='+voice+'&AUDIO=WAVE_FILE',
			    	            		 null, 
			    	            		 failureCallBack
			    	            );
	
			    				 this.current_speech = my_media; 
			    				 
			    	             my_media.addEventListener('ended', function() {
			    	            	 	this.current_speech = null;
			    	            	 	if(successCallBack){
			    	            	 		successCallBack();
			    	            	 	}
					    			}, false);
			    	             
			    	             if(startCallBack){
					    			 my_media.addEventListener('playing', startCallBack, false);
			    				 }
			    	             
			    	             my_media.play();
					    	} catch (e){
					    		this.current_speech = null;
					    		if(failureCallBack){
					    			failureCallBack(e);
					    		}
					    	}
		    			},
		    			cancelSpeech: function(successCallBack,failureCallBack){
		    				 
		    				if(this.current_speech){
		    					try{
		    						this.current_speech.pause();
		    					} catch(e){
		    						if(failureCallBack){
		    							failureCallBack(e);
		    							return;////////////////// EARLY EXIT ////////////////
		    						}
		    					}
		    				}
		    				
		    				if(successCallBack){
		    					successCallBack();
		    				}
		    			},
					    playURL: function(url, successCallBack, failureCallBack){
					    	try {
					    		
					    		 var my_media = new Audio(url,null,failureCallBack);
					    		 if(successCallBack){
					    			 my_media.addEventListener('ended', successCallBack, false);
					    		 }
					                my_media.play();
					    	} catch (e){
					    		if(failureCallBack){
					    			failureCallBack(e);
					    		}
					    	}
					    },
		    			getURLAsAudio: function(url, successCallBack, failureCallBack){
					    	try {
					    		
					    		 var my_media = new Audio(url,null,failureCallBack);
					    		 if(successCallBack){
					    			 my_media.addEventListener('ended', successCallBack, false);
					    		 }
					             return my_media;
					    	} catch (e){
					    		if(failureCallBack){
					    			failureCallBack(e);
					    		}
					    	}
					    }
		    		});
		}
};
		
