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
 * @module mobileDS.javascripts.manager
 * 
 */
var mobileDS = window.mobileDS ||
{};

/**
 * A class for managing the language of the application. <br>
 * It's purpose is to load the controllers and their views / partials and provide functions to find controllers or
 * perform actions or helper-actions.
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.ControllerManager.getInstance()</code>
 * @class LanguageManager
 * @category core
 * 
 * @see mobileDS.LanguageManager#constructor
 */
mobileDS.LanguageManager = (function(){
	
    /**
     * Object containing the instance of the class {@link mobileDS.LanguageManager} 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance = null;

    
    /**
     * JSON object containing the contents of a dictionary file - which are found in 'config/languages/&lt;language&gt;/dictionary.dic'.
     * 
     * @property dictionary
     * @type JSON
     * @private
     */
    var dictionary = null;

    
    /**
     * A String holding the currently loaded language, e.g. "en".
     * 
     * @property currentLanguage
     * @type String
     * @private
     */
    var currentLanguage = null;
    
    /**
     * A JSON-Object holding the information on the currently loaded speaker.
     * 
     * @property currentSpeaker
     * @type JSON-Object
     * @private
     */
    var currentSpeaker = null;
    
    /**
     * An array of all available languages.
     * 
     * @property languages
     * @type Array
     * @private
     */
    var languages = null;
    
    /**
     * A keyword which can be used in views (ehtml) to display the current language.<br>
     * If this keyword is used inside a view or partial, it is replaced by the current language string.
     * 
     * @property keyword_current_language
     * @type String
     * @private
     * @example @localize('current_language')
     * 
     */
	var keyword_current_language = 'current_language';
	

	/**
	 * Constructor-Method of Class {@link mobileDS.LanguageManager}.<br>
	 * If no language is supplied as parameter, then the property *language* from {@link mobileDS.Configuration} is used 
	 * or the first language found in the language directory. 
	 * 
	 * @param {String} lang The language which should be used throughout the application.
	 * 
	 * @constructor
	 * @augments mobileDS.LanguageManager
	 * @memberOf mobileDS.LanguageManager.prototype
	 */
	function constructor(lang){
    	if ((!lang || lang.length < 1) && (!currentLanguage || currentLanguage.length < 1)){
    		// var appLang = mobileDS.ConfigurationManager.getInstance().getLanguage();
    		var appLang = mobileDS.constants.getInstance().getLanguage();
    		if (appLang && appLang.length > 0){//applicationLanguage.length > 0){
    			lang = appLang;//applicationLanguage;
    			// console.info("[LanguageManager] No language specified. Using language from mobileDS.ConfigurationManager '" + appLang +"'.");//applicationLanguage + "'.");
    			console.info("[LanguageManager] No language specified. Using language from mobileDS.constants '" + appLang +"'.");//applicationLanguage + "'.");
    		} else {
    			if (languages.length > 0){
    				console.info("[LanguageManager] No language specified. Using first language in directory '"+mobileDS.constants.getInstance(forBrowser).getLanguagePath()+"': '" + languages[0] + "'.");
    			} else {
    				console.warn("[LanguageManager] No language specified. And no language could be read from directory '"+mobileDS.constants.getInstance(forBrowser).getLanguagePath()+"'.");
    			}
    		}
    	}

    	
    	/**
    	 * Function to set a new language, but only, if the new language is different from the current language.
    	 * 
    	 * @function setLanguage
    	 * @param {String} lang The language of the dictionary which should be loaded.
    	 * @returns {String} The (new) current language
    	 * @private
    	 */
    	function setLanguage(lang){
        	if ((lang) && (currentLanguage != lang)){
        		loadDictionary(lang);
        		loadSpeaker(lang);
        		requestGrammar(lang);
        	}
        	return currentLanguage;
        }
    	
    	
    	function doCheckExistsGrammarForLanguage(lang){
    		var langFiles = null;
    		var retValue = false;
    		
    		if (lang != null){
    			langFiles = mobileDS.CommonUtils.getInstance().getDirectoryContents(mobileDS.constants.getInstance(forBrowser).getLanguagePath() + lang);
    			if (langFiles != null){
    				if (langFiles.indexOf(mobileDS.constants.getInstance(forBrowser).getGrammarFilename()) > -1){
    					retValue = true;
    				}
    			} 
    		} 
    		return retValue;
    	}
        
    	/**
    	 * Request grammar for the provided language. 
    	 * 
    	 * If there is no grammar available for the requested language, no
    	 * new grammar is set.
    	 * 
    	 * A grammar is available, if at least one of the following is true for the requested language
    	 * <ul>
    	 * 	<li>there exists a JSON grammar file (with correct name and at the correct location)</li>
    	 * 	<li>there exists a compiled JavaScript grammar file (with correct name and at the correct location)</li>
    	 * </ul>
    	 * 
    	 * TODO document location for JSON and JavaScript grammar files
    	 * 
    	 * @function requestGrammar
    	 * @param {String} lang The language of the grammar which should be loaded.
    	 * @returns {String} The current grammar language
    	 * @async
    	 * @private
    	 */
    	function requestGrammar(lang){
    		
    		if(mobileDS.SemanticInterpreter.getInstance().hasGrammar(lang) || doCheckExistsGrammarForLanguage(lang)){
    			mobileDS.SemanticInterpreter.getInstance().setCurrentGrammar(lang);
    			return lang;
    		}
    		
    		return mobileDS.SemanticInterpreter.getInstance().getCurrentGrammar();
    	}
    		/**
    	 * Loads the speaker info for the provided language and updates the current language. 
    	 * 
    	 * @function loadSpeaker
    	 * @param {String} lang The language of the speaker info which should be loaded.
    	 * @returns {String} The (new) current language
    	 * @async
    	 * @private
    	 */
        function loadSpeaker(lang){
        	
        	if (lang && currentLanguage != lang){
            	currentLanguage = lang;
        	}
            $.ajax({
                async: false,
                dataType: "json",
                url: mobileDS.constants.getInstance(forBrowser).getLanguagePath()+lang+"/"+mobileDS.constants.getInstance(forBrowser).getSpeakerFilename(), // languagePath + lang + "/dictionary.dic",
                success: function(data){
//                	console.log("[LanguageManager] Success. " + data);
                    currentSpeaker = data;//jQuery.parseJSON(data);
//                  console.log("[LanguageManager] " + JSON.stringify(dictionary));
                },
                error: function(data) {
            		// print out an error message
            		console.error("[LanguageManager] Error. " + data); //error
                }
            });
            return currentLanguage;
        }
        
    	/**
    	 * Loads the dictionary for the provided language and updates the current language. 
    	 * 
    	 * @function loadDictionary
    	 * @param {String} lang The language of the dictionary which should be loaded.
    	 * @returns {String} The (new) current language
    	 * @async
    	 * @private
    	 */
        function loadDictionary(lang){
        	
        	if (lang && currentLanguage != lang){
            	currentLanguage = lang;
        	}
            $.ajax({
                async: false,
                dataType: "json",
                url: mobileDS.constants.getInstance(forBrowser).getLanguagePath()+lang+"/"+mobileDS.constants.getInstance(forBrowser).getDictionaryFilename(), // languagePath + lang + "/dictionary.dic",
                success: function(data){
//                	console.log("[LanguageManager] Success. " + data);
                    dictionary = data;//jQuery.parseJSON(data);
//                  console.log("[LanguageManager] " + JSON.stringify(dictionary));
                },
                error: function(data) {
            		// print out an error message
            		console.error("[LanguageManager] Error. " + data); //error
                }
            });
            return currentLanguage;
        }

        // get all the languages/dictionaries by name
        languages = mobileDS.CommonUtils.getInstance().getDirectoryContents(mobileDS.constants.getInstance(forBrowser).getLanguagePath());
        
        if(IS_DEBUG_ENABLED) console.debug("[LanguageManager] Found dictionaries for: " + JSON.stringify(languages));//debug
        
        loadDictionary(lang);
        loadSpeaker(lang);
        requestGrammar(lang);
                	
    	/**
    	 * Translates a keyword using the current dictionary and returns the translation.
    	 * 
    	 * @function internalGetText 
    	 * @param {String} textVarName The keyword which should be looked up
    	 * @returns {String} the translation of the keyword
    	 * @private
    	 */
        function internalGetText(textVarName){
        	var translated = "";
//			console.log("[translate] " + JSON.stringify(textVarName));
			if (dictionary[textVarName] && dictionary[textVarName].length > 0){
				translated = dictionary[textVarName];
//              	console.log("[Dictionary] '" + textVarName + "' found in " + JSON.stringify(dictionary));
			}
			else if (textVarName === keyword_current_language){
				translated = currentLanguage;
			}
			else {
				translated = "undefined";
              	console.warn("[Dictionary] '" + textVarName + "' not found in " + JSON.stringify(dictionary));
          	}
			return translated;
        }
        
        /** @lends mobileDS.LanguageManager.prototype */
        return {
        	/**
        	 * <b>unused</b><br>
        	 * Returns the dictionary of the currently used language. 
        	 *  
        	 * @function getDictionary
        	 * @returns {Array} The dictionary of the currently used language 
        	 * @public
        	 */
        	getDictionary: function(){
        		return dictionary;
        	},
        	
        	/**
        	 * If a dictionary exists for the given language, 'true' is returned. Else 
        	 * the method returns 'false'. 
        	 *  
        	 * @function existsDictionaryForLanguage
        	 * @returns {Boolean} True if a dictionary exists for given language. 
        	 * @param {String} Language String, i.e.: en, de 
        	 * @public
        	 */
        	existsDictionaryForLanguage: function(lang){
        		var langFiles = null;
        		var retValue = false;
        		
        		if (lang != null){
        			langFiles = mobileDS.CommonUtils.getInstance().getDirectoryContents(mobileDS.constants.getInstance(forBrowser).getLanguagePath() + lang);
        			if (langFiles != null){
        				if (langFiles.indexOf(mobileDS.constants.getInstance(forBrowser).getDictionaryFilename()) > -1){
        					retValue = true;
        				}
        			} 
        		} 
        		return retValue;
        	},
        	
        	/**
        	 * If a Speaker exists for the given language, 'true' is returned. Else 
        	 * the method returns 'false'. 
        	 *  
        	 * @function existsDictionaryForLanguage
        	 * @returns {Boolean} True if a Speaker exists for given language. 
        	 * @param {String} Language String, i.e.: en, de 
        	 * @public
        	 */
        	existsSpeakerForLanguage: function(lang){
        		var langFiles = null;
        		var retValue = false;
        		
        		if (lang != null){
        			langFiles = mobileDS.CommonUtils.getInstance().getDirectoryContents(mobileDS.constants.getInstance(forBrowser).getLanguagePath() + lang);
        			if (langFiles != null){
        				if (langFiles.indexOf(mobileDS.constants.getInstance(forBrowser).getSpeakerFilename()) > -1){
        					retValue = true;
        				}
        			} 
        		} 
        		return retValue;
        	},
        	
        	/**
        	 * If a grammar exists for the given language, 'true' is returned. Else 
        	 * the method returns 'false'. 
        	 *  
        	 * @function existsGrammarForLanguage
        	 * @returns {Boolean} True if a grammar exists for given language. 
        	 * @param {String} Language String, i.e.: en, de 
        	 * @public
        	 */
        	existsGrammarForLanguage: doCheckExistsGrammarForLanguage,
        	
			/**
			 * Chooses a language for the application:
			 * 1) check if a default language exists
			 *    if it does and if both (!) grammar and dictionary exist for this language, return this language
			 * 2) walk through all languages alphabetically
			 *  2.1) if for a language both (!) grammar and dictionary exist, return this language
			 *       memorize the first language with a grammar (do not care, if a dictionary exists)
			 * 3) test if a grammar exists for the default language - do not care about dictionaries - if it does, return the default language
			 * 4) If a language was found (in Step 2.1) return this language
			 * 5) If still no language is returned take the default language if it has a dictionary
			 * 6) If a language exists, take it (the first one)
			 * 7) Take the default language - no matter what
			 *  
			 * @function determineLanguage
			 * @returns {String} The determined language  
			 * @public
			 */
            determineLanguage: function(lang){
            	var tempLanguage = lang;
            	var firstLanguageWithGrammar = null;
            	
            	// first check, if language - given in parameter - exists
            	if (tempLanguage != null) {
            		// check if both grammar and dictionary exist for given language 
            		if (mobileDS.LanguageManager.getInstance().existsGrammarForLanguage(tempLanguage) && mobileDS.LanguageManager.getInstance().existsDictionaryForLanguage(tempLanguage)){
            			return tempLanguage;
            		}
            	}
            	
            	tempLanguage = mobileDS.constants.getInstance().getLanguage();
            	// then check, if default language exists
            	if (tempLanguage != null) {
            		// check if both grammar and dictionary exist for default language 
            		if (mobileDS.LanguageManager.getInstance().existsGrammarForLanguage(tempLanguage) && mobileDS.LanguageManager.getInstance().existsDictionaryForLanguage(tempLanguage)){
            			return tempLanguage;
            		}
            	}
            	// walk through the languages alphabetically
    			for (var i=0; i<languages.length; i++){
    				tempLanguage = languages[i];
        			// check if a grammar and dictionary exists for every language
        			if (mobileDS.LanguageManager.getInstance().existsGrammarForLanguage(tempLanguage)){
        				
        				// memorize the first language with a grammar (for later)
        				if (firstLanguageWithGrammar == null){
        					firstLanguageWithGrammar = tempLanguage;
        				}
        				
            			if (mobileDS.LanguageManager.getInstance().existsDictionaryForLanguage(tempLanguage)){
                			return tempLanguage;
            			}
        			}
    			}
    			
    			// still no language found - take the default language and test if a grammar exists
    			tempLanguage = mobileDS.constants.getInstance().getLanguage();
            	if (tempLanguage != null) {
            		// check if both grammar and dictionary exist for default language 
            		if (mobileDS.LanguageManager.getInstance().existsGrammarForLanguage(tempLanguage)){
            			return tempLanguage;
            		} else if (firstLanguageWithGrammar != null){
            			return firstLanguageWithGrammar;
            		} else if (mobileDS.LanguageManager.getInstance().existsDictionaryForLanguage(tempLanguage)){
            			return tempLanguage;
            		}
            	}

            	// still no language - take the first one
            	tempLanguage = languages[0];
            	if (tempLanguage != null){
            		return tempLanguage;
            	} 
	
            	return mobileDS.constants.getInstance().getLanguage();
            },

            
			/**
			 * Sets a new language, but only, if the new language is different from the current language.
			 *  
			 * @function setLanguage
			 * @returns {String} The (new) current language
			 * @public
			 */
            setLanguage: function(lang){
            	return setLanguage(lang);
            },

            
            /**
             * Gets the language currently used for the translation.
             *  
             * @function getLanguage
             * @returns {String} The current language
             * @public
             */
            getLanguage: function(){
            	return currentLanguage;
            },
            
            /**
             * Gets the language currently used for the translation.
             *  
             * @function getCurrentLanguage
             * @returns {String} The current language
             * @public
             */
            getCurrentLanguage: function(){
            	return currentLanguage;
            },
            
            
			/**
			 * Gets the default language.
			 *  
			 * @function getDefaultLanguage
			 * @returns {String} The default language
			 * @public
			 */
            getDefaultLanguage: function(){
            	return mobileDS.constants.getInstance().getLanguage();
            },

            
			/**
			 * <div class="box important">
			 * <b>Note:</b>
			 * At the moment this function is used by controllers/application.js:available_languages which in turn is 
			 * used by helpers/applicationHelper.js to generate the language menu.<br>
			 * This process shall be replaced by a version using a partial as a language menu template!
			 * </div>
			 * Gets an array of all for the translation available languages.<br>
			 * 
			 *  
			 * @function getLanguages
			 * @returns {String} An array of all for the translation available languages
			 * @public
			 */
            getLanguages: function(){
            	return languages;
            },
            
            
			/**
			 * Cycles through the available languages.
			 *  
			 * @function cycleLanguages
			 * @returns {String} The (new) current language
			 * @public
			 * @deprecated unused
			 */
            cycleLanguages: function(){
            	var indexCurrentLanguage = languages.indexOf(currentLanguage);
            	
            	if(IS_DEBUG_ENABLED) console.debug("[LanguageManager] Current language is " + currentLanguage);//debug
            	
            	if (indexCurrentLanguage > -1){
            		indexCurrentLanguage = indexCurrentLanguage + 1;
            		if (indexCurrentLanguage > languages.length - 1){
            			indexCurrentLanguage = 0;
            		}
            		currentLanguage = languages[indexCurrentLanguage];
            		
            		if(IS_DEBUG_ENABLED) console.debug("[LanguageManager] Next language is " + currentLanguage);//debug
            		loadSpeaker(currentLanguage);
            		return loadDictionary(currentLanguage);
            	}
            },

			/**
			 * This function is used to localize the view description (ehtml) before they are displayed.
			 * 
			 * @function translateHTML
			 * @param {String} html The (HTML) string which is to be localized into the currently used language  
			 * @returns {String} The localized (HTML) string 
			 * @public
			 */
            translateHTML: function(html){
            	var translationRegExp = mobileDS.CommonUtils.getInstance().getTranslationRegExp();
            	if (html.match(translationRegExp)){
            		while (tre = translationRegExp.exec(html)) {
            			var translated = internalGetText(tre[1]);
            			html = html.replace(tre[0], translated);
            		}
            	}
            	return html;
            },
            

			/**
			 * Looks up a keyword in the current dictionary and returns the translation.
			 * 
			 * @function getText
			 * @param {String} textVarName The keyword which is to be translated 
			 * @returns {String} The translation of the keyword
			 * @public
			 */
            getText : function(textVarName){
            	return internalGetText(textVarName);
            },
            
            /**
             * @returns {JSON-Object} The current Speaker Code
             */
            getSpeaker: function(){
            	return currentSpeaker;
            },

			/**
			 * <div class="box important">
			 * <b>Note:</b>
			 * Momentarily this function is used by 'helpers/applicationHelper.js' to generate a menu to choose the application language.<br>
			 * This should better be implemented as a partial.
			 * </div>
			 * 
			 * This function changes the application language and if wanted renders the current view again, so that 
			 * the change of the language is applied to the currently displayed view. 
			 * And after that an event "language_choosen" (typo) is raised.<br>
			 * 
			 * @function changeLanguage
			 * @param {String} newLang The new language which is to be used henceforth
			 * @param {Boolean} rerenderview Should the currently displayed view be rendered again in the new language?
			 * @returns {String} The translation of the keyword
			 * @public
			 */
            changeLanguage: function(newLang, rerenderview) {
            	
            	if(IS_DEBUG_ENABLED) console.debug("[Language] selected " + newLang);//debug
            	
        		mobileDS.LanguageManager.getInstance().setLanguage(newLang);
//            	applicationLanguage = mobileDS.LanguageManager.getInstance().setLanguage(newLang);
            	
            	if (rerenderview == true){
                	mobileDS.PresentationManager.getInstance().rerenderView();
            	}
                //mobileDS.DialogEngine.getInstance().raiseEvent("language_choosen");
            }
        };
    }
    
    
    return {
        /**
         * Object containing the instance of the class {@link mobileDS.LanguageManager} 
         * 
         * @function getInstance
         * @param {String} lang Optional parameter to set the used language to lang
         * @returns {Object} Object containing the instance of the class {@link mobileDS.LanguageManager}
         * @public
         */
        getInstance: function(lang){
            if (instance === null) {
                instance = constructor(lang);
            } else if (currentLanguage != lang){
            	instance.setLanguage(lang);
            }
            return instance;
        }
    };
    
})();

