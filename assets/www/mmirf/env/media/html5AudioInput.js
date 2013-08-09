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
		
		function htmlAudioConstructor(){
			// variable that describes if recording is in process
			var recording = false;
			var webSocket = null;
			var nonFunctional = false;
			var inputId = 1;
			var audio_context=null;
			var stream = null;
    		var recorder=null;
    		//the function that is called on the recognized text that came back from the server
    		var textProcessor = function(e,id){};
    		var silenceDetection = null;
    		var silenceDetectionInput = null;
    		
    		//for gathering partial ASR results when using startRecord:
    		var recordAsrResultCache = [];
    		var recordAsrResultSorter = function(a,b){return a.id - b.id;};
    		var asrResultCacheToString = function(cache){
    			var size = cache.length;
    			var sb = new Array(size);//use "StringBuffer" for concatenating partial results
    			for(var i = 0; i < size; ++i){
    				sb[i] = cache[i].text;
    			}
    			return sb.join('');
    		};
    		var recordAsrResultAggregator = function printResult(res,id){
    			recordAsrResultCache.push({
    				text: res,
    				id:id
    			});
    			recordAsrResultCache.sort(recordAsrResultSorter);

    			//FIXME debug output:
    			console.debug( asrResultCacheToString(recordAsrResultCache) );
    		};
    		
    		/** initializes the connection to the googleMediator-server, 
    		 * where the audio will be sent in order to be recognized. **/
      		 function initializeWebSocket(){
      			 webSocket = new WebSocket(mobileDS.ConfigurationManager.getInstance().get("HTML5InputWebSocketAddress"));
      			 webSocket.onopen = function () {
      				 if(IS_DEBUG_ENABLED) console.log("Openened connection to websocket");
      			 };

      			 webSocket.onmessage = function(e) {
      				 var id = e.data.substring(0,e.data.indexOf("_"));
      				 var jsonText = e.data.substring(e.data.indexOf("_")+1, e.data.length);
      				 var jsonResponse = jQuery.parseJSON(jsonText );
      				 if (jsonResponse.hypotheses.length>0){
      					 if(textProcessor){
      						 textProcessor(jsonResponse.hypotheses[0].utterance, id);
      					 }
      					 
      					 //aggregate / gather text-parts into the recordAsrResultCache:
      					 recordAsrResultAggregator(jsonResponse.hypotheses[0].utterance, id);
      				 }
      			 };	
      			 webSocket.onerror = function(e) {
      				 console.log('Websocket Error: '+e);
      				 // initializeWebSocket();
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
		    	silenceDetectionInput = input.context.createJavaScriptNode(mobileDS.ConfigurationManager.getInstance().get("HTML5InputSoundPackageSize"), 2, 2);
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
    			silenceDetection = new Worker(mobileDS.ConfigurationManager.getInstance().get("HTML5InputSilenceDetectorPath"));
    			silenceDetection.onmessage = function (e){
    				if(IS_DEBUG_ENABLED) console.log(e.data);
    				if (e.data=='Silence detected!'){
    					// send record to server!
    					recorder && recorder.exportWAV(function(blob, id){
    						if(IS_DEBUG_ENABLED) console.log("wav exported");
    						if(blob.size>2000000) {
    							console.log("Message too large. You need to pause from time to time.");
    						} else  
    						{
    							//mobileDS.MediaManager.getInstance().playWAV(blob,function(){},function(){alert("could not play blob");});
    							webSocket.send("clear");
    							webSocket.send("language "+mobileDS.ConfigurationManager.getInstance().getLanguage());
    							webSocket.send("start "+inputId);
    							webSocket.send(blob);
    							webSocket.send("analyze "+inputId++);
    						}
    					}, mobileDS.ConfigurationManager.getInstance().get("HTML5InputSilenceBuffer"),inputId);
    				}
    				if (e.data=='clear'){
    					recorder.clear(mobileDS.ConfigurationManager.getInstance().get("HTML5InputSilenceBuffer"));
    				}
    			};
    			silenceDetection.postMessage({
    				command: 'init',
    				config: {
    					sampleRate: input.context.sampleRate,
    					noiseTreshold : mobileDS.ConfigurationManager.getInstance().get("SilenceDetectorNoiseTreshold"),
    					pauseCount : mobileDS.ConfigurationManager.getInstance().get("SilenceDetectorPauseCount"),
    					resetCount : mobileDS.ConfigurationManager.getInstance().get("SilenceDetectorResetCount")
    				}
    			});
    		}//END: startUserMedia
    		
    		try {
		        // unify the different kinds of HTML5 implementations
    			//window.AudioContext = window.AudioContext || window.webkitAudioContext;
    			html5Navigator.getUserMedia = html5Navigator.getUserMedia || html5Navigator.webkitGetUserMedia || html5Navigator.mozGetUserMedia;
    			//window.URL = window.URL || window.webkitURL;
    			audio_context = new webkitAudioContext;
    		} 
    		catch (e) {
    			console.error('No web audio support in this browser!');
    			nonFunctional = true;
    		}
    		
    		if( nonFunctional !== true ) try {
    			initializeWebSocket();
    		} catch (e) {
    			console.error('Could not reach the voice recognition server!');
    			nonFunctional = true;
    		}

    		if (nonFunctional) {
    			return {};///////////////////////////// EARLY EXIT //////////////////////////////
    		}

    		// get audioInputStream
    		html5Navigator.webkitGetUserMedia({audio: true}, startUserMedia, function(e) {});

    		return {
    			startRecord: function(callBack){
    				textProcessor = callBack;
    				silenceDetection && startNewInputNode();
    				recording=true;
    				recorder && recorder.clear();
    				recorder && recorder.record();
    				silenceDetection && silenceDetection.postMessage({command: 'start'});
    			},
    			stopRecord: function(successCallBack,failureCallBack){//blobHandler){
    				recording=false;
    				recorder && recorder.stop();
    				recorder && recorder.exportWAV(function (blob) {
    					webSocket.send("clear");
    					webSocket.send("start "+inputId);
    					webSocket.send(blob);
    					webSocket.send("stop");
    					webSocket.send("analyze "+inputId++);
    					webSocket.send("clear");
//		    					blobHandler(blob);
    					if(successCallBack){
    						successCallBack( recordAsrResultCache.join('') );
    					}

    					//reset result-cache:
    					recordAsrResultCache = [];
    				});
    				silenceDetection && silenceDetection.postMessage({command: 'stop'});
    			},
    			recognize: function(successCallBack,failureCallBack){
    				textProcessor = successCallBack;
    				recorder && recorder.stop();
    				silenceDetection && silenceDetection.postMessage({command: 'stop'});
    				recorder && recorder.exportWAV(function(blob){		   					 
    					webSocket.send("clear");
    					webSocket.send("start "+ inputId);
    					webSocket.send(blob);
    					webSocket.send("stop");
    					webSocket.send("analyze "+ inputId++);
    					webSocket.send("clear");
    				});
    			}
    		};//END: return
		};//END: htmlAudioConstructor()
			
		// the code starts here, loads the necessary scripts and then calls htmlAudioConstructor
		mobileDS.CommonUtils.getInstance().loadScript(mobileDS.constants.getInstance().getWorkerPath()+'recorderWorker.js',function(){
			mobileDS.CommonUtils.getInstance().loadScript('mmirf/env/media/recorder.js', function(){
				callBack(htmlAudioConstructor());
			});
		});
	}//END: initialize()
		
};