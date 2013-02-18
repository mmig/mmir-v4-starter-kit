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
var asr_recognized_text;

function _error( msg )
{
    console.error('ERROR [SemanticInterpreter.parse]: '+msg);
}

function _warning( msg )
{
    console.warn('WARNING [SemanticInterpreter.parse]: '+msg);   
}


function _print( msg )
{
    console.info('INFO [SemanticInterpreter.parse]: '+msg);   
}

mobileDS.SemanticInterpreter = (function(){
    var instance = null;
    
    var defaultGeneratedParserFunctionName = 'compiled_grammar';
    var generatedParserFunction = null;
    
    /**
     * @param doRecompile (OPTIONAL) IF {Boolean}: if true, the JSON grammar in content\grammar.json will be recompiled (needs to be accessable through ajax!)
     * 					IF {String}: the String's contents will be used as a String-representation of the JSON grammar
     * 					IF {Object}: the Object will be used as JSON representation for the grammar
     * 
     * @param generatedParserFunctionName (OPTIONAL) {String} if param doRecompile is used, this String specifies the 
     * 					function name for the generated grammatic-parser, i.e. the (global) function with which the
     * 					parser will be invoked (parameterless). If omitted, the name "compiled_grammar" will be used
     * 					by default.
     * 					NOTE: this must be a valid JavaScript identifier!
     */
    function constructor(doRecompile, generatedParserFunctionName){
    
    	var grammarParser = null;
    	var grammarDefinitionText = null;
    	
        var gc = new GrammarConverter();
      
        function build_grammar(){
        
            
            gc.convert_json_grammar();
            var grammarDefinition = gc.get_jscc_grammar();
            
            grammarDefinitionText = grammarDefinition;
            
            var pure_code, out_code, i;
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
            
            if(IS_DEBUG_ENABLED) console.debug("before replace " + gc.PARSER_TEMPLATE);//debug
         
            grammarParser = new String(gc.PARSER_TEMPLATE);
            grammarParser = grammarParser.replace(/##PREFIX##/gi, "");
            grammarParser = grammarParser.replace(/##HEADER##/gi, code_head);
            grammarParser = grammarParser.replace(/##TABLES##/gi, print_parse_tables(MODE_GEN_JS));
            grammarParser = grammarParser.replace(/##DFA##/gi, print_dfa_table(dfa_table));
            grammarParser = grammarParser.replace(/##TERMINAL_ACTIONS##/gi, print_term_actions());
            grammarParser = grammarParser.replace(/##LABELS##/gi, print_symbol_labels());
            grammarParser = grammarParser.replace(/##ACTIONS##/gi, print_actions());
            grammarParser = grammarParser.replace(/##FOOTER##/gi, "__parse( asr_recognized_text, new Array(), new Array());");
            grammarParser = grammarParser.replace(/##ERROR##/gi, get_error_symbol_id());
            grammarParser = grammarParser.replace(/##EOF##/gi, get_eof_symbol_id());
            grammarParser = grammarParser.replace(/##WHITESPACE##/gi, get_whitespace_symbol_id());
            
            var funcName = typeof generatedParserFunctionName === 'string'? generatedParserFunctionName : defaultGeneratedParserFunctionName;
            //FIXME attach compiled parser to some other class/object
            grammarParser = 'GrammarConverter.prototype.' + funcName + ' = function(){\n ' +grammarParser + '\n};';
            eval(grammarParser);
            generatedParserFunction = funcName + '();';
        }
        
        if(doRecompile === true || doRecompile === 'true'){
        	gc.load_grammar(build_grammar);
        } if(typeof doRecompile === 'string'){
        	gc.json_grammar_definition = jQuery.parseJSON(doRecompile);
        	build_grammar();
        } if(typeof doRecompile === 'object'){
        	gc.json_grammar_definition = doRecompile;
        	build_grammar();
        } else {
        	gc.load_grammar();
        }
        
        var process_asr_semantic = function(phrase, stopwordFunc, grammarParserCode){
//        	var stop_words_regexp = gc.get_stop_words_regexp();
        	phrase = stopwordFunc(phrase);//phrase.replace(stop_words_regexp, '');
            asr_recognized_text = "";
            //var tokens = phrase.split(" ");
            asr_recognized_text = phrase.toLowerCase().replace(/ö/g,'__oe__').replace(/ä/g,'__ae__').replace(/ü/g,'__ue__').replace(/ß/g,'__ss__');
           
            if(IS_DEBUG_ENABLED) console.debug('SemanticInterpreter.process_asr_semantic: removed stopwords, now parsing phrase "'+asr_recognized_text+'"');//debug
            
            if(typeof grammarParserCode === 'string'){
//        		console.log('SemanticInterpreter.process_asr_semantic: using CODE STRING paramter as grammar-parser (eval)');//FIXM debug
            	eval(grammarParserCode);
            } else {
            	if(generatedParserFunction != null){
//            		console.log('SemanticInterpreter.process_asr_semantic: using generated grammar-parser (eval)!');//FIXM debug
            		//FIXME see above: when attachment of compile parser is changed, this also needs to be changed.
            		eval('gc.' + generatedParserFunction);
            	} else {
            		
            		if(IS_DEBUG_ENABLED) console.debug('SemanticInterpreter.process_asr_semantic: using default grammar-parser!');//debug
            		
            		gc.compiled_grammar();
            	}
            }

            return gc.asr_semantic_annotation = 
            	JSON.parse((JSON.stringify(gc.asr_semantic_annotation).replace(/__oe__/g,'ö').replace(/__ae__/g,'ä').replace(/__ue__/g,'ü').replace(/__ss__/g,'ß')));
        };
        

		var removeStopwordsFunc =  function(thePhrase){
    		var stop_words_regexp = gc.get_stop_words_regexp();
        	return thePhrase.replace(stop_words_regexp, '').trim();
    	};
    	
		var removeStopwordsAltFunc = function(thePhrase){
    		
    		var stop_words_regexp = gc.get_stop_words_regexp_alt();
        	
			while (thePhrase.match(stop_words_regexp)) {
				thePhrase = thePhrase.replace(stop_words_regexp, ' ');
				thePhrase = thePhrase.trim();
			}
			
			return thePhrase;
		};
        
        return { // public members
        	/**
             * NOTE: now uses the modified implementation for stopwords.
             */
            get_asr_semantic: function(phrase, grammarParserCode){
            	
            	return process_asr_semantic(phrase, removeStopwordsAltFunc, grammarParserCode);
            	
//            	var stop_words_regexp = gc.get_stop_words_regexp();
//            	phrase = phrase.replace(stop_words_regexp, '');
//                asr_recognized_text = "";
//                //var tokens = phrase.split(" ");
//                asr_recognized_text = phrase.toLowerCase().replace(/ö/g,'__oe__').replace(/ä/g,'__ae__').replace(/ü/g,'__ue__').replace(/ß/g,'__ss__');
//               // eval(grammarParser);
//                compiled_grammar();
//                return asr_semantic_annotation = 
//                    jQuery.parseJSON((JSON.stringify(asr_semantic_annotation).replace(/__oe__/g,'ö').replace(/__ae__/g,'ä').replace(/__ue__/g,'ü').replace(/__ss__/g,'ß')));
            },
            get_curr_asr_semantic: function(){
                return gc.asr_semantic_annotation;
            },
            /**
             * NOTE: uses the original implementation for stopwords (has some problems for stopwords at the 
             *  end of a sentence
             */
            get_asr_semantic_alt: function(phrase, grammarParserCode){
            	
            	return process_asr_semantic(phrase, removeStopwordsFunc, grammarParserCode);
            	
            },
			removeStopwords: removeStopwordsFunc,
			removeStopwordsAlt: removeStopwordsAltFunc,
			/** NOTE: the grammar must be compiled first, see getNewInstance(true) */
			getGrammarDefinitionText: function(){
				return grammarDefinitionText;
			},
			/** NOTE: the grammar must be compiled first, see getNewInstance(true) */
			getGrammarParserText: function(){
				return grammarParser;
			},	
			printAndRaise: function(asr_result){//FIXME move this code from here into application-specific code file!
				
			//	console.log("[Nuance] "  + res['result']);
				
		//		var asr_result = res['result'];
				
				var result = mobileDS.SemanticInterpreter.getInstance().get_asr_semantic(asr_result);
				var semantic;
				if ($('#mic_button').hasClass('footer_button_clicked'))
					$('#mic_button').removeClass('footer_button_clicked');
				if (result.semantic != null) {
				    semantic = JSON.parse(result.semantic);
				    semantic.phrase = asr_result;
				    console.log("semantic : " + result.semantic);
				}
				else {
				    semantic = JSON.parse('{ "NoMatch": { "phrase": "'+asr_result+'" }}');
				}
				MobileDS.InputManager.getInstance().raiseEvent("speech_input_event",  semantic);
			}
        };
    }
    return {
        getInstance: function(){
        
            if (instance === null) {
            
                instance = constructor();
            }
            return instance;
        },
        getNewInstance: function(doRecompile, generatedParserFunctionName){
            
            instance = constructor(doRecompile, generatedParserFunctionName);
            
            return instance;
        }
    };
    
})();
