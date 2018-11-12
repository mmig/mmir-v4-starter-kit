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

define(['mmirf/constants', 'mmirf/grammarConverter', 'mmirf/logger', 'module', 'require'
        ], 
	/**
	 * @name SemanticInterpreter
	 * @memberOf mmir
	 * @static
	 * @class
	 * 
	 * @requires require
	 */
	function (
		constants, GrammarConverter, Logger, module, require
){
	
	/**
	 * The instance for the singleton SemanticInterpreter
	 * 
	 * @type SemanticInterpreter
	 * @private
	 * 
     * @memberOf SemanticInterpreter#
	 */
	var instance = null;

	/**
	 * @private
	 * @type Logger
     * @memberOf SemanticInterpreter#
	 */
	var logger = Logger.create(module);
	
	/**
     * The version number for the format of generated (JavaScript) grammars.
     * 
     * This number is "written into" the generated grammars and then
     * used as argument, when the grammar adds itself via
     * <code>addGrammar(id, func, versionNumber)</code>.
     * 
     * See generator function build_grammar() within createAndAddGrammar().
     * 
     * NOTE: This version number must be increased, when way changes, how 
     *       grammars are generated.
     *       Or more precisely: when previously generated grammars cannot
     *       be used anymore, after the generation mechanism has been changed.
     * 
     * @constant
     * @private
     * 
     * @memberOf SemanticInterpreter#
     */
    var GRAMMAR_FILE_FORMAT_VERSION = 5;
    
    
    /**
     * @constructs SemanticInterpreter
     * @memberOf SemanticInterpreter#
     * @private
     * @ignore
     */
    function constructor(){
    	
	    /**
	     * "map" for grammar implementations (e.g. for different languages)
	     * 
	     * @private
	     * 
	     * @memberOf SemanticInterpreter#
	     */
	    var grammarImplMap = {};
	    /**
	     * list of IDs for grammar implementations (e.g. for different languages).
	     * 
	     * This list contains the "keys" of all current entries in <tt>grammarImplMap</tt>.
	     * 
	     * @private
	     * @type Array<String>
	     * 
	     * @memberOf SemanticInterpreter#
	     */
	    var grammarImplList = [];
	    
	    /**
	     * id (i.e. the <em>key</em> for map <tt>grammarImplMap</tt>) for currently used
	     * grammar.
	     * 
	     * If for invocations of interpret(..) etc. function the ID/languageCode
	     * argument is missing/omitted, then this id will be used.
	     * 
	     * NOTE: if not <tt>NULL</tt>, the grammar must be available, either
	     * 		 as compiled JS file (which must be already loaded, i.e. already present in <tt>grammarImplMap</tt>), or
	     * 		 as JSON grammar file (which must be available at <tt>/config/languages/[ID]/grammar.json</tt>
	     * 
	     * @type String
	     * @private
	     * 
	     * @memberOf SemanticInterpreter#
	     */
	    var currentGrammarId = null;
	    
	    /**
	     * @type String
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
	    var currentGrammarEningeId = null;

	    /**
	     * If true, the async versions of the grammar engines are loaded,
	     * i.e. compilation of grammar parsers will be asynchronously done in a WebWorker
	     * 
	     * @type Boolean
	     * @private
	     * @default false
	     * @memberOf SemanticInterpreter#
	     */
	    var _isAsyncCompileMode = false;
	    
	    /**
	     * @type String
	     * @constant
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
	    var DEFAULT_GRAMMAR_ENGINE = 'jscc';
	    /**
	     * @type String
	     * @constant
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
	    var GRAMMAR_MODULE_ID_PREFIX = 'mmirf/';
	    /**
	     * @type String
	     * @constant
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
	    var GRAMMAR_MODULE_ID_POSTFIX = 'Gen';
	    /**
	     * @type String
	     * @constant
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
	    var GRAMMAR_ASYNC_MODULE_MODIFIER = 'Async';
	    
	    /**
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
	    var doSetGrammarEngine = function(id, asyncCompileMode){
	    	
	    	currentGrammarEningeId = id;
	    	
	    	if(typeof asyncCompileMode !== 'undefined'){
	    		_isAsyncCompileMode = !!asyncCompileMode;
	    	}
	    };
	    /**
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
	    var doGetGrammarEngine = function(){
	    	if(currentGrammarEningeId){
		    	return currentGrammarEningeId;	
	    	}
	    	return DEFAULT_GRAMMAR_ENGINE;
	    };
    	
	    /**
	     * Flag for enabling/disabling processing of SemanticInterpreter.
	     * 
	     * If disabled, interpret(), removeStopwords() will return <tt>null</tt> values. 
	     * 
	     * NOTE: if no grammar for any language is available, the SemanticInterpreter should be disabled.
	     * 
	     *  Setting a language, automatically enables the the SemanticInterpreter.
	     * 
	     * @type Boolean
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
	    var _isEnabled = false;
	    

	    /**
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
	    var doSetEnabled = function(isEnabled){
        	_isEnabled = isEnabled;
        };

	    /**
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
        var doCheckIsEnabled = function(){
        	return _isEnabled;
        };
	    
	    /**
	     * 
	     * NOTE: if no other grammar is available yet, <tt>currentGrammarId</tt> will be set to <tt>id</tt>.
	     * 
	     * NOTE: if currently disabled, calling this function automatically enables ( setEnabled(TRUE) ),
	     * 		 the semantic interpreter.
	     * 
	     * @function
	     * @param id {String} ID for the grammar (e.g. an ISO-639 language code)
	     * @param grammarImpl {GrammarConverter|Function} the executable JavaScript grammar implementation
	     * 					IF {GrammarConverter}: the impl. with valid member {Function} {@link GrammarConverter.executeGrammar()}
	     * 					IF {Function}: the {Function} {@link GrammarConverter.executeGrammar()} - 
	     * 									In this case, if no GrammarConverter instance fo <tt>id</tt> is present, a new one will be created; 
	     * 									The stopwords must already be set, be part of the options-argument 
	     * 									  (see doc for <code>fileFormatNo</code>), or must additionally be set for the GrammarConverter 
	     * 									  instance (e.g. using {@link mmir.SemanticInterpreter.setStopwords})
	     * @param {Number|PlainObject} [fileFormatNo] OPTIONAL
		 * 					If Number and the number given does not match {@link #GRAMMAR_FILE_FORMAT_VERSION}
		 * 					the file format is assumed to be out-dated and an Error will be thrown.
		 * 					
		 * 					If PlainObject, i.e. an options object, the following properties are evaluated
		 * 					(all properties are optional):
		 * 					<code>fileFormat: NUMBER, default: undefined</code>
		 * 						(desc. see above)
		 * 					<code>execMode: 'sync' | 'async', default: 'sync'</code>
		 * 						if 'async' then the grammar is executed asynchronously, i.e. interpret()
		 * 						must be invoked with a callback function in order to retrieve the result
		 * 					<code>stopwords: Array<string>, default: null</code>
		 * 						if given, the grammar (GrammarConverter) will be set with this stopword list, i.e. <code>grammar.setStopwords(stopwords)</code>
		 * 
	     * @throws Error if <code>fileFormatNo</code> is given, but does not match GRAMMAR_FILE_FORMAT_VERSION.
	     * 
	     * @private
	     * @memberOf SemanticInterpreter#
	     */
    	var doAddGrammar = function(id, grammarImpl, fileFormatNo){
    		
    		var execMode = 'sync';
    		var stopwords = null;
    		if(fileFormatNo && typeof fileFormatNo === 'object'){
    			
    			execMode = fileFormatNo.execMode;
    			stopwords = fileFormatNo.stopwords;
    			
    			//lastly: overwrite fileFormatNo with the corresponding property:
    			fileFormatNo = fileFormatNo.fileFormat;
    			
    		}
    		
    		//check if the added grammar has correct format
    		if(fileFormatNo && fileFormatNo != GRAMMAR_FILE_FORMAT_VERSION){
    			
    			//grammar has old / out-dated format:
    			throw new Error('Grammar file has wrong format: need grammar file with format version '
    					+GRAMMAR_FILE_FORMAT_VERSION+', but got: '+fileFormatNo
    					+ '. Please update generated grammar (delete '
    					+ constants.getGeneratedGrammarsPath() +' and re-build grammars).'
    			);
    		}
        	
    		//the grammar function must be "wrapped" in a GrammarConverter instance
    		// ... if not, do so now:
        	if( ! (grammarImpl instanceof GrammarConverter)){
        		var gc = doGetGrammar(id, true);
        		
        		//if for this ID (= language code) no grammar-converter
        		// exists yet, create a now one
        		// (otherwise, re-use the existing one)
        		if(!gc){
        			gc = new GrammarConverter();
        		}
        		gc.setGrammarFunction(grammarImpl, execMode === 'async');
        		grammarImpl = gc;
        	}
        	
        	var isAlreadyPresent = checkHasGrammar(id);
        	grammarImplMap[id] = grammarImpl;
        	
        	if( ! isAlreadyPresent){
        		
        		//DISABLED: this may produce side effects (now: current grammar must be explicitly set using setCurrentGrammar(lang))
//	        	if(grammarImplList.length === 0){
//	        		currentGrammarId = id;
//	        	}
	        	grammarImplList.push(id);
        	}
        	
        	if(stopwords){
        		grammarImpl.setStopWords(stopwords);
        	}
        	
        	doSetEnabled(true);
        };
        
        /**
	     * @private
	     * @memberOf SemanticInterpreter#
         */
        var doSetStopwords = function(id, stopwordArray){
        	doGetGrammar(id).setStopWords(stopwordArray);
        };
        /**
         * HELPER retrieve the executable grammar:
         * if already loaded, return the grammar instance, otherwise load & compile.
         * 
         * @param {String} id
         * 		the ID (e.g. language code) for the grammar
         * @param {Boolean} [doNotResolve] OPTIONAL
         * 		if <code>false</code> AND the request grammar is not loaded yet,
         * 		then the grammar will NOT be loaded (if omitted or <code>true</code>
         * 		missing grammars will automatically be loaded and compiled)
         * @param {Function} [callback] OPTIONAL
         * 		if grammar has to be loaded (and compiled), the provided callback
         * 		will be called, after completion.
         * 
         * @return {GrammarExecFunction}
         * 			the exectuable grammar (i.e. execution function), if the grammar is
         * 			already loaded (if grammar has to loaded and compiled, you need to
         * 			wait for the callback-call and then re-invoke doGetGrammar()).
         * 
	     * @private
	     * @memberOf SemanticInterpreter#
         */
        var doGetGrammar = function(id, doNotResolve, callback){//NOTE: this should stay private
        	
        	if(!id){
        		if(!currentGrammarId){
        			throw 'Could not retrieve grammar: required grammar ID is missing';
        		}
        		else {
        			id = currentGrammarId;
        		}
        	}
        	
        	//shift arguments, if necessary:
        	if(!callback && typeof doNotResolve === 'function'){
        		callback = doNotResolve;
        		doNotResolve = false;
        	}
        	
        	var isDefaultCallback = false;
        	if(!callback && logger.isInfo()){
        		//create a "debug-info callback"
        		isDefaultCallback = true;
        		callback = function(){
        			if(logger.isInfo()) logger.info('created executable grammar for "'+id+'" from source '+jsonGrammarUrl);
        		};
        	}
        	
        	if(!doNotResolve && ! checkHasGrammar(id) ){
        		var jsonGrammarUrl = instance.get_json_grammar_url(id);
        		
        		createAndAddGrammar(jsonGrammarUrl, id, callback);
        	}
        	else if(callback && !isDefaultCallback){
        		callback();
        	}
        	
        	return grammarImplMap[id];
        };
        /**
         * @private
	     * @memberOf SemanticInterpreter#
         */
        var checkHasGrammar = function(id){
        	return typeof grammarImplMap[id] !== 'undefined';
        };
        /**
	     * @private
	     * @memberOf SemanticInterpreter#
         */
        var doRemoveGrammar = function(id){
        	
        	if( checkHasGrammar(id) ){
        		
        		//remove from impl.-map:
	        	delete grammarImplMap[id];
	        	
	        	//remove from ID-list
	        	for(var i=0, size = grammarImplList.length; i < size; ++i){
	        		if(grammarImplList[i]==id){
		        		grammarImplList.splice(i, 1);
	        			break;
	        		}
	        	}
        	}
        };
        
        
        //TODO move create/build into GrammarConverter
    	/**
         * @param {String|JSONObject} doRecompile
         * 					IF {String}: the String's contents will be used as a String-representation of the JSON grammar
         * 					IF {Object}: the Object will be used as JSON representation for the grammar 
         * 
         * @param {String} [generatedParserLanguageCode] OPTIONAL 
         * 					if param doRecompile is used, this String specifies the 
         * 					   language for the generated grammatic-parser. If omitted, the default "de" (German) will be used.
         * 					NOTE: this must be a valid ISO language code!
         * 
         * @param {Function} [callback] OPTIONAL
         * 							a callback that is invoked after the grammar was created and added to the SemanticInterpreter. 
         * 							The callback-function will be invoked without arguments, i.e. <code>callback();</code>
         * @function
         * 
	     * @private
	     * @memberOf SemanticInterpreter#
         */
        function createAndAddGrammar(doRecompile, generatedParserLanguageCode, callback){
        	
        	var gc = new GrammarConverter();
        	
        	//callback that will be used after the JSON file for the grammar was loaded:
        	function build_grammar(theConverterInstance){//<- argument is the GrammarConverter instance
        	    
        		var genId   = doGetGrammarEngine();//one of ['jscc' | 'pegjs' | 'jison'];
        		var genName = GRAMMAR_MODULE_ID_PREFIX + genId + (_isAsyncCompileMode? GRAMMAR_ASYNC_MODULE_MODIFIER : '') + GRAMMAR_MODULE_ID_POSTFIX;
        		
        		var onModuleLoaded = function onLoad(gen){ 
        			
        			//initialize the generator (initialization may be async -> need callback/Promise)
        			// (-> if already initialized, the then-callback will be invoked immediately)
        			gen.init().then(function onInit(){
        				
        				//actually start compilation of the grammar definition:
        				// usually this involves 2 steps: 
        				//    (1) converting the JSON grammar into a specific ParserParser syntax (e.g. JS/CC syntax)
        				//    (2) compiling this syntax using the corresponding Parser-Generator
        				// -> the resulting parser-function will then be registered on the SemanticInterpreter instance
        				//    (using its addGrammar() function) along with the stopword definition (using the setStopwords() function)
        				gen.compileGrammar(theConverterInstance, generatedParserLanguageCode, GRAMMAR_FILE_FORMAT_VERSION, function onCompiled(convertedInstance){
	        		        
        					//add the grammar-parser-text and grammar-definition-text to the newly registered Grammar-instance
        					// (-> registering is done within the compileGrammar() function!)
	        		        var registeredGrammarInstance = doGetGrammar(generatedParserLanguageCode, true);
	        		        if(registeredGrammarInstance){
		        		        registeredGrammarInstance.setGrammarSource(convertedInstance.getGrammarSource());
		        		        registeredGrammarInstance.setGrammarDef(convertedInstance.getGrammarDef());
	        		        }
	        		        else {
	        		        	logger.error('A problem occured during generation of grammar for "'+generatedParserLanguageCode+'"');
	        		        }
	        		        
	        		        //invoke callback if present:
	        		        if(callback){
	        		        	callback(registeredGrammarInstance);
	        		        }
        				});
        			});
        			
        		};//END: onModuleLoaded([jsccGen])
        		
        		require([genName], onModuleLoaded, function(err){
        			
        			//if async-module could not be loaded, try sync-module
        			if(_isAsyncCompileMode){
        				
        				logger.warn('Cannot use asynchronous compilation for '+genId+
        						': no async module available, using sync compilation instead...'
        				);
        				genName = GRAMMAR_MODULE_ID_PREFIX + genId + GRAMMAR_MODULE_ID_POSTFIX;
        				
        				require([genName], onModuleLoaded);
        			}
        		});
                
            }//END function build_grammar
        	
        	if(typeof doRecompile === 'string'){// arg. is URL for JSON grammar definition

        		//interpret STRING as URL for the JSON grammar:
        		gc.loadGrammar(build_grammar, function(err){

        			var errMsg = err;
        			if(err){
        				if(err.stack){
        					errMsg = err.stack;
        				} else {
        					try{
        						errMsg = JSON.stringify(err);
        					} catch(e){}
        				}
        			}
        			
        			throw 'Could not find JSON grammar file at "'+doRecompile+'": '+errMsg;
        		}, doRecompile, true
        		);
        	} else if(typeof doRecompile === 'object'){// arg. is JSONObject (ie. JSON grammar definition)
            	
            	//ASSERT if doRecompile === null => throws error!
            	
            	gc.json_grammar_definition = doRecompile;
            	build_grammar(gc);
            	
            } else {
            	logger.error('SemanticInterpreter.__createAndAddGrammar: could not build grammar due to missing argumens');
            }
        }
        
        /**
	     * @private
	     * @memberOf SemanticInterpreter#
         */
        var process_asr_semantic = function(phrase, langCode, callback){

			if(!doCheckIsEnabled()){
				logger.warn('SemanticInterpreter.interpret: currently disabled!');
				return null;
			}
			
			if(typeof langCode === 'function'){
				callback = langCode;
				langCode = void(0);
			}
        	
			var execGrammar = function(grammarConverter, phrase, langCode, callback){

	    		//pre-process pharse (e.g. mask umlauts, remove stopwords)
				var positions = {};//<- for storing modification information during pre-processing
	            var strPreparedPhrase = grammarConverter.preproc( phrase.toLowerCase(), positions );
	           
	            if(logger.isDebug()) logger.debug('SemanticInterpreter.process_asr_semantic('+langCode+'): removed stopwords, now parsing phrase "'+strPreparedPhrase+'"');//debug
	            
	            if(callback){

		    		grammarConverter.executeGrammar( strPreparedPhrase, function(result){
		    			
		    			//post-process result (e.g. unmask umlauts etc)
			    		result = grammarConverter.postproc(
			    				result
			    		);
			    		result.preproc = positions;
			            
			            callback(result);//TODO return copy instead of original instance?
			            
		    		} );
		            
		    		
		            
	            } else {
	            	
		    		var result = grammarConverter.executeGrammar( strPreparedPhrase );
		            
		    		//post-process result (e.g. unmask umlauts etc)
		    		result = grammarConverter.postproc(
		    				result
		    		);
		    		result.preproc = positions;
		            
		            return result;//TODO return copy instead of original instance?
	            }
	            
        	};
        	
			var grammarReadyCallback;
			if(callback){
				
				grammarReadyCallback = function(){
					
					var grammarConverter = doGetGrammar(langCode);
					
					if(grammarConverter.isAsyncExec()){
						execGrammar(grammarConverter, phrase, langCode, callback);	
					} else {
						callback(execGrammar(grammarConverter, phrase, langCode));
					}
				};
			}
			
        	var grammarConverter = doGetGrammar(langCode, grammarReadyCallback);
        	
        	if(!grammarConverter && ! grammarReadyCallback){
    			throw 'NoGrammar_'+langCode;
    		}
        	
        	if(!grammarReadyCallback){
        		return execGrammar(grammarConverter, phrase, langCode);
        	}
        };
    	
        /**
	     * @private
	     * @memberOf SemanticInterpreter#
         */
		var doRemoveStopWords = function(thePhrase, lang, stopwordFunc){
			if(!doCheckIsEnabled()){
				logger.warn('SemanticInterpreter.doProcessStopwords: currently disabled!');
				return null;
			}
			
			var grammarConverter = doGetGrammar(lang);
        	
        	if(!grammarConverter){
    			throw 'NoGrammar_'+lang;
    		}
        	
        	stopwordFunc = stopwordFunc || grammarConverter.removeStopwords;
        	
        	return grammarConverter.preproc(thePhrase);
		};
		
		/** @lends mmir.SemanticInterpreter.prototype */
        var _tmpInstance = { // public members
        		
        	/**  @scope SemanticInterpreter# *///for jsdoc2

        	/**
             * @param {String} phrase
             * 					the phrase that will be parsed
             * @param {String} langCode
             * 					the language code (identifier) for the parser/grammar
             * @param {Function} [callback] OPTIONAL
             * 					a callback function that receives the return value
             * 					(instead of receiving the result as return value from
             * 					 this function directly).
             * 					The signature for the callback is: <code>callback(result: Object)</code>
             * 					  (i.e. the result that would be returned by this function itself is
             * 					   passed as argument into the callback function; see also documentation
             * 					   for <em>returns</em>).
             * 					NOTE: in case, the grammar for the requested <code>langCode</code>
             * 						  is not compiled yet (i.e. not present as executable JavaScript),
             * 						  the corresponding JSON definition of the grammar needs to be
             * 					      compiled first, before processing the ASR's semantics is possible.
             * 						  In this case, a <code>callback</code> function <strong>MUST</strong>
             * 						  be supplied in order to receive a result (since compilation of the
             * 					      grammar may be <em>asynchronous</em>).  
             * 
             * @returns {Object}
             * 				the parsing result (as processed by the parser / grammar;
             * 				usually a JSON-like object).
             * 				WARNING: if a <code>callback</code> function was provided, then
             * 						 there is no return object.
             * 
	         * @public
	         * @memberOf mmir.SemanticInterpreter.prototype
             */
            interpret: function(phrase, langCode, callback){
            	
            	return process_asr_semantic(phrase, langCode, callback);
            	
            },
            /**
             * Removes stopwords using the stopword-list from the parser/grammar
             * for <code>lang</code>.
             * 
             * NOTE: <code>{@link #interpret}</code> automatically applies stopword-removal
             * 		 (i.e. there is no need to manually remove stopwords using this function
             * 		  when using <code>{@link #interpret}</code>).
             * 
             * @param {String} thePhrase
             * 					the Phrase for which stopwords should be removed
             * @param {String} lang
             * 					the language code (identifier) for the parser/grammar
             * 
	         * @public
             */
			removeStopwords: function(thePhrase, lang, stopwordFunc){
				return doRemoveStopWords(thePhrase, lang, stopwordFunc);
			},
			/** NOTE: the grammar must be compiled first, see getNewInstance(true)  @public */
			getGrammarDefinitionText: function(id){
				return doGetGrammar(id).getGrammarDef();//grammarDefinitionText;
			},
			/** NOTE: the grammar must be compiled first, see getNewInstance(true)  @public*/
			getGrammarParserText: function(id){
				return doGetGrammar(id).getGrammarSource();//grammarParser;
			},
			/**
			 * 
	         * @public
			 * @param {String} id
			 * @returns {GrammarConverter}
			 */
			getGrammarConverter: function(id){
				return doGetGrammar(id, true);//<- if no grammar is loaded for this ID, do NOT try to load it!
			},
			/**
			 * 
	         * @public
			 * @param {String|JSONObject} rawGrammarSrc
			 * @param {String} id
			 * @param {Function} [callback]
			 * @returns {SemanticInterpreter.prototype}
			 */
			createGrammar: function(rawGrammarSrc, id, callback){
				
				if(!id){
					throw 'missing ID for generated grammar';//TODO
				}
		        
				createAndAddGrammar(rawGrammarSrc, id, callback);
				
				return this;
			},
			/**  
			 * @public
			 * @function
			 */
	        addGrammar: doAddGrammar,
			/**  
			 * @public
			 * @function
			 */
	        setStopwords: doSetStopwords,
//	        getGrammar: doGetGrammar, <- set to private
			/**  
			 * @public
			 * @function
			 */
	        hasGrammar: checkHasGrammar,
			/**  
			 * @public
			 * @function
			 */
	        removeGrammar: doRemoveGrammar,

	        /**
	         * Sets the current grammar.
	         * 
	         * If in invocations of {@link #interpret} the grammar ID (e.g. language code) is missing,
	         * then this grammar that is set here is used.
	         * 
	         * The id must reference either a grammar that was compiled (i.e. generated JavaScript file)
	         * for this id, or there must exists JSON-grammar file for which the language-dir matches the id parameter,
	         * e.g. <code>config/languages/[id]/grammar.json</code>.
	         * 
	         * @param {String} id the ID for the grammar, e.g. an ISO language code
	         * 
	         * @function
	         * @public
	         */
	        setCurrentGrammar: function(id){
	        	currentGrammarId = id;
	        	
	        	//set semantic-interpreter to enabled
	        	//  (this ensures, that JSON-grammars are automatically loaded,
	        	//   if no corresponding compiled JS-grammar is available yet) 
	        	doSetEnabled(true);
	        },
			/**  @public  */
	        getCurrentGrammar: function(){
	        	return currentGrammarId;
	        },

			/**  @public  */
	        setEnabled: function(isEnabled){
	        	doSetEnabled(isEnabled);
	        },
			/**  @public  */
	        isEnabled: function(){
	        	return doCheckIsEnabled();
	        },
	        
	        /**
	         * Get the ID of the current grammar engine / compiler.
	         * 
	         * @default "jcss"
	         * @returns {String}
	         * 			the ID of the current grammar engine
	         * @public
	         */
	        getGrammarEngine: function(){
	        	return doGetGrammarEngine();
	        },
	        /**
	         * Set the grammar engine, i.e. the
	         * compiler engine for the JSON grammar
	         * 
	         * NOTE: implementations of the grammar engines are located at env/grammar/
	         *       The file-name for an implementation should follow the convention: ID+"Generator.js"
	         *       and should be registered with requirejs with the module-ID: ID+"Gen"
	         * 
	         * @param {String} egnineId
	         * 			the ID for the engine.
	         * 			Possible values: "jscc", "jison", "pegjs"
	         * 
	         * @param {Boolean} [asyncCompileMode] OPITIONAL
	         * 			sets the compile mode (sychronous or asynchronous) when generating new parsers
	         * 			with the grammar-engine.
	         * 			DEFAULT: VOID (i.e. leave current set compile-mode setting unchanged)
	         * 
	         * @public
	         */
	        setGrammarEngine: function(engineId, asyncCompileMode){
	        	doSetGrammarEngine(engineId, asyncCompileMode);
	        },
	        
	        /**
	         * Set compile-mode (sychronous or asynchronous) for the grammar engine, i.e. if the
	         * compiler engine for the JSON grammar should run synchronously or asynchronously.
	         * 
	         * NOTE: if there is no asynchronous implementation available for the grammar engine,
	         * 		 the sync-impl. is used by default.
	         * 
	         * NOTE: asynchronous compile mode requires WebWorkers
	         * 
	         * @param {Boolean} asyncCompileMode
	         * 			sets the compile mode (sychronous or asynchronous) when generating new parsers
	         * 			with the grammar-engine.
	         * 
	         * @public
	         * @default false (i.e. synchronous compile mode)
	         * @require WebWorker (if async mode)
	         */
	        setEngineCompileMode: function(asyncCompileMode){
	        	_isAsyncCompileMode = !!asyncCompileMode;
	        },
	        /**
	         * @returns {Number} the current version number that this SemanticInterpreter
	         * 				instance supports, for the file format of compiled grammars.
	         */
	        getFileVersion: function(){
	        	return GRAMMAR_FILE_FORMAT_VERSION;
	        },
	        
	        //FIXME rename/move functions
	        get_json_grammar_url: function(id){
	        	var configLangPath = constants.getLanguagePath();
	        	var jsonGrammarFileName = constants.getGrammarFileName();
	        	
	        	return configLangPath + id + '/' +jsonGrammarFileName;
	        }
        };//END: var _tmpInstance = {...
        
        return _tmpInstance;
    }
    
    instance = new constructor();
    
    return instance;
    
});//END: define(..., function(){
