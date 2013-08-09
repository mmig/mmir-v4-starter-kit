/*
 * Taken from 
 * https://github.com/phonegap/phonegap-plugins/tree/master/Android/SoftKeyboard
 * and 
 * http://ambrusmartin.wordpress.com/2012/08/30/soft-keyboards-in-android-iphone-phonegap-applications-when-we-call-focus/
 * 
 * The MIT License
 * 
 * Copyright (c) 2009-2012 Paul Panserrieu, Naokazu Terada, (zathrus) smejko
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or 
 * substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *  
 */

var SoftKeyBoardPlugin = function(){
};

SoftKeyBoardPlugin.prototype.show = function(win, fail){
	return cordova.exec(function(args){
		if (win !== undefined) {
			win(args);
		}
	}, function(args){
		if (fail !== undefined) {
			fail(args);
		}
	}, "SoftKeyBoard", "show", []);
};
	
SoftKeyBoardPlugin.prototype.hide= function(win, fail){
	return cordova.exec(function(args){
		if (win !== undefined) {
			win(args);
		}
	}, function(args){
		if (fail !== undefined) {
			fail(args);
		}
	}, "SoftKeyBoard", "hide", []);
};
	
SoftKeyBoardPlugin.prototype.isShowing = function(win, fail){
	return cordova.exec(function(args){
		if (win !== undefined) {
			win(args);
		}
	}, function(args){
		if (fail !== undefined) {
			fail(args);
		}
	}, "SoftKeyBoard", "isShowing", []);
};

//Cordova 2.x plugin registration:
if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.softKeyBoardPlugin) {
    window.plugins.softKeyBoardPlugin = new SoftKeyBoardPlugin();
}

// usage:
// SoftKeyBoard.show(function () {
//     success
//},function () {
//    fail
//   console.log('keyboard show error');
//});
