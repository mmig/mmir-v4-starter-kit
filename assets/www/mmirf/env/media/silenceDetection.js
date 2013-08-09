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


var silenceCount = 0, //how many silent blobs have there been in a row now?
	speachCount = 0, //how many blobs have been loud in a row now?
	lastInput = 0, // how long has there been no good loud input?
	recording= false,
	noiseTreshold = 0.1, //the bigger, the more is counted as silent
	sampleRate = 0,
	pauseCount = 3,
	resetCount = 15;
  
self.onmessage = function(e){
  switch(e.data.command){
    case 'init':
      init(e.data.config);
      break;
    case 'start':
      start();
      break;
    case 'isSilent':
      isSilent(e.data.buffer);
      break;
    case 'stop':
      stop();
      break;
  }
};
/**
 * sets the config and echos back
 * @param config
 */
function init(config){
  if (config.sampleRate)sampleRate = config.sampleRate;
  if (config.noiseTreshold) noiseTreshold = config.noiseTreshold;
  if (config.pauseCount) pauseCount = config.pauseCount;
  if (config.resetCount) resetCount = config.restCount;
  self.postMessage('Silence Detection initialized');
}

/**
 * recieves an audioBlob and decides whether or not there has been a real input (min. 3 loud blobs in a row)
 * and a real pause (min. <pauseCount> silent blobs in a row) afterwards. In this case it dictates a pause. 
 * If some time has gone by without any real input, it sends a signal to clear the buffers.
 * @param inputBuffer
 */
function isSilent(inputBuffer){
	if (recording){
		var thisSilent = true;
		var bound = 0;
		for (var i = 0; i < inputBuffer.length; i++) {
			if (( inputBuffer[i]> noiseTreshold)||( inputBuffer[i]<0-noiseTreshold)){
				if (inputBuffer[i]>bound) bound= inputBuffer[i];
				thisSilent = false;
			}
		}
		if (thisSilent){
			if (silenceCount>=pauseCount){
				self.postMessage('Silence detected!');
				speachCount = 0;
				silenceCount = 0;
				lastInput = 0;
			}
			if (speachCount>=pauseCount){
				silenceCount++;
			} 
			else {
				speachCount = 0;
				lastInput++;
			}
		} 
		else {
			if (speachCount>=pauseCount){
				silenceCount=0;
			} 
			else {
				speachCount++;
				lastInput++;
			}
		}
		
		if (speachCount==0 && lastInput>resetCount){
			this.postMessage('clear');
			lastInput= 0;
		}
		
	}
}

/**
 * resets everything and switches the worker to recording mode.
 */
function start(){
	silenceCount=0;
	speachCount =0;
	lastInput = 0;
	recording = true;
	self.postMessage('Silence Detection started');
}
function stop(){
	recording = false;
	self.postMessage('Silence Detection stopped');
}


