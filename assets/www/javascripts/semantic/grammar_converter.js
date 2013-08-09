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
* @module mobileDS.javascripts.semantic
* 
*/

/**
* The GrammarConverter object initializes the grammar for the voice recognition.
* 
* @class GrammarConverter
* @constructor
* @category core
*/

var GrammarConverter = function(){
	this.THE_INTERNAL_GRAMMAR_CONVERTER_INSTANCE_NAME = "theGrammarConverterInstance";
	this.json_grammar_definition = null;
	this.grammar_tokens = "/~ --- Token definitions --- ~/\n\n/~ Characters to be ignored ~/\n!   ' |\\t' ;\n\n/~ Non-associative tokens ~/\n";
	this.grammar_utterances = "";
	this.grammar_phrases = "phrases:";
	this.jscc_grammar_definition = "";
	this.js_grammar_definition = "";
	this.variable_prefix = "_$";
	this.variable_regexp = /"(_\$[^\"]*)"/igm;// /"_$([^\"]*)/igm;
	this.token_variables = "[*\n  var " + this.variable_prefix
			+ "result = '';\n";
	this.tokens_array = new Array();
	this.stop_words_regexp;
	
	this.asr_semantic_annotation = {};

	//alternative reg-exp for stop-words (a different method for detecting/removing stopwords must be used!)
	this.stop_words_regexp_alt;
	
};

GrammarConverter.prototype.load_grammar = function(successCallback, errorCallback, grammarUrl){
	var grammar = '';
	var self = this;
	var theUrl = grammarUrl;
	if(!theUrl){
		theUrl = 'content/grammar.json'; 
	}
	$.ajax({
		async: false,
		dataType: 'json',
		url:theUrl,
		success: function(data){
			
			data = JSON.stringify(data);
			
			//TODO: externalize replacement (encoding/decoding); see also in semantic_interpreter.js
			//Java-Code:
//			data = data.replaceAll("\u00E4", "__ae__");//HTML: &#228;
//			data = data.replaceAll("\u00FC", "__ue__");//HTML: &#252;
//			data = data.replaceAll("\u00F6", "__oe__");//HTML: &#246;
//			data = data.replaceAll("\u00DF", "__ss__");//HTML: &#223;
			grammar=data.replace(/ö/g,'__oe__').replace(/ä/g,'__ae__').replace(/ü/g,'__ue__').replace(/ß/g,'__ss__');
			
			self.json_grammar_definition = jQuery.parseJSON( grammar );
			if (typeof successCallback == "function") {
				successCallback(self);
			}
		},
		error: function(data){
			alert("failed to load the grammar! error: "+ JSON.stringify(data));
			if (typeof errorCallback == "function") {
				errorCallback(self);
			}
		}
	});
};

GrammarConverter.prototype.convert_json_grammar = function(){
	this.parse_tokes();
	this.parse_utterances();
	this.parse_stop_words();
	

	this.jscc_grammar_definition = this.token_variables
			+ "*]\n\n"
			+ this.grammar_tokens
			+ "\n\n ##\n\n/~ --- Grammar specification --- ~/\n\nutterance:      phrases    [*  "
			+ this.variable_prefix
			+ "result['semantic'] = "
			+ this.variable_prefix
			+ "result['semantic'].replace(/\"{/g,'{').replace(/}\"/g,'}'); console.log("
			+ this.variable_prefix + "result);  "+this.THE_INTERNAL_GRAMMAR_CONVERTER_INSTANCE_NAME+".asr_semantic_annotation = "
			+ this.variable_prefix + "result*] ;\n\n" + this.grammar_utterances
			+ "\n" + this.grammar_phrases + ";";
};

GrammarConverter.prototype.set_stop_words = function(stopWordArray){
	if(!this.json_grammar_definition){
		this.json_grammar_definition = {};
	}
	this.json_grammar_definition.stop_word = stopWordArray;
	
	this.parse_stop_words();
	this.parse_stop_words_alt();
};

GrammarConverter.prototype.get_stop_words = function(){
	if(!this.json_grammar_definition){
		return null;
	}
	return this.json_grammar_definition.stop_word;
};

//(this is the original implementation; has problems if stopwords are at the end of a senctence)
GrammarConverter.prototype.parse_stop_words = function(){

	//create RegExp for stop words:
	var json_stop_words = this.json_grammar_definition.stop_word;
	var stop_words = "(";
	
	//the RegExp matches each stopword (and optionally followed by one white-character)
	for(var index=0, size = json_stop_words.length; index < size ; ++index){
		var stop_word = json_stop_words[index];
		if (index > 0){
			stop_words +=	"|" 		//... OR match ...: 
							+ stop_word //... the stopword "stop_word"
							+ "\\s?";	//... and optionally one white-character that follows the stopword
		}else{
			stop_words += stop_word + " ";//if there is no entry in the stopword list: only match space-character as stopword
		}
	}
	
	stop_words += ")";
	this.stop_words_regexp = new RegExp(stop_words,"igm");	//RegExp options: 
															// ignore-case (i),
															// match globally i.e. all occurrences in the String (g), 
															// do not stop at line breaks (m) 

	//initialize the alternative version / regular expression for stopwords:
	this.parse_stop_words_alt();
};

//initialize alternative version / regular expression for stopwords:
GrammarConverter.prototype.parse_stop_words_alt = function(){
	
	var json_stop_words = this.json_grammar_definition.stop_word;
	var stop_words = "(";

	for(var index=0, size = json_stop_words.length; index < size ; ++index){
		var stop_word = json_stop_words[index];
		if (index > 0) {
			stop_words += "|";
		}
		//create match pattern for: (1) stopword enclosed in spaces, (2) the stopword at 'line end' preceded by a space, (3) the stopword at 'line start' followed by a space
		stop_words += " " + stop_word + " | " + stop_word + "$|^" + stop_word
				+ " ";
	}
	
	stop_words += ")";
	this.stop_words_regexp_alt = new RegExp(stop_words,"igm");
};

GrammarConverter.prototype.get_stop_words_regexp = function(){
	if(!this.stop_words_regexp){
		this.parse_stop_words();
	}
	return this.stop_words_regexp;
};

//alternative version / regular expression for stopwords:
GrammarConverter.prototype.get_stop_words_regexp_alt = function(){
	if(!this.stop_words_regexp_alt){
		this.parse_stop_words_alt();
	}
	return this.stop_words_regexp_alt;
};

GrammarConverter.prototype.get_jscc_grammar = function(){
	return  this.jscc_grammar_definition;
};

GrammarConverter.prototype.get_js_grammar = function(){
	return  this.js_grammar_definition;
};

GrammarConverter.prototype.set_js_grammar = function(src_code){
	 this.js_grammar_definition = src_code;
};

GrammarConverter.prototype.parse_tokes = function(){
	var self = this;
	var json_tokens =  this.json_grammar_definition.tokens;
	
	for(token_name in json_tokens){
		
		var words = json_tokens[token_name];
		
		self.token_variables += "  var " + self.variable_prefix
				+ token_name.toLowerCase() + " = {};\n";
		
		var grammar_token ="    '";
		
		for(var i=0, size = words.length; i < size ; ++i){
			if(i > 0){
				grammar_token += "|";
			}
			grammar_token += words[i];
		}
		
		grammar_token += "'    " + token_name + " [* " + self.variable_prefix
				+ token_name.toLowerCase() + "[%match] = %match; *];\n";
		
		self.grammar_tokens += grammar_token;
	}
};

GrammarConverter.prototype.parse_utterances = function(){
	var self = this;
	var utt_index = 0;
	var json_utterances =  this.json_grammar_definition.utterances;

	for(utterance_name in json_utterances){
		var utterance_def = json_utterances[utterance_name];
		if(utt_index > 0){
			self.grammar_phrases += "\n\t|";
		}
		utt_index++;
		self.parse_utterance(utterance_name, utterance_def);
	}
};

GrammarConverter.prototype.parse_utterance = function(utterance_name, utterance_def){
	var grammar_utterance = utterance_name + ":";
	var self = this; 
	self.token_variables += "  var " + self.variable_prefix
			+ utterance_name.toLowerCase() + " = {};\n";
	//self.grammar_phrases += utterance_name + "  " +  self.get_semantic_interpretationt_of_utterance(utterance_name, utterance_def);
	self.grammar_phrases += utterance_name + "  " ;
	var phrases = utterance_def.phrases;
	var semantic  = self.get_semantic_interpretationt_of_utterance(utterance_name, utterance_def);
	
	for(var index=0,size=phrases.length; index < size; ++index){
		if(index > 0){
			grammar_utterance += "\n|";
		}
		var phrase = phrases[index];
		var semantic_interpretation = self.get_semantic_interpretationt_of_phrase(
				utterance_name.toLowerCase(), utterance_def, phrase, semantic
		);
		grammar_utterance += phrase + semantic_interpretation;
	}
	self.grammar_utterances += grammar_utterance + ";\n\n";
};


GrammarConverter.prototype.get_semantic_interpretationt_of_utterance = function(utterance_name, utterance_def){
	var semantic = utterance_def.semantic,
	variable_index, variable_name;
	
	if(IS_DEBUG_ENABLED) console.debug('get_semantic_interpretationt_of_utterance: '+semantic);//debug
	
	var semantic_as_string = JSON.stringify(semantic);
	if( semantic_as_string != null){
	this.variable_regexp.lastIndex = 0;
	var variables = this.variable_regexp.exec(semantic_as_string);
	while (variables != null) {
		var variable = variables[1],
		remapped_variable_name = "";
		
		if(IS_DEBUG_ENABLED) console.debug("variables " + variable, semantic_as_string);//debug
		
		variable_index = /\[(\d+)\]/.exec(variable);
		variable_name = new RegExp('_\\$([a-zA-Z_][a-zA-Z0-9_\\-]*)').exec(variable)[1];
		if (variable_index == null) {
			remapped_variable_name = variable;
		} else {
				remapped_variable_name = variable.replace('['
						+ variable_index[1] + ']', "["
						+ utterance_name.toLowerCase() + "_temp['phrases']['"
						+ variable_name.toLowerCase() + "']["
						+ variable_index[1] + "]]");
		}
		semantic_as_string = semantic_as_string.replace(
				variable,
				"' + function(){try{return " + remapped_variable_name
					+ ";} catch(e){return 'undefined';}}() + '"
		);
		variables =  this.variable_regexp.exec(semantic_as_string);
	}
	}
	return semantic_as_string;
};

GrammarConverter.prototype.get_semantic_interpretationt_of_phrase = function(utterance_name, utterance_def, phrase, semantic_as_string){
	var splitted_phrase = phrase.split(/\s+/),
	length = splitted_phrase.length,
	duplicate_helper = {};
	
	var result = " [* %% = ";
	var i = 0;
	while (i < length){
		i++;
		result += "%"+i;
		if(i < length){
			result += " + ' ' + ";
		}
	}
	result += "; var "+utterance_name+"_temp = {}; "+utterance_name+"_temp['phrases'] = {};";
	for (i = 0; i < length; i += 1) {
		if (typeof(duplicate_helper[splitted_phrase[i]]) == "undefined") {
			duplicate_helper[splitted_phrase[i]] = 0;
			result += utterance_name+"_temp['phrases']['"+splitted_phrase[i].toLowerCase()+"'] = {};";
		} else {
			duplicate_helper[splitted_phrase[i]] += 1;
		}
		result += utterance_name + "_temp['phrases']['"
					+ splitted_phrase[i].toLowerCase() + "']["
					+ duplicate_helper[splitted_phrase[i]] + "] = %" + (i + 1)
					+ "; ";
	}
	result += "var " + this.variable_prefix + "phrase = %%; " + utterance_name
			+ "_temp['phrase']=" + this.variable_prefix + "phrase; "
			+ utterance_name + "_temp['semantic'] = '" + semantic_as_string
			+ "'; " + this.variable_prefix + utterance_name + "["
			+ this.variable_prefix + "phrase] = " + utterance_name + "_temp; "
			+ this.variable_prefix + "result = " + utterance_name + "_temp; *]";
	return result;
};

GrammarConverter.prototype.set_compiled_grammar = function(func){
	this.compiled_grammar = func;
};
