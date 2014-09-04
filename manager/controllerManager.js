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





define(['dictionary', 'controller', 'constants', 'commonUtils', 'jquery' ],

	/**
	 * A class for managing the controllers of the application. <br>
	 * It's purpose is to load the controllers and their views / partials and provide functions to find controllers or
	 * perform actions or helper-actions.
	 * 
	 * This "class" is structured as a singleton - so that only one instance is in use.<br>
	 * 
	 * @category core
	 * 
	 * @class
	 * @name mmir.ControllerManager
	 * @static
	 * 
	 * @depends jQuery.Deferred
	 */
	function( 
		Dictionary, Controller, constants, commonUtils, $
){
	//next 2 comments are needed by JSDoc so that all functions etc. can
	// be mapped to the correct class description
	/** @scope mmir.ControllerManager.prototype */
	/**
	 * #@+
	 * @memberOf mmir.ControllerManager.prototype 
	 */
	
	// private members
	/**
	 * Array of controller-instances
	 * 
	 * @property controllers
	 * @type Dictionary
	 * @private
	 */
	var controllers = new Dictionary();
	
	/**
	 * Initialize ControllerManager:
	 * 
	 * Load all Controllers from /controller
	 * that are specified in /config/directories.json
	 * 
	 * @function _init
	 * @param {Function} [callback] OPTIONAL
	 * 				an optional callback that will be triggered after the controllers where loaded
	 * @returns {Promise}
	 * 				a Deferred.promise that will get fulfilled when controllers are loaded
	 * @private
	 */
	function _init(callback) {

//		delete _instance.create;
		//replace create-method with instance-getter:
		_instance.create = _instance.getInstance;
		
		//create return value
		var deferred = $.Deferred();
		if(callback){
			deferred.always(callback);
		}
		
		
		/**
		 * HELPER FUNC: remove file extension from file-name
		 * @private
		 */
		function removeFileExt(fileName){
	    	return fileName.replace(/\.[^.]+$/g,'');
	    }
		/**
		 * HELPER FUNC: convert first letter to upper case
		 * @private
		 */
	    function firstToUpperCase(name){
	    	return name[0].toUpperCase()+name.substr(1);
	    }
	    
	    /**
		 * HELPER FUNC: add file path for generated / compiled view-element
		 *              if it exists.
		 * 
		 * @param {String} genDirPath
		 * 				path the the directory, where the file for the generated view-element
		 * 				is potentially located (generated file may not exists)
		 * 
		 * @param {PlainObject} infoObj
		 * 				the info-object for the view-element. MUST HAVE property <code>name</code>!
		 * 
		 * @param {String} [fileNamePrefix] OPTIONAL
		 * 				prefix for the file-name, e.g. in case of Partials, the file-name would be:
		 * 				<code>fileNamePrefix + infoObj.name</code> (+ file-extension)
		 * 
		 * @returns {PlainObject}
		 * 				the info-object: if a path for the generated file exists,
		 * 				a property <code>genPath</code> (String) with the path as value is added.
		 * @private
		 */
	    function addGenPath(genDirPath, infoObj, fileNamePrefix){
	    	
	    	var prefix = fileNamePrefix? fileNamePrefix : '';
	    	var genPath = commonUtils.getDirectoryContentsWithFilter(genDirPath, prefix + infoObj.name+".js");
    		if(genPath && genPath.length > 0){
    			infoObj.genPath = genDirPath + '/' + genPath[0];
    		}
    		
    		return infoObj;
	    }
		
		/**
		 * This function gets the controller file names and builds a JSON object containing information about
		 * the location, file name etc. for the controller itself, its views, partials, layout, and helper.
		 * 
		 * @function getControllerResources
		 * @param {String} controllerName
		 * 					the name of the Controller (must start with an upper case letter).
		 * @param {String} controllerPath
		 * 					the path (URL) where the file with the Controller's implementation
		 * 					is located (according to information in file <code>/config/directories.json</code>,
		 * 					i.e. {@link mmir.CommonUtils#getDirectoryStructure})
		 * @returns {JSON} JSON-Object containing information about the controller,
		 * 				its views, partials, and paths etc. 
		 * @private
		 * 
		 * @example
		 * //EXAMPLE for returned object:
		 * {
		 *   "fileName": "application",
		 *   "name": "Application",
		 *   "path": "controllers/application.js",
		 *   "views": [
		 *     {
		 *       "name": "login",
		 *       "path": "views/application/login.ehtml",
		 *       "genPath": "gen/views/application/login.js"
		 *     },
		 *     {
		 *       "name": "registration",
		 *       "path": "views/application/registration.ehtml",
		 *       "genPath": "gen/views/application/registration.js"
		 *     },
		 *     {
		 *       "name": "welcome",
		 *       "path": "views/application/welcome.ehtml",
		 *       "genPath": "gen/views/application/welcome.js"
		 *     }
		 *   ],
		 *   "partials": [
		 *     {
		 *       "name": "languageMenu",
		 *       "path": "views/application/~languageMenu.ehtml",
		 *       "genPath": "gen/views/application/~languageMenu.js"
		 *     }
		 *   ],
		 *   "helper": {
		 *     "fileName": "applicationHelper",
		 *     "name": "ApplicationHelper",
		 *     "path": "helpers/applicationHelper.js"
		 *   },
		 *   "layout": {
		 *     "fileName": "application",
		 *     "name": "application",
		 *     "path": "views/layouts/application.ehtml",
		 *     "genPath": "gen/views/layouts/application.js"
		 *   }
		 * }
		 * //NOTE 1: genPath is an optional field, i.e. it will only be added
		 *           if the corresponding file exists
		 * //NOTE 2: layout may be NULL
		 * 
		 * @depends mmir.CommonUtils
		 * @depends mmir.Constants
		 */
	    function getControllerResources(controllerName, controllerPath){
	    	
	    	var partialsPrefix = commonUtils.getPartialsPrefix();
	    	var controllerFilePath = controllerPath + controllerName;
	    	
	    	var rawControllerName= removeFileExt(controllerName);
	    	controllerName = rawControllerName;
	    	
	    	
	    	var viewsPath = constants.getViewPath() + controllerName;
	    	var genViewsPath = constants.getCompiledViewPath() + controllerName;
	    	
	    	controllerName = firstToUpperCase(controllerName);
	    	
	    	var viewsFileList = commonUtils.getDirectoryContentsWithFilter(viewsPath, "(?!"+partialsPrefix+")*.ehtml");

	    	var i, size;
	    	var viewsList = [];
	    	if(viewsFileList != null){
	    		for (i=0, size = viewsFileList.length; i < size; ++i){
	    			
	    			viewsList.push(addGenPath( genViewsPath, {
		    			name: removeFileExt(viewsFileList[i]),
		    			path: viewsPath+"/"+viewsFileList[i]
		    		}));
		    	}
	    	}

	    	var partialsFileList = commonUtils.getDirectoryContentsWithFilter(viewsPath, partialsPrefix+"*.ehtml");

	    	var partialsInfoList = [];
	    	if(partialsFileList != null) {
	    		for (i=0, size = partialsFileList.length; i < size; ++i){
	    		
		    		partialsInfoList.push(addGenPath(genViewsPath, {
				    		// remove leading "~" indicating it is a partial
				    		name: removeFileExt( partialsFileList[i].replace(partialsPrefix,'') ),
				        	path: viewsPath+"/"+partialsFileList[i]
		    		
					}, partialsPrefix));
		        }
	    	}

	    	var helpersPath = constants.getHelperPath();
	    	helpersPath = helpersPath.substring(0, helpersPath.length-1);//remove trailing slash
	    	var helpersFileList = commonUtils.getDirectoryContentsWithFilter(helpersPath, "(?!"+partialsPrefix+")*.js");

	    	var helperSuffix = constants.getHelperSuffix();
	    	var helperInfo = null;
	    	if(helpersFileList != null){
	    		
	    		for(i=0, size = helpersFileList.length; i < size; ++i){
		    		if(helpersFileList[i].startsWith(controllerName, true) && helpersFileList[i].endsWith(helperSuffix+'.js', true)){
		    	    	
		    			var name = removeFileExt(helpersFileList[i]);
		    			helperInfo = {
		    	    			fileName: name,
		    	    			name: firstToUpperCase(name),
		    	    			path: helpersPath+"/"+helpersFileList[i]
		    	    	};
		    		}
		    	}
	    		
	        }
	    	
	    	var layoutsPath = constants.getLayoutPath();
	    	layoutsPath = layoutsPath.substring(0, layoutsPath.length-1);//remove trailing slash
	    	var layoutsFileList = commonUtils.getDirectoryContentsWithFilter(layoutsPath, "(?!"+partialsPrefix+")*.ehtml");
	    	
	    	var layoutInfo = null, layoutGenPath;
	    	for(i=0, size = layoutsFileList.length; i < size; ++i){
	    		
	    		if( layoutsFileList[i].startsWith(controllerName, true) ){
	    			
	    			var layoutName = removeFileExt(layoutsFileList[i]);
	    	    	layoutInfo = {
			    		fileName: layoutName,
			    		name: firstToUpperCase(layoutName),
			        	path: layoutsPath+"/"+layoutsFileList[i],
	    	    	};
	    	    	
	    	    	layoutGenPath = constants.getCompiledLayoutPath();
	    	    	addGenPath(layoutGenPath.substring(0, layoutGenPath.length-1), layoutInfo);
		        	
		        	break;
	    		}
	        }
	    	
	    	var ctrlInfo = {
	    		fileName: rawControllerName,
	    		name:     controllerName,
	    		path:     controllerFilePath,
	    		
	    		views:    viewsList,
	    		partials: partialsInfoList,
	    		helper:   helperInfo,
	    		layout:   layoutInfo
	    	};
	    	
	    	//TEST compare info with "reference" result from original impl.:
//	    	var test ={
//	    			application: '{"fileName":"application","name":"Application","path":"controllers/application.js","views":[{"name":"login","path":"views/application/login.ehtml"},{"name":"registration","path":"views/application/registration.ehtml"},{"name":"welcome","path":"views/application/welcome.ehtml"}],"partials":[{"name":"languageMenu","path":"views/application/~languageMenu.ehtml"}],"helper":{"fileName":"applicationHelper","name":"ApplicationHelper","path":"helpers/applicationHelper.js"},"layout":{"fileName":"application","name":"application","path":"views/layouts/application.ehtml"}}',
//	    			calendar: '{"fileName":"calendar","name":"Calendar","path":"controllers/calendar.js","views":[{"name":"create_appointment","path":"views/calendar/create_appointment.ehtml"}],"partials":[],"helper":null,"layout":null}'
//	    	};
//	    	
//	    	var isEqual = (JSON.stringify(ctrlInfo) === test[ctrlInfo.fileName]);
//	    	console[isEqual? 'info':'error']('compliance-test: isEual? '+  isEqual);
	        
	        return ctrlInfo;
		};

		commonUtils.loadImpl(


				constants.getControllerPath(),

				false,

				function () {
					
					console.info( '[loadControllers] done' );
					
					deferred.resolve(_instance);
				},

				function isAlreadyLoaded (name) {
					return false; //(_instance && _instance.getController(name));
				},

				function callbackStatus(status, fileName, msg) {
					if(status==='info'){
						
						console.info('[loadController] "'+fileName);

						var ctrlInfo = getControllerResources(fileName, constants.getControllerPath());

						var controller = new Controller(ctrlInfo.name, ctrlInfo);

						if(ctrlInfo.helper){
							var helperPath = ctrlInfo.helper.path;
							var helperName = ctrlInfo.helper.name;
							controller.loadHelper(helperName,helperPath);
						}

						controllers.put(controller.getName(), controller);
					}
					else if(status==='warning'){
						console.warn('[loadController] "'+fileName+'": '+msg);
					}
					else if(status==='error'){
						console.error('[loadController] "'+fileName+'": '+msg);
					}
					else{
						console.error('[loadController] '+status+' (UNKNOWN STATUS) -> "'+fileName+'": '+msg);
					}               
				}

		);		

		return deferred.promise(_instance);

	};

	/**
     * Object containing the instance of the class {@link mmir.ControllerManager} 
     * 
     * @property _instance
     * @type Object
     * @private
	 * @augments mmir.ControllerManager
	 * @memberOf mmir.ControllerManager.prototype
	 * @ignore
     */
	var _instance = {
			/** @scope mmir.ControllerManager.prototype */

			/**
			 * Get instance of ControllerManager.
			 * 
			 * @deprecated use directly: instead of <code>mmir.ControllerManager.getInstance()</code> use <code>mmir.ControllerManager</code>
			 * 
			 * NOTE: The ControllerManager must be initialized, before it can be used! (see {@link ControllerManager#init})
			 */
			getInstance : function () {

				return this;
			},	

			// public members           

			/**
			 * This function gets the controller by name. 
			 * 
			 * @function getController
			 * @param {String} ctrlName Name of the controller which should be returned
			 * @returns {Object} controller if found, null else
			 * @public
			 */
			getController: function(ctrlName){
				var ctrl = controllers.get(ctrlName);
				if(!ctrl){
					return null;
				}
				return ctrl;
			},


			/**
			 * This function returns names of all loaded controllers. 
			 * 
			 * @function getControllerNames
			 * @returns {Array<String>} Names of all loaded controllers
			 * @public
			 */
			getControllerNames: function(){

				return controllers.getKeys();
			},


			/**
			 * This function performs an action of a controller. 
			 * 
			 * @function perform
			 * @param {String} ctrlName Name of the controller to which the action belongs
			 * @param {String} actionName Name of the action that should be performed
			 * @param {Object} data optional data that can be submitted to the action
			 * @returns {Object} the return object of the performed action
			 * @public
			 */
			perform: function(ctrlName, actionName, data){
				var ctrl = this.getController(ctrlName);
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
			 * @function performHelper
			 * @param {String} ctrlName Name of the controller to which the helper action belongs
			 * @param {String} actionName Name of the action that should be performed by the helper
			 * @param {Object} data optional data that can be submitted to the action
			 * @returns {Object} the return object of the performed action
			 * @public
			 */
			performHelper: function(ctrlName, actionName, data) {

				var ctrl = this.getController(ctrlName);
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
			 * @function init
			 * 
			 * @param {Function} [callback] OPTIONAL
			 * 				an optional callback that will be triggered after the controllers where loaded
			 * @returns {Promise}
			 * 				a Deferred.promise that will get fulfilled when controllers are loaded
			 * @example
			 *  //recommended style:
			 *  require(['controllerManager', ...], function(controllerManager, ...) {
			 *  	controllerManager.init().then(function(theInitializedControllerInstance){
			 *  		...
			 *  	});
			 *  })
			 *  
			 *  //old style:
			 * 	function afterLoadingControllers(controllerManagerInstance){
			 * 		var appCtrl = controllerManagerInstance.getController('Application');
			 * 		//do something...
			 * 	} 
			 * 	mmir.ControllerManager.init(afterLoadingControllers);
			 * @public
			 */
			init: _init

	};
	/**@ignore*/
	return _instance;
	
	/** #@- */
	
});


