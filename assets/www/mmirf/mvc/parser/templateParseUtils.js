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

var mobileDS = window.mobileDS || {};
mobileDS.parser = mobileDS.parser || {};


var print = function(msg){//FIXME
	console.log(msg);
};

var printInfo = function(prefix, msg){//FIXME
	console.info(parserCreatePrintMessage(prefix,msg));
};

var parserPrintDebug = function(prefix, msg){//FIXME
	console.debug(parserCreatePrintMessage(prefix,msg));
};

var parserPrintInfo = function(prefix, msg){//FIXME
	console.info(parserCreatePrintMessage(prefix,msg));
};

var parserPrintWarning = function(prefix, msg){//FIXME
	console.warn(parserCreatePrintMessage(prefix,msg));
};

var parserPrintError = function(prefix, msg){//FIXME
	console.error(parserCreatePrintMessage(prefix,msg));
};

var CURRENT_PARSED_VIEW = null;//FIXME
var parserCreatePrintMessage = function(prefix, msg){//FIXME
	if(CURRENT_PARSED_VIEW != null){
		
		var details = CURRENT_PARSED_VIEW.constructor.name;
		if(CURRENT_PARSED_VIEW.getName){
			details += '(' + CURRENT_PARSED_VIEW.getName() + ')';
		}
		if(CURRENT_PARSED_VIEW.getController){
			details += '_CTRL[' + CURRENT_PARSED_VIEW.getController().getName() + ']';
		}
		
		return prefix + 'in ' + details + ' - ' + msg;
	}
	else {
		return prefix+msg;
	}
};

/**
 * A Utility class for parsing (eHTML) templates.<br>
 * 
 * @example <code>mobileDS.ParserUtils.getInstance()</code>
 * @class ParserUtils
 * @category parser
 * 
 * @see mobileDS.parser.ParserUtils#constructor
 */
mobileDS.parser.ParserUtils = (function(){

    /**
     * Object containing the instance of the class ParserUtils 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance = null;
    
    var isDebug = true;//TODO read/set from configuration
    
    MmirTemplateLexer.prototype.emitErrorMessage = function(msg) {
    	parserPrintError('[ERROR] TemplateLexer: ',msg);
	};
//	MmirTemplateParser.prototype.emitErrorMessage = function(msg) {
//		parserPrintError('[ERROR] TemplateParser: ',msg);
//	};
	
	ES3Lexer.prototype.emitErrorMessage = function(msg) {
		parserPrintError('[ERROR] JavaScriptLexer_ES3: ',msg);
	};
	ES3Parser.prototype.emitErrorMessage = function(msg) {
		parserPrintError('[ERROR] JavaScriptParser_ES3: ',msg);
	};
	
	MmirScriptBlockLexer.prototype.emitErrorMessage = function(msg) {
		parserPrintError('[ERROR] ScriptBlockLexer: ',msg);
	};
	MmirScriptBlockParser.prototype.emitErrorMessage = function(msg) {
		parserPrintError('[ERROR] ScriptBlockParser: ',msg);
	};
	
	MmirScriptStatementLexer.prototype.emitErrorMessage = function(msg) {
		parserPrintError('[ERROR] ScriptStatementLexer: ',msg);
	};
	MmirScriptStatementParser.prototype.emitErrorMessage = function(msg) {
		parserPrintError('[ERROR] ScriptStatementParser: ',msg);
	};
	
	MmirScriptContentLexer.prototype.emitErrorMessage = function(msg) {
		parserPrintError('[ERROR] ContentLexer: ',msg);
	};
	MmirScriptContentParser.prototype.emitErrorMessage = function(msg) {
		parserPrintError('[ERROR] ContentParser: ',msg);
	};
	
	function internalParse(text) {

	    var input = new org.antlr.runtime.ANTLRStringStream(text);
	  	var lexer = new MmirTemplateLexer(input);
	  	
	  	lexer.isDebug = isDebug;
	  	
	  	var tokens = new org.antlr.runtime.CommonTokenStream(lexer);

		var result 				= new Object();
		result.rawTemplateText 	= tokens.toString();
		result.scripts 			= lexer.includeScripts;
		result.styles 			= lexer.includeStyles;
		result.localizations 	= lexer.locales;
		result.ifs	 			= lexer.ifs;
		result.fors 			= lexer.fors;
		result.yields 			= lexer.yields;
		result.contentFors 		= lexer.yieldContents;
		result.helpers	 		= lexer.helpers;
		result.partials 		= lexer.renderPartials;
		result.escapes	 		= lexer.escape;
		result.scriptStatements	= lexer.scriptStatements;
		result.scriptBlocks		= lexer.scriptBlocks;
		result.vars				= lexer.vars;
		result.comments			= lexer.comments;
		//end: parsing results
		
		
		lexer = null;
		
		return result;
	}
	
	function internalParseJS(text, entryRuleName) {
	  	
	  	var input = new org.antlr.runtime.ANTLRStringStream(text);
	  	var lexer = new ES3Lexer(input);
	  	lexer.isDebug = isDebug;
	  	
	  	var tokens = new org.antlr.runtime.CommonTokenStream(lexer);
		var parser = new ES3Parser(tokens);
		
		if(!entryRuleName){
//		var parseResult = 
			parser.program();//<- parse with main rule 'program' in ES3Parser
		}
		else {
//			var parseResult = 
				parser[entryRuleName]();//<- parse with main rule 'program' in ES3Parser
		}
		var result 				= new Object();
		result.rawTemplateText 	= tokens.toString();
		
		var varRefs = parser.getVarReferences();
		if(varRefs){
			result.varReferences = varRefs;
		}
		
		//TODO handle potentially global var-declaration (i.e. assignments without preceding var, where the variable is undefined yet)
		
		//end: parsing results
		
		lexer = null;
		parser = null;
		
		return result;
	}
	
//	var getVarReferences = function(parser){
//		
//		var size = parser.ampersatIdentifiers.length;
//		
//		if(size === 0){
//			return null;
//		}
//		
//		var varRefs = new Array(size);
//		for(var i=0; i < size; ++i){
//			var ref = parser.ampersatIdentifiers[i];
//			
//			var refObj = new mobileDS.parser.ParsingResult(ref);
////			refObj.start = ref.start;
//			
//			//correct end-position (token's stop-index is exactly the last char-index, whereas ParsingResult's end-position is token.stopIndex + 1)
//			refObj.end = refObj.getEnd() + 1;
//			
//			refObj.type = mobileDS.parser.element.VAR_REFERENCE;
//			
//			varRefs[i] = refObj;
//		}
//		return varRefs;
//	};
	
    /**
	 * Constructor-Method of Class {@link mobileDS.parser.ParserUtils}
	 * 
	 * @constructor
	 * @augments mobileDS.parser.ParserUtils
	 * @memberOf mobileDS.parser.ParserUtils.prototype
	 */
    function constructor(){
        //private members (currently none)
    	
    	/** @lends mobileDS.parser.ParserUtils.prototype */
    	return {
        	//public members:

    		/**
    		 * Parse a text as view template (e.g. *.ehtml files). 
    		 * 
    		 * @param {String} rawTemplateString the text that should be parsed
    		 * @param {Object} [view] (optional) the view to which the <tt>rawTemplateString</tt> belongs (only used for error messages)
    		 * @returns {mobileDS.parser.ParsingResult} the parsing result 
    		 */
    		parse: function(rawTemplateString, view){
    			
    			if(view){
    				CURRENT_PARSED_VIEW = view;
    			}
    			else {
    				CURRENT_PARSED_VIEW = null;
    			}
    			
    			return internalParse(rawTemplateString);
    		},
    		
    		/**
    		 * Parse a text as JavaScript.
    		 * 
    		 * @param {String} rawTemplateString the text that should be parsed
    		 * @param {String} [parseEntryRuleName] (optional) specifies the JavaScript element that should be parsed for
    		 * @param {Object} [view] (optional) the view to which the <tt>rawTemplateString</tt> belongs (only used for error messages)
    		 * @returns {mobileDS.parser.ParsingResult} the parsing result 
    		 */
    		parseJS: function(rawTemplateString, parseEntryRuleName, view){
    			
    			//in case only 2 arguments are present: is 2nd the View object?
    			if(!view && typeof parseEntryRuleName !== 'string' && typeof parseEntryRuleName === 'object'){
    				view = parseEntryRuleName;
    				parseEntryRuleName = null;
    			}
    			
    			if(view){
    				CURRENT_PARSED_VIEW = view;
    			}
    			else {
    				CURRENT_PARSED_VIEW = null;
    			}
    			
    			return internalParseJS(rawTemplateString, parseEntryRuleName);
    		}
    	};
    }
    
    return {
        /**
         * Object containing the instance of the class {@link mobileDS.ParserUtils} 
         * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.ParserUtils}
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