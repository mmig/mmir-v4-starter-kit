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

var mobileDS = window.mobileDS ||
{};

/**
 * A Utility class that provides various <i>constants</i>.<br>
 * 
 * <p>
 * Note that the actual values depend on the execution environment (e.g. ANDROID vs. BROWSER).
 * As a consequence the constants object has 2 modes, that can be switchted via
 * the getInstance()-method, e.g. <code>getInstance(false)</code>
 * 
 * @example <code>mobileDS.constants.getInstance(true)</code>
 * @class constants
 * @category core
 * 
 * @see mobileDS.constants#constructor
 */
mobileDS.constants = (function() {
    /**
     * Object containing the instance of the class constants 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance = null;
	
	var isBrowserEnv = false;

	// needed basepath
    var basePath = "";
	var assetPath = "/../";
	
	// Paths
	var frameworkBasePath = "mmirf/";
	
	var workerPath = frameworkBasePath + "workers/";
	var pluginsPath = frameworkBasePath + "plugins/";
	var extensionsPath = frameworkBasePath + "tools/extensions/";
	var beepURL = frameworkBasePath + "res/sounds/beep-notification.mp3";
	var controllerPath = "controllers/";
	var helperPath = "helpers/";
	var languagePath = "config/languages/";
	var modelPath = "models/";
	var layoutPath = "views/layouts/";
	var viewPath = "views/";
	var genGrammarsPath = "gen/grammar/";
	var speakerFileName = "speaker.json";
	var grammarFileName = "grammar.json";
	var dictionaryFileName = "dictionary.dic";
	var mediaPluginPath = "mmirf/env/media/";
	
	var configurationFileUrl = "config/configuration.json";
	
	var language = "en";
	
	// Prefixes
	var partialsPrefix = '~';
	var helperSuffix = "Helper";
	
	function setBasePath(isBrowserEnvParam){
		// if not on browser: basepath must be different
		if (isBrowserEnvParam){
			basePath = "";
			assetPath = "/../";
		}
		else {
			basePath = "file:///android_asset/www/";
			assetPath = "file:///android_asset/";
		}
	}
	
	/**
	 * Constructor-Method of Class {@link mobileDS.constants}<br>
	 * @constructor
	 * @augments mobileDS.constants
	 * 
	 * @memberOf mobileDS.constants.prototype
	 */
    function constructor(forBrowserParameter){
		isBrowserEnv = forBrowserParameter? forBrowserParameter : isBrowserEnv;
		setBasePath(forBrowserParameter);
		
		/** @lends mobileDS.constants.prototype */
		return {
			/**
			 * Returns a string with the base path.
			 * @function getBasePath
			 * @public
			 * @returns {String} base path
			 */
			getBasePath: function(){
				return basePath;
			},
			/**
			 * Returns a string with the path to the plugins.
			 * @function getPluginsPath
			 * @public
			 * @returns {String} plugin path
			 */
			getPluginsPath: function(){
				return basePath+pluginsPath;
			},
			/**
			 * Returns a string with the path to the layouts.
			 * @function getLayoutPath
			 * @public
			 * @returns {String} layout path
			 */
			getLayoutPath: function(){
				return basePath+layoutPath;
			},
			/**
			 * Returns a string with the path to the models.
			 * @function getModelPath
			 * @public
			 * @returns {String} model path
			 */
			getModelPath: function(){
				return basePath+modelPath;
			},
			/**
			 * Returns a string with the path to the views.
			 * @function getViewPath
			 * @public
			 * @returns {String} view path
			 */
			getViewPath: function(){
				return basePath+viewPath;
			},
			/**
			 * Returns a string with the path to the languages.
			 * @function getLanguagePath
			 * @public
			 * @returns {String} language path
			 */
			getLanguagePath: function(){
				return basePath+languagePath;
			},
			/**
			 * Returns a string with the path to the controllers.
			 * @function getControllerPath
			 * @public
			 * @returns {String} controller path
			 */
			getControllerPath: function(){
				return basePath+controllerPath;
			},
			/**
			 * Returns a string with the path to the workers.
			 * @function getWorerPath
			 * @public
			 * @returns {String} worker path
			 */
			getWorkerPath: function(){
				return workerPath;
			},
			/**
			 * Returns a string with the path to the helpers.
			 * @function getHelperPath
			 * @public
			 * @returns {String} helper path
			 */
			getHelperPath: function(){
				return basePath+helperPath;
			},
			/**
			 * Returns a string with the path to the extensions.
			 * @function getExtensionsPath
			 * @public
			 * @returns {String} extensions path
			 */
			getExtensionsPath: function(){
				return basePath + extensionsPath;
			},
			/**
			 * Returns a string with the path to the Media-Plugins.
			 * @function getMediaPluginPath
			 * @public
			 * @returns {String} MediaPlugin path
			 */
			getMediaPluginPath: function(){
				return basePath + mediaPluginPath;
			},
			/**
			 * Returns a string with the path to the directory that contains the generated/executable grammars.
			 * @function getGeneratedGrammarsPath
			 * @public
			 * @returns {String} path for generated grammars (JavaScript files)
			 */
			getGeneratedGrammarsPath: function(){
				return basePath + genGrammarsPath;
			},
			/**
			 * Returns a string with the path to the configuration file.
			 * @function getConfigurationFileUrl
			 * @public
			 * @returns {String} path to configuration file
			 */
			getConfigurationFileUrl: function(){
				return basePath+configurationFileUrl;
			},
			/**
			 * Returns a string with the path to the beep audio-file.
			 * @function getBeepUrl
			 * @public
			 * @returns {String} path to beep wav file
			 */
			getBeepUrl: function(){
				return basePath+beepURL;
			},
			/**
			 * Returns the name of the dictionary filename as string 
			 * @function getDictionaryFileName
			 * @public
			 * @returns {String} dictionary filename
			 */
			getDictionaryFileName: function(){
				return dictionaryFileName;
			},
			/**
			 * Returns the name of the speaker filename as string 
			 * @function getDictionaryFileName
			 * @public
			 * @returns {String} dictionary filename
			 */
			getSpeakerFileName: function(){
				return speakerFileName;
			},
			/**
			 * Returns the name of the grammar filename as string 
			 * @function grammarFileName
			 * @public
			 * @returns {String} grammar filename
			 */
			getGrammarFileName: function(){
				return grammarFileName;
			},
			/**
			 * Returns the prefix for partial filenames as string 
			 * @function getPartialsPrefix
			 * @public
			 * @returns {String} prefix for partial filenames
			 */
			getPartialsPrefix: function(){
				return partialsPrefix;
			},
			/**
			 * Returns the suffix for helper filenames as string. A helpers filename looks like: "ControllerName"+"Helper"+".js"
			 * @function getHelperSuffix
			 * @public
			 * @returns {String} suffix for helper filenames
			 */
			getHelperSuffix: function(){
				return helperSuffix;
			},
			/**
			 * Returns default language as string.
			 * @function getLanguage
			 * @public
			 * @returns {String} default language
			 */
			getLanguage: function(){
				return language;
			}
		};
	}
	
	return {
        /**
         * Object containing the instance of the class {@link mobileDS.constants} 
         * 
         * @function create
         * @param {Boolean} forBrowserParameter <tt>true</tt> for browser-environment, if <tt>false</tt> ANDROID environment is assumed (TODO change type from boolean; support more environments!)
         * @param {jQuery} [jQuery] the jQuery object (some functions may not work without this; see requires annotations)
         * @returns {Object} Object containing the instance of the class {@link mobileDS.constants}
         * @public
         */
		create: function(forBrowserParameter, jQuery){
//			if (instance === null) {
				instance = constructor(forBrowserParameter, jQuery);
	            
				//remove necessity for using getInstance
				mobileDS.constants = instance;
	            
	            //replace functions so that after this function returns, 
	            // create and getInstance will always just return the created instance:
	            var createImpl = function getInstanceDummy(theForBrowserParameter){
	            	if (theForBrowserParameter && theForBrowserParameter != isBrowserEnv){
	    				setBasePath(theForBrowserParameter);
	    			}
	            	return instance;
	            };
	            mobileDS.constants.getInstance = createImpl;
	            mobileDS.constants.create = createImpl;
//			}
			
			return instance;
		}
	
	    /**
	     * @see create
	     * 
	     * @function
	     */
	    ,getInstance: function(forBrowserParameter, jQuery){
	    	return this.create(forBrowserParameter, jQuery);
	    }
	};

}());