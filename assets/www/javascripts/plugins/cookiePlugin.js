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


/**
 * Cordova plugin that exposes the WebKit's native cookie handling interface
 * (see android.webkit.CookieManager).
 */
var CookiePlugin = function(){
};

//synchronized boolean 	acceptCookie()
//	Gets whether the application's WebView instances send and accept cookies.
CookiePlugin.prototype.acceptCookie = function(successCallback, failureCallback){
	return cordova.exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "CookiePlugin", "acceptCookie", []);
};

//String 	getCookie(String url)
//	Gets the cookies for the given URL.
CookiePlugin.prototype.getCookie = function(url, successCallback, failureCallback){
	return cordova.exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "CookiePlugin", "getCookie", [url]);
};

//synchronized boolean 	hasCookies()
//	Gets whether there are stored cookies.
CookiePlugin.prototype.hasCookies = function(successCallback, failureCallback){
	return cordova.exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "CookiePlugin", "hasCookies", []);
};

//void 	removeAllCookie()
//	Removes all cookies.
CookiePlugin.prototype.removeAllCookie = function(successCallback, failureCallback){
	cordova.exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "CookiePlugin", "removeAllCookie", []);
};

//void 	removeExpiredCookie()
//	Removes all expired cookies.
CookiePlugin.prototype.removeExpiredCookie = function(successCallback, failureCallback){
	cordova.exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "CookiePlugin", "removeExpiredCookie", []);
};

//void 	removeSessionCookie()
// Removes all session cookies, which are cookies without an expiration date.
CookiePlugin.prototype.removeSessionCookie = function(successCallback, failureCallback){
	cordova.exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "CookiePlugin", "removeSessionCookie", []);
};

//synchronized void 	setAcceptCookie(boolean accept)
//	Sets whether the application's WebView instances should send and accept cookies.
CookiePlugin.prototype.setAcceptCookie = function(accept, successCallback, failureCallback){
	cordova.exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "CookiePlugin", "setAcceptCookie", [accept]);
};

//String 	setCookie(String url, String value)
//	Sets a cookie for the given URL. Returns (all) cookies that are set for url.
CookiePlugin.prototype.setCookie = function(url, value, successCallback, failureCallback){
	return cordova.exec(function(args){
		if (successCallback !== undefined) {
			successCallback(args);
		}
	}, function(args){
		if (failureCallback !== undefined) {
			failureCallback(args);
		}
	}, "CookiePlugin", "setCookie", [url, value]);
};


//Cordova 2.x plugin registration:
if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.cookiePlugin) {
    window.plugins.cookiePlugin = new CookiePlugin();
}

