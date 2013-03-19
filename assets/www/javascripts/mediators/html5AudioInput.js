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


newAudioInput = {
		initialize: function(callBack){
				function htmlAudioConstructor(){
					// variable that describes if recording is in process
					var recording = false;
					var webSocket = null;
					var audio_context=null;
					var stream = null;
		    		var recorder=null;
		    		//the function that is called on the recognized text that came back from the server
		    		var textProcessor = function(e){};
		    		var silenceDetection = null;
		    		var silenceDetectionInput = null;
		    		
		    		/** initializes the connection to the googleMediator-server, 
		    		 * where the audio will be sent in order to be recognized. **/
				    function initializeWebSocket(){
						   webSocket = new WebSocket("ws://127.0.0.1:9999");
			               webSocket.onopen = function () {
			            	   if(IS_DEBUG_ENABLED) console.log("Openened connection to websocket");
			               };
			 
			               webSocket.onmessage = function(e) {
			                   var jsonResponse = jQuery.parseJSON(e.data );
			                   if (jsonResponse.hypotheses.length>0){			                	  			          
			                	   textProcessor(jsonResponse.hypotheses[0].utterance);		
			                   }
			               };		                   
					}
				    /**
				     * creates a new AudioNode, that communicates sound to the silence detector
				     */
		    		function startNewInputNode(){
		    			if (silenceDetectionInput) {
		    					silenceDetectionInput.onaudioprocess= function(e){};
		    			}
		    			var input = audio_context.createMediaStreamSource(stream); 	    		    
		    			silenceDetectionInput = input.context.createJavaScriptNode(4096, 2, 2);
		   	    		silenceDetectionInput.onaudioprocess = function(e){
		   	    			if (recording){
				   	    	     silenceDetection.postMessage({
				   	    	        command: 'isSilent',
				   	    	        buffer: e.inputBuffer.getChannelData(0)
				   	    	      });
		   	    			}
			   	    	};
		   	    		input.connect(silenceDetectionInput);
		   	    		silenceDetectionInput.connect(input.context.destination);    

		    		}
		    		
		    		/**
		    		 * creates Silence detector and recorder and connects them to the input stream
		    		 * @param inputstream
		    		 */
		    		function startUserMedia(inputstream){
		    			stream = inputstream;
		   	    		var input = audio_context.createMediaStreamSource(stream); 	    		    
		   	    		recorder = new Recorder(input);   		    
		   	    		silenceDetection = new Worker('javascripts/mediators/silenceDetection.js');
		   	    		silenceDetection.onmessage = function (e){
		   	    			if(IS_DEBUG_ENABLED) console.log(e.data);
		   	    			if (e.data=='Silence detected!'){
		   	    				// send record to server!
			   	    			recorder && recorder.exportWAV(function(blob){
			   	    				if(IS_DEBUG_ENABLED) console.log("wav exported");
			   	    			   	recorder.clear();
				   					webSocket.send("clear");
				   					webSocket.send("language "+mobileDS.ConfigurationManager.getInstance().getLanguage());
				   					webSocket.send("start");
				   					webSocket.send(blob);
				   					webSocket.send("stop");
				   					webSocket.send("analyze");
				   				 });
		   	    			}
		   	    			if (e.data=='clear'){
			   	    			recorder.clear();
		   	    			}
		   	    		};
		   	    		silenceDetection.postMessage({
				   	         command: 'init',
				   	         config: {
				   	           sampleRate: input.context.sampleRate,
				   	           
				   	         }
				   	       });
		   	    	}
		    		try {
				        // unify the different kinds of HTML5 implementations
		    			//window.AudioContext = window.AudioContext || window.webkitAudioContext;
		    			//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		    			//window.URL = window.URL || window.webkitURL;
		    			audio_context = new webkitAudioContext;
		    		} 
		    		catch (e) {
		    			alert('No web audio support in this browser!');
		    		}
		    		try {
		    			initializeWebSocket();
		    		} catch (e) {
		    			alert('Could not reach the voice recognition server!');
		    		}
		    		// get audioInputStream
		    		navigator.__proto__.webkitGetUserMedia({audio: true}, startUserMedia, function(e) {});

		    		return {
		    			startRecord: function(callBack){
			   			textProcessor = callBack;
		    			silenceDetection && startNewInputNode();
		    			recording=true;
		    			recorder && recorder.clear();
		   				recorder && recorder.record();
		   				silenceDetection && silenceDetection.postMessage({command: 'start'});
		   			 },
		   			 stopGetRecord: function(blobHandler){
		   				recording=false;
		   				recorder && recorder.stop();
		   				recorder && recorder.exportWAV(blobHandler);
		   				silenceDetection && silenceDetection.postMessage({command: 'stop'});
		   			 },
		   			 recognize: function(successCallBack,failureCallBack){
			   			textProcessor = successCallBack;
		   				recorder && recorder.stop();
		   				silenceDetection && silenceDetection.postMessage({command: 'stop'});
		   				recorder && recorder.exportWAV(function(blob){		   					 
		   					 webSocket.send("clear");
		   					 webSocket.send("start");
		   					 webSocket.send(blob);
		   					 webSocket.send("stop");
		   					 webSocket.send("analyze");
		   					 webSocket.send("clear");
		   				 });
		   			 }
		    		};
		    		
				};
			// the code starts here, loads the necessary scripts and then calls htmlAudioConstructor
			mobileDS.CommonUtils.getInstance().loadScript('javascripts/mediators/recorderWorker.js',function(){
				mobileDS.CommonUtils.getInstance().loadScript('javascripts/mediators/recorder.js', function(){
					callBack(htmlAudioConstructor());
				});
			});
		}
		
};