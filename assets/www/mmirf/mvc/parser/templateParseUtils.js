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

/** TODO move this function
 *
 * Get the index in the String str, where line number lineNo
 * starts.
 * 
 * New lines begin after \n, \r\n, or \r.
 * 
 * If lineNo is <= 1, the function returns always 0.
 * 
 * If the lineNo is greater than the count of lins in str, the string length itself is returned. 
 * 
 * @function getIndexForLine
 * @param {String} str the string
 * @param {Number} lineNo the line number (first line is 1)
 */
var getIndexForLine = (function(){
	var detectLinebreak = /(\r?\n|\r)/igm;
	return function(str, lineNo){
		if(lineNo <= 1){
			return 0;
		}
		var match;
		var count = 1;
		while(match = detectLinebreak.exec(str)){
			//ASSERT: lineNo >= 2
			if(++count == lineNo){
				break;
			}
		}
		if(match){
			return match.index + match[1].length;
		}
		//request line-no. >= 2 AND loop "detect enough" linebreaks => the request line index starts after strings ends => return string's length
		return str.length;
	};
})();

/** TODO move this function
 *
 * Get the line in the String str, in which the char at index is included.
 * 
 * New lines begin after \n, \r\n, or \r,
 * e.g. for line X: 
 * <pre>
 *  ...\r\n
 *        ^
 * </pre>
 * the line number will be X (i.e. the line-break itself is still included in the current line).
 * 
 * If index is < 0, the function returns always 1.
 * 
 * If the index is greater than str.length, -1 is returned. 
 * 
 * @function getLineForIndex
 * @param {String} str the string
 * @param {Number} index the char index for which to find the line number (first line is 1)
 */
var getLineForIndex = (function(){
	var detectLinebreak = /(\r?\n|\r)/ig;
	return function(str, index){
		if(index < 0){
			return 1;
		}
		if(index >= str.length){
			return -1;
		}
		//ASSERT index is at least within line 1
		var match;
		var count = 1;
		var isNextLineFound = false;
		while(match = detectLinebreak.exec(str)){
			if(match.index + match[1].length > index){
				isNextLineFound = true;
				break;
			}
			++count;
		}
		if(match){
			//need to reset regexpr for next call:
			detectLinebreak.test(str);
		}
		if(!isNextLineFound){
			//loop ended prematurely: fix line-count
			return count - 1;
		}
		return count;
	};
})();

/** TODO move this function
 *
 * @function extractErrorPosition
 */
extractErrorPosition = (function(){
	var detectLine = /line (\d+):(\d+)/i;
	return function extractErrorPositionImpl(msg, offset, originalContent){
//		console.log('\nTEST1_extractErrorPositionImpl with arguments '+arguments.length+'\n');
		var result = detectLine.exec(msg);
//		console.log('\nTEST2_result for "'+msg+'": '+result+'\n');
		var pos = null;
		if(result){
			pos = {
					line: parseInt(result[1],10),
					index: parseInt(result[2],10)
			};
//			console.log('\nTEST3_pos: '+JSON.stringify(pos)+', offset: '+offset+'\n');
			
			if(offset && offset !== 0){
//				console.log('\nTEST4_offset: '+offset+'\n');
				var lineOffset = getLineForIndex(originalContent, offset);
				var newLine = lineOffset + pos.line - 1;
				var fixed = msg.substring(0,result.index + 'line '.length) + newLine + ':' + pos.index + msg.substring(result.index + result[0].length);
				pos.text = fixed;
				pos.originalLine = pos.line;
				pos.line = newLine;
//				pos.originalContent = originalContent;
//				pos.offset = offset + pos.index;
			}
			else {
				pos.text = msg;
			}
		}
		return pos;
	}
})();

var CURRENT_PARSED_VIEW = null;//FIXME
var parserCreatePrintMessage = function(prefix, msg){//FIXME
	if(CURRENT_PARSED_VIEW != null){
		
		var rootView = null;
		var details = '';
		if(CURRENT_PARSED_VIEW.getController){
			details += 'CTRL("' + CURRENT_PARSED_VIEW.getController().getName() + '")';
		}
		
		if(CURRENT_PARSED_VIEW.getView){
			if(details.length > 0){
				details += '->';
			}
			details += 'VIEW("' + CURRENT_PARSED_VIEW.getView().getName() + '")';
			rootView = CURRENT_PARSED_VIEW.getView();
		}
		
		if(details.length > 0){
			details += '->';
		}
		details += CURRENT_PARSED_VIEW.constructor.name;
		
		if(CURRENT_PARSED_VIEW.getName){
			details += '("' + CURRENT_PARSED_VIEW.getName() + '")';
		}
		
		if(rootView && typeof CURRENT_PARSED_VIEW.getStart !== 'undefined'){
			
			var pos = extractErrorPosition(msg, CURRENT_PARSED_VIEW.getStart(), rootView.getDefinition());
//			console.log('\nTEST_A_pos: '+JSON.stringify(pos)+', offset: '+CURRENT_PARSED_VIEW.getStart() +'\n');
			if(pos){

				msg = pos.text;
				
				//msg += '\n\t at line '+pos.line+', index '+pos.index;
				var content = rootView.getDefinition();
				var line = null;
				var offset = CURRENT_PARSED_VIEW.getStart();

				
				if(content){
					var start = getIndexForLine(content, pos.line);
					var end = start;
					var len = content.length;
					while(end < len && (content[end] != '\r' && content[end] != '\n')){
						++end;
					}
					
					line = content.substring(start,end);
				}
				
				if(line){
					
					//marker for "pointing" the error
					var marker = [];
					for(var i=0; i < pos.index; ++i){
						if(line[i] == '\t'){
							//need to include tabs themselves, since they
							//  take more than 1 char-positions when displayed:
							marker.push('\t');
						}
						else {
							marker.push(' ');
						}
					}
					//add marker symbol, that points to error in the line above:
					marker.push('^');
	
					msg += ' at line '+pos.line+':';
					msg += '\n "'+line+'"';        //<- the line with the error
					msg += '\n  '+marker.join(''); //<- the marker line (will only be correctly aligned for fixed-width fonts)
				}
			}
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