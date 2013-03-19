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
		    			alert('No web audio support in this browser!');
		    		}
		    		
		    		var playURL = function (url){
		    			
		    		}
		    		callBack({
		    			playWAV: function(blob, successCallBack, failureCallBack){
		    				blobURL = window.webkitURL.createObjectURL(blob);
		    				var my_audio = new Audio(blobURL,null,null);
		    				my_audio.play();
		    			},
		    			textToSpeach: function(text,successCallBack,failureCallBack){
		    				 text = text.replace(/\s/g, '%20');
		    				 var lang = mobileDS.ConfigurationManager.getInstance().getLanguage();
		    				 var voice = 'dfki-pavoque-styles';
		    				 if (lang == 'en'){
		    					 voice = 'dfki-spike';
		    					 lang = 'en_GB';
		    				 }
		    	             var my_media = new Audio('http://mary.dfki.de:59125/process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=' + text + '&LOCALE='+lang+'&VOICE='+voice+'&AUDIO=WAVE_FILE', null, null);
		    	             my_media.play();
		    			}
		    		});
		}
};
		
