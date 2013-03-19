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

grammar MmirTemplate;

options{
	language = JavaScript;
	output=AST;
}

@lexer::members {

	this.INCLUDE_SCRIPT 	= 0;
	this.INCLUDE_STYLE 	= 2;
	this.LOCALIZE	 	= 4;
	this.YIELD_DECLARATION 	= 8;
	this.YIELD_CONTENT 	= 16;
	this.BLOCK 		= 32;
	this.STATEMENT 		= 64;
	this.HELPER 		= 128;
	this.IF 		= 256;
	this.ELSE 		= 512;
	this.FOR 		= 1024;
	this.RENDER 		= 2048;
	
	var IF_TYPE = this.IF;
	
	if(typeof mobileDS !== 'undefined' && typeof mobileDS.parser !==  'undefined' && typeof mobileDS.parser.element !== 'undefined'){
		this.INCLUDE_SCRIPT 		= mobileDS.parser.element.INCLUDE_SCRIPT;
		this.INCLUDE_STYLE 		= mobileDS.parser.element.INCLUDE_STYLE;
		this.LOCALIZE 			= mobileDS.parser.element.LOCALIZE;
		this.YIELD_DECLARATION 		= mobileDS.parser.element.YIELD_DECLARATION;
		this.YIELD_CONTENT 		= mobileDS.parser.element.YIELD_CONTENT;
		this.BLOCK 			= mobileDS.parser.element.BLOCK;
		this.STATEMENT 			= mobileDS.parser.element.STATEMENT;
		this.HELPER 			= mobileDS.parser.element.HELPER;
		this.IF 			= mobileDS.parser.element.IF;
		this.ELSE 			= mobileDS.parser.element.ELSE;
		this.FOR 			= mobileDS.parser.element.FOR;
		this.RENDER 			= mobileDS.parser.element.RENDER;
	}
	
	this.PARSER_SCRIPT_BLOCK 	= 0;
	this.PARSER_SCRIPT_STATMENT 	= 2;
	this.PARSER_SCRIPT_CONTENT 	= 4;
	this.PARSER_JS_CODE	 	= 8;
	
	
	this.isDebug = true;
	
	var theLexerInstance = this;
	this.SCRIPT_CHANNEL = 1;
	//this.nesting = 0;
	
	this.scriptBlocks = new Array();
	this.scriptStatements = new Array();
	this.includeScripts = new Array();
	this.includeStyles = new Array();
	this.locales = new Array();
	this.helpers = new Array();
	this.renderPartials = new Array();
	
	this.ifs = new Array();
	this.fors = new Array();
	
	this.yields = new Array();
	this.yieldContents = new Array();
	
	this.lastParsedElement =  null;
	
	var JS_TOKENS = null;
	function getTokenName(tokenType, parser){
		if(!JS_TOKENS){
			JS_TOKENS = parser.getTokenNames();
		}
		return JS_TOKENS[tokenType];
	}
	//this.getTokenName = getTokenName;
	
	function createJSObjectFrom(parseElement, parentObject, parser){
		
		var type = getTokenName(parseElement.getType(), parser);
		if('StringLiteral' === type){
			var str = parseElement.getText();
			return str.substring(1,str.length - 1);
		}
		else if ( 'NAMEDVALUE' === type ){
			var theValue = new Object();
			
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
			
			var array_size = parseElement.getChildCount()
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
	//this.createJSObjectFrom = createJSObjectFrom;
	
	var ParsingResult = function (thetokens){
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
	ParsingResult.prototype.setStartFrom = function(thetokens){
		//NOTE: must invoke getTokens() for initializing size() etc.!
		if(thetokens.getTokens() && thetokens.size() > 0){
			this.start = thetokens.getTokens()[0].getStartIndex();
		} 
		else {
			this.start = -1;
		}
	}
	ParsingResult.prototype.setEndFrom = function(thetokens){
		//NOTE: must invoke getTokens() for initializing size() etc.!
		if(thetokens.getTokens() && thetokens.size() > 0){
			this.end = thetokens.getTokens()[thetokens.size()-1].getStopIndex();
		} 
		else {
			this.end = -1;
		}
	}
	
	function processBlock(parsingObj, result, tokens){
	
		parsingObj.scriptContent = result;
		
		if(!parsingObj.scriptContent){
			if(this.isDebug) print('WARNING: invalid "script block" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.scriptBlocks.push(parsingObj);
		
	}
	this.processBlock = processBlock;
	
	function processStatement(parsingObj, result, tokens){
	
		parsingObj.scriptContent = result;
		
		if(!parsingObj.scriptContent){
			if(this.isDebug) print('WARNING: invalid "script statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.scriptStatements.push(parsingObj);
		
	}
	this.processStatement = processStatement;
	
	function processIncludeScript (parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.scriptPathType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.scriptPath = createJSObjectFrom(tree.getChild(0), null, parser );
		
		if(!parsingObj.scriptPath){
			if(this.isDebug) print('WARNING: invalid "include script statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.includeScripts.push(parsingObj);
		
	}
	this.processIncludeScript = processIncludeScript;
	
	function processIncludeStyle(parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.stylePathType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.stylePath = createJSObjectFrom(tree.getChild(0), null, parser );
		
		if(!parsingObj.stylePath){
			if(this.isDebug) print('WARNING: invalid "include style statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.includeStyles.push(parsingObj);
		
	}
	this.processIncludeStyle = processIncludeStyle;
	
	function processLocalize(parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.name = createJSObjectFrom(tree.getChild(0), null, parser );
		
		if(!parsingObj.name || parsingObj.name.length === 0){
			if(this.isDebug) print('WARNING: invalid "localize statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.locales.push(parsingObj);
		
	}
	this.processLocalize = processLocalize;
	
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
			if(this.isDebug) print('WARNING: invalid "helper function statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.helpers.push(parsingObj);
		
	}
	this.processHelperFunction = processHelperFunction;
	
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
			if(this.isDebug) print('WARNING: invalid "render partial statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.renderPartials.push(parsingObj);
		
	}
	this.processRenderPartial = processRenderPartial;
	
	function processYieldDeclaration(parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.name = createJSObjectFrom(tree.getChild(0), null, parser );
		
		if(!parsingObj.name || parsingObj.name.length === 0){
			if(this.isDebug) print('WARNING: invalid "yield declaration" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.yields.push(parsingObj);
		
	}
	this.processYieldDeclaration = processYieldDeclaration;

	function processYieldContentParam (parsingObj, result, tokens, parser){
	
		var tree = result.tree;
		
		parsingObj.nameType = getTokenName( tree.getChild(0).getType(), parser);
		parsingObj.name = createJSObjectFrom(tree.getChild(0), null, parser );
		
		
		if(!parsingObj.name){
			if(this.isDebug) print('WARNING: invalid "content for specification" (missing name) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
	}
	this.processYieldContentParam = processYieldContentParam;
	
	function processYieldContent (parsingObj, result, tokens){
	
		parsingObj.content = result;
		
		if(!parsingObj.content){
			if(this.isDebug) print('WARNING: invalid "content for specification" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.yieldContents.push(parsingObj);
		
	}
	this.processYieldContent = processYieldContent;
	
	function processIfExpr (parsingObj, result, tokens, parser){
	
		//TODO validate expr! (e.g. detect assignments to undeclared variables...)
		//var tree = result.tree;
		//parsingObj.exprType = getTokenName( tree.getChild(0).getType(), parser);
		//parsingObj.expr = createJSObjectFrom(tree.getChild(0), null, parser );
		
		parsingObj.expr = tokens.toString();
		
		if(!parsingObj.expr){
			if(this.isDebug) print('WARNING: invalid "if statement" (missing expression) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
	}
	this.processIfExpr = processIfExpr;
	
	function processIfContent (parsingObj, result, tokens){
	
		parsingObj.content = result;
		
		if(!parsingObj.content){
			if(this.isDebug) print('WARNING: invalid "if statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.ifs.push(parsingObj);
		
	}
	this.processIfContent = processIfContent;
	
	function processElse (parsingObj, result, tokens){
	
		parsingObj.content = result;
		
		if(!parsingObj.content){
			if(this.isDebug) print('WARNING: invalid "else statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		var lastElem = this.lastParsedElement;
		if(lastElem.type !== IF_TYPE){
			if(this.isDebug) print('WARNING: invalid "else statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			
			throw new org.antlr.runtime.NoViableAltException('invalid else statement: missing preceeding IF!', -1, -1, tokens);
		}
		
		var lastIf = theLexerInstance.ifs[theLexerInstance.ifs.length-1];
		
		lastIf.elseContent = parsingObj;
	}
	this.processElse = processElse;
	
	function processForControl (parsingObj, result, tokens, parser){
	
		//TODO validate expr! (e.g. detect assignments to undeclared variables...)
		//var tree = result.tree;
		//parsingObj.forControlType = getTokenName( tree.getChild(0).getType(), parser);
		//parsingObj.forControl = createJSObjectFrom(tree.getChild(0), null, parser );
		
		parsingObj.forControl = tokens.toString();
		
		if(!parsingObj.expr){
			if(this.isDebug) print('WARNING: invalid "for statement" (missing control statement) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
	}
	this.processForControl = processForControl;
	
	function processForContent (parsingObj, result, tokens){
	
		parsingObj.content = result;
		
		if(!parsingObj.content){
			if(this.isDebug) print('WARNING: invalid "for statement" (missing content) at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.fors.push(parsingObj);
		
	}
	this.processForContent = processForContent;
	
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
			result = new ParsingResult(tokens);
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
		
		this.lastParsedElement = result;
		
		return result;
	};
	
	this.enterBlock = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
		return doEnter(this.PARSER_SCRIPT_BLOCK, this, currentChannel, entryFunc, processFunc, parseResultObject, msg);
	};
	
	this.enterScript = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
		return doEnter(this.PARSER_SCRIPT_STATEMENT, this, currentChannel, entryFunc, processFunc, parseResultObject, msg);
	};
	
	this.enterContent = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
		return doEnter(this.PARSER_SCRIPT_CONTENT, this, currentChannel, entryFunc, processFunc, parseResultObject, msg);
	};
	
	this.enterJavaScript = function (currentChannel, entryFunc, processFunc, msg, parseResultObject){
		return doEnter(this.PARSER_JS_CODE, this, currentChannel, entryFunc, processFunc, parseResultObject, msg);
	};
}

main
	: text
	;
	
text
	: line+
	;
	
line 	: (other | STRING | SSTRING | CHAR)* (NL | END)
	;
	
other	: ESC_DoEnter
	| COMMENT
	| DoEnterBlock
	| DoEnterStatement
	| DoEnterIncludeScript
	| DoEnterIncludeStyle
	| DoEnterLocalize
	| DoEnterYieldDeclaration
	| DoEnterYieldContent
	;

ESC_DoEnter 	:	'@@' ;

DoEnterBlock	:	s='@{'
            {
             var result = this.enterBlock($channel, 'main', this.processBlock, 'BLOCK');
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.BLOCK;
            }
            {$channel=HIDDEN;}
        ;

DoEnterStatement :   s='@('
            {
             var result = this.enterScript($channel, 'main', this.processStatement, 'STATEMENT');
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.STATEMENT;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterIncludeScript :   s='@script('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processIncludeScript, 'INCLUDE_SCRIPT');
             //correct start/end positions to include enclosing @script() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.INCLUDE_SCRIPT;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterIncludeStyle :   s='@style('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processIncludeStyle, 'INCLUDE_STYLE');
             //correct start/end positions to include enclosing @style() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.INCLUDE_STYLE;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterLocalize :   s='@localize('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processLocalize, 'LOCALIZE');
             //correct start/end positions to include enclosing @locale() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.LOCALIZE;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterHelper :   s='@helper('
            {
             var result = this.enterJavaScript($channel, 'embeddedDataCallStatement', this.processHelperFunction, 'HELPER_FUNCTION');
             //correct start/end positions to include enclosing @helper() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.HELPER;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterRender :   s='@render('
            {
             var result = this.enterJavaScript($channel, 'embeddedRenderControlStatement', this.processRenderPartial, 'RENDER_PARTIAL');
             //correct start/end positions to include enclosing @render() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.RENDER;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterYieldDeclaration :   s='@yield('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processYieldDeclaration, 'YieldDeclaration');
             //correct start/end positions to include enclosing @yield() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.HELPER;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterYieldContent :   s='@contentFor('
            {
             var result = this.enterJavaScript($channel, 'embeddedCallStatement', this.processYieldContentParam, 'YieldContentParam');
             //correct start/end positions to include enclosing @contentFor(){ ... }@ statement
             result.start = $s.getStartIndex();
             
             result = this.enterContent($channel, 'content', this.processYieldContent, 'YieldContent', result);
             
	     result.end = result.end + 2;
	     result.type = this.YIELD_CONTENT;
	     
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterIfStatement :   s='@if('
            {
             var result = this.enterJavaScript($channel, 'embeddedIfExpressionFragment', this.processIfExpr, 'IfExpr');
             //correct start/end positions to include enclosing @if(){ ... }@ statement
             result.start = $s.getStartIndex();
             
             result = this.enterContent($channel, 'content', this.processIfContent, 'IfContent', result);
             
	     result.end = result.end + 2;
	     result.type = this.IF;
	     
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterElseStatement :   s='@else'
            {
             var result = this.enterContent($channel, 'content', this.processElse, 'ELSE', result);
             
             //correct start/end positions to include enclosing @else{ ... }@ statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.ELSE;
	     
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterForStatement :   s='@for('
            {
             var result = this.enterJavaScript($channel, 'embeddedForControlStatement', this.processForControl, 'ForControl');
             //correct start/end positions to include enclosing @if(){ ... }@ statement
             result.start = $s.getStartIndex();
             
             result = this.enterContent($channel, 'content', this.processForContent, 'ForContent', result);
             
	     result.end = result.end + 2;
	     result.type = this.FOR;
	     
            }
            {$channel=HIDDEN;}
        ;

NL
	: '\r'? '\n'
	| '\r'		// Line feed.
	| '\u2028'	// Line separator.
	| '\u2029'	// Paragraph separator.
	;

END_SCRIPT :	'}@';

CHAR	:	~('\n'|'\r');

COMMENT
    :   '@*' ( options {greedy=false;} : . )* '*@'
    ;

STRING
    :  '"' ( options {greedy=false;}: (ESC_SEQ | ~('\\'|'"') ))* '"'
    ;
    
SSTRING
    :  '\'' ( options {greedy=false;}: (ESC_SEQ | ~('\\'|'\'') ))* '\''
    ;

fragment
HEX_DIGIT : ('0'..'9'|'a'..'f'|'A'..'F') ;

fragment
ESC_SEQ
    :   '\\' ('b'|'t'|'n'|'f'|'r'|'\"'|'\''|'\\')
    |   UNICODE_ESC
    |   OCTAL_ESC
    ;

fragment
OCTAL_ESC
    :   '\\' ('0'..'3') ('0'..'7') ('0'..'7')
    |   '\\' ('0'..'7') ('0'..'7')
    |   '\\' ('0'..'7')
    ;

fragment
UNICODE_ESC
    :   '\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
    ;

/** When the template parser sees end-of-comment it just says 'I'm done', which
 *  consumes the tokens and forces this template parser (feeding
 *  off the input stream currently) to exit.
 */
END     : EOF {this.emit(org.antlr.runtime.Token.EOF_TOKEN);}
          {if(this.isDebug) print("exit text");/*debug*/}
        ;