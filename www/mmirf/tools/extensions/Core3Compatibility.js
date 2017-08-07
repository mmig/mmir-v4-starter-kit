define(['require', 'mmirf/semanticInterpreterCompatibility',
    'mmirf/configurationManager','mmirf/controllerManager','mmirf/dialogManager','mmirf/dialogEngine',
    'mmirf/inputManager','mmirf/inputEngine','mmirf/commonUtils','mmirf/languageManager','mmirf/mediaManager','mmirf/presentationManager',
    'mmirf/semanticInterpreter','mmirf/modelManager','mmirf/constants','mmirf/notificationManager','mmirf/grammarConverter', 'mmirf/util/deferred',
    'mmirf/parseUtils', 'mmirf/renderUtils', 'mmirf/scionEngine',
    //only loaded, not used as argument:
    'mmirf/stringExtension'
], 
	/**
     * Set to "backwards compatibility mode v3" (for pre version 4.0) for module names and method names.
     * 
	 * This function adds old names/synonyms for modules names (on <code>mmir</code> object/namespace):
     * <ul>
     * 	<li> {@link mmir.CommonUtils} as
     *          <b><u>mmir.util</u></b>
     *  </li><li> {@link mmir.ConfigurationManager} as
     *          <b><u>mmir.conf</u></b>
     *  </li><li> {@link mmir.ControllerManager} as
     *          <b><u>mmir.ctrl</u></b>
     *  </li><li> {@link mmir.Constants } as
     *          <b><u>mmir.const</u></b>
     *  </li><li> {@link mmir.DialogManager} as
     *          <b><u>mmir.dialog</u></b>
     *  </li><li> {@link mmir.InputManager } as
     *          <b><u>mmir.input</u></b>
     *  </li><li> {@link mmir.LanguageManager} as
     *          <b><u>mmir.lang</u></b>
     *  </li><li> {@link mmir.MediaManager} as
     *          <b><u>mmir.media</u></b>
     *  </li><li> {@link mmir.ModelManager} as
     *          <b><u>mmir.model</u></b>
     *  </li><li> {@link mmir.NotificationManager} as
     *          <b><u>mmir.notifier</u></b>
     *  </li><li> {@link mmir.PresentationManager} as
     *          <b><u>mmir.presentation</u></b>
     *  </li><li> {@link mmir.SemanticInterpreter} as
     *          <b><u>mmir.semantic</u></b>
     *  </li>
     * </ul>
     * 
     * In addition, old method names will be added as synonyms:
     * <ul>
     * 	 <li> {@link mmir.ConfigurationManager}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.ConfigurationManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.Constants}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.Constants}</li>
     * 		</ul>
     *  </li><li> {@link mmir.ControllerManager}
     * 		<ul>
     * 			<li><b><u>get</u></b> for {@link mmir.ControllerManager#getController}</li>
     * 			<li><b><u>getNames</u></b> for {@link mmir.ControllerManager#getControllerNames}</li>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.ControllerManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.DialogManager}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.DialogManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.InputManager}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.InputManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.LanguageManager}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.LanguageManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.ModelManager}
     * 		<ul>
     * 			<li><b><u>get</u></b> for {@link mmir.ModelManager#getController}</li>
     * 			<li><b><u>getNames</u></b> for {@link mmir.ModelManager#getControllerNames}</li>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.ModelManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.ModelManager}
     * 		<ul>
     * 			<li><b><u>get</u></b> for {@link mmir.ModelManager#getController}</li>
     * 			<li><b><u>getNames</u></b> for {@link mmir.ModelManager#getControllerNames}</li>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.ModelManager}</li>
     * 		</ul>
     *  </li>
     *  <li> {@link mmir.NotificationManager}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.NotificationManager}</li>
     * 		</ul>
     *  </li>
     *  <li> {@link mmir.PresentationManager}
     * 		<ul>
     * 			<li><b><u>renderView</u></b> for {@link mmir.PresentationManager#render}</li>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.PresentationManager}</li>
     * 		</ul>
     *  </li><li> {@link mmir.parser.ParserUtils}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.parser.ParserUtils}</li>
     * 		</ul>
     *  </li><li> {@link mmir.parser.RenderUtils}
     * 		<ul>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.parser.RenderUtils}</li>
     * 		</ul>
     *  </li><li> {@link mmir.SemanticInterpreter}
     * 		<ul>
     * 			<li><b><u>getASRSemantic</u></b> for {@link mmir.SemanticInterpreter#interpret}</li>
     * 			<li><b><u>getInstance</u></b> <em>(removed)</em> for {@link mmir.SemanticInterpreter}</li>
     * 		</ul>
     *  </li>
     * </ul>
     * 
     * Methods with changed signature will be re-mapped to match their old signature
     * <ul>
     * 	 <li> {@link mmir.ConfigurationManager}
     * 		<ul>
     * 			<li>map <b><u>get(propertyName, defaultValue, useSafeAccess)</u></b> back to <br>
     * 				get(propertyName, useSafeAccess, defaultValue)<br>
     * 				the original function will be available via <em>_get(propertyName, useSafeAccess, defaultValue)</em>
     * 			</li>
     * 			<li>map <b><u>getBoolean(propertyName, defaultValue, useSafeAccess)</u></b> back to <br>
     * 				getBoolean(propertyName, useSafeAccess, defaultValue)<br>
     * 				the original function will be available via <em>_getBoolean(propertyName, useSafeAccess, defaultValue)</em>
     * 			</li>
     * 			<li>map <b><u>getString(propertyName, defaultValue, useSafeAccess)</u></b> back to <br>
     * 				getString(propertyName, useSafeAccess, defaultValue)<br>
     * 				the original function will be available via <em>_getString(propertyName, useSafeAccess, defaultValue)</em>
     * 			</li>
     * 		</ul>
     *   </li>
     * </ul>
     * 
     * Lastly, removed methods will be added:
     * <ul>
     * 	<li> {@link mmir.Constants}
     * 		<ul>
     * 			<li><b><u>getPluginsPath</u></b> <em>(removed)</em> to {@link mmir.CommonUtils}</li>
     * 		</ul>
     *   </li>
     * 	 <li> {@link mmir.CommonUtils}
     * 		<ul>
     * 			<li><b><u>loadAllCordovaPlugins</u></b> <em>(removed)</em> to {@link mmir.CommonUtils}</li>
     * 			<li><b><u>setToCompatibilityMode</u></b> <em>(removed)</em> to {@link mmir.CommonUtils}</li>
     * 		</ul>
     *   </li>
     * 	 <li> {@link mmir.LanguageManager}
     * 		<ul>
     * 			<li><b><u>setToCompatibilityMode</u></b> <em>(removed)</em> to {@link mmir.LanguageManager}</li>
     * 		</ul>
     *   </li>
     * </ul>
     * 
     * @param {mmir} mmir
     * 			the (core) instance/namespace for MMIR
     * 
	 * 
	 * @class
	 * @name mmir.Core.setToCompatibilityMode3Extension
	 * @static
	 * 
	 * @requires SemanticInterpreterCompatibility
	 * 
	 * @example
	 * mmir.require(['mmirf/core3Compatibility', 'mmirf/core'], function(setCompatibility, mmir){
	 * 		setCompatibility(mmir);
	 * });
	 * 
	 * //OR: if mmir-lib modules were require'd in application code, add v3 module-ID aliases first:
	 * mmir.require(['mmirf/core3ModuleIdCompatibility', 'mmirf/core3Compatibility', 'mmirf/core'], function(core3ModuleIdCompatibility, setCompatibility, mmir){
	 * 		core3ModuleIdCompatibility(mmir.require, window);
	 * 		setCompatibility(mmir);
	 * });
	 * 
	 * @public
	 */
	function(require, semanticInterpreterCompatibility,
		configurationManager, controllerManager, dialogManager, dialogEngine,
		inputManager, inputEngine, commonUtils, languageManager, mediaManager, presentationManager,
		semanticInterpreter, modelManager, constants, notificationManager, GrammarConverter, deferred,
		parseUtils, renderUtils, scionEngine
	){

	/**
     * Set to "backwards compatibility mode" (for pre version 4.0).
     * 
     * This function re-adds deprecated and removed functions and
     * properties to the (core) mmir namespace.
     * 
     * NOTE that once set to compatibility mode, it cannot be reset to
     * non-compatibility mode.
     * 
     * 
     * @param {mmir} mmir
     * 			the (core) instance/namespace for MMIR
     * 
     * @constructs mmir.Core.setToCompatibilityMode3Extension
     */
    return setToCompatibilityMode = function(mmir) {
    	
    	mmir.ConfigurationManager = configurationManager;
    	mmir.ControllerManager = controllerManager;
    	mmir.PresentationManager = presentationManager;
    	mmir.DialogManager = dialogManager;
    	mmir.DialogEngine = dialogEngine;
    	mmir.InputManager = inputManager;
    	mmir.InputEngine = inputEngine;
    	mmir.CommonUtils = commonUtils;
    	mmir.LanguageManager = languageManager;
    	mmir.MediaManager = mediaManager;
    	mmir.SemanticInterpreter = semanticInterpreter;
    	mmir.ModelManager = modelManager;
    	mmir.Constants = constants;
    	mmir.NotificationManager = notificationManager;
    	
//    	mediaManager.textToSpech = mediaManager.tts;
//    	mediaManager.setTextToSpeechVolume = mediaManager.ttsVolume;
    	
    	presentationManager.renderView = presentationManager.render;
    	controllerManager.getController = controllerManager.get;
    	controllerManager.getControllerNames = controllerManager.getNames;
    	modelManager.getModel = modelManager.get;
    	modelManager.getModels = modelManager.getNames;
    	
    	//set backwards-compatibility mode for semanticInterpreter and GrammarConverter
        semanticInterpreterCompatibility(semanticInterpreter, GrammarConverter);
    	
    	var getInstance = function(){return this;};
    	var getInstanceAsInit = function(){return this.init.apply(this, arguments);};
    	
    	constants.getInstance = getInstanceAsInit;
    	controllerManager.getInstance = getInstance;
    	dialogManager.getInstance = getInstance;
    	inputManager.getInstance = getInstance;
    	languageManager.getInstance = function(lang){
    		if(lang) {
    			setLanguage(lang);
    		}
    		
    		return this;
    	};
    	mediaManager.getInstance = function(){
            return this.init(null, null);
        };
        modelManager.getInstance = getInstanceAsInit;
        notificationManager.getInstance = getInstance;
        presentationManager.getInstance = getInstance;
        
        parseUtils.getInstance = getInstance;
        
        //DISABLED would not effect scionEngine instances, that were already created
        //         ... and scionEninge (and created instance) are only internally used, so application code should be not effected...
//        requirejs.undef('mmirf/scionEngine');
//        define('mmirf/scionEngine', function(){
//        	return function(configuration , context){
//            	var instance = scionEngine(configuration , context);
//            	instance.getInstance = getInstance;
//            	return instance;
//            };
//        });
//        require(['mmirf/scionEngine']);
        
        renderUtils.getInstance = getInstance;
        
        configurationManager.getLanguage = function(){ return languageManager.getLanguage(); };
        configurationManager.setLanguage = function(lang){ languageManager.setLanguage(lang); };
        
        configurationManager._get = configurationManager.get;
        configurationManager.get = function(propertyName, useSafeAccess, defaultValue){
        	return this._get(propertyName, defaultValue, useSafeAccess);
        };
        configurationManager._getBoolean = configurationManager.getBoolean;
        configurationManager.getBoolean = function(propertyName, useSafeAccess, defaultValue){
        	return this._getBoolean(propertyName, defaultValue, useSafeAccess);
        };
        configurationManager._getString = configurationManager.getString;
        configurationManager.getString = function(propertyName, useSafeAccess, defaultValue){
        	return this._getString(propertyName, defaultValue, useSafeAccess);
        };
        
        
        /**
	     * Set to "backwards compatibility mode" (for pre version 2.0).
	     * 
	     * This function re-adds deprecated and removed functions and
	     * properties to the CommonUtils instance.
	     * 
	     * NOTE that once set to compatibility mode, it cannot be reset to
	     * non-compatibility mode.
	     * 
         * NOTE: Requires jQuery to be present.
         * 
	     * @deprecated use only for backwards compatibility
	     * 
	     * @async
	     * @requires jQuery
	     * @requires mmir.CommonUtils.setToCompatibilityModeExtension
	     * 
	     * @param {Function} [success]
	     * 				a callback function that is invoked, after compatibility mode
	     * 				was set (alternatively the returned promise can be used).
	     * @param {Function} [requireFunction]
	     * 				the require-function that is configured for loading the compatibility module/file.
	     * 				Normally, this would be the function <code>mmir.require</code>.
	     * 				If omitted, the default (local dependency) <code>require</code> function will be used.
	     * 				NOTE: this argument is positional, i.e. argument <code>success</code> must be present, if
	     * 				      you want to specify this argument
	     * @returns {Promise}
	     * 				a deferred promise that is resolved, after compatibility mode
	     * 				was set
	     * 
    	 * @memberOf mmir.Core.setToCompatibilityMode3Extension
	     */
	    commonUtils.setToCompatibilityMode = function(success, requireFunction) {
	    	
	    	var defer = deferred();
	    	if(success){
	    		defer.then(success, success);
	    	}

	    	requireFunction = requireFunction || require;
	    	requireFunction(['mmirf/commonUtilsCompatibility'],function(setCompatibility){
	    		
	    		setCompatibility(commonUtils);
	    		
	    		defer.resolve();
	    	});
	    	
	    	return defer;
	    };
	    
	    /**
         * Set to "backwards compatibility mode" (for pre version 2.0).
         * 
         * This function re-adds deprecated and removed functions and
         * properties to the CommonUtils instance.
         * 
         * NOTE that once set to compatibility mode, it cannot be reset to
         * non-compatibility mode.
         * 
         * NOTE: Requires jQuery to be present.
         * 
         * @deprecated use only for backwards compatibility
         * 
         * @public
         * @async
	     * @requires jQuery
	     * @requires mmir.LanguageManager.setToCompatibilityModeExtension
	     * 
	     * @param {Function} [success]
	     * 				a callback function that is invoked, after compatibility mode
	     * 				was set (alternatively the returned promise can be used).
	     * @param {Function} [requireFunction]
	     * 				the require-function that is configured for loading the compatibility module/file.
	     * 				Normally, this would be the function <code>mmir.require</code>.
	     * 				If omitted, the global <code>require</code> function will be used.
	     * 				NOTE: this argument is positional, i.e. argument <code>success</code> must be present, if
	     * 				      you want to specify this argument
	     * @returns {Promise}
	     * 				a deferred promise that is resolved, after compatibility mode
	     * 				was set
	     * 
    	 * @memberOf mmir.Core.setToCompatibilityMode3Extension
         */
        languageManager.setToCompatibilityMode = function(success, requireFunction) {
        	
        	var defer = deferred();
	    	if(success){
	    		defer.then(success, success);
	    	}
	    	requireFunction = requireFunction || require;
	    	requireFunction(['mmirf/languageManagerCompatibility'],function(setCompatibility){
	    		
	    		setCompatibility(languageManager);
	    		
	    		defer.resolve();
	    	});
	    	
	    	return defer;
            
        };
        
        /**
		 * Returns a string with the path to the (Cordova v2.x) plugins directory.
		 * @function
		 * @public
		 * @returns {String} plugins directory path
		 * 
    	 * @memberOf mmir.Core.setToCompatibilityMode3Extension
		 */
        constants.getPluginsPath = function(){
			return constants.getBasePath()+'mmirf/plugins/';
		};
        

	    /**
	     * Load all plugins (i.e. JavaScript interfaces for
	     * Cordova v2 / JavaScript-impl. plugins).
	     * 
	     * @function
	     * @param {String} [pluginsPath] OPTIONAL 
	     *            Path of the plugins which should be
	     *            loaded, e.g.
	     *            <b>mmirf/plugins/</b>
	     *            
	     *            If omitted: the default plugin-path is used
	     *            (see {@link mmir.Core.setToCompatibilityMode3Extension#getPluginsPath})
	     *            
	     * @param {Function} [cbFunction] OPTIONAL 
	     *            The function that should be executed after
	     *            the plugins are loaded. If the execution of following
	     *            functions is dependent on the present of plugins, they
	     *            should be triggered from inside the callback-function
	     *            
	     * @returns {Promise} a Deferred.promise (see loadImpl())
	     * 
	     * @async
	     * @public
    	 * @memberOf mmir.Core.setToCompatibilityMode3Extension
	     */
	    commonUtils.loadAllCordovaPlugins = function(pluginsPath, cbFunction) {

	    	if(typeof pluginsPath === 'function'){
	    		cbFunction = pluginsPath;
	    		pluginsPath = null;
	    	}
	    	
	    	if(typeof pluginsPath !== 'string'){
	    		pluginsPath = constants.getPluginsPath();
	    	}
	    	
	    	// reads all *.js files in www/mmirf/plugins/
        	// and loads them dynamically
        	// IMPORTANT: /assets/www/config/directories.json must be up-to-date!
        	//				(it contains the list of JS-files for the plugins)
        	//				-> use "cordova prepare" for updating
        	
	    	
	    	//FIXME: Cordova 2.x mechanism!!! (remove when switching to 3.x ?)
	    	window.plugins = window.plugins || {};
	    	
	    	
			return commonUtils.loadImpl(
            	  pluginsPath, 
            	  false, 
            	  cbFunction,
				  function isPluginAlreadyLoaded(pluginFileName) {
				      if (window.plugins[pluginFileName.replace(/\.[^.]+$/g, "")]) {//<- regexpr for removing file extension
				    	  return true;
				      }
					  else {
						  return false;
				      }
				  },
				  function(status, fileName, msg){
				      if (status === 'info') {
				    	  if(logger.isInfo()) logger.info('CommonUtils', 'loadAllCordovaPlugins', 'loaded "'+ fileName + '": ' + msg);
				      }
					  else if (status === 'warning') {
						  if(logger.isWarn()) logger.warn('CommonUtils', 'loadAllCordovaPlugins', 'loading "'+ fileName + '": ' + msg);
				      }
					  else if (status === 'error') {
						  logger.error('CommonUtils', 'loadAllCordovaPlugins', 'loading "'+ fileName + '": ' + msg);
				      }
					  else {
						  logger.error('CommonUtils', 'loadAllCordovaPlugins', status + ' (UNKNOWN STATUS) -> "'+ fileName + '": ' + msg);
				      }
				  }
			);
	    }
    };
    
});
