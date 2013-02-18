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
	if(typeof mobileDS !== 'undefined' && typeof mobileDS.parser !==  'undefined' && typeof mobileDS.parser.element !== 'undefined'){
		this.INCLUDE_SCRIPT 		= mobileDS.parser.element.INCLUDE_SCRIPT;
		this.INCLUDE_STYLE 		= mobileDS.parser.element.INCLUDE_STYLE;
		this.LOCALIZE 			= mobileDS.parser.element.LOCALIZE;
		this.YIELD_DECLARATION 		= mobileDS.parser.element.YIELD_DECLARATION;
		this.YIELD_CONTENT 		= mobileDS.parser.element.YIELD_CONTENT;
		this.BLOCK 			= mobileDS.parser.element.BLOCK;
		this.STATEMENT 			= mobileDS.parser.element.STATEMENT;
	}

	
	this.isDebug = true;
	
	var theLexerInstance = this;
	this.SCRIPT_CHANNEL = 1;
	//this.nesting = 0;
	
	this.includeScripts = new Array();
	this.includeStyles = new Array();
	this.locales = new Array();
	
	
	this.yields = new Array();
	this.yieldContents = new Array();
	
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
	
	function processIncludeScript (parsingObj, result, tokens){
	
		parsingObj.scriptPath = result;
		
		if(!parsingObj.scriptPath){
			if(this.isDebug) print('WARNING: invalid "include script statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.includeScripts.push(parsingObj);
		
	}
	this.processIncludeScript = processIncludeScript;
	
	function processIncludeStyle(parsingObj, result, tokens){
	
		parsingObj.stylePath = result;
		
		if(!parsingObj.stylePath){
			if(this.isDebug) print('WARNING: invalid "include style statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.includeStyles.push(parsingObj);
		
	}
	this.processIncludeStyle = processIncludeStyle;
	
	function processLocalize(parsingObj, result, tokens){
	
		parsingObj.name = result;
		
		if(!parsingObj.name || parsingObj.name.length === 0){
			if(this.isDebug) print('WARNING: invalid "localize statement" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.locales.push(parsingObj);
		
	}
	this.processLocalize = processLocalize;
	
	function processYieldDeclaration(parsingObj, result, tokens){
	
		parsingObj.name = result;
		
		if(!parsingObj.name || parsingObj.name.length === 0){
			if(this.isDebug) print('WARNING: invalid "yield declaration" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.yields.push(parsingObj);
		
	}
	this.processYieldDeclaration = processYieldDeclaration;

	function processYieldContent (parsingObj, result, tokens){
	
		parsingObj.name = result.theName;
		parsingObj.content = result.theContent;
		
		if(!parsingObj.name || !parsingObj.content){
			if(this.isDebug) print('WARNING: invalid "content for specification" at ['+parsingObj.start+','+parsingObj.end+'] -> "'+this.input.data.substring(parsingObj.start,parsingObj.end)+'"');//debug
			return;
		}
		
		theLexerInstance.yieldContents.push(parsingObj);
		
	}
	this.processYieldContent = processYieldContent;
	
	var doEnter = function (isContentNotScript, self, currentChannel, entryFunc, processFunc, msg){
		
		if(!entryFunc){
			entryFunc = 'main';
		}
		if(!msg){
			msg = '';
			if(typeof processFunc !== 'function'){
				msg = processFunc;
				processFunc = null;
			}
		}
		
		if(self.isDebug) print('enter embedded '+msg);//debug
		
		var lexer = isContentNotScript? 
				  new MmirScriptContentLexer(self.input)
				: new MmirScriptLexer(self.input);

		lexer.isDebug = self.isDebug;
		var tokens = new org.antlr.runtime.CommonTokenStream(lexer);
		
		
		var result = new ParsingResult(tokens);
		
		if(self.isDebug){//debug
			//alert(msg+'\n'+JSON.stringify(result));
			var start = result.start;//tokens.getTokens()[0].getStartIndex();
			var end = result.end;//tokens.getTokens()[tokens.size()-1].getStopIndex();
			
			printInfo(msg+'_tokens('+start+'->'+end+')',tokens);
		}
		
		var parser = isContentNotScript?
				  new MmirScriptContentParser(tokens)
				: new MmirScriptParser(tokens);
		
		parser.isDebug = self.isDebug;
		var parseResult = parser[entryFunc]();
				
		if(self.isDebug) print(msg+'.'+entryFunc+'() result: >'+parseResult+'<');//debug
		
		//var result = new Object();
		result.rawResult = parseResult;
		//result.start = start;
		//result.end = end;
		
		if(typeof processFunc === 'function'){
			processFunc(result, parseResult, tokens);
		}
		
		// returns a SCRIPT token to the java parser but on a
		// different channel than the normal token stream so it
		// doesn't get in the way.
		currentChannel = theLexerInstance.SCRIPT_CHANNEL;
		
		return result;
	};
	
	this.enterScript = function (currentChannel, entryFunc, processFunc, msg){
		return doEnter(false, this, currentChannel, entryFunc, processFunc, msg);
	};
	
	this.enterContent = function (currentChannel, entryFunc, processFunc, msg){
		return doEnter(true, this, currentChannel, entryFunc, processFunc, msg);
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
DoEnterBlock	:	'@{'
            {
            this.enterScript($channel, 'main', 'BLOCK');
//       	     result.type = this.BLOCK;
            }
            {$channel=HIDDEN;}
        ;

DoEnterStatement :   '@('
            {
             this.enterScript($channel, 'main', 'STATEMENT');
//       	     result.type = this.STATEMENT;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterIncludeScript :   s='@script('
            {
             var result = this.enterScript($channel, 'parseStringArg', this.processIncludeScript, 'INCLUDE_SCRIPT');
             //correct start/end positions to include enclosing @script() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.INCLUDE_SCRIPT;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterIncludeStyle :   s='@style('
            {
             var result = this.enterScript($channel, 'parseStringArg', this.processIncludeStyle, 'INCLUDE_STYLE');
             //correct start/end positions to include enclosing @style() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.INCLUDE_STYLE;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterLocalize :   s='@localize('
            {
             var result = this.enterScript($channel, 'parseStringArg', this.processLocalize, 'LOCALIZE');
             //correct start/end positions to include enclosing @locale() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.LOCALIZE;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterYieldDeclaration :   s='@yield('
            {
             var result = this.enterScript($channel, 'parseStringArg', this.processYieldDeclaration, 'Yield_Declaration');
             //correct start/end positions to include enclosing @yield() statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.YIELD_DECLARATION;
            }
            {$channel=HIDDEN;}
        ;
        
DoEnterYieldContent :   s='@contentFor('
            {
             var result = this.enterContent($channel, 'stringArgAndContent', this.processYieldContent, 'YieldContent');
             //correct start/end positions to include enclosing @contentFor(){ ... }@ statement
             result.start = $s.getStartIndex();
	     result.end = result.end + 2;
	     result.type = this.YIELD_CONTENT;
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