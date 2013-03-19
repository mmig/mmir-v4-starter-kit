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

mobileDS.parser.extendMmirTemplateProcessor = function(theLexerInstance){
	
	theLexerInstance.INCLUDE_SCRIPT 	= 0;
	theLexerInstance.INCLUDE_STYLE	 	= 2;
	theLexerInstance.LOCALIZE	 		= 4;
	theLexerInstance.YIELD_DECLARATION 	= 8;
	theLexerInstance.YIELD_CONTENT 		= 16;
	theLexerInstance.BLOCK 				= 32;
	theLexerInstance.STATEMENT 			= 64;
	theLexerInstance.HELPER 			= 128;
	theLexerInstance.IF 				= 256;
	theLexerInstance.ELSE 				= 512;
	theLexerInstance.FOR 				= 1024;
	theLexerInstance.RENDER 			= 2048;
	
	var IF_TYPE = theLexerInstance.IF;
	
	if(typeof mobileDS !== 'undefined' && typeof mobileDS.parser !==  'undefined' && typeof mobileDS.parser.element !== 'undefined'){
		theLexerInstance.INCLUDE_SCRIPT 	= mobileDS.parser.element.INCLUDE_SCRIPT;
		theLexerInstance.INCLUDE_STYLE 		= mobileDS.parser.element.INCLUDE_STYLE;
		theLexerInstance.LOCALIZE 			= mobileDS.parser.element.LOCALIZE;
		theLexerInstance.YIELD_DECLARATION 	= mobileDS.parser.element.YIELD_DECLARATION;
		theLexerInstance.YIELD_CONTENT 		= mobileDS.parser.element.YIELD_CONTENT;
		theLexerInstance.BLOCK 				= mobileDS.parser.element.BLOCK;
		theLexerInstance.STATEMENT 			= mobileDS.parser.element.STATEMENT;
		theLexerInstance.HELPER 			= mobileDS.parser.element.HELPER;
		theLexerInstance.IF 				= mobileDS.parser.element.IF;
		theLexerInstance.ELSE 				= mobileDS.parser.element.ELSE;
		theLexerInstance.FOR 				= mobileDS.parser.element.FOR;
		theLexerInstance.RENDER 			= mobileDS.parser.element.RENDER;
	}
	
	theLexerInstance.PARSER_SCRIPT_BLOCK 	= 0;
	theLexerInstance.PARSER_SCRIPT_STATMENT = 2;
	theLexerInstance.PARSER_SCRIPT_CONTENT 	= 4;
	theLexerInstance.PARSER_JS_CODE	 		= 8;
	
	
	theLexerInstance.isDebug = true;
	
	theLexerInstance.SCRIPT_CHANtheLexerInstance= 1;
	//theLexerInstance.nesting = 0;
	
	theLexerInstance.scriptBlocks = new Array();
	theLexerInstance.scriptStatements = new Array();
	theLexerInstance.includeScripts = new Array();
	theLexerInstance.includeStyles = new Array();
	theLexerInstance.locales = new Array();
	theLexerInstance.helpers = new Array();
	theLexerInstance.renderPartials = new Array();
	
	theLexerInstance.ifs = new Array();
	theLexerInstance.fors = new Array();
	
	theLexerInstance.yields = new Array();
	theLexerInstance.yieldContents = new Array();
	
	theLexerInstance.lastParsedElement =  null;
	
	var JS_TOKENS = null;
	function getTokenName(tokenType, parser){
		if(!JS_TOKENS){
			JS_TOKENS = parser.getTokenNames();
		}
		return JS_TOKENS[tokenType];
	}
	//theLexerInstance.getTokenName = getTokenName;
	
	function createJSObjectFrom(parseElement, parentObject, parser){
		
		var type = getTokenName(parseElement.getType(), parser);
		if('StringLiteral' === type){
			var str = parseElement.getText();
			return str.substring(1,str.length - 1);
		}
		else if ( 'NAMEDVALUE' === type ){
			
			var name = createJSObjectFrom(parseElement.getChild(0), null, parser);
			
			var value = createJSObjectFrom(parseElement.getChild(1), null, parser);
			
			if(!parentObject){
				parentObject = new Object();
			}
			
			parentObject[name] = value;
			
			return parentObject;
		}
		else if ( 'OBJECT' === type ){
		
			var theValue = new Object();
			var current = null;
			
			for(var data_index = 0, data_size = parseElement.getChildCount(); data_index < data_size; ++ data_index){
				current = parseElement.getChild(data_index);
				theValue = createJSObjectFrom(current, theValue, parser);
			}
			return theValue;
		}
		else if ( 'ARRAY' === type ){
			
			var array_size = parseElement.getChildCount();
			var theValue = new Array();
			var current = null;
			
			for(var array_index = 0; array_index < array_size; ++ array_index){
				current = parseElement.getChild(array_index);
				theValue[array_index] = createJSObjectFrom(current.getChild(0), theValue, parser);
			}
			return theValue;
		}
		else {
			return parseElement.getText();
		}
	}
	//theLexerInstance.createJSObjectFrom = createJSObjectFrom;
	
	function processBlock(parsingObj, result, tokens){
	
		parsingObj.scriptContent = result;
		
		if(!parsingObj.scriptContent){
			if(theLexerInstance.isDebug) print('WARNING: invalid "script block" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.scriptBlocks.push(parsingObj);
		
	}
	theLexerInstance.processBlock = processBlock;
	
	function processStatement(parsingObj, result, tokens){
	
		parsingObj.scriptContent = result;
		
		if(!parsingObj.scriptContent){
			if(theLexerInstance.isDebug) print('WARNING: invalid "script statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.scriptStatements.push(parsingObj);
		
	}
	theLexerInstance.processStatement = processStatement;
	
	function processIncludeScript (parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.scriptPathType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.scriptPath = createJSObjectFrom(tree.getChild(0), null, parser );
		
		if(!parsingObj.scriptPath){
			if(theLexerInstance.isDebug) print('WARNING: invalid "include script statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.includeScripts.push(parsingObj);
		
	}
	theLexerInstance.processIncludeScript = processIncludeScript;
	
	function processIncludeStyle(parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.stylePathType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.stylePath = createJSObjectFrom(tree.getChild(0), null, parser );
		
		if(!parsingObj.stylePath){
			if(theLexerInstance.isDebug) print('WARNING: invalid "include style statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.includeStyles.push(parsingObj);
		
	}
	theLexerInstance.processIncludeStyle = processIncludeStyle;
	
	function processLocalize(parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.name = createJSObjectFrom(tree.getChild(0), null, parser );
		
		if(!parsingObj.name || parsingObj.name.length === 0){
			if(theLexerInstance.isDebug) print('WARNING: invalid "localize statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.locales.push(parsingObj);
		
	}
	theLexerInstance.processLocalize = processLocalize;
	
	function processHelperFunction(parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.helperType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.helper = createJSObjectFrom(tree.getChild(0), null, parser );
		
		if(tree.getChildCount() === 2){
			parsingObj.dataType = getTokenName( tree.getChild(1).getType(), parser);
			var param = null;
			if('OBJECT' === parsingObj.dataType){
				param = new Object();
			}
			parsingObj.data = createJSObjectFrom(tree.getChild(1), param, parser );
		}
		
		if(!parsingObj.helper || parsingObj.helper.length === 0){
			if(theLexerInstance.isDebug) print('WARNING: invalid "helper function statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.helpers.push(parsingObj);
		
	}
	theLexerInstance.processHelperFunction = processHelperFunction;
	
	function processRenderPartial(parsingObj, result, tokens, parser){
	
		//parsingObj.controllerName = result.controller;
		//parsingObj.partialName = result.partial;
		//parsingObj.arguments = result.arguments;
		
				
		var tree = result.tree;
		
		parsingObj.controllerType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.controller = createJSObjectFrom(tree.getChild(0), null, parser );
		
		parsingObj.partialType = getTokenName( tree.getChild(1).getType(), parser);
		parsingObj.partial = createJSObjectFrom(tree.getChild(1), null, parser );
		
		if(tree.getChildCount() === 3){
			parsingObj.dataType = getTokenName( tree.getChild(2).getType(), parser);
			var param = null;
			if('OBJECT' === parsingObj.dataType){
				param = new Object();
			}
			parsingObj.data = createJSObjectFrom(tree.getChild(2), param, parser );
		}
		
		if(false){//!parsingObj.partialName || parsingObj.partialName.length === 0){ TODO implement check
			if(theLexerInstance.isDebug) print('WARNING: invalid "render partial statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.renderPartials.push(parsingObj);
		
	}
	theLexerInstance.processRenderPartial = processRenderPartial;
	
	function processYieldDeclaration(parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.name = createJSObjectFrom(tree.getChild(0), null, parser );
		
		if(!parsingObj.name || parsingObj.name.length === 0){
			if(theLexerInstance.isDebug) print('WARNING: invalid "yield declaration" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.yields.push(parsingObj);
		
	}
	theLexerInstance.processYieldDeclaration = processYieldDeclaration;

	function processYieldContentParam (parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.name = createJSObjectFrom(tree.getChild(0), null, parser );
		
		
		if(!parsingObj.name){
			if(theLexerInstance.isDebug) print('WARNING: invalid "content for specification" (missing name) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
	}
	theLexerInstance.processYieldContentParam = processYieldContentParam;
	
	function processYieldContent (parsingObj, result, tokens){
	
		parsingObj.content = result;
		
		if(!parsingObj.content){
			if(theLexerInstance.isDebug) print('WARNING: invalid "content for specification" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.yieldContents.push(parsingObj);
		
	}
	theLexerInstance.processYieldContent = processYieldContent;
	
	function processIfExpr (parsingObj, result, tokens, parser){
	
		//TODO validate expr! (e.g. detect assignments to undeclared variables...)
		//var tree = result.tree;
		//parsingObj.exprType = getTokenName( tree.getChild(0).getType(), parser);
		//parsingObj.expr = createJSObjectFrom(tree.getChild(0), null, parser );
		
		parsingObj.expr = tokens.toString();
		
		if(!parsingObj.expr){
			if(theLexerInstance.isDebug) print('WARNING: invalid "if statement" (missing expression) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
	}
	theLexerInstance.processIfExpr = processIfExpr;
	
	function processIfContent (parsingObj, result, tokens){
	
		parsingObj.content = result;
		
		if(!parsingObj.content){
			if(theLexerInstance.isDebug) print('WARNING: invalid "if statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.ifs.push(parsingObj);
		
	}
	theLexerInstance.processIfContent = processIfContent;
	
	function processElse (parsingObj, result, tokens){
	
		parsingObj.content = result;
		
		if(!parsingObj.content){
			if(theLexerInstance.isDebug) print('WARNING: invalid "else statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		var lastElem = theLexerInstance.lastParsedElement;
		if(lastElem.type !== IF_TYPE){
			if(theLexerInstance.isDebug) print('WARNING: invalid "else statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			
			throw new org.antlr.runtime.NoViableAltException('invalid else statement: missing preceeding IF!', -1, -1, tokens);
		}
		
		var lastIf = theLexerInstance.ifs[theLexerInstance.ifs.length-1];
		
		lastIf.elseContent = parsingObj;
	}
	theLexerInstance.processElse = processElse;
	
	function processForControl (parsingObj, result, tokens, parser){
	
		//TODO validate expr! (e.g. detect assignments to undeclared variables...)
		//var tree = result.tree;
		//parsingObj.forControlType = getTokenName( tree.getChild(0).getType(), parser);
		//parsingObj.forControl = createJSObjectFrom(tree.getChild(0), null, parser );
		
		parsingObj.forControl = tokens.toString();
		
		if(!parsingObj.expr){
			if(theLexerInstance.isDebug) print('WARNING: invalid "for statement" (missing control statement) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
	}
	theLexerInstance.processForControl = processForControl;
	
	function processForContent (parsingObj, result, tokens){
	
		parsingObj.content = result;
		
		if(!parsingObj.content){
			if(theLexerInstance.isDebug) print('WARNING: invalid "for statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+theLexerInstance.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.fors.push(parsingObj);
		
	}
	theLexerInstance.processForContent = processForContent;
	
	var getLexerFor = function (self, parserType, input){
		if(self.PARSER_SCRIPT_BLOCK === parserType){
			return new MmirScriptBlockLexer(input);
		}
		else if(self.PARSER_SCRIPT_STATEMENT === parserType){
			return new MmirScriptStatementLexer(input);
		}
		else if(self.PARSER_SCRIPT_CONTENT === parserType){
			return new MmirScriptContentLexer(input);
		}
		else if(self.PARSER_JS_CODE === parserType){
			return new ES3Lexer(input);
		}
		print('WARNING: getLexerFor unkonwn parser type '+parserType);
		return null;
	};
	
	var getParserFor = function (self, parserType, tokens){
		if(self.PARSER_SCRIPT_BLOCK === parserType){
			return new MmirScriptBlockParser(tokens);
		}
		else if(self.PARSER_SCRIPT_STATEMENT === parserType){
			return new MmirScriptStatementParser(tokens);
		}
		else if(self.PARSER_SCRIPT_CONTENT === parserType){
			return new MmirScriptContentParser(tokens);
		}
		else if(self.PARSER_JS_CODE === parserType){
			return new ES3Parser(tokens);
		}
		print('WARNING: getParserFor unkonwn parser type '+parserType);
		return null;
	};
	
	var doEnter = function (parserType, self, currentChannel, entryFunc, processFunc, parseResultObject, msg){
		
		if(!entryFunc){
			entryFunc = 'main';
		}
		
		if(!parseResultObject){
			parseResultObject = null;
			if(typeof processFunc !== 'function'){
				msg = processFunc;
				processFunc = null;
			}
		}
		if(!msg){
			msg = '';
		}
		
		if(self.isDebug) print('enter embedded '+msg);//debug
		
		var lexer = getLexerFor(self, parserType, self.input);

		lexer.isDebug = self.isDebug;
		var tokens = new org.antlr.runtime.CommonTokenStream(lexer);
		
		
		var result;
		if(parseResultObject){
			result = parseResultObject;
			result.setEndFrom(tokens);
		}
		else {
			result = new mobileDS.parser.ParsingResult(tokens);
		}
		
		if(self.isDebug){//debug
			//alert(msg+'\n'+JSON.stringify(result));
			var start = result.start;//tokens.getTokens()[0].getStartIndex();
			var end = result.end;//tokens.getTokens()[tokens.size()-1].getStopIndex();
			
			printInfo(msg+'_tokens('+start+'->'+end+')',tokens);
		}
		
		var parser = getParserFor(self, parserType, tokens);
		
		parser.isDebug = self.isDebug;
		var parseResult = parser[entryFunc]();
				
		if(self.isDebug) print(msg+'.'+entryFunc+'() result: >'+parseResult+'<');//debug
		
		if(result.rawResult){
			var rawResults = new Array(2);
			rawResults[0] = result.rawResult;
			rawResults[1] = parseResult;
			result.rawResult = rawResults;
		}
		else {
			result.rawResult = parseResult;
		}
		
		if(typeof processFunc === 'function'){
			processFunc(result, parseResult, tokens, parser);
		}
		
		// returns a SCRIPT token to the java parser but on a
		// different channel than the normal token stream so it
		// doesn't get in the way.
		currentChannel = theLexerInstance.SCRIPT_CHANNEL;
		
		theLexerInstance.lastParsedElement = result;
		
		return result;
	};
	
	theLexerInstance.enterBlock = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
		return doEnter(theLexerInstance.PARSER_SCRIPT_BLOCK, theLexerInstance, currentChannel, entryFunc, processFunc, parseResultObject, msg);
	};
	
	theLexerInstance.enterScript = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
		return doEnter(theLexerInstance.PARSER_SCRIPT_STATEMENT, theLexerInstance, currentChannel, entryFunc, processFunc, parseResultObject, msg);
	};
	
	theLexerInstance.enterContent = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
		return doEnter(theLexerInstance.PARSER_SCRIPT_CONTENT, theLexerInstance, currentChannel, entryFunc, processFunc, parseResultObject, msg);
	};
	
	theLexerInstance.enterJavaScript = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
		return doEnter(theLexerInstance.PARSER_JS_CODE, theLexerInstance, currentChannel, entryFunc, processFunc, parseResultObject, msg);
	};
};

mobileDS.parser.ParsingResult = function (thetokens){
	//NOTE: must invoke getTokens() for initializing size() etc.!
	if(thetokens.getTokens() && thetokens.size() > 0){
		this.start = thetokens.getTokens()[0].getStartIndex();
		this.end = thetokens.getTokens()[thetokens.size()-1].getStopIndex();
	} 
	else {
		this.start = -1;
		this.end = -1;
	}
};
mobileDS.parser.ParsingResult.prototype.setStartFrom = function(thetokens){
	//NOTE: must invoke getTokens() for initializing size() etc.!
	if(thetokens.getTokens() && thetokens.size() > 0){
		this.start = thetokens.getTokens()[0].getStartIndex();
	} 
	else {
		this.start = -1;
	}
};
mobileDS.parser.ParsingResult.prototype.setEndFrom = function(thetokens){
	//NOTE: must invoke getTokens() for initializing size() etc.!
	if(thetokens.getTokens() && thetokens.size() > 0){
		this.end = thetokens.getTokens()[thetokens.size()-1].getStopIndex();
	} 
	else {
		this.end = -1;
	}
};