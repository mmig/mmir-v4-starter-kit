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
 * @module mobileDS.manager.settings
 * 
 */
var mobileDS = window.mobileDS ||
{};

/**
 * A class for managing the configuration. <br>
 * It's purpose is to load the configuration and settings automatically.
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.ConfigurationManager.getInstance()</code>
 * @class ConfigurationManager
 * @category core
 * 
 * @see mobileDS.ConfigurationManager#constructor
 */
mobileDS.ConfigurationManager = (function(){
    /**
     * Object containing the instance of the class {@link mobileDS.ConfigurationManager}.
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance = null;
    
	/**
	 * Constructor-Method of Class {@link mobileDS.ConfigurationManager}.
	 * 
	 * @constructor
	 * @augments mobileDS.ConfigurationManager
	 * @memberOf mobileDS.ConfigurationManager.prototype
	 */
    function constructor(){
    	/**
    	 * the configuration data (i.e. properties)
		 * @property configData
		 * @type Object
		 * @private
    	 */
    	var configData = null;
    	
        //load configuration file asynchronously: 
        $.ajax({
    		async: false,
    		dataType: "json",
    		url: mobileDS.constants.getInstance(forBrowser).getConfigurationFileUrl(),
    		success: function(data){
    			
    			if(IS_DEBUG_ENABLED) console.debug("ConfigurationManager.constructor: loaded language settings from "+mobileDS.constants.getInstance(forBrowser).getConfigurationFileUrl());//debug
    			
				if(data){ 
    				var jsonData = data;//jQuery.parseJSON( data );
    				
    				//DISABLED: avoid cyclic dependency LanguageManager <-> ConfigurationManager 
    				//          & avoid "private" knowledge about LanguageManager 
    				//			-> now LanguageManager "pulls" language configuration from ConfigurationManager
//    				//get & set language setting
//    				if(jsonData.language && jsonData.language != mobileDS.LanguageManager.getInstance().getLanguage()){
//	    				mobileDS.LanguageManager.getInstance().setLanguage(jsonData.language);
//	    				if(IS_DEBUG_ENABLED) console.debug("ConfigurationManager.constructor: setting language to "+ jsonData.language);//debug
//	    			}
    				
    				configData = jsonData;
    			}
    		},
    		error: function(data){
    			console.error("ConfigurationManager.constructor: failed to load configuration from '"+mobileDS.constants.getInstance(forBrowser).getConfigurationFileUrl()+"'! ERROR: "+ JSON.stringify(data));
    		}
    	});
    	
        /** @lends mobileDS.ConfigurationManager.prototype */
        return { // public members
			/**
			 * Returns the currently used language. 
			 * 
			 * <p>This does not return the language of the configuration, but is a
			 * shortcut for {@link mobileDS.LanguageManager#getLanguage}.
			 * 
			 * 
			 * @deprecated use mobileDS.LanguageManager.getInstance().getLanguage() instead!
			 * 
			 * 
			 * @function getLanguage
			 * @returns {String} The currently used language
			 * @public
			 */
            getLanguage: function(){
                return mobileDS.LanguageManager.getInstance().getLanguage();
            },
			/**
			 * Sets the currently used language.
			 * 
			 * <p>This does not set the language of the configuration, but is a
			 * shortcut for {@link mobileDS.LanguageManager#setLanguage}.
			 * 
			 * 
			 * @deprecated use mobileDS.LanguageManager.getInstance().setLanguage(lang) instead!
			 *  
			 * @function setLanguage
			 * @param {String} lang The language which is to be used
			 * @public
			 */
            setLanguage: function(lang){
            	mobileDS.LanguageManager.getInstance().setLanguage(lang);
            },
			/**
			 * Returns the value of a property.
			 *  
			 * @function get
			 * @param {String} propertyName The name of the property
			 * @returns {Object} The value of the property
			 * @public
			 */
            get: function(propertyName){
            	if(configData){
            		return configData[propertyName];
            	}
            },
			/**
			 * Sets a property to a given value.
			 *  
			 * @function set
			 * @param {String} propertyName The name of the property
			 * @param {Object} value The value of the property
			 * @public
			 */
            set: function(propertyName,value){
            	if(!configData){
            		configData = new Object();
            	}
            	configData[propertyName] = value;
            }
            
        };
    }
    return {
        /**
         * Object containing the instance of the class {@link mobileDS.ConfigurationManager} 
         * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.ConfigurationManager}
         * @public
         */
        getInstance: function(){
            if (instance == null) {
                instance = constructor();
            }
            return instance;
        }
    };
    
})();
