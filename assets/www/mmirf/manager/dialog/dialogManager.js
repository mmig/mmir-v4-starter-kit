define([ 
          'commonUtils', 'module', 'engineConfig', 'controllerManager', 'presentationManager'
        , 'modelManager' 
	], function(commonUtils, module, engineConfig, controllerManager, presentationManager
) {

	var _instance = {

		getInstance : function() {
			return this;
		},

		/**
		 * This function performs an action of a controller by calling
		 * the method {@link mmir.ControllerManager#perform} of the
		 * {@link mmir.ControllerManager}
		 * 
		 * @function perform
		 * @param {String}
		 *            ctrlName Name of the controller to which the
		 *            action belongs
		 * @param {String}
		 *            actionName Name of the action that should be
		 *            performed
		 * @param {Object}
		 *            data optional data that can be submitted to the
		 *            action
		 * @returns {Object} the return object of the performed action
		 * @public
		 */
		perform : function(ctrlName, actionName, data) {
			
			//@russa what is this for?
//			var _data = {};
//			_data.timestamp = new Date().getTime();
//			_data.ctrl = ctrlName;
//			_data.name = actionName;
//			_data.args = data;
			
			// if(IS_DEBUG_ENABLED) console.debug("going to perform ('" + ctrlName + "','" + actionName + "')");//debug

			return controllerManager.perform(ctrlName, actionName, data);
		},

		/**
		 * This function performs an action of a helper-class for a
		 * controller by calling the method
		 * {@link mmir.ControllerManager#performHelper} of the
		 * {@link mmir.ControllerManager}
		 * 
		 * @function performHelper
		 * @param {String}
		 *            ctrlName Name of the controller to which the
		 *            helper action belongs
		 * @param {String}
		 *            helper_method_name Name of the action that should
		 *            be performed by the helper
		 * @param {Object}
		 *            data optional data that can be submitted to the
		 *            action
		 * @returns {Object} the return object of the performed action
		 * @public
		 */
		performHelper : function(ctrlName, helper_method_name, data) {
			
			if (arguments.length > 3) {
				
				return controllerManager.performHelper(
						ctrlName, helper_method_name, data, arguments[3]
				);
			}
			else {
				
				return controllerManager.performHelper(
						ctrlName, helper_method_name, data
				);
			}
		},

		/**
		 * This function displays a dialog of a controller by calling
		 * the method {@link mmir.PresentationManager#showDialog} of the
		 * {@link mmir.PresentationManager}
		 * 
		 * @function showDialog
		 * @param {String}
		 *            ctrlName Name of the controller to which the
		 *            dialog belongs
		 * @param {String}
		 *            dialogId Id of the dialog that should be displayed
		 * @param {Object}
		 *            data Optional data that can be submitted to the
		 *            dialog
		 * @public
		 */
		showDialog : function(ctrlName, dialogId, data) {

			var eventData;
			if (data) {
				
				if (!data.Data) {
					
					eventData = {
							Data: data
					};
				}
				else {
					eventData = data;
				}
			}
//			writeLogEntry('showDialog_'+ctrlName+'_'+dialogId, eventData); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)

			presentationManager.showDialog(ctrlName, dialogId, data);
		},

		/**
		 * This function closes a dialog of a controller by calling the
		 * method {@link mmir.PresentationManager#hideCurrentDialog} of
		 * the {@link mmir.PresentationManager}
		 * 
		 * @function hideCurrentDialog
		 * @public
		 */
		hideCurrentDialog : function() {

//			writeLogEntry('hideCurrentDialog'); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)

			presentationManager.hideCurrentDialog();
		},
		/**
		 * Show a "wait" dialog, indicating work-in-progress.
		 * 
		 * @function showWaitDialog
		 * @public
		 * @requires jQuery Mobile
		 * 
		 * @see mmir.EngineConfig#hideWaitDialog
		 */
		showWaitDialog : function() {

			if ($('.ui-loading').length == 0) {
				//only write log-entry, if waiting-dialog is newly opened with this call
//				console.debug('[DEBUG] show loading');//FIXM debug
//				writeLogEntry('showWaitingDialog'); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)
			}

			var loadingText = mmir.LanguageManager.getText('loadingText');
			if (loadingText !== null && loadingText.length > 0) {
//				console.log('[DEBUG] setting loading text to: "'+loadingText+'"');
				$.mobile.loading('show', {
					text : loadingText,
					textVisible : true
				});
			}
			else {
				$.mobile.loading('show');
			}

			// layout-fix: the icon is not animated on itself (PNG) -> add
			// CSS spin-animator class
			$('.ui-loader .ui-icon-loading').addClass('spin');
		},

		/**
		 * Hides / closes the "wait" dialog.
		 * 
		 * @function hideWaitDialog
		 * @public
		 * @requires jQuery Mobile
		 * 
		 * @see mmir.EngineConfig#showWaitDialog
		 */
		hideWaitDialog : function() {

			if ($('.ui-loading').length > 0) {
				//only write log-entry, if waiting-dialog is currently open
//				writeLogEntry('closeWaitingDialog'); FIXME disabled logging for BROWSER (how could this be accomplished in Browser?)
			}

			$.mobile.loading('hide');

		},

		/**
		 * This function displays a view of a controller by calling the
		 * method {@link mmir.PresentationManager#renderView} of the
		 * {@link mmir.PresentationManager}.<br>
		 * And after rendering binds event listeners to all buttons of
		 * the view.
		 * 
		 * @function render
		 * @param {String}
		 *            ctrlName Name of the controller to which the view
		 *            belongs
		 * @param {String}
		 *            viewName Name of the view that should be rendered
		 * @param {Object}
		 *            data Optional data that can be submitted to the
		 *            generation of the view
		 * @public
		 */
		render : function(ctrlName, viewName, data) {
			
			//@russa: what is this for
//			var _data = {};
//			_data.timestamp = new Date().getTime();
//			_data.ctrl = ctrlName;
//			_data.name = viewName;
//			_data.args = data;
			
			presentationManager.renderView(ctrlName, viewName, data);

			if (typeof onPageRenderedFunc === 'function') {
				
				onPageRenderedFunc(ctrlName, viewName, data);
			}
		},
		/**
		 * Get the current on-page-rendered hook function (if it was
		 * set).
		 * 
		 * @function getOnPageRenderedHandler
		 * @param {Function}
		 *            the onPageRendered handler (NOTE: this may not be
		 *            set, i.e. <tt>undefined</tt>)
		 */
		getOnPageRenderedHandler : function() {
			return onPageRenderedFunc;
		},
		/**
		 * Set the on_page_loaded callback function.
		 * 
		 * If <code>onPageRenderedHook</code> is a function object, it
		 * will be executed after a view is rendered and after the
		 * view's controller on_page_load function(s) has/have been
		 * executed.
		 * 
		 * <p>
		 * This function will be executed after the view's
		 * on_page_load()-function.<br>
		 * The <code>onPageRenderedHook</code> function takes 3
		 * arguments that refer to the parameters with which the
		 * render-function was invoked: <br>
		 * <code>{String} ctrlName </code> Name of the controller to
		 * which the view belongs <br>
		 * <code>{String} viewName</code> Name of the view that should
		 * be rendered <br>
		 * <code>{Object} [data]</code> <em>Optional</em> data that
		 * can be submitted to the generation of the view
		 * 
		 * @function setOnPageRenderedHandler
		 * @param {Function}
		 *            onPageRenderedHook a callback function that will
		 *            be executed after a view was rendered i.e. after a
		 *            page was loaded.
		 */
		setOnPageRenderedHandler : function(onPageRenderedHook) {
			onPageRenderedFunc = onPageRenderedHook;
		}
		
	};//END: _instance = {...

	return $.extend(true, _instance, {

		init : function() {
			
			delete this.init;
			var url = module.config().scxmlDoc;
			var mode = module.config().mode;
			var engine = engineConfig(url, mode);

			var _self = this;

			return $.Deferred(function(dfd) {
				
				engine.load().done(function(_engine) {
					
					//DEPRECATED loadAddons!
//					if (module.config().addons) {
//						commonUtils.loadAddons(
//							module.config().addons,
//							function() {
//								mmir.DialogEngine = _engine;
////								mmir.DialogEngine.gen('init', _self);
//								delete _engine.gen;
//								dfd.resolve(_engine);
//							}
//						);
//					}
//					else {
						mmir.DialogEngine = _engine;
//						mmir.DialogEngine.gen('init', _self);
						delete _engine.gen;
						dfd.resolve(_engine);
//					}
					
				});
				
			}).promise();
			
		}//END: init()

	});//END $.extend(...

});//END: define(...
