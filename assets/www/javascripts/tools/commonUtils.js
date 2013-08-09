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
 * @module mobileDS.javascripts.tools
 * 
 */
var mobileDS = window.mobileDS ||
{};

/**
 * A Utility class to support various functions.<br>
 * It contains nearly all regular expressions used in the application - so that changes can be arranged inside this file.<br>
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.CommonUtils.getInstance()</code>
 * @class CommonUtils
 * @category core
 * 
 * @see mobileDS.CommonUtils#constructor
 */
mobileDS.CommonUtils = (function(){

    /**
     * Object containing the instance of the class CommonUtils 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance = null;
    
    /**
     * JSON-Object containing the directory Structure of the application. Only directories defined by the Property 
     * {@link mobileDS.CommonUtils-constructor-directoriesToParse} are contained within the JSON-Object.
     * 
     * @property directoryStructure
     * @type JSON
     * @private
     */
    var directoryStructure;

    /**
     * Property holding this instance of CommonUtils for referencing _this_-object inside sub-functions
     * 
     * @property self
     * @type Object
     * @private
     * @deprecated This Property is unused
     */
    var self = this;
	
	/**
	 * This function is used by {@link mobileDS.CommonUtils-constructor.getDirectoryContents} and {@link mobileDS.CommonUtils-constructor.getDirectoryContentsWithFilter} to strip the pathname parameter
	 * @function stripPathName
	 * @private
	 * @param {string} pathname The path that should be stripped of "file://" and a beginning or trailing "/"
	 * @returns {String} The stripped pathname - devoid of beginning "file://" or "/" and trailing "/"
 	 */
	function stripPathName(pathname){
		
		//FIXME this is a HACK; TODO handle this in a general way!
		var basePath = mobileDS.constants.getInstance(forBrowser).getBasePath();
		
    	if(pathname.startsWith(basePath)){
    		pathname = pathname.substring(basePath.length);
    	}
    	
		if (pathname.indexOf("file://") != -1){
    		pathname = pathname.replace("file://", "");
    	}
    	if (pathname[pathname.length-1] == "/"){
    		pathname = pathname.substring(0,pathname.length-1);
    	}
    	if (pathname[0] != "/"){
    		pathname = "/" + pathname;
    	}
    	
    	return pathname;
	}
	
	/**
	 * This helper initializes a function for detecting if an Object is an Array.
	 * 
	 * The helper tries to find functions of JavaScript libraries for this; if none can be found,
	 * a custom implementation is used.
	 * 
	 * The returned function is used by {@link mobileDS.CommonUtils-constructor.isArray}
	 * 
	 * NOTE: The current implementation checks $.isArray for presences
	 * 
	 * @function isArrayHelper
	 * @private
	 * @returns {Function} a function that takes one parameter (Object) and returns true if this parameter is an Array (false otherwise)
 	 */
	var isArrayHelper = function(obj){
		
		//this is the initializer: the following will overwrite the isArray-function
		// with the appropriate version (use jQuery method, if present, otherwise use alternative)
		
		//if present, use jQuery method:
		if(typeof $ !== 'undefined' && typeof $.isArray === 'function'){
			isArrayHelper = $.isArray; 
		}
		else {
			//use the toString method with well-defined return-value from Object:
			var staticToString = Object.prototype.toString;
			
			isArrayHelper = function(obj){
				return staticToString.call(obj) === '[object Array]';
			};
		}
	};
	//initialize the isArray-function
	isArrayHelper();

	/**
	 * Constructor-Method of Class {@link mobileDS.CommonUtils}
	 * 
	 * @constructor
	 * @augments mobileDS.CommonUtils
	 * 
	 * @memberOf mobileDS.CommonUtils.prototype
	 */
    function constructor(){
        //private members.
        /**
         * HTML-Dom-Element for logging directly on the main HTML-Page
         * as of now there is no element with the id "log" in the index.html 
         * 
         * @property debugNode
         * @type Element
         * @private
         * @deprecated unused
         */
        var debugNode = document.getElementById("log");
        
        /**
         * Regular Expression to identify a styleSheet-tag for the transformation of ehtml to html
         * 
         * @property styleSheetRegExp
         * @type String|RegExp
         * @private
         * @deprecated unused
         */
        var styleSheetRegExp = /<(%=\s*stylesheet_link_tag)\s* (\"(.*)\" %)>/;
        
        /**
         * Regular Expression to identify a javascript for the transformation of ehtml to html
         * 
         * @property javaScriptRegExp
         * @type String|RegExp
         * @private
         * @deprecated unused
         */
        var javaScriptRegExp = /<(%=\s*javascript_include_tag)\s* (\"(.*)\" %)>/;
        
        /**
         * Regular Expression to identify content for a view-element:<br>
         * either _header_, _footer_, _dialogs_ or _content_ 
         * 
         * @deprecated old template syntax format
         * 
         * @property contentForRegExp
         * @type String|RegExp
         * @private
         */
        var contentForRegExp =  /<%\s*content_for\s*:([^\s]*)\s*do\s*%>(([\s|\n]*.*[\s|\n]*)*)<%\s*end\s*%>/i ;

        /**
         * Regular Expression to identify if a partial should be rendered inside a view (ehtml-String)
         * 
         * @deprecated old template syntax format
         * 
         * @property renderPartialRegExp
         * @type String|RegExp
         * @private
         */
        var renderPartialRegExp =  /<%\s*render\s*([^\s]*)\s*\{\}\s*%>/i ;
        
        /**
         * Regular Expression for matching a translation-tag for the localization of view content (ehtml-String)
         * 
         * @deprecated old template syntax format
         * 
         * @property translationRegExpString
         * @type String|RegExp
         * @private
         */
        var translationRegExpString = '<%t\\s*:([^\\s]*)\\s*%>';

        /**
         * The Prefix for the file names of partial-files.<br>
         * Files named &lt;PARTIAL-PREFIX&gt;filename.ehtml inside a views-directory
         * are recognized as partials.
         * 
         * @property partialsPrefix
         * @type String
         * @private
         */
        var partialsPrefix = '~';

//        /**
//         * The Prefix for the names of view-files - currently unused and deprecated.
//         * 
//         * @property viewsPrefix
//         * @type String
//         * @private
//         * @deprecated has no further value 
//         */
//        var viewsPrefix = '#';

        /**
         * Array of Directories (Strings) to parse at the starting process<br>
         * those directories are then accessable by the functions {@link mobileDS.CommonUtils-constructor.getDirectoryContents} and {@link mobileDS.CommonUtils-constructor.getDirectoryContentsWithFilter}
         * 
         * TODO read from properties (implement mechanism such that \build.settings and this refer to the same resource) 
         * 
         * @property directoriesToParse
         * @type Array
         * @private
         */
        var directoriesToParse = [
		                 		 "www/controllers", 
		                		 "www/views", 
		                		 "www/models", 
		                		 "www/config", 
		                		 "www/javascripts/plugins", 
		                		 "www/helpers"
		                		 ];
        /**
         * Property holding this instance of CommonUtils for referencing _this_ constructor-object inside sub-functions
         * 
         * @property self
         * @type Object
         * @private
         * @deprecated This Property is unused
         */
		var self = this;
		
		
		
	    /**
	     * Array of strings for the conversion of month represented by integers to strings 
	     * Default Language for months is english, 'en'
	     * @property months
	     * @type Object
	     * @private
	     */
	    this.months = new Object();
	    this.months['01'] = 'January';
	    this.months['02'] = 'February';
	    this.months['03'] = 'March';
	    this.months['04'] = 'April';
	    this.months['05'] = 'May';
	    this.months['06'] = 'June';
	    this.months['07'] = 'July';
	    this.months['08'] = 'August';
	    this.months['09'] = 'September';
	    this.months['10'] = 'October';
	    this.months['11'] = 'November';
	    this.months['12'] = 'December';

	    this.months['de'] = new Object();
	    this.months['de']['01'] = 'Januar';
	    this.months['de']['02'] = 'Februar';
	    this.months['de']['03'] = 'M&auml;rz';
	    this.months['de']['04'] = 'April';
	    this.months['de']['05'] = 'Mai';
	    this.months['de']['06'] = 'Juni';
	    this.months['de']['07'] = 'Juli';
	    this.months['de']['08'] = 'August';
	    this.months['de']['09'] = 'September';
	    this.months['de']['10'] = 'Oktober';
	    this.months['de']['11'] = 'November';
	    this.months['de']['12'] = 'Dezember';

	    /** @lends mobileDS.CommonUtils.prototype */
		return {
            //public members.
			/**
			 * @function getPartialsPrefix
			 * @public
			 * @returns {String} The Prefix for the file names of partial-files
			 */
			getPartialsPrefix: function(){
				return partialsPrefix;
			},

			/**
			 * @function getDirectoryStructure
			 * @public
			 * @returns {Object} Directory structure as json object
			 */
			getDirectoryStructure: function(){
            	return this.directoryStructure;
            },
			
//			/**
//			 * Get the prefix for views.
//			 * @function getViewsPrefix
//			 * @public
//			 * @returns {String} The Prefix for the file names of views
//			 * @deprecated This function is unused and superfluous
//			 */
//			getViewsPrefix: function(){
//				return viewsPrefix;
//			},
			
			/**
			 * Gets the Regular Expression for translation tags.
			 * @function getTranslationRegExp
			 * @public
			 * @returns {String} The regular expression for matching a translation-tag - used inside a ehtml-String
			 */
			getTranslationRegExp: function(){
				return new RegExp(translationRegExpString, 'gi');
			},
			
			/**
			 * Appends a log-message to the main document (index.html) and prints it in the console
			 * @function log
			 * @param {String} clazz A prefix for the output of the log message in the console
			 * @param {String} logMessage The log message which should be printed
			 * @public
			 * @deprecated 
			 */
            log: function(clazz,logMessage){
                this.debugNode = document.getElementById("log");
                if (this.debugNode) {
                    this.debugNode.innerHTML += "<pre>\n" + logMessage + "\n</pre>\n";
                }
                console.log(clazz + ":" + logMessage);
            },
            
            /**
             * Regular Expression for matching HTML comments.<br>
             * 
             * This RegExp also matches multi-line comments.
             * 
             * Note upon using the RegExp that it does not consider
             * if a HTML comment is specified within a String or data-definition
             * (i.e. the comment is matched regardless were its defined).
             * 
             * @example <code> <!-- some comment --></code>
             * @property html_comment_regex
             * @type String|RegExp
             * @public
             */
			html_comment_regex: /<!--([\r\n]|.)*?-->/igm,
			
            /**
             * Regular Expression to identify content in a view that will be inserted.<br>
             * The content is generated by a helper function of the controller and usually saved as a JSON-Object with a _helper_ and _content_ part.<br>
             * If the string is escaped and must be unescaped a second parameter can be given to ensure that the string will be unescaped before the insertion in the view.
             * 
             * @deprecated old template syntax format
             * 
             * @example <code> <%= value_of(languageMenu::header, true) %></code>
             * @property value_of_regex
             * @type String|RegExp
             * @public
             */
			value_of_regex: /<%=\s*value_of\s*\(([^\)]*)\)\s*%>/igm,

            /**
             * See Property: {@link mobileDS.CommonUtils-constructor.value_of_regex} <br>
             * This regular expression is an extension to parse the parameters of the <b>value_of</b>-function.<br>
             * 
             * Regular Expression to identify content in a view that will be inserted.<br>
             * The content is generated by a helper function of the controller and usually saved as a JSON-Object with a _helper_ and _content_ part.<br>
             * If the string is escaped and must be unescaped a second parameter can be given to ensure that the string will be unescaped before the insertion in the view.
             * 
             * @deprecated old template syntax format
             * 
             * @example <code> <%= value_of(languageMenu::header, true) %></code>
             * @property value_of_path_regex
             * @type String|RegExp
             * @public
             */
			value_of_path_regex: /\(\s*([^\),]*),?\s*([^\)]*)\s*\)/i,

            /**
             * Regular Expression to identify if a partial is to be inserted in a view. <br>
             * Partials are in principle customizable views, which can be used independently from a controller and furthermore accept parameters to customize the partial.<br>
             * A partial is first processed and then integrated into the view.  
             * 
             * @deprecated old template syntax format
             * 
             * @example <code>  <% render googlemap/poi_details {:curr_poi_data_jpath => new JPath(mobileDS.ControllerManager.getInstance().getController("googlemap").script['current_poi_meta_data'])} %></code>
             * @property render_partial_regex
             * @type String|RegExp
             * @public
             */
			render_partial_regex: /<%\s*render\s*([^\s]*)\s*\{([^\}]*)\}\s*%>/igm,

            /**
             * See Property: {@link mobileDS.CommonUtils-constructor.render_partial_regex} <br>
             * This regular expression is an extension for the parsing of the parameters of the partial (for customization).<br>
             * 
             * Regular Expression to identify if a partial is to be inserted in a view. <br>
             * Partials are in principle customizable views, which can be used independently from a controller and furthermore accept parameters to customize the partial.<br>
             * A partial is first processed and then integrated into the view.  
             * 
             * @deprecated old template syntax format
             * 
             * @example <code>  <% render googlemap/poi_details {:curr_poi_data_jpath => new JPath(mobileDS.ControllerManager.getInstance().getController("googlemap").script['current_poi_meta_data'])} %></code>
             * @property partial_parameter_regex
             * @type String|RegExp
             * @public
             */
			partial_parameter_regex: /\s*:(\S*)\s*=>\s*(("([\S ]+)")|([^,]+))/i,

            /**
             * See Property: {@link mobileDS.CommonUtils-constructor.render_partial_regex} <br>
             * This regular expression is an extension for the parsing of the parameters of the partial (for customization) to get the name of the corresponding controller of the partial.<br>
             * 
             * Regular Expression to identify if a partial is to be inserted in a view. <br>
             * Partials are in principle customizable views, which can be used independently from a controller and furthermore accept parameters to customize the partial.<br>
             * A partial is first processed and then integrated into the view.  
             * 
             * @deprecated old template syntax format
             * 
             * @example <code>  <% render googlemap/poi_details {:curr_poi_data_jpath => new JPath(mobileDS.ControllerManager.getInstance().getController("googlemap").script['current_poi_meta_data'])} %></code>
             * @property partial_name_regex
             * @type String|RegExp
             * @public
             */
			partial_name_regex: /^([^\/]+)\/(.+)$/i,
			
            /**
             * Regular expression for the parsing of partial-files.<br>
             * This expression detects all variables and data-instructions for the customization of the partial. There are 3 types of variables or instructions:
             *
             * + <b>if-else-statement</b>, controls which part of the partial will be displayed - depending on the condition
             * + <b>data-instruction</b>, which is evaluated, but not displayed
             * + <b>variable</b> or <b>javascript-code</b>, which are evaluated and displayed in the view 
             *
             * Partials are principally customizable views, which can be used independently from a controller and furthermore accept parameters to customize the partial.<br>
             * A partial is first processed and then integrated into the view.  
             * 
             * @deprecated old template syntax format
             * 
             * @example <code>  {::address = address + " " + {:curr_poi_data}.query('addressBean/housenumber')}</code>
             * @property partial_var_pattern_regex
             * @type String|RegExp
             * @public
             */
			partial_var_pattern_regex: /(\{[^\}\{]+\})|(\{[^\{]*(\{(?=[^\}]*\}).*)\})/gmi,

            /**
             * Regular expression for the parsing of partial-files.<br>
             * This expression detects all simple variables for the customization of the partial in the form of <b>{:curr_poi_data}</b>.<br>
             * Form of <b>simple object</b>: <b>{:SIMPLE_OBJECT}</b><br>
             *
             * Partials are principally customizable views, which can be used independently from a controller and furthermore accept parameters to customize the partial.<br>
             * A partial is first processed and then integrated into the view.  
             * 
             * 
             * @deprecated old template syntax format
             * 
             * @example <code>{:curr_poi_data}</code>
             * @property partial_var_pattern_simpleobject_regex
             * @type String|RegExp
             * @public
             */
			partial_var_pattern_simpleobject_regex: /\{:([^\}]+)\}/,

            /**
             * Regular expression for the parsing of partial-files.<br>
             * This expression detects all <b>data objects</b> for the customization of the partial in the form of <b>{::curr_poi_data={:curr_poi_data_jpath}}</b>.<br>
             * Form of <b>data object</b>: <b>{::DATA_OBJECT}</b><br>
             * 
             * Partials are principally customizable views, which can be used independently from a controller and furthermore accept parameters to customize the partial.<br>
             * A partial is first processed and then integrated into the view.  
             * 
             * 
             * @deprecated old template syntax format
             * 
             * @example  <code>{::address = address + "&lt;br/&gt;"}</code>
             * @property partial_var_pattern_dataobject_regex
             * @type String|RegExp
             * @public
             */
			partial_var_pattern_dataobject_regex: /\{::([^\}\{]+)\}|\{::([^\{]*(?:\{(?:[^\}]*\}).*))\}/ig,

			/**
			 * Regular expression for detecting an assignment expression in templates,
			 * e.g. <code>{::theVariable=... }</code>.
			 * 
			 * 
             * @deprecated old template syntax format
             * 
			 * @example  <code>{::address = address + "&lt;br/&gt;"}</code> or <code>{::address = {:anotherVariable} + "&lt;br/&gt;"}</code>
             * @property partial_var_pattern_assignment_regex
             * @type String|RegExp
			 * @public 
			 */
			partial_var_pattern_assignment_regex: /\{::([^\}\{=]+)=([^\}\{]+)\}|\{::([^\}\{=]+)=([^\{]*(?:\{(?:[^\}]*\}).*))\}/ig,

//			/**
//             * Deprecated regular expression for partials. 
//             * @property partial_var_pattern_object_with_function_regex
//             * @type String|RegExp
//             * @public
//             * @deprecated unused
//             */
//			partial_var_pattern_object_with_function_regex: /\{?([^\.]+)([\.\[])([^\s\}]+)()/ig,
			
			/**
			 * Function which transforms a ehtml string (while parsing views) into html by replacing stylesheet-, javascript- and content_for-tags with corresponding contents.
			 * 
			 * 
             * @deprecated used for parsing/rendering old template syntax format
             * 
			 * @function ehtml2Html
			 * @param {String} eHtmlTag A string that should be transformed from ehtml to html 
			 * @public
			 * @returns {String} From ehtml into html transformed string 
			 */
            ehtml2Html: function(eHtmlTag){

                var result;
				if (eHtmlTag.match(styleSheetRegExp)) {
                   var group = eHtmlTag.match(styleSheetRegExp);
                   result = eHtmlTag.replace(group[1], "link rel=\"stylesheet\" ").replace(group[2], "href=\"content/stylesheets/" + group[3] + ".css\"/");
                }else if (eHtmlTag.match(javaScriptRegExp)) {
                        var group = eHtmlTag.match(javaScriptRegExp);
                        result = eHtmlTag.replace(group[1], "script  type=\"text/javascript\" charset=\"utf-8\" ").replace(group[2], "src=\"javascripts/" + group[3] + ".js\"></script");
                }else if (eHtmlTag.match(contentForRegExp)) {
                   var group = eHtmlTag.match(contentForRegExp);
				   return group;
                } 
                else {
                   return eHtmlTag;
                }

                return result;
            },
			
			/**
			 * Similar to the jQuery.getScript() function - appending a url of a javascript-source to the header of the main document.
			 * @function appendJsSrcToHeader
			 * @param {String} scriptSrc source of javascript-file
			 * @public
			 * @deprecated superseded by getLocalScript
			 */
            appendJsSrcToHeader: function (scriptSrc){
            	// appends '<script src=scriptSrc type = "text/javascript"></script>' to header
            	// thus loading it dynamically
            	var newScript = document.createElement('script');
            	newScript.type="text/javascript";
            	newScript.src=scriptSrc;
            	document.head.appendChild(newScript);
            },
            
			/**
			 * Similar to the jQuery.getScript() function - appending a url of a javascript-source to the header of the main document.<br>
			 * This function also calls a callback if the script was loaded.
			 * @function loadScript
			 * @param {String} url source of javascript-file
			 * @param {Function} callback callback function
			 * @public
			 * @async
			 * @deprecated superseded by getLocalScript
			 */
            loadScript: function (url, callback){
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                
                if (typeof callback === 'function'){
                    script.onload = function(){
                        callback();
                    };
                }
                document.getElementsByTagName("head")[0].appendChild(script);
            },
            
			/**
			 * Function which transforms a ehtml string (while parsing views) into html by replacing stylesheet-, javascript- and content_for-tags with corresponding contents.
			 * @function loadAllPhonegapPlugins
			 * @param {String} pluginspath Path of the plugins which should be loaded, e.g. <b>file:///android_asset/www/javascripts/plugins/</b> 
			 * @param {Function} cbFunction The function that should be executed after the plugins are loaded. If the execution of following functions is dependent on the present of plugins they should be capsuled inside the callback-function. 
			 * @async
			 * @public
			 */
            loadAllPhonegapPlugins: function (pluginsPath, cbFunction){
            	var self = this;
            	// reads all *.js files under /assets/www/javascript/plugins
            	// and loads them dynamically
            	// IMPORTANT: the Plugin "DirectoryListing" MUST be present and loaded
            	// the javascript file directoryDisting.js respectively
            	// Also important: ALL Plugins must be present in the /res/plugins.xml file!
            	
                function loadAllPluginFilesCB(data){
            		if (data.length < 1){
            			if (typeof cbFunction == 'function'){
            				cbFunction();
            			} else {
            				console.warn("[loadAllPluginFilesCB] callback-Parameter is not a function.");
            			}
            		} else {
            			var tmpPlugin = data[0];
                		if (window.plugins[tmpPlugin.replace(/\.[^.]+$/g,"")]){
                			
                			if(IS_DEBUG_ENABLED) console.info("[DEBUG] Plugin already loaded " + tmpPlugin);//debug
                			
            				data = data.slice(1);
            				loadAllPluginFilesCB(data);
                		} else {
                		
	                		/// ATTENTION: $.getScript --> mobileDS.CommonUtils.getInstance().getLocalScript
	                		/// under Android 4.0 getScript is not wokring properly
	                		mobileDS.CommonUtils.getInstance().getLocalScript(pluginsPath+tmpPlugin, 
	                		function(){
	                			
	                			if(IS_DEBUG_ENABLED) console.debug("[DEBUG] Loaded " + pluginsPath+tmpPlugin);//debug
	                			
	            				data = data.slice(1);
	            				loadAllPluginFilesCB(data);
	                		},
	                		function(exception) {
	                			// print out an error message
	                			console.error("[ERROR] Could not load '" + pluginsPath+tmpPlugin + "': "+ exception); //failure
	                		});
                		}
            		}
                }
                //console.log('about to load all plugins from path "'+pluginsPath+'"...');//FIXME debug
            	loadAllPluginFilesCB(mobileDS.CommonUtils.getInstance().getDirectoryContentsWithFilter(pluginsPath, "*.js"));

            	
            },
            
			/**
			 * Detects via the user-agent-string if the application is running on android. 
			 * @function isRunningOnAndroid
			 * @public
			 * @returns {Boolean} <b>True</b> if application is running on android, <b>False</b> otherwise
			 * @deprecated unused
			 */
            isRunningOnAndroid: function (){
            	// Testing if user-Agent-/ or appVersion-String contains 'android'
            	if ((navigator.userAgent.toLowerCase().indexOf("android")>-1) || (navigator.appVersion.toLowerCase().indexOf("android")>-1)){
            		return true;
            	} else {
            		return false;
            	}
            },

			/**
			 * Should detect - via the user-agent-string - if the application is running on android, symbian or ios; in other words: on a smartphone. 
			 * @function isRunningOnSmartphone
			 * @public
			 * @returns {Boolean} <b>True</b> if application is running on smartphone, <b>False</b> otherwise
			 * @deprecated unused
			 */
            isRunningOnSmartphone: function (){
            	// Testing if user-Agent-/ or appVersion-String contains 'android' or 'iOS'
            	// at the moment only android-, ios and symbian-strings are 'implemented'
            	var testString = navigator.userAgent.toLowerCase() + navigator.appVersion.toLowerCase();
            	if ((testString.indexOf("android")>-1) || (testString.indexOf("ios")>-1) || (testString.indexOf("symbian")>-1)){
            		return true;
            	} else {
                	return false;
            	}
            },
            
			/**
			 * <div class="box important">
			 * <b>Note:</b>
			 * On Android 4.0 jQuery.getScript() is not working properly - so use this function instead!
			 * </div>
			 * 
			 * Similar to the jQuery.getScript() function - appending a url of a javascript-source to the header of the main document.<br>
			 * This function also calls a success-callback if the script was successfully loaded or a fail-callback.<br>
			 * 
			 * 
			 * @function getLocalScript
			 * @param {String} scriptUrl source of javascript-file 
			 * @param {Function} success success callback function 
			 * @param {Function} fail fail callback function 
			 * @async
			 * @public
			 */
            getLocalScript: function (scriptUrl, success, fail){
            	var head = document.getElementsByTagName("head")[0];
            	script = document.createElement('script');
            	script.type = 'text/javascript';
            	script.src = scriptUrl;
            	script.onload = function() { success && success(); };
            	script.onerror = function(e) { 
            		if(IS_DEBUG_ENABLED) console.info("Insert Script Failed - " + scriptUrl + ": " + e); 
            		fail && fail(e); 
            	};
            	head.appendChild(script);
        	},
            
			/**
			 * This function returns an array of strings with the contents of a directory. 
			 * @function getDirectoryContents
			 * @param {String} pathname Path of the directory which contents should be returned
			 * @public
			 * @returns {Array} Array of Strings which contains the contents of the directory
			 */
            getDirectoryContents: function(pathname){
            	var retValue;
            	
            	pathname=stripPathName(pathname);
            	
            	try{
            		retValue = this.directoryStructure[pathname];
            	} catch(e){
            		console.warn(e);
            		retValue = null;
            	}
            	return retValue;
            },
            
			/**
			 * This function returns an array of strings with the contents of a directory, giving only those files which match the filter. 
			 * @function getDirectoryContentsWithFilter
			 * @param {String} pathname Path of the directory which contents should be returned
			 * @param {String} filter Filter of file-names: <b>*.js</b>, <b>*</b> or <b>*.ehtml</b>
			 * @public
			 * @returns {Array} Array of Strings which contains the contents of the directory
			 */
            getDirectoryContentsWithFilter: function(pathname, filter){
            	var retValue = new Array();
            	
            	var tmpfilter="^" + filter.replace(".","\\.").replace("*", ".*").replace("\$", "\\$") + "$";
            	
            	var filterRegExp = new RegExp(tmpfilter, 'gi');
            	
            	pathname=stripPathName(pathname);

            	try{
            		var tmp=this.directoryStructure[pathname];
            		if (tmp == undefined){
                		console.warn("["+pathname+" / " + filter + "] not found.");
                		retValue = null;
            		} else {
                		for (var i=0;i<tmp.length;i++){
                        	if (tmp[i].match(filterRegExp)){
                				retValue.push(tmp[i]);
                			}
                		}
            		}
            	} catch(e){
            		console.error("["+pathname+" / " + filter + "] "+e);
            		retValue = null;
            	}
            	return retValue;
            },
            
            /**
             * Checks if an object is an <code>Array</code>.
             * 
             * <p>
             * This function can be savely run in arbirtray contexts, e.g.
             * 
             * <pre> var checkArray = mobileDS.CommonUtils.getInstance().isArray;
             * if( checkArray(someObject) ){
             *   ...</pre>
             *  
			 * @function isArray
			 * @param {Object} object the Object for checking if it is an Array
			 * @public
			 * @returns {Boolean} <code>true</code> if <code>object</code> is an <code>Array</code>, otherwise <code>false</code>.
			 */
            isArray: function(object){
            	return isArrayHelper(object);
            },
            
			/**
			 * This function iterates over all elements of a specific class and changes the font-size of the contained text to the maximal possible size - while still being small enough to fit in the element. 
			 * @function html_resize_font_to_fit_surrounding_box
			 * @param {String} class_name Name of the class which inner text should be fitted to the size of the element 
			 * @public
			 */
            html_resize_font_to_fit_surrounding_box: 	function(class_name){
            	// resize the font in box_fit-class, so that it won't overlap its div-box
        		$(function(){

        			var smallest_font=1000;
        			$( class_name ).each(function ( i, box ) {
        				var width = $( box ).width(),
        					html = '<span style="white-space:nowrap">',
        					line = $( box ).wrapInner( html ).children()[ 0 ],
        					n = parseInt($( box ).css("font-size"), 10);
        				
        				$( box ).css( 'font-size', n );

        				while ( $( line ).width() > width ) {
        					$( box ).css( 'font-size', --n );
        				}

        				$( box ).text( $( line ).text() );
        				
        				n = parseInt($( box ).css("font-size"), 10);
        				
        				if (n < smallest_font){
        					smallest_font = n;
        				}
        			});

        			$( class_name ).each(function ( i, box ) {
        				$( box ).css( 'font-size', smallest_font );
        			});
        		});
        	},
            
			/**
			 * Converts the object to a valid JSON String value.
			 * 
			 * Ensures that the returned value does not contain (un-escaped) double-quotes, so that 
			 * the returned value can be used as a JSON value, e.g. </br>
			 * @example	<code>var jsonValue = to_json_string_value(someValue);
			 *  var data = JSON.parse('"theValue":"' + jsonValue + '"');</code>
			 * @function to_json_string_value
			 * @param {Object} theObjectValue the object to convert to a JSON String value. If NULL or UNDEFINED, an EMPTY String will be returned
			 * @returns {String} the String value
			 * @public
			 */
        	to_json_string_value: function(theObjectValue){
        		if(typeof theObjectValue !== 'undefined' && theObjectValue !== null){
					if(typeof theObjectValue !== 'string'){
						theObjectValue = theObjectValue.toString();
					}
					theObjectValue = theObjectValue.escapeDoubleQuotes();
				} else {
					theObjectValue = '';
				}
        		return theObjectValue;
        	},
        	
        	
			/**
			 * Converts the object to a valid JSON String value.
			 * 
			 * Ensures that the returned value does not contain (un-escaped) double-quotes, so that 
			 * the returned value can be used as a JSON value, also does replace all newlines with the
			 * HTML-equivalent '&lt;br/&gt;', e.g.
			 *  @example <code> var jsonValue = to_json_string_value(someValue);
			 *  var data = JSON.parse('"theValue":"' + jsonValue + '"');
			 *  ...</code>
			 * @function convert_to_json_value_HTML_string
			 * @param {Object} theObjectValue the object to convert to a JSON String value. If NULL or UNDEFINED, an EMPTY String will be returned
			 * @returns {String} the String value
			 * @public
			 */
        	convert_to_json_value_HTML_string: function(str){
        		if(typeof str !== 'undefined' && str !== null){
					if(typeof str !== 'string'){
						str = str.toString();
					}
	        		//escape double-quotes, if necessary
	        		//replace (all variants of) newlines with HTML-newlines
					str = str.escapeDoubleQuotes().replaceAll('\r\n','<br/>').replaceAll('\n','<br/>').replaceAll('\r','<br/>');
				} else {
					str = '';
				}
        		return str;

        	},
            
        	convert_json_to_HTML_string: function(_o){
//        		var parse = function(_o){
			        var a = new Array(), t;
			        for(var p in _o){
			            if(_o.hasOwnProperty(p)){
			                t = _o[p];
			                if (t != null){
				                if(t && typeof t == "object"){
				                	a[a.length]= p + ":{ " + arguments.callee(t).join(", ") + "}";
				                } else {
				                	if(typeof t == "string"){
				                        a[a.length] = [ p+ ": \"" + t.toString() + "\"" ];
				                    } else{
				                    	a[a.length] = [ p+ ": " + t.toString()];
				                    }
				                }
			                }
			            }
			        }
//    		        return a;
//        		};
//    		    return "{" + parse(o).join(", ") + "}";

    		    return "{" + a.join(", ") + "}";
        	},
        	
        	/**
			 * Reformat the String representation of a date.
			 * 
			 * @example converts <code>2012-07-23 16:37:33.0</code> into &rarr; <code>23. July 2012</code>
			 * 
			 * @function get_date_as_string
			 * @param {String} the date String in format <code>yyyy-mm-dd HH:mm:ss.S</code>
			 * @param {String} <em>[Optional]</em> the language code (currently used to format the name of the month). Currently supported languages: <code>en, de</code>. If unkown or omitted, default <code>en</code> is used.
			 * @return {String} a new String representation for the date
			 * @public
			 */
        	get_date_as_string: function(date, languageCode){
        		var day, month, year;
        		var date_time = date.split(" ");
        	    var splited_date = date_time[0].split("-");
        	    year = splited_date[0];
        	    month = splited_date[1];
        	    
        	    //add leading zero if necessary
        	    if(month.length == 1){
        	    	month = '0'+month;
        	    }
        	    day = splited_date[2];
        	    
        	    var theLanguage = typeof languageCode === 'string'? languageCode.toLowerCase() : null;
        	    var monthName;
        	    if(theLanguage !== null && languageCode !== 'en' && self.months[theLanguage]){
        	    	//get language specific name for month, if possible
        	    	monthName = self.months[theLanguage][month];
        	    } else {
        	    	//get default name for month
        	    	monthName = self.months[month];
        	    }
        	    return day +". "+monthName+" "+year;   
        	},

        	/**
			 * Convert a duration (in seconds) into a String representation.
			 * 
			 * @example <code>2:09:19 h</code>, <code>12:05 min</code>
			 * 
			 * @function get_duration_as_string
			 * @param {Integer} the duration in seconds
			 * @return {String} a String representation for the duration
			 * @public
			 */
        	get_duration_as_string: function (duration){
        		var sec = duration % 60;
        	    var min = (duration - sec) / 60;
        	    
        	    var hour = 0;
        	    if(min > 59){
        	    	min = min % 60;
        	    	hour = ((duration - (min*60))-sec) / 3600;
        	    }
        	    if(sec < 10 ){
        	    	sec = "0"+sec;
        	    }
        	    if(min < 10){
        	    	min = "0"+min;
        	    }
        	    
        	    if(hour > 0){
        	    	return hour+":"+min+":"+ sec + " h";
        	    } else {
        	    	return min+":"+sec + " min";
        	    }
        	   
        	},
        	/**
			 * Convert parameter-part of an URL to a "dictionary", containing
			 * the parameter keys and values
			 * 
			 * @example <code>?id=5&name=heinz&name=kunz</code> &rarr; <code>dict['id']=5, dict['name'] = ['heinz', 'kunz']</code>
			 * 
			 * The returnd "dictionary" has the following functions:
			 * <ul>
			 * 	<li>has(String key): returns <code>true</code> if the dictionary contains an entry for <code>key</code></li>
			 * 	<li>isMultiple(String key): returns <code>true</code> if the entry for <code>key</code> is an Array (i.e. the URL contained multiple values for this key)</li>
			 * 	<li>getKeys(): returns an Array with the keys (String) for all entries</li>
			 * </ul> 
			 * 
			 * @function get_params_as_dict
			 * @param {String} the parameter-part of the URL, i.e. <code>&...</code>
			 * @return {Object} an "dictionary" for the parameters
			 * @public
			 */
        	get_params_as_dict: function(urlParamsPartStrings){
        		var dict = new Object();
        		
        		dict.has = function(key){
        			return typeof dict[key] !== 'undefined';
        		};
        		dict.isMultiple = function(key){
            		//use not-allowed-as-part-of-parameter-name char & as prefix for meta-data 'isMultiple' on field 'key':
        			return typeof dict['&'+key] !== 'undefined' && dict['&'+key] === true;
        		};
        		//use not-allowed-as-part-of-parameter-name char & as prefix for meta-data 'keys-list': 
        		dict['&&keys'] = new Array();
        		dict.getKeys = function(){
        			return dict['&&keys'];
        		};
        		
        		if(urlParamsPartStrings){
        			if(typeof urlParamsPartStrings !== 'string'){
        				urlParamsPartStrings = urlParamsPartStrings.toString();
        			}
        			if(urlParamsPartStrings.length < 1){
        				return dict;//////////////////////// EARLY EXIT ///////////////////////////
        			}
	            	if(urlParamsPartStrings.charAt(0)==='?'){
	            		urlParamsPartStrings = urlParamsPartStrings.substring(1);
	            	}
	            	
		        	var params = urlParamsPartStrings.split('&');
		        	var cur = null;
		        	var keyValue = null;
		        	var theKey = null;
		        	var theValue= null;
		        	for(var i_params = 0, size_params = params.length; i_params < size_params; ++ i_params) {
		        		
		        		cur = params[i_params];
		        		
			        	//"parse" parameter into key & value:
		        		keyValue = cur.split('=');
			        	theKey = keyValue[0];
			        	if(keyValue.length > 1){
			        		theValue =  keyValue[1];
			        	}
			        	else {
			        		theValue = null;
			        	}
			        	
			        	//create entry in dict for the parameter
			        	if(dict.has(theKey)){
			        		
			        		if(dict.isMultiple(theKey)){
			        			dict[theKey].push(theValue);
			        		}
			        		else {
			        			//entry already exist, but is not multiple (=Array) yet:
			        			var arr = new Array(2);
			        			arr[0] = dict[theKey];
			        			arr[1] = theValue;
			        			dict[theKey] = arr;
			        			dict['&'+theKey] = true;
			        		}
			        	}
			        	else {
			        		dict[theKey] = theValue;
			        		dict['&&keys'].push(theKey);
			        	}
		        	}
	        	}
        		return dict;
        	},
        	/**
        	 * This function is used check whether a network connection is enabled. </br>
        	 * This version of checking the network connection is based on the cordova 2.3.0 API. 
        	 * 
        	 * TODO implement with HTML5 functions (in addition to / instead of cordova)? 
        	 * 
        	 * @function checkNetworkConnection
        	 * @private
        	 * @returns {Boolean} <code>true</code> if a network connection is enabled
         	 */
        	checkNetworkConnection: function() {
        		console.log("Check network status.");
        	    var networkState = navigator.connection.type;

        	    var states = {};
        	    states[Connection.UNKNOWN]  = 'Unknown connection';
        	    states[Connection.ETHERNET] = 'Ethernet connection';
        	    states[Connection.WIFI]     = 'WiFi connection';
        	    states[Connection.CELL_2G]  = 'Cell 2G connection';
        	    states[Connection.CELL_3G]  = 'Cell 3G connection';
        	    states[Connection.CELL_4G]  = 'Cell 4G connection';
        	    states[Connection.NONE]     = 'No network connection';

        	    if (Connection.NONE === networkState){
        		    //alert('Connection type: ' + states[networkState]);
        	    	return false;
        	    }
        	    return true;
        	},
        	/**
			 * Parses the directory structure - paths given by property {@link mobileDS.CommonUtils-constructor-directoriesToParse} - and storing the result in the class-property {@link mobileDS.CommonUtils-directoryStructure}
			 * @function initialize
			 * @param {Function} cb The function that should be executed after the diretories are parsed - it's best to include all following functions inside the callback-function. 
			 * @async
			 * @public
			 */
            initialize: function(cb){
            	var self = this;
            	
            	window.plugins.directoryListing.getDirectoryStructure(
            		directoriesToParse,
            		function(dirStruct){
            			
            			if(IS_DEBUG_ENABLED) console.debug(JSON.stringify(dirStruct));//debug
            			
            			self.directoryStructure = dirStruct;
            			
            			if(IS_DEBUG_ENABLED) console.debug("[getDirectoryStructure] finished.");//debug
            			if(IS_DEBUG_ENABLED) console.debug(JSON.stringify(dirStruct));//debug
            			
            			if ((cb) && (typeof cb == 'function')){
            				cb.call();
            			}
                    }, 
                    function(e){
                    	console.error("[ERROR] " + e);
                    }
                );
            }

        };
        }
    
    return {
        /**
         * Object containing the instance of the class {@link mobileDS.CommonUtils} 
         * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.CommonUtils}
         * @public
         */
        getInstance: function(){
            if (instance === null) {
                instance = constructor();
            }
            return instance;
        }
    };
    
    
})();
