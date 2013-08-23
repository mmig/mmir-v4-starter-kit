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


// overwrite/implement output functions for JS/CC compiler:
function _error( msg ){
    console.error('ERROR [SemanticInterpreter.parse]: '+msg);
}
function _warning( msg ){
    console.warn('WARNING [SemanticInterpreter.parse]: '+msg);   
}
function _print( msg ){
    console.info('INFO [SemanticInterpreter.parse]: '+msg);   
}

/**
 * @class
 * 
 * @see mobileDS.SemanticInterpreter#costructor
 */
mobileDS.SemanticInterpreter = (function(){
	var instance = null;
        
    var INPUT_FIELD_NAME = 'asr_recognized_text';
    
    
    
    /**
     * @param doRecompile (OPTIONAL) IF {Boolean}: if true, the JSON grammar in content\grammar.json will be recompiled (needs to be accessible via AJAX!)
     * 					IF {String}: the String's contents will be used as a String-representation of the JSON grammar
     * 					IF {Object}: the Object will be used as JSON representation for the grammar
     * 
     * @param {String} [generatedParserLanguageCode]  if param doRecompile is used, this String specifies the 
     * 					language for the generated grammar-parser.
     * 					NOTE: this should be a valid ISO language code!
     * 
     * @constructor
     * @augments mobileDS.SemanticInterpreter
     * @memberOf mobileDS.SemanticInterpreter.prototype
     */
    function constructor(doRecompile, generatedParserLanguageCode){
    
	    /**
	     * "map" for grammar implementations (e.g. for different languages)
	     * 
	     * @property grammarImplMap
	     * @private
	     */
	    var grammarImplMap = {};
	    /**
	     * list of IDs for grammar implementations (e.g. for different languages).
	     * 
	     * This list contains the "keys" of all current entries in <tt>grammarImplMap</tt>.
	     * 
	     * @property grammarImplList
	     * @private
	     */
	    var grammarImplList = [];
	    
	    /**
	     * id (i.e. the <em>key</em> for map <tt>grammarImplMap</tt>) for currently used
	     * grammar.
	     * 
	     * If for invocations of getASRSemantic(..) etc. function the ID/languageCode
	     * argument is missing/omitted, then this id will be used.
	     * 
	     * NOTE: if not <tt>NULL</tt>, the grammar must be available, either
	     * 		 as compiled JS file (which must be already loaded, i.e. already present in <tt>grammarImplMap</tt>), or
	     * 		 as JSON grammar file (which must be available at <tt>/config/languages/[ID]/grammar.json</tt>
	     * 
	     * @property currentGrammarId
	     * @private
	     */
	    var currentGrammarId = null;
    	
	    /**
	     * Flag for enabling/disabling processing of SemanticInterpreter.
	     * 
	     * If disabled, getASRSemantic(), removeStopwords() etc. (+ <tt>_alt</tt> versions) will return <tt>null</tt> values. 
	     * 
	     * NOTE: if no grammar for any language is available, the SemanticInterpreter should be disabled.
	     * 
	     *  Setting a language, automatically enables the the SemanticInterpreter.
	     * 
	     * @property _isEnabled
	     * @type Boolean
	     * @private
	     */
	    var _isEnabled = false;
	    
	    var doSetEnabled = function(isEnabled){
        	_isEnabled = isEnabled;
        };
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
	     * 									The stopwords must already be set, or must additionally be set for the GrammarConverter instance
	     * 									  (e.g. using {@link mobileDS.SemanticInterpreter.setStopwords}) 
	     */
    	var doAddGrammar = function(id, grammarImpl){
        	
    		
        	if( ! (grammarImpl instanceof GrammarConverter)){
        		var gc = doGetGrammar(id, true);
        		if(!gc){
        			gc = new GrammarConverter();
        		}
        		gc.setGrammarFunction(grammarImpl);
        		grammarImpl = gc;
        	}
//        	else {
//        		
//        	}
        	
        	var isAlreadyPresent = checkHasGrammar(id);
        	grammarImplMap[id] = grammarImpl;
        	
        	if( ! isAlreadyPresent){
	        	if(grammarImplList.length === 0){
	        		currentGrammarId = id;
	        	}
	        	grammarImplList.push(id);
        	}
        	
        	doSetEnabled(true);
        };
        
        var doSetStopwords = function(id, stopwordArray){
        	doGetGrammar(id).setStopWords(stopwordArray);
        };
        var doGetGrammar = function(id, doNotResolve){//NOTE: this should stay private
        	
        	if(!id){
        		if(!currentGrammarId){
        			throw 'Could not retrieve grammar: required grammar ID is missing';
        		}
        		else {
        			id = currentGrammarId;
        		}
        	}
        	
        	if(!doNotResolve && ! checkHasGrammar(id) ){
        		var jsonGrammarUrl = instance.get_json_grammar_url(id);
        		
        		createAndAddGrammar(jsonGrammarUrl, id, function(){console.info('created executable grammar for "'+id+'" from source '+jsonGrammarUrl);});
        	}
        	
        	return grammarImplMap[id];
        };
        var checkHasGrammar = function(id){
        	return typeof grammarImplMap[id] !== 'undefined';
        };
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
         * @param doRecompile (OPTIONAL) IF {Boolean}: if true, the JSON grammar in content\grammar.json will be recompiled (needs to be accessable through ajax!)
         * 					IF {String}: the String's contents will be used as a String-representation of the JSON grammar
         * 					IF {Object}: the Object will be used as JSON representation for the grammar
         * 					IF omitted: the current grammar-JSON file will be loaded into the GrammarConverter.json_grammar_definition 
         * 
         * @param generatedParserLanguageCode (OPTIONAL) {String} if param doRecompile is used, this String specifies the 
         * 					language for the generated grammatic-parser. If omitted, the default "de" (German) will be used.
         * 					NOTE: this must be a valid ISO language code!
         * 
         * @param callback (OPTIONAL) {Function} a callback that is invoked after the grammar was created and added to the SemanticInterpreter. 
         * 							The callback-function will be invoked without arguments, i.e. <code>callback();</code>
         * @function
         */
        function createAndAddGrammar(doRecompile, generatedParserLanguageCode, callback){
        	
        	var gc = new GrammarConverter();
        	
        	function build_grammar(theConverterInstance){
        	    
                
                theConverterInstance.convertJSONGrammar();
                var grammarDefinition = theConverterInstance.getJSCCGrammar();
                
//                grammarDefinitionText = grammarDefinition;
                
//                var pure_code, out_code, i;

                //set up the JS/CC compiler (writes into global variables!):
                html_output = new String();
                error_output = new String();
                reset_all(EXEC_WEB);
                parse_grammar(grammarDefinition);
              
                if (errors == 0) {
                    undef();
                    unreachable();
                        
                    if (errors == 0) {
                        first();
                         print_symbols();
                         dfa_table = create_subset(nfa_states);
                         dfa_table = minimize_dfa(dfa_table);
                         lalr1_parse_table(false);
                         errors = 0;
                    }
                }
             
                if (errors > 0 || warnings > 0 && error_output != "") 
                    console.error(''+error_output);
                
//                console.debug("before replace " + theConverterInstance.PARSER_TEMPLATE);//debug
             
                var grammarParser = new String(theConverterInstance.PARSER_TEMPLATE);
                grammarParser = grammarParser.replace(/##PREFIX##/gi, "");
                grammarParser = grammarParser.replace(/##HEADER##/gi, code_head);
                grammarParser = grammarParser.replace(/##TABLES##/gi, print_parse_tables(MODE_GEN_JS));
                grammarParser = grammarParser.replace(/##DFA##/gi, print_dfa_table(dfa_table));
                grammarParser = grammarParser.replace(/##TERMINAL_ACTIONS##/gi, print_term_actions());
                grammarParser = grammarParser.replace(/##LABELS##/gi, print_symbol_labels());
                grammarParser = grammarParser.replace(/##ACTIONS##/gi, print_actions());
                grammarParser = grammarParser.replace(/##FOOTER##/gi, "__parse( "+INPUT_FIELD_NAME+", new Array(), new Array());");
                grammarParser = grammarParser.replace(/##ERROR##/gi, get_error_symbol_id());
                grammarParser = grammarParser.replace(/##EOF##/gi, get_eof_symbol_id());
                grammarParser = grammarParser.replace(/##WHITESPACE##/gi, get_whitespace_symbol_id());
                
                
                //FIXME attach compiled parser to some other class/object
                var addGrammarParserExec = 
                	  'mobileDS.SemanticInterpreter.getInstance().addGrammar("'
                		+generatedParserLanguageCode
                		+'", function('+INPUT_FIELD_NAME+'){'
                			+ grammarParser
                	+ '\n});\n\n'
                	+ 'mobileDS.SemanticInterpreter.getInstance().setStopwords("'
                		+generatedParserLanguageCode+'",'
                		+JSON.stringify(theConverterInstance.getStopWords())
                	+ ');\n'
                ;
                
                theConverterInstance.setJSGrammar(addGrammarParserExec);

                doAddGrammar(generatedParserLanguageCode, theConverterInstance);
                
                eval(addGrammarParserExec);
                
                //invoke create&add callback if present:
                if(callback){
                	callback();
                }
                
            }//END function build_grammar
        	
            if(doRecompile === true || doRecompile === 'true'){//FIXME this option must be re-implemented (there is no 'default' grammar any more!)
            	gc.loadGrammar(build_grammar, function(){ throw 'Could not find JSON grammar file at default location'; } );
            } else if(typeof doRecompile === 'string'){
            	//previously: STRING was interpreted as "stringified" JSON-grammar, now: as URL for the JSON grammar
//            	gc.json_grammar_definition = JSON.parse(doRecompile);
//            	build_grammar(gc);
            	gc.loadGrammar(build_grammar, function(){ throw 'Could not find JSON grammar file at "'+doRecompile+'"'; } , doRecompile);
            } else if(typeof doRecompile === 'object'){
            	gc.json_grammar_definition = doRecompile;
            	build_grammar(gc);
            } else {
            	gc.loadGrammar();
            	doAddGrammar(generatedParserLanguageCode, gc);
            	if(callback){
            		callback();
            	}
            }
        }
        
        var encodeSpecialChars = function(target, doAlsoEncodeUpperCase){
        	var isString = typeof target === 'string';
        	var str;
        	if(isString){
        		str = target;
        	}
        	else {
        		str = JSON.stringify(target);
        	}
        	
        	str = str.replace(/ö/g,'__oe__').replace(/ä/g,'__ae__').replace(/ü/g,'__ue__').replace(/ß/g,'__ss__');
        	if(doAlsoEncodeUpperCase){
            	str = str.replace(/Ö/g,'__Oe__').replace(/Ä/g,'__Ae__').replace(/Ü/g,'__Ue__');
        	}
        	
        	if(isString){
        		return str;
        	}
        	else {
        		return JSON.parse(str);
        	}
        };
        
        var decodeSpecialChars = function(target, doAlsoDecodeUpperCase){
        	var isString = typeof target === 'string';
        	var str;
        	if(isString){
        		str = target;
        	}
        	else {
        		str = JSON.stringify(target);
        	}
        	
        	str = str.replace(/__oe__/g,'ö').replace(/__ae__/g,'ä').replace(/__ue__/g,'ü').replace(/__ss__/g,'ß');
        	if(doAlsoDecodeUpperCase){
            	str = str.replace(/__Oe__/g,'Ö').replace(/__Ae__/g,'Ä').replace(/__Ue__/g,'Ü');
        	}
        	
        	if(isString){
        		return str;
        	}
        	else {
        		return JSON.parse(str);
        	}
        };
        
        var process_asr_semantic = function(phrase, stopwordFunc, langCode){//grammarParserCode){

			if(!doCheckIsEnabled()){
				console.warn('SemanticInterpreter.getASRSemantic: currently disabled!');
				return null;
			}
			
        	var grammarConverter = doGetGrammar(langCode);
        	
        	if(!grammarConverter){
    			throw 'NoGrammar_'+langCode;
    		}
        	
            var asr_recognized_text = encodeSpecialChars( phrase.toLowerCase() );
            asr_recognized_text = stopwordFunc(asr_recognized_text.toLowerCase(), langCode);
           
            if(IS_DEBUG_ENABLED) console.debug('SemanticInterpreter.process_asr_semantic('+langCode+'): removed stopwords, now parsing phrase "'+asr_recognized_text+'"');//debug
            
    		grammarConverter.executeGrammar(asr_recognized_text);
            		
            grammarConverter.semanticAnnotationResult = decodeSpecialChars(grammarConverter.semanticAnnotationResult);
//            	JSON.parse((JSON.stringify(grammarConverter.semanticAnnotationResult).replace(/__oe__/g,'ö').replace(/__ae__/g,'ä').replace(/__ue__/g,'ü').replace(/__ss__/g,'ß')));
            
            return grammarConverter.semanticAnnotationResult;//TODO return copy instead of original instance? 
        };
        

		var removeStopwordsFunc =  function(thePhrase, lang){
			var gc = doGetGrammar(lang);
    		var stop_words_regexp = gc.getStopWordsRegExpr();
        	return thePhrase.replace(stop_words_regexp, '').trim();
    	};
    	
		var removeStopwordsAltFunc = function(thePhrase, lang){
    		var gc = doGetGrammar(lang);
    		var stop_words_regexp = gc.getStopWordsRegExpr_alt();
        	
			while (thePhrase.match(stop_words_regexp)) {
				thePhrase = thePhrase.replace(stop_words_regexp, ' ');
				thePhrase = thePhrase.trim();
			}
			
			return thePhrase;
		};
        
		/** @lends mobileDS.SemanticInterpreter.prototype */
        return { // public members
        	/**
             * NOTE: now uses the modified implementation for stopwords.
             */
            getASRSemantic: function(phrase, langCode){
            	
            	return process_asr_semantic(phrase, removeStopwordsFunc, langCode);
            	
            },
//            get_curr_asr_semantic: function(id){
//                return doGetGrammar(id).semanticAnnotationResult;
//            },
            /**
             * NOTE: uses the original implementation for stopwords (has some problems for stopwords at the 
             *  end of a sentence)
             */
            getASRSemantic_alt: function(phrase, langCode){
            	
            	return process_asr_semantic(phrase, removeStopwordsAltFunc, langCode);
            	
            },
			removeStopwords: function(thePhrase, lang){
				if(!doCheckIsEnabled()){
					console.warn('SemanticInterpreter.removeStopwords: currently disabled!');
					return null;
				}
				var str = encodeSpecialChars(thePhrase, true);
				str = removeStopwordsFunc(str, lang);
				return decodeSpecialChars(str, true);
			},
			removeStopwords_alt: function(thePhrase, lang){
				if(!doCheckIsEnabled()){
					console.warn('SemanticInterpreter.removeStopwords_alt: currently disabled!');
					return null;
				}
				var str = encodeSpecialChars(thePhrase, true);
				str = removeStopwordsAltFunc(str, lang);
				return decodeSpecialChars(str, true);
			},
			/** NOTE: the grammar must be compiled first, see getNewInstance(true) */
			getGrammarDefinitionText: function(id){
				return doGetGrammar(id).getJSCCGrammar();//grammarDefinitionText;
			},
			/** NOTE: the grammar must be compiled first, see getNewInstance(true) */
			getGrammarParserText: function(id){
				return doGetGrammar(id).getJSGrammar();//grammarParser;
			},
			getGrammarConverter: function(id){
				return doGetGrammar(id);
			},
			
			createGrammar: function(rawGrammarSrc, id, callback){
				
				if(!id){
					throw 'missing ID for generated grammar';//TODO
				}
		        
				createAndAddGrammar(rawGrammarSrc, id, callback);
				
				return this;
			},
			
	        addGrammar: doAddGrammar,
	        setStopwords: doSetStopwords,
//	        getGrammar: doGetGrammar, <- set to private
	        hasGrammar: checkHasGrammar,
	        removeGrammar: doRemoveGrammar,

	        /**
	         * Sets the current grammar.
	         * 
	         * If in invocations of getASRSemantic(..) the grammar ID (e.g. language code) is missing,
	         * then this grammar that is set here is used.
	         * 
	         * The id must reference either a grammar that was compiled (i.e. generated JavaScript file)
	         * for this id, or there must exists JSON-grammar file for which the language-dir matches the id parameter,
	         * e.g. config/languages/[id]/grammar.json.
	         * 
	         * @param {String} id the ID for the grammar, e.g. an ISO language code
	         * 
	         * @function
	         * @public
	         */
	        setCurrentGrammar: function(id){
	        	currentGrammarId = id;
	        },
	        getCurrentGrammar: function(){
	        	return currentGrammarId;
	        },
	        
	        setEnabled: function(isEnabled){
	        	doSetEnabled(isEnabled);
	        },
	        isEnabled: function(){
	        	return doCheckIsEnabled();
	        },
	        
	        //FIXME rename/move functions
	        get_json_grammar_url: function(id){
	        	var configLangPath = mobileDS.constants.getInstance().getLanguagePath();
	        	var jsonGrammarFileName = mobileDS.constants.getInstance().getGrammarFileName();
	        	
	        	return configLangPath + id + '/' +jsonGrammarFileName;
	        }
        };
    }
    
    return {
        getInstance: function(){
        
            if (instance === null) {
            
                instance = constructor();
            }
            return instance;
        }
//    	,
//        getNewInstance: function(doRecompile, generatedParserId){
//            
//            instance = constructor(doRecompile, generatedParserId);
//            
//            return instance;
//        }
    };
    
})();
