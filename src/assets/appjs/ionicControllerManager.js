
define(['mmirf/dictionary', 'mmirf/controller'],

	/**
	 * A class for managing the controllers of the application. <br>
	 * It's purpose is to load the controllers and their views / partials and provide functions to find controllers or
	 * perform actions or helper-actions.
	 *
	 * This "class" is structured as a singleton - so that only one instance is in use.<br>
	 *
	 *
	 * @class
	 * @name mmir.ControllerManager
	 * @static
	 *
	 * @requires jQuery.Deferred
	 */
	function(
		Dictionary, Controller
){
	//the next comment enables JSDoc2 to map all functions etc. to the correct class description
	/** @scope mmir.ControllerManager.prototype */

	// private members
	/**
	 * Array of controller-instances
	 *
	 * @type Dictionary
	 * @private
	 *
	 * @memberOf mmir.ControllerManager#
	 */
	var controllers = new Dictionary();

  //MODIFICATION Ionic: method for adding ionic-ViewControllers
  if(!Controller.prototype.addView){
    Controller.prototype.addView = function(viewName, viewCtrlConstructor){
      if(this.views.indexOf(viewName) !== -1){
        return;
      }
      this._ionicViews[viewName] = viewCtrlConstructor;
      this.views.push(viewName);
    }
  }

	/**
	 * Initialize ControllerManager:
	 *
	 * Load all Controllers from /controller
	 * that are specified in /config/directories.json
	 *
	 * @function
	 * @param {Function} [callback] OPTIONAL
	 * 				an optional callback that will be triggered after the controllers where loaded
	 * @param {Object} [ctx] OPTIONAL
	 * 				the context for the controller & helper implementations (DEFAULT: the global context, i.e. window)
	 * @returns {Promise}
	 * 				a Deferred.promise that will get fulfilled when controllers are loaded
	 * @private
	 *
	 * @memberOf mmir.ControllerManager#
	 */
	function _init(callback, ctx) {

		//replace init-method with instance-getter:
		_instance.init = _instance.getInstance;

		//shift arguments if necessary:
		if(!ctx && typeof callback !== 'function'){
			ctx = callback;
			callback = void(0);
		}

		//set ctx to global/window, if not already set:
		ctx = ctx || window;


	    	// var ctrlInfo = {
	    	// 	fileName: rawControllerName,
	    	// 	name:     controllerName,
	    	// 	path:     controllerFilePath,
	    	//
	    	// 	views:    viewsList,
	    	// 	partials: partialsInfoList,
	    	// 	helper:   helperInfo,
	    	// 	layout:   layoutInfo
	    	// };

    callback && callback(_instance);
		return Promise.resolve(_instance);
	};

	/**
     * Object containing the instance of the class {@link mmir.ControllerManager}
     *
     * @type Object
     * @private
	 * @augments mmir.ControllerManager
	 * @ignore
     */
	var _instance = {
			/** @scope mmir.ControllerManager.prototype *///for jsdoc2

			// public members

			/**
			 * This function gets the controller by name.
			 *
			 * @function
			 * @param {String} ctrlName Name of the controller which should be returned
			 * @returns {Object} controller if found, null else
			 * @public
			 */
			get: function(ctrlName){
				var ctrl = controllers.get(ctrlName);
				if(!ctrl){
					return null;
				}
				return ctrl;
			},


			/**
			 * This function returns names of all loaded controllers.
			 *
			 * @function
			 * @returns {Array<String>} Names of all loaded controllers
			 * @public
			 */
			getNames: function(){

				return controllers.getKeys();
			},


			/**
			 * This function performs an action of a controller.
			 *
			 * @function
			 * @param {String} ctrlName Name of the controller to which the action belongs
			 * @param {String} actionName Name of the action that should be performed
			 * @param {Object} data optional data that can be submitted to the action
			 * @returns {Object} the return object of the performed action
			 * @public
			 */
			perform: function(ctrlName, actionName, data){
				var ctrl = this.get(ctrlName);
				if (ctrl != null) {
					return ctrl.perform(actionName, data);
				}
				else {
					console.error('ControllerManager.perform: the controller could not be found "'+ctrlName+'"');
				}
			},


			/**
			 * This function performs an action of a helper-class for a controller.
			 *
			 * @function
			 * @param {String} ctrlName Name of the controller to which the helper action belongs
			 * @param {String} actionName Name of the action that should be performed by the helper
			 * @param {Object} data optional data that can be submitted to the action
			 * @returns {Object} the return object of the performed action
			 * @public
			 */
			performHelper: function(ctrlName, actionName, data) {

				var ctrl = this.get(ctrlName);
				if (ctrl != null) {
					if(arguments.length > 3){
						return ctrl.performHelper(actionName, data, arguments[3]);
					}
					else {
						return ctrl.performHelper(actionName, data);
					}
				}
				else {
					console.error('ControllerManager.performHelper: the controller could not be found "'+ctrlName+'"');
				}
			},
			/**
			 * This function must be called before using the {@link mmir.ControllerManager}. The Initialization process is asynchronous,
			 * because javascript-files must be loaded (the controllers).
			 * To ensure that the ControllerManager is initialized, a callback can be used, or the returned
			 * <em>Promise</em> (e.g. see documentation of jQuery.Deferred) for code, that relies
			 * on the presence of the loaded controllers.<br>
			 *
			 *
			 * <div class="box important">
			 * <b>Note:</b>
			 * The callback function should be used for code, that requires the prior loading of the controllers.<br>
			 * The callback mechanism is necessary, because loading the controllers is asynchronous.<br><br>
			 * If provided, the callback function is invoked with 1 argument, the ControllerManager instance:<br>
			 * <code> callbackFunction(controllerManagerInstance) </code>
			 * </div>
			 *
			 * @function
			 *
			 * @param {Function} [callback] OPTIONAL
			 * 				an optional callback that will be triggered after the controllers where loaded
			 * @param {Object} [ctx] OPTIONAL
			 * 				the context for the controller & helper implementations (DEFAULT: the global context, i.e. window)
			 * @returns {Promise}
			 * 				a Deferred.promise that will get fulfilled when controllers are loaded
			 * @example
			 *  //recommended style:
			 *  require(['mmirf/controllerManager', ...], function(controllerManager, ...) {
			 *  	controllerManager.init().then(function(theInitializedControllerInstance){
			 *  		...
			 *  	});
			 *  })
			 *
			 *  //old style:
			 * 	function afterLoadingControllers(controllerManagerInstance){
			 * 		var appCtrl = controllerManagerInstance.get('Application');
			 * 		//do something...
			 * 	}
			 * 	mmir.ctrl.init(afterLoadingControllers);
			 * @public
			 */
			init: _init

      , _createIonicController: function(ctrlName, viewName, ionicViewController){

        var dummyCtrl = {};
        dummyCtrl[ctrlName] = function(){};

        ctrl = new Controller(ctrlName, {views:[], partials: []}, dummyCtrl);
        ctrl._ionicViews = {};
        ctrl.addView(viewName, ionicViewController);

        controllers.put(ctrlName, ctrl);
        return ctrl;
      }

	};
	/**@ignore*/
	return _instance;

});
