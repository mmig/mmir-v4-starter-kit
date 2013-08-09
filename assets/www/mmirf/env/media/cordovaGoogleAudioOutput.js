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
			
			window.plugins.nativeTTS.startup(
				function(data){
					console.info('NativeTTS.startup: success -> '+JSON.stringify(data));
				}, function(e){
					console.info('NativeTTS.startup: error -> '+JSON.stringify(e));
				}
			);
			var language = mobileDS.LanguageManager.getInstance().getSpeaker()["voice_lang"];
			window.plugins.nativeTTS.setLanguage(
					language,
				function(data){
					console.info('NativeTTS.setLanguage('+language+'): success -> '+JSON.stringify(data));
				}, function(e){
					console.info('NativeTTS.setLanguage('+language+'): error -> '+JSON.stringify(e));
				}
			);
							
			callBack({
				    textToSpeech: function (text, successCallBack, failureCallBack, startCallBack){
				    	
				    	try{
				    		
				    		var ttsFunc = function(){
				    			window.plugins.nativeTTS.speak(
						    			text, 
						    			successCallBack, 
						    			failureCallBack
						    	);
						    	//TODO implement real start-callback (needs to be done within java-/javascript-plugin)
						    	if(startCallBack){
						    		startCallBack();
						    	}
				    		};
				    		
				    		//check for changes in language setting:
				    		var currentLanguage = mobileDS.LanguageManager.getInstance().getSpeaker()["voice_lang"];
				    		if(currentLanguage !== language){
				    			//if necessary: change language first
				    			window.plugins.nativeTTS.setLanguage(currentLanguage,
				    				function(data){
				    					//on completion of setting lanuage: start TTS
				    					language = currentLanguage;
				    					ttsFunc();
					    			},
					    			failureCallBack
				    			);
				    		}
				    		else {
				    			//if correct language is set, start TTS
				    			ttsFunc();
				    		}
				    		
				    	} catch(e){
				    		if(failureCallBack){
				    			failureCallBack(e);
				    		}
				    	}
				    	
				    },
	    			cancelSpeech: function(successCallBack,failureCallBack){
	    				 
//	    				//FIXME currently, NuancePlugin returns failure on successful cancel-performance, so we call the function with switched failure, success arguments...
//	    				//			-> switch back, when NuancePlugin returns PluginResults correctly... 
//	    				window.plugins.nuancePlugin.cancel(failureCallBack, successCallBack);
//				    	console.error('DISABLED: Nuance TTS is disabled!');
//				    	if(failureCallBack)
//				    		failureCallBack('DISABLED: Nuance TTS is disabled!');
				    	
				    	window.plugins.nativeTTS.cancel(
				    			successCallBack, 
				    			failureCallBack
				    	);
	    			},
				    playWav: function(blob, successCallback, failureCallBack){
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
				    				 },failureCallBack
				    		);
				    		 
				            my_media.play();
				            
				    	} catch (e){
				    		if(failureCallBack){
				    			failureCallBack(e);
				    		}
				    	}
				    },
				    playURL: function(url, successCallback, failureCallBack){
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
				    				 failureCallBack
				    		 );

				    		 my_media.play();
				    	} catch (e){
				    		if(failureCallBack){
				    			failureCallBack(e);
				    		}
				    	}
				    },
				    getURLAsAudio: function(url, successCallback, failureCallBack){
				    	try {
				    		 console.log(url);
				    		 var my_media = new Media(
				    				 url, 
				    				 function(){ 
				    					 console.log('Audio created');

//							    		 my_media.release();//TODO if my_media object is to be re-used, do not release immediately...
							    		 if(successCallback){
							                successCallback();
							    		 }
				    				 } ,
				    				 failureCallBack
				    		 );

				    		 return my_media;
				    	} catch (e){
				    		if(failureCallBack){
				    			failureCallBack(e);
				    		}
				    	}
				    }
				});	
		}
}