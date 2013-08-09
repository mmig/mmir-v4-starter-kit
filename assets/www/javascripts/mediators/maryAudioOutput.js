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
			callBack({
				textToSpeech: function(text,successCallBack,failureCallBack,startCallBack){
					try {
						text = text.replace(/\s/g, '%20');
						var speaker = window.mobileDS.LanguageManager.getInstance().getSpeaker();
						var lang = speaker["lang_simple"];
						var voice = speaker["speaker"];
	   			
						var my_media = new Media(
							window.mobileDS.ConfigurationManager.getInstance().get("HTML5OutputServerBasePath")+'process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=' + text + '&LOCALE='+lang+'&VOICE='+voice+'&AUDIO=WAVE_FILE', 
							successCallBack,
							failureCallBack
						);
						
						if(startCallBack){
			    			 my_media.addEventListener('playing', startCallBack, false);
	    				 }
						
						my_media.play();
					} catch (e){
			    		console.log('error!'+e);
						if (failureCallBack){
							failureCallBack(e);
						}
					}
				},
				    playWav: function(blob, successCallback, failureCallBack){
				    	try {
				    	     var blobURL = window.URL.createObjectURL(blob);
				    		 var my_media = new Media(blobURL,null,failureCallBack);
				                my_media.play();
				                if(successCallback){
				                	successCallback();
				                }
				    	} catch (e){
				    		console.log('error!'+e);
							if (failureCallBack){
								failureCallBack();
							}
				    	}
				    },
				    playURL: function(url, successCallBack, failureCallBack){
				    	try {
				    		 var my_media = new Media(url,successCallBack, failureCallBack,null,null);
				             my_media.play();
				    	} catch (e){
				    		console.log('error!'+e);
							if (failureCallBack){
								failureCallBack(e);
							}
				    	}
				    }
				});	
		}
}