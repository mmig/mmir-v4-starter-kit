﻿/*
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

/**
 * @class NotificationManager
 * 
 * @depends Dictionary
 * @depends mmir.MediaManager
 */

define(['module', 'constants', 'mediaManager', 'dictionary'], function(module, constants, mediaManager, Dictionary){
    //private members
	
	
	//TODO replace by "real" ENV mechanism ... instead of !forBrowser / ! constants.isBrowserEnv()
	var isCordovaEnv = ! constants.isBrowserEnv();
	
	/** @private */
    var instance = null;
    
    
    //private methods
    
    /**
	 * Constructor-Method of Class {@link mmir.NotificationManager}.<br> 
	 * 
	 * @constructor
	 * @augments mmir.NotificationManager
	 * @memberOf mmir.NotificationManager.prototype
	 */
    function constructor(){
    	
    	var INIT = 'init';
    	
    	//VIBRATE initialization:
    	var isHapticEnabled = true;

    	var doVibrate = null;
    	if(isCordovaEnv){
    		
    		if(navigator.notification && navigator.notification.vibrate){
//	    		console.debug('Vibrate: navigator.notification');
	    		doVibrate = function(n){ navigator.notification.vibrate(n); };
    		}
    		else {
    			console.warn('mmir.NotificationManager.INIT: could not detect navigator.notification.vibrate, using NOOP dummy instead.');
        		doVibrate = function(n){ console.debug('mmir.NotificationManager.vibrate('+n+') triggered (but no VIBRATE function available).'); };// DEBUG
    		}
    	}
    	else if (navigator.vibrate){
//    		console.debug('Vibrate API');
    		doVibrate = function(n){ navigator.vibrate(n); };
    	}
    	else if (navigator.webkitVibrate){
//    		console.debug('Vibrate: webkit');
    		doVibrate = function(n){ navigator.webkitVibrate(n); };
    	}
    	
    	
    	//SOUND / BEEP initialization:
    	
    	var beepVolume = 1.0;
    	var beepAudio = null;
    	
    	//TODO add option for limiting size of soundMap (-> e.g. how many resources are max. cached/occupied for Android) 
    	var soundMap = new Dictionary();
    	
    	var initNotificationSound = function(audioObj, name){
    		audioObj.name = name;
    		audioObj.setVolume(beepVolume);
			audioObj.isNotificationPlaying = false;
			audioObj.repeatNotification = 0;
			audioObj.playNotification = function(repeatNTimes){
				
//				console.debug('isPlaying: '+this.isNotificationPlaying+', repeat: '+this.repeatNotification+',  args: '+repeatNTimes+'');
				
				//"blocking mode": only re-start, if not already playing
				if(!this.isNotificationPlaying){
					this.repeatNotification = repeatNTimes ? repeatNTimes : 0;
				}
				
				if( this.repeatNotification < 1){
					//end recurusion
					this.isNotificationPlaying = false;
					this.repeatNotification = 0;
				}
				else {
					this.isNotificationPlaying = true;
					--this.repeatNotification;
//					this.stop();
					this.play();
				}
			};
			
			audioObj.setCallbacks = function(onFinished, onError){
				this.onFinishedListener = onFinished;
				this.onErrorListener = onError;
			};
			audioObj.clearCallbacks = function(){
				this.onFinishedListener = null;
				this.onErrorListener = null;
			};
			audioObj.fireFinished = function(){
				
				var tempOnFinishedListener = this.onFinishedListener;
				//clear callbacks
				// NOTE: do this before triggering callback, in case the callback re-plays the notification with new callbacks!
				//       (if we would clear callbacks after invocation, we would delete the new callbacks!)
				this.clearCallbacks();
				if(tempOnFinishedListener){
					tempOnFinishedListener();
				}
			};
			audioObj.fireError = function(error){
				
				var tempOnErrorListener = this.onErrorListener;
				//clear callbacks
				// NOTE: do this before triggering callback, in case the callback re-plays the notification with new callbacks!
				//       (if we would clear callbacks after invocation, we would delete the new callbacks!)
				this.clearCallbacks();
				
				//create error message with details
				var id;
				if(this.name){
					var entry = soundMap.get(this.name);
					id = '"' + this.name + '" -> ' + (entry? '"'+entry.url+'"' : 'UNDEF'); 
				}
				else {
					id = '"BEEP" -> "'+constants.getBeepUrl()+'"'; 
				}
				var msg = 'Notification: Error playing the sound for notification '+id;
				
				//create Error object if necessary
				if(!error){
					error = new Error(msg);
					msg = null;
				}
				
				
				if(tempOnErrorListener){
					tempOnErrorListener(error, msg);
				}
				else {
					//if no callback: print debug output in error stream:
					console.error( (msg? msg + ': ' : '') + error);
				}
			};
			
			return audioObj;
    	};
    	
    	function createAudio(url, success, fail, init){
    		return mediaManager.getURLAsAudio(url, success, fail, init);
    	}
    	
    	
    	function initAudioSoundEntry(name, theUrl, isKeepOnPause){
    		var config = {url: theUrl, audio: null};
    		if(isKeepOnPause){
    			config.isKeepOnPause = true;
    		}
    		soundMap.put(name, config);
    	}
    	
    	function doGetSoundFromMap(name, onErrorCallback){
    		var audioObj = null;
    		var audioUrl = null;
    		var keepOnPause = false;
    		
    		//if no name: use default beep
    		if(!name){
    			audioObj = beepAudio;
    			audioUrl = constants.getBeepUrl();
    		}
    		else {
    			//retrieve information for sound
    			var soundEntry = soundMap.get(name);
    			if(soundEntry === INIT){
    				//TODO set repeat-times?
    				
    				//sound is still initializing -> return
    				return null; ////////////////////// EARLY EXIT //////////////////////
    			}
    			
    			if(!soundEntry){
    				var errMsg = 'mmir.NotificationManager: no sound "'+name+'" initialized!';
    				if(onErrorCallback){
    					onErrorCallback(errMsg);
    				}
    				else {
    					console.error(errMsg);
    				}
//    				throw new Error(errMsg);
    				return null; ////////////////////// EARLY EXIT //////////////////////
    			}
    			
    			audioObj = soundEntry.audio;//<- may be null
    			audioUrl = soundEntry.url;//<- must NOT be null
    			keepOnPause = soundEntry.isKeepOnPause? true : false;
    		}
    		
    		return {
    			sound: audioObj,
    			url: audioUrl,
    			isKeepOnPause: keepOnPause
    		};
    	}
    	
    	function playAudioSound(name, times, onFinishedCallback, onErrorCallback){
    		
    		var soundEntry = doGetSoundFromMap(name, onErrorCallback);
    		
    		if(soundEntry === null){
    			//could not retrieve sound-object
    			// (error callback will already have been invoked, so just return)
    			return;/////////////////////// EARYL EXIT ///////////
    		}
    		
    		var audioObj = soundEntry.sound;
    		var audioUrl = soundEntry.url;
    		var isKeepOnPause = soundEntry.isKeepOnPause;

    		//create audio-object, if not existing yet
    		if(audioObj === null){
    			
    			if(name){
    				soundMap.put(name, INIT);
    			}

    			audioObj = createAudio(
    					audioUrl,
    					function onFinished(){ 
    						this.playNotification();

    						audioObj.fireFinished();
    					}, 
    					function onError(e){ 
    						if(name) {
    							soundMap.remove(name);
    						};
    						
    						if(audioObj){
    							audioObj.fireError(e);
    						}
    						else {
    							if(onErrorCallback){
    								onErrorCallback();
    							}
    							else {
    								console.error('Notification: Error playing the sound from "'+audioUrl+'": '+e);
    							}
    						}
    					},
    					function onInit(){ 
    						
    						//FIX for Android/Cordova: return-value of createAudio will not set audioObj "fast enough"
    						// 						   (i.e. may not use async-initialization, depending on where the audio-file is located)
    						//						   ... in order to be able to use keep variable audioObj useful -> do assignment now/here
    						audioObj = this;

    	    				initNotificationSound(audioObj, name);
    	    				audioObj.setCallbacks(onFinishedCallback, onErrorCallback);
    	    				
    	    	    		//if no name: assume default beep
    	    				if(!name){
    	    					beepAudio = audioObj;
    	    	    		}
    	    				else {
    	    					var theEntry = {url: audioUrl, audio: audioObj};
    	    					if(isKeepOnPause){
    	    						theEntry.isKeepOnPause = true;
    	    					}
    	    					soundMap.put(name, theEntry);
    	    				}
    	    				
    						audioObj.playNotification(times);
    	    				
    	    			}
    			);
    			
//    			//FIXME this is a QUICK-FIX:
//    			//		Android needs invocation of a media-method, before it triggers the on-init callback.
//    			//		We need to do this here, not within the
//    			if(isCordovaEnv){
//    				audioObj.init();
//    			}
    		}
    		else {
				audioObj.setCallbacks(onFinishedCallback, onErrorCallback);
    			audioObj.playNotification(times);
    		}
    		
    	}
    	
    	function stopAudioSound(name, onFinishedCallback, onErrorCallback){
    		
    		var soundEntry = doGetSoundFromMap(name, onErrorCallback);
    		

//			console.error('Notification: invoked stop on notification-sound '+name+' -> '+JSON.stringify(soundEntry));//FIXM debug
    		
    		if(soundEntry === null){
    			//could not retrieve sound-object
    			// (error callback will already have been invoked, so just return)
    			return;/////////////////////// EARYL EXIT ///////////
    		}
    		
    		var audioObj = soundEntry.sound;
    		//NOTE audioObj may be null, e.g. if sound is still initializing.
    		
    		if(audioObj != null){
    			if(audioObj.repeatNotification > 0)
    				audioObj.repeatNotification = 0;
    			if(audioObj.isNotificationPlaying === true)
    				audioObj.isNotificationPlaying = false;
    			if(audioObj.stop){
//  				console.error('Notification: stopping notification-sound -> '+name);//FIXM debug
    				audioObj.stop();
    			}
    		}
    		
    		if(onFinishedCallback){
    			onFinishedCallback.call(audioObj);
    		}
    		
    	};
    	
    	//on Android: release resources on pause/exit, since they are limited
    	if(isCordovaEnv){
    		
    		document.addEventListener("resume", function(event){
    			//initialize beep sound:
        		playAudioSound(null, 0);
    		});
    		
    		document.addEventListener(
    				"pause", 
    				function(event){
    					
    					//use temporal variable for minimizing concurrency problems
    					var temp;
    					
    					if(beepAudio !== null){
    						
    						temp = beepAudio;
    						beepAudio = null;
    						temp.release();
    						
    						console.info('Notification: released media resources for beep.');
    					}
    					
    					var keys = soundMap.getKeys();
    					for(var i = keys.length - 1; i >= 0; --i){
    						
    						var entry = soundMap.get(keys[i]);
	    					if(entry !== null && entry != INIT && ! entry.isKeepOnPause){
	    						
	    						temp = entry.audio;
	    						
	    						//audio may not be initialized yet:
	    						if(temp != null){
		    						entry.audio = null;
		    						temp.release();
	    						}
	    						
	    						console.info('Notification: released media resources for '+entry.url);
	    					}
    					}
    				},
    				false
    		);
    	}
    	
    	/** @lends mmir.NotificationManager.prototype */
        return { //public members and methods
            
        	/**
        	 * Trigger a haptic vibration feedback.
        	 * 
        	 * <p>Note: The device / execution environment may not support haptic vibration feedback 
        	 * 
        	 * @function vibrate
        	 * @param milliseconds {Number} duration for vibration in milliseconds
        	 * @public
        	 */
            vibrate: function(milliseconds){
            	if (isHapticEnabled && doVibrate){
            		doVibrate(milliseconds);
            	}
            },
            isVibrateEnabled: function(){
            	if (isHapticEnabled && doVibrate){
            		return true;
            	}
            	else {
            		return false;
            	}
            },
            isVibrateAvailable: function(){
            	if (doVibrate){
            		return true;
            	}
            	else {
            		return false;
            	}
            },
            setVibrateEnabled: function(enabled){
            	isHapticEnabled = enabled;
            },
            /**
             * Opens a (native) notification dialog.
             * 
             * @function alert
             * @public
             */
            alert: function(message, alertCallback, title, buttonName){
            	navigator.notification.alert(message, alertCallback, title, buttonName);
            },
            /**
             * Opens a (native) confirmation dialog.
             * 
             * @function confirm
             * @public
             */
            confirm: function(message, confirmCallback, title, buttonLabels){
            	navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
            },
            /**
             * Trigger a beep notification sound.
             * 
             * @function beep
             * @param times {Number} how many times should to beep repeated
             * @public
             */
            beep: function(times){
        		if (times>0){
        			playAudioSound(null, times);
        		}
            },
            
            getVolume: function(){
            	return beepVolume;
            },
            setVolume: function(vol){
            	if(typeof vol !== 'number'){
            		throw new TypeError('argument vol (value: '+vol+') must be a number, but is instead: '+(typeof vol));
            	}
            	
            	if(vol !== beepVolume){
            		
            		//set volume for beep notification
	            	beepVolume = vol;
	            	if(beepAudio){
	            		beepAudio.setVolume(beepVolume);
	            	}
	            	
	            	//set volume for notification sounds
	            	var keys = soundMap.getKeys();
	            	var entry = null;
	            	for(var i = 0, size = keys.length; i < size; ++i){
	            		entry = soundMap.get(keys[i]);
	            		if(entry.audio !== null){
	            			entry.audio.setVolume(vol);
	            		}
	            	}
	            	
            	}
            }
            
            /**
             * Trigger a sound notification by NAME (needs to be created first).
             * 
             * @function playSound
             * @param name {String} the name / identifier for the sound (if NULL, beep notification is used)
             * @param times {Number} how many times should to beep repeated
             * @public
             */
            ,playSound: function(name, times, onFinished, onError){
        		if (times>0){
        			playAudioSound(name, times, onFinished, onError);
        		}
            },
            createSound: function(name, url, isKeepOnPause){ // TODO add callbacks? this would make the impl. more complex ..., successCallback, errorCallback){
            	initAudioSoundEntry(name, url, isKeepOnPause);

            	//DISABLED this triggers an error if MediaManager / LanguageManager etc. are not initialized yet!
//            	console.error('created sound "'+name+'" for url "'+url+'", calling from: ' + new Error().stack);
//            	//immediately initialize the sound (but do not play it yet);
//            	playAudioSound(name, 0);
            }
            ,stopSound: function(name){
        		stopAudioSound(name);
            }
            
            , initBeep: function(){
            	//initialize beep sound:
        		playAudioSound(null, 0);
            }
            , initSound: function(name){
            	//initialize sound (identified by its name):
        		playAudioSound(name, 0);
            }
        };
    }
//    return {
//        /**
//         * Get the instance of the singleton {@link mmir.NotificationManager} 
//         * 
//         * @function getInstance
//         * @returns {Object} the instance for singleton {@link mmir.NotificationManager}
//         * @public
//         */
//        getInstance: function(){
//            if (instance === null) {
//                instance = constructor();
//            }
//            return instance;
//        }
//    };
    
    instance = new constructor();
    
    /**
	 * @deprecated instead: use mmir.NotificationManager directly
	 */
	instance.getInstance = function(){
		return instance;
	};
    
    return instance;
//})();
    
});//END: define(..., function(){...