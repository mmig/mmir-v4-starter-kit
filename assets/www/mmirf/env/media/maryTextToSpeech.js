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
			var onEndCallBack= null;
			var currentFailureCallBack = null;
			var isReady= true;
			var ttsMedia = null;
			var playIndex = 0;
			var firstSentence = true;
			var loadIndex = 0;
			var isLoading = false;
			var bufferSize = 3;
			var audioArray = [];
			var sentenceArray = [];
			var pauseDuration = 1000;
			var defaultSplitter = function(text){
				text = text.replace(/\.\s|\?\s|\!\s/g,"#");
				return text.split("#");
			}
			var generateTTSURL = function(text){
				text = text.replace(/\s/g, '%20');
				var speaker = window.mobileDS.LanguageManager.getInstance().getSpeaker();
				var lang = speaker["lang_simple"];
				var voice = speaker["speaker"];
				return window.mobileDS.ConfigurationManager.getInstance().get("HTML5OutputServerBasePath")+'process?INPUT_TYPE=TEXT&OUTPUT_TYPE=AUDIO&INPUT_TEXT=' + text + '&LOCALE='+lang+'&VOICE='+voice+'&AUDIO=WAVE_FILE';
			};
			
			var playNext = function playNext(){
				playIndex++;
				if (playIndex<(audioArray.length)){
					ttsMedia=audioArray[playIndex];
					console.log("LongTTS playing "+playIndex+ " "+sentenceArray[playIndex]);
					audioArray[playIndex].play();
					loadNext();
				}
				else {
					if (onEndCallBack){
						onEndCallBack();
					}
					isReady = true;
				}
			};
			var ttsSingleSentence = function(text, onEnd, failureCallBack, onLoad){
				{
					try {
						isReady = false;		   			
						ttsMedia = mobileDS.MediaManager.getInstance().getURLAsAudio(generateTTSURL(text), 
									function(){
										isReady = true;
										if(onEnd){
											onEnd();
										};
									},
									function(){
										isReady = true;
										if (failureCallBack){
											failureCallBack();
										};
									},
									function(){
										if(onLoad){
											onLoad();
										};
									});
						ttsMedia.play();
					} catch (e){
						isReady=true;
			    		console.log('error!'+e);
						if (failureCallBack){
							failureCallBack();
						}
					}
				}
			};
			var ttsSentenceArray = function(sentences, onEnd, failureCallBack){
				{
					try {
						firstSentence = true;
						
						//"clean up" texts in sentence array (ignore empty texts)
						var size = sentences.length;
						var theText = null;
						
						sentenceArray= [];
						for(var i=0; i < size; ++i){
							if(sentences[i] && sentences[i].length > 0){
								theText = sentences[i].trim();
								if(theText.length > 0){
									sentenceArray.push(theText);
								}
							}
						}
							
						onEndCallBack = onEnd;
						currentFailureCallBack = failureCallBack;
						playIndex = -1;
						loadIndex = -1;
						audioArray = new Array(sentences.length);
						isLoading = false;
						loadNext();
					} catch (e){
						isReady=true;
			    		console.log('error! '+e);
						if (failureCallBack){
							failureCallBack();
						}
					}
				}
			};
			var loadNext = function loadNext(){
				if (isLoading) return null;
				isLoading = true;
				if (((loadIndex-playIndex)<= bufferSize) && (loadIndex<(audioArray.length-1))){
					var currIndex = ++loadIndex;
					console.log("LongTTS loading "+currIndex+ " "+sentenceArray[currIndex]);
					audioArray[currIndex] = mobileDS.MediaManager.getInstance().getURLAsAudio(generateTTSURL(sentenceArray[currIndex]), 
							function(){
								console.log("LongTTS done playing "+currIndex+ " "+sentenceArray[currIndex]);
								audioArray[currIndex].release();
								setTimeout(playNext, pauseDuration);
							},

							function(){
								isReady = true;
								if (currentFailureCallBack){
									currentFailureCallBack();
								};
							},
							function(){
								console.log("LongTTS done loading "+currIndex+ " "+sentenceArray[currIndex]);
								isLoading = false;
								loadNext();
								
							});
					if (currIndex==0){
						playNext();
					}
					loadNext();
				}
			};
			
			callBack({
				textToSpeech: function(parameter, successCallback, failureCallback){
					if (!isReady) {
						if(failureCallback){
							failureCallback("TTS is already used at the moment.");
						}
						return;
					}
					isReady = false;
					if ((typeof parameter) == 'string'){
						if(parameter.length === 0){
							isReady = true;
							if(failureCallback){
								failureCallback("Aborted TTS: no text supplied (string has length 0)");
							}
							return;/////////////////////////////////// EARLY EXIT /////////////////////////////
						}
						ttsSingleSentence(parameter, successCallback, failureCallback);
					} else if((typeof parameter !== 'undefined')&& mobileDS.CommonUtils.getInstance().isArray(parameter) ){
						ttsSentenceArray(parameter, successCallback, failureCallback);
					} else if ((typeof parameter == 'object')){
						if (parameter.pauseDuration!== null && parameter.pauseDuration>=0){
							pauseDuration = parameter.pauseDuration;
							console.log("PauseDuration: "+pauseDuration);
						} else {
							var configPause = mobileDS.ConfigurationManager.getInstance().get('pauseDurationBetweenSentences');
							if (configPause) {
								pauseDuration = configPause;
							}
							else pauseDuration = 1000;
						}
						if ((typeof parameter.text !== 'undefined')&& mobileDS.CommonUtils.getInstance().isArray(parameter.text) ){
							if (parameter.forceSingleSentence){
								ttsSingleSentence(mobileDS.CommonUtils.getInstance().concatArray(parameter.text),successCallback, failureCallback);
							} else {
								ttsSentenceArray(parameter.text, successCallback, failureCallback);
							}
						}
						if ((typeof parameter.text)== 'string'){
							if (parameter.split || parameter.splitter){
								var splitter = parameter.splitter || defaultSplitter;
								ttsSentenceArray(splitter(parameter.text), successCallback, failureCallback);
							} else {
								ttsSingleSentence(parameter.text, successCallback, failureCallback);
							}
						}
					}
				},
				cancelSpeech: function(successCallBack, failureCallBack){
					try {
						if (!isReady){
						ttsMedia.disable();
						}
						audioArray.forEach(function (audio){
							if (audio) {
								audio.stop();								
								audio.release;
							}
						});
						isReady = true;
						successCallBack();
					}catch (e){
						isReady = true;
						if (failureCallBack)
							failureCallBack();
					}
				}
				});	
		}
};