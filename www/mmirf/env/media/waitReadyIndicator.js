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
		/**  @memberOf WaitReadyIndicatorImpl# */
		initialize: function(callBack){//, mediaManager, ctxId, moduleConfig){//DISABLED this argument is currently un-used -> disabled
			
			
			require(['waitDialog'], function(dlg){

				/**  @memberOf WaitReadyIndicatorImpl# */
				var _pluginName = 'waitReadyIndicator';
				
				/** 
				 * @type mmir.LanguageManager
				 * @memberOf WaitReadyIndicatorImpl#
				 */
				var languageManager = require('languageManager');
				
				/**  @memberOf WaitReadyIndicatorImpl# */
				var _id = 'media-plugin-wait';
				
				/**  @memberOf WaitReadyIndicatorImpl# */
				var caption;
				
				/**  @memberOf WaitReadyIndicatorImpl# */
				var cssUrl = 'mmirf/vendor/styles/' + dlg.styleUrl;//TODO make this configurable / retrieve this setting from somewhere
				
				//load the stylesheet file for the wait-dialog
				// (does nothing, if this load-function was already called before)
				dlg._loadStyle(cssUrl);
				
				//create the DOM elements for the wait dialog (hidden)
				dlg.create(_id);//, {type: 'verbose', theme: 'a'});//DISABLED: these are the default options
				
				//invoke the passed-in initializer-callback and export the public functions:
				callBack({waitReadyImpl: {
						/**
						 * Shows wait dialog.
						 * 
						 * @public
						 * @memberOf WaitReadyIndicatorImpl.prototype
						 * @see mmir.MediaManager#_preparing
						 */
					    preparing: function (){
					    	var text = typeof caption !== 'undefined'? caption : languageManager.getText('loadingText');
					    	dlg.show(text, _id);
					    },
					    /**
					     * Hides wait dialog.
					     * 
						 * @public
						 * @memberOf WaitReadyIndicatorImpl.prototype
						 * @see mmir.MediaManager#_ready
						 */
		    			ready: function(){
		    				dlg.hide(_id);
		    			},
		    			/**
		    			 * Set caption for wait dialog.
		    			 * 
		    			 * <p>
		    			 * By default (i.e. not set), the dictionary entry for
		    			 * "loadingText" is used as caption / label.
		    			 * 
		    			 * @param {String} text
		    			 * 		set the caption / label for the wait-dialog.<br>
		    			 * 		If <code>undefined</code>, the default caption will be used.
		    			 * 
						 * @public
						 * @memberOf WaitReadyIndicatorImpl.prototype
						 * @see mmir.MediaManager#ready
						 * @see mmir.LanguageManager#getText
						 */
					    setWaitCaption: function(text){
		    				caption = text;
		    			},
		    			/**
		    			 * Get current caption for wait dialog.
		    			 * 
		    			 * NOTE if none is set, then internally the value of "loadingText"
		    			 * property of the current language dictionary will be used.
		    			 * 
						 * @public
						 * @memberOf WaitReadyIndicatorImpl.prototype
						 * @see mmir.MediaManager#_ready
						 * @see #setWaitCaption
						 */
					    getWaitCaption: function(){
		    				return caption;
		    			}
				}});
				
			});
			
		}
};