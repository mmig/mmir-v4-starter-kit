
 /*
 * cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 * 
 * Copyright (c) 2011, IBM Corporation
 */

/**
 * Constructor
 */
function TTS() {
}

TTS.STOPPED = 0;
TTS.INITIALIZING = 1;
TTS.STARTED = 2;

/**
 * Play the passed in text as synthasized speech
 * @function speak 
 * @param {DOMString} text
 * @param {Object} successCallback
 * @param {Object} errorCallback
 */
TTS.prototype.speak = function(text, successCallback, errorCallback) {
	
     return cordova.exec(successCallback, errorCallback, "NativeTTS", "speak", [text]);
};

/** 
 * Play silence for the number of ms passed in as duration
 * 
 * @function silence 
 * @param {long} duration
 * @param {Object} successCallback
 * @param {Object} errorCallback
 */
TTS.prototype.silence = function(duration, successCallback, errorCallback) {
     return cordova.exec(successCallback, errorCallback, "NativeTTS", "silence", [duration]);
};

/**
 * Starts up the TTS Service
 * 
 * @function startup 
 * @param {Object} successCallback
 * @param {Object} errorCallback
 */
TTS.prototype.startup = function(successCallback, errorCallback) {
	
     return cordova.exec(successCallback, errorCallback, "NativeTTS", "startup", []);
};

/**
 * Shuts down the TTS Service if you no longer need it.
 * 
 * @function shutdown 
 * @param {Object} successCallback
 * @param {Object} errorCallback
 */
TTS.prototype.shutdown = function(successCallback, errorCallback) {
     return cordova.exec(successCallback, errorCallback, "NativeTTS", "shutdown", []);
};

/**
 * Finds out if the language is currently supported by the TTS service.
 * 
 * @function isLanguageAvailable 
 * @param {DOMSting} lang
 * @param {Object} successCallback
 * @param {Object} errorCallback
 */
TTS.prototype.isLanguageAvailable = function(lang, successCallback, errorCallback) {
     return cordova.exec(successCallback, errorCallback, "NativeTTS", "isLanguageAvailable", [lang]);
};

/**
 * Finds out the current language of the TTS service.
 * 
 * @function successCallback 
 * @param {Object} successCallback
 * @param {Object} errorCallback
 */
TTS.prototype.getLanguage = function(successCallback, errorCallback) {
     return cordova.exec(successCallback, errorCallback, "NativeTTS", "getLanguage", []);
};

/**
 * Sets the language of the TTS service.
 * 
 * @function setLanguage 
 * @param {DOMString} lang
 * @param {Object} successCallback
 * @param {Object} errorCallback
 */
TTS.prototype.setLanguage = function(lang, successCallback, errorCallback) {
     return cordova.exec(successCallback, errorCallback, "NativeTTS", "setLanguage", [lang]);
};

/**
 * Cancel TTS speak (if active; do nothing if not active).
 * 
 * @function cancel
 * @param {Object} successCallback
 * @param {Object} errorCallback
 */
TTS.prototype.cancel = function(successCallback, errorCallback) {
     return cordova.exec(successCallback, errorCallback, "NativeTTS", "cancel", []);
};

/**
 * Load TTS
 */
//cordova.addConstructor(function() {
//	cordova.addPlugin('nativeTTS', new  TTS());
//    });

//Cordova 2.x plugin registration:
if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.nativeTTS) {
    window.plugins.nativeTTS = new TTS();
}
