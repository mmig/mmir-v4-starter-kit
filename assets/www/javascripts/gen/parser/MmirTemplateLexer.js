// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirTemplate.g 2013-02-13 18:45:50

var MmirTemplateLexer = function(input, state) {
// alternate constructor @todo
// public MmirTemplateLexer(CharStream input)
// public MmirTemplateLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){


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

    }).call(this);

    this.dfa10 = new MmirTemplateLexer.DFA10(this);
    MmirTemplateLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(MmirTemplateLexer, {
    EOF: -1,
    STRING: 4,
    SSTRING: 5,
    CHAR: 6,
    NL: 7,
    END: 8,
    ESC_DoEnter: 9,
    COMMENT: 10,
    DoEnterBlock: 11,
    DoEnterStatement: 12,
    DoEnterIncludeScript: 13,
    DoEnterIncludeStyle: 14,
    DoEnterLocalize: 15,
    DoEnterYieldDeclaration: 16,
    DoEnterYieldContent: 17,
    END_SCRIPT: 18,
    ESC_SEQ: 19,
    HEX_DIGIT: 20,
    UNICODE_ESC: 21,
    OCTAL_ESC: 22
});

(function(){
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(MmirTemplateLexer, org.antlr.runtime.Lexer, {
    EOF : -1,
    STRING : 4,
    SSTRING : 5,
    CHAR : 6,
    NL : 7,
    END : 8,
    ESC_DoEnter : 9,
    COMMENT : 10,
    DoEnterBlock : 11,
    DoEnterStatement : 12,
    DoEnterIncludeScript : 13,
    DoEnterIncludeStyle : 14,
    DoEnterLocalize : 15,
    DoEnterYieldDeclaration : 16,
    DoEnterYieldContent : 17,
    END_SCRIPT : 18,
    ESC_SEQ : 19,
    HEX_DIGIT : 20,
    UNICODE_ESC : 21,
    OCTAL_ESC : 22,
    getGrammarFileName: function() { return "../MmirTemplate.g"; }
});
org.antlr.lang.augmentObject(MmirTemplateLexer.prototype, {
    // $ANTLR start ESC_DoEnter
    mESC_DoEnter: function()  {
        try {
            var _type = this.ESC_DoEnter;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirTemplate.g:215:14: ( '@@' )
            // ../MmirTemplate.g:215:16: '@@'
            this.match("@@"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "ESC_DoEnter",

    // $ANTLR start DoEnterBlock
    mDoEnterBlock: function()  {
        try {
            var _type = this.DoEnterBlock;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirTemplate.g:216:14: ( '@{' )
            // ../MmirTemplate.g:216:16: '@{'
            this.match("@{"); 


                        this.enterScript(_channel, 'main', 'BLOCK');
            //       	     result.type = this.BLOCK;
                        
            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterBlock",

    // $ANTLR start DoEnterStatement
    mDoEnterStatement: function()  {
        try {
            var _type = this.DoEnterStatement;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirTemplate.g:224:18: ( '@(' )
            // ../MmirTemplate.g:224:22: '@('
            this.match("@("); 


                         this.enterScript(_channel, 'main', 'STATEMENT');
            //       	     result.type = this.STATEMENT;
                        
            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterStatement",

    // $ANTLR start DoEnterIncludeScript
    mDoEnterIncludeScript: function()  {
        try {
            var _type = this.DoEnterIncludeScript;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            var s=null;

            // ../MmirTemplate.g:232:22: (s= '@script(' )
            // ../MmirTemplate.g:232:26: s= '@script('
            var sStart = this.getCharIndex();
            this.match("@script("); 
            var s = new org.antlr.runtime.CommonToken(this.input, org.antlr.runtime.Token.INVALID_TOKEN_TYPE, org.antlr.runtime.Token.DEFAULT_CHANNEL, sStart, this.getCharIndex()-1);

                         var result = this.enterScript(_channel, 'parseStringArg', this.processIncludeScript, 'INCLUDE_SCRIPT');
                         //correct start/end positions to include enclosing @script() statement
                         result.start = s.getStartIndex();
            	     result.end = result.end + 2;
            	     result.type = this.INCLUDE_SCRIPT;
                        
            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterIncludeScript",

    // $ANTLR start DoEnterIncludeStyle
    mDoEnterIncludeStyle: function()  {
        try {
            var _type = this.DoEnterIncludeStyle;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            var s=null;

            // ../MmirTemplate.g:243:21: (s= '@style(' )
            // ../MmirTemplate.g:243:25: s= '@style('
            var sStart = this.getCharIndex();
            this.match("@style("); 
            var s = new org.antlr.runtime.CommonToken(this.input, org.antlr.runtime.Token.INVALID_TOKEN_TYPE, org.antlr.runtime.Token.DEFAULT_CHANNEL, sStart, this.getCharIndex()-1);

                         var result = this.enterScript(_channel, 'parseStringArg', this.processIncludeStyle, 'INCLUDE_STYLE');
                         //correct start/end positions to include enclosing @style() statement
                         result.start = s.getStartIndex();
            	     result.end = result.end + 2;
            	     result.type = this.INCLUDE_STYLE;
                        
            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterIncludeStyle",

    // $ANTLR start DoEnterLocalize
    mDoEnterLocalize: function()  {
        try {
            var _type = this.DoEnterLocalize;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            var s=null;

            // ../MmirTemplate.g:254:17: (s= '@localize(' )
            // ../MmirTemplate.g:254:21: s= '@localize('
            var sStart = this.getCharIndex();
            this.match("@localize("); 
            var s = new org.antlr.runtime.CommonToken(this.input, org.antlr.runtime.Token.INVALID_TOKEN_TYPE, org.antlr.runtime.Token.DEFAULT_CHANNEL, sStart, this.getCharIndex()-1);

                         var result = this.enterScript(_channel, 'parseStringArg', this.processLocalize, 'LOCALIZE');
                         //correct start/end positions to include enclosing @locale() statement
                         result.start = s.getStartIndex();
            	     result.end = result.end + 2;
            	     result.type = this.LOCALIZE;
                        
            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterLocalize",

    // $ANTLR start DoEnterYieldDeclaration
    mDoEnterYieldDeclaration: function()  {
        try {
            var _type = this.DoEnterYieldDeclaration;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            var s=null;

            // ../MmirTemplate.g:265:25: (s= '@yield(' )
            // ../MmirTemplate.g:265:29: s= '@yield('
            var sStart = this.getCharIndex();
            this.match("@yield("); 
            var s = new org.antlr.runtime.CommonToken(this.input, org.antlr.runtime.Token.INVALID_TOKEN_TYPE, org.antlr.runtime.Token.DEFAULT_CHANNEL, sStart, this.getCharIndex()-1);

                         var result = this.enterScript(_channel, 'parseStringArg', this.processYieldDeclaration, 'Yield_Declaration');
                         //correct start/end positions to include enclosing @yield() statement
                         result.start = s.getStartIndex();
            	     result.end = result.end + 2;
            	     result.type = this.YIELD_DECLARATION;
                        
            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterYieldDeclaration",

    // $ANTLR start DoEnterYieldContent
    mDoEnterYieldContent: function()  {
        try {
            var _type = this.DoEnterYieldContent;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            var s=null;

            // ../MmirTemplate.g:276:21: (s= '@contentFor(' )
            // ../MmirTemplate.g:276:25: s= '@contentFor('
            var sStart = this.getCharIndex();
            this.match("@contentFor("); 
            var s = new org.antlr.runtime.CommonToken(this.input, org.antlr.runtime.Token.INVALID_TOKEN_TYPE, org.antlr.runtime.Token.DEFAULT_CHANNEL, sStart, this.getCharIndex()-1);

                         var result = this.enterContent(_channel, 'stringArgAndContent', this.processYieldContent, 'YieldContent');
                         //correct start/end positions to include enclosing @contentFor(){ ... }@ statement
                         result.start = s.getStartIndex();
            	     result.end = result.end + 2;
            	     result.type = this.YIELD_CONTENT;
                        
            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnterYieldContent",

    // $ANTLR start NL
    mNL: function()  {
        try {
            var _type = this.NL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirTemplate.g:288:2: ( ( '\\r' )? '\\n' | '\\r' | '\\u2028' | '\\u2029' )
            var alt2=4;
            switch ( this.input.LA(1) ) {
            case '\r':
                var LA2_1 = this.input.LA(2);

                if ( (LA2_1=='\n') ) {
                    alt2=1;
                }
                else {
                    alt2=2;}
                break;
            case '\n':
                alt2=1;
                break;
            case '\u2028':
                alt2=3;
                break;
            case '\u2029':
                alt2=4;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 2, 0, this.input);

                throw nvae;
            }

            switch (alt2) {
                case 1 :
                    // ../MmirTemplate.g:288:4: ( '\\r' )? '\\n'
                    // ../MmirTemplate.g:288:4: ( '\\r' )?
                    var alt1=2;
                    var LA1_0 = this.input.LA(1);

                    if ( (LA1_0=='\r') ) {
                        alt1=1;
                    }
                    switch (alt1) {
                        case 1 :
                            // ../MmirTemplate.g:288:4: '\\r'
                            this.match('\r'); 


                            break;

                    }

                    this.match('\n'); 


                    break;
                case 2 :
                    // ../MmirTemplate.g:289:4: '\\r'
                    this.match('\r'); 


                    break;
                case 3 :
                    // ../MmirTemplate.g:290:4: '\\u2028'
                    this.match('\u2028'); 


                    break;
                case 4 :
                    // ../MmirTemplate.g:291:4: '\\u2029'
                    this.match('\u2029'); 


                    break;

            }
            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "NL",

    // $ANTLR start END_SCRIPT
    mEND_SCRIPT: function()  {
        try {
            var _type = this.END_SCRIPT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirTemplate.g:294:12: ( '}@' )
            // ../MmirTemplate.g:294:14: '}@'
            this.match("}@"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "END_SCRIPT",

    // $ANTLR start CHAR
    mCHAR: function()  {
        try {
            var _type = this.CHAR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirTemplate.g:296:6: (~ ( '\\n' | '\\r' ) )
            // ../MmirTemplate.g:296:8: ~ ( '\\n' | '\\r' )
            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\f')||(this.input.LA(1)>='\u000E' && this.input.LA(1)<='\uFFFF') ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "CHAR",

    // $ANTLR start COMMENT
    mCOMMENT: function()  {
        try {
            var _type = this.COMMENT;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirTemplate.g:299:5: ( '@*' ( options {greedy=false; } : . )* '*@' )
            // ../MmirTemplate.g:299:9: '@*' ( options {greedy=false; } : . )* '*@'
            this.match("@*"); 

            // ../MmirTemplate.g:299:14: ( options {greedy=false; } : . )*
            loop3:
            do {
                var alt3=2;
                var LA3_0 = this.input.LA(1);

                if ( (LA3_0=='*') ) {
                    var LA3_1 = this.input.LA(2);

                    if ( (LA3_1=='@') ) {
                        alt3=2;
                    }
                    else if ( ((LA3_1>='\u0000' && LA3_1<='?')||(LA3_1>='A' && LA3_1<='\uFFFF')) ) {
                        alt3=1;
                    }


                }
                else if ( ((LA3_0>='\u0000' && LA3_0<=')')||(LA3_0>='+' && LA3_0<='\uFFFF')) ) {
                    alt3=1;
                }


                switch (alt3) {
                case 1 :
                    // ../MmirTemplate.g:299:42: .
                    this.matchAny(); 


                    break;

                default :
                    break loop3;
                }
            } while (true);

            this.match("*@"); 




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "COMMENT",

    // $ANTLR start STRING
    mSTRING: function()  {
        try {
            var _type = this.STRING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirTemplate.g:303:5: ( '\"' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"' )
            // ../MmirTemplate.g:303:8: '\"' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"'
            this.match('\"'); 
            // ../MmirTemplate.g:303:12: ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )*
            loop5:
            do {
                var alt5=2;
                var LA5_0 = this.input.LA(1);

                if ( ((LA5_0>='\u0000' && LA5_0<='!')||(LA5_0>='#' && LA5_0<='\uFFFF')) ) {
                    alt5=1;
                }
                else if ( (LA5_0=='\"') ) {
                    alt5=2;
                }


                switch (alt5) {
                case 1 :
                    // ../MmirTemplate.g:303:39: ( ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    // ../MmirTemplate.g:303:39: ( ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    var alt4=2;
                    var LA4_0 = this.input.LA(1);

                    if ( (LA4_0=='\\') ) {
                        alt4=1;
                    }
                    else if ( ((LA4_0>='\u0000' && LA4_0<='!')||(LA4_0>='#' && LA4_0<='[')||(LA4_0>=']' && LA4_0<='\uFFFF')) ) {
                        alt4=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 4, 0, this.input);

                        throw nvae;
                    }
                    switch (alt4) {
                        case 1 :
                            // ../MmirTemplate.g:303:40: ESC_SEQ
                            this.mESC_SEQ(); 


                            break;
                        case 2 :
                            // ../MmirTemplate.g:303:50: ~ ( '\\\\' | '\"' )
                            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='!')||(this.input.LA(1)>='#' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                    }



                    break;

                default :
                    break loop5;
                }
            } while (true);

            this.match('\"'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "STRING",

    // $ANTLR start SSTRING
    mSSTRING: function()  {
        try {
            var _type = this.SSTRING;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirTemplate.g:307:5: ( '\\'' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\'' )
            // ../MmirTemplate.g:307:8: '\\'' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\''
            this.match('\''); 
            // ../MmirTemplate.g:307:13: ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )*
            loop7:
            do {
                var alt7=2;
                var LA7_0 = this.input.LA(1);

                if ( ((LA7_0>='\u0000' && LA7_0<='&')||(LA7_0>='(' && LA7_0<='\uFFFF')) ) {
                    alt7=1;
                }
                else if ( (LA7_0=='\'') ) {
                    alt7=2;
                }


                switch (alt7) {
                case 1 :
                    // ../MmirTemplate.g:307:40: ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    // ../MmirTemplate.g:307:40: ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    var alt6=2;
                    var LA6_0 = this.input.LA(1);

                    if ( (LA6_0=='\\') ) {
                        alt6=1;
                    }
                    else if ( ((LA6_0>='\u0000' && LA6_0<='&')||(LA6_0>='(' && LA6_0<='[')||(LA6_0>=']' && LA6_0<='\uFFFF')) ) {
                        alt6=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 6, 0, this.input);

                        throw nvae;
                    }
                    switch (alt6) {
                        case 1 :
                            // ../MmirTemplate.g:307:41: ESC_SEQ
                            this.mESC_SEQ(); 


                            break;
                        case 2 :
                            // ../MmirTemplate.g:307:51: ~ ( '\\\\' | '\\'' )
                            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='&')||(this.input.LA(1)>='(' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                    }



                    break;

                default :
                    break loop7;
                }
            } while (true);

            this.match('\''); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "SSTRING",

    // $ANTLR start HEX_DIGIT
    mHEX_DIGIT: function()  {
        try {
            // ../MmirTemplate.g:311:11: ( ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' ) )
            // ../MmirTemplate.g:311:13: ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )
            if ( (this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='F')||(this.input.LA(1)>='a' && this.input.LA(1)<='f') ) {
                this.input.consume();

            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                this.recover(mse);
                throw mse;}




        }
        finally {
        }
    },
    // $ANTLR end "HEX_DIGIT",

    // $ANTLR start ESC_SEQ
    mESC_SEQ: function()  {
        try {
            // ../MmirTemplate.g:315:5: ( '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' ) | UNICODE_ESC | OCTAL_ESC )
            var alt8=3;
            var LA8_0 = this.input.LA(1);

            if ( (LA8_0=='\\') ) {
                switch ( this.input.LA(2) ) {
                case '\"':
                case '\'':
                case '\\':
                case 'b':
                case 'f':
                case 'n':
                case 'r':
                case 't':
                    alt8=1;
                    break;
                case 'u':
                    alt8=2;
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                    alt8=3;
                    break;
                default:
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 8, 1, this.input);

                    throw nvae;
                }

            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 8, 0, this.input);

                throw nvae;
            }
            switch (alt8) {
                case 1 :
                    // ../MmirTemplate.g:315:9: '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' )
                    this.match('\\'); 
                    if ( this.input.LA(1)=='\"'||this.input.LA(1)=='\''||this.input.LA(1)=='\\'||this.input.LA(1)=='b'||this.input.LA(1)=='f'||this.input.LA(1)=='n'||this.input.LA(1)=='r'||this.input.LA(1)=='t' ) {
                        this.input.consume();

                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;
                case 2 :
                    // ../MmirTemplate.g:316:9: UNICODE_ESC
                    this.mUNICODE_ESC(); 


                    break;
                case 3 :
                    // ../MmirTemplate.g:317:9: OCTAL_ESC
                    this.mOCTAL_ESC(); 


                    break;

            }
        }
        finally {
        }
    },
    // $ANTLR end "ESC_SEQ",

    // $ANTLR start OCTAL_ESC
    mOCTAL_ESC: function()  {
        try {
            // ../MmirTemplate.g:322:5: ( '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) )
            var alt9=3;
            var LA9_0 = this.input.LA(1);

            if ( (LA9_0=='\\') ) {
                var LA9_1 = this.input.LA(2);

                if ( ((LA9_1>='0' && LA9_1<='3')) ) {
                    var LA9_2 = this.input.LA(3);

                    if ( ((LA9_2>='0' && LA9_2<='7')) ) {
                        var LA9_4 = this.input.LA(4);

                        if ( ((LA9_4>='0' && LA9_4<='7')) ) {
                            alt9=1;
                        }
                        else {
                            alt9=2;}
                    }
                    else {
                        alt9=3;}
                }
                else if ( ((LA9_1>='4' && LA9_1<='7')) ) {
                    var LA9_3 = this.input.LA(3);

                    if ( ((LA9_3>='0' && LA9_3<='7')) ) {
                        alt9=2;
                    }
                    else {
                        alt9=3;}
                }
                else {
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 9, 1, this.input);

                    throw nvae;
                }
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 9, 0, this.input);

                throw nvae;
            }
            switch (alt9) {
                case 1 :
                    // ../MmirTemplate.g:322:9: '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); 
                    // ../MmirTemplate.g:322:14: ( '0' .. '3' )
                    // ../MmirTemplate.g:322:15: '0' .. '3'
                    this.matchRange('0','3'); 



                    // ../MmirTemplate.g:322:25: ( '0' .. '7' )
                    // ../MmirTemplate.g:322:26: '0' .. '7'
                    this.matchRange('0','7'); 



                    // ../MmirTemplate.g:322:36: ( '0' .. '7' )
                    // ../MmirTemplate.g:322:37: '0' .. '7'
                    this.matchRange('0','7'); 





                    break;
                case 2 :
                    // ../MmirTemplate.g:323:9: '\\\\' ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); 
                    // ../MmirTemplate.g:323:14: ( '0' .. '7' )
                    // ../MmirTemplate.g:323:15: '0' .. '7'
                    this.matchRange('0','7'); 



                    // ../MmirTemplate.g:323:25: ( '0' .. '7' )
                    // ../MmirTemplate.g:323:26: '0' .. '7'
                    this.matchRange('0','7'); 





                    break;
                case 3 :
                    // ../MmirTemplate.g:324:9: '\\\\' ( '0' .. '7' )
                    this.match('\\'); 
                    // ../MmirTemplate.g:324:14: ( '0' .. '7' )
                    // ../MmirTemplate.g:324:15: '0' .. '7'
                    this.matchRange('0','7'); 





                    break;

            }
        }
        finally {
        }
    },
    // $ANTLR end "OCTAL_ESC",

    // $ANTLR start UNICODE_ESC
    mUNICODE_ESC: function()  {
        try {
            // ../MmirTemplate.g:329:5: ( '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT )
            // ../MmirTemplate.g:329:9: '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
            this.match('\\'); 
            this.match('u'); 
            this.mHEX_DIGIT(); 
            this.mHEX_DIGIT(); 
            this.mHEX_DIGIT(); 
            this.mHEX_DIGIT(); 



        }
        finally {
        }
    },
    // $ANTLR end "UNICODE_ESC",

    // $ANTLR start END
    mEND: function()  {
        try {
            var _type = this.END;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirTemplate.g:336:9: ( EOF )
            // ../MmirTemplate.g:336:11: EOF
            this.match(this.EOF); 
            this.emit(org.antlr.runtime.Token.EOF_TOKEN);
            if(this.isDebug) print("exit text");/*debug*/



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "END",

    mTokens: function() {
        // ../MmirTemplate.g:1:8: ( ESC_DoEnter | DoEnterBlock | DoEnterStatement | DoEnterIncludeScript | DoEnterIncludeStyle | DoEnterLocalize | DoEnterYieldDeclaration | DoEnterYieldContent | NL | END_SCRIPT | CHAR | COMMENT | STRING | SSTRING | END )
        var alt10=15;
        alt10 = this.dfa10.predict(this.input);
        switch (alt10) {
            case 1 :
                // ../MmirTemplate.g:1:10: ESC_DoEnter
                this.mESC_DoEnter(); 


                break;
            case 2 :
                // ../MmirTemplate.g:1:22: DoEnterBlock
                this.mDoEnterBlock(); 


                break;
            case 3 :
                // ../MmirTemplate.g:1:35: DoEnterStatement
                this.mDoEnterStatement(); 


                break;
            case 4 :
                // ../MmirTemplate.g:1:52: DoEnterIncludeScript
                this.mDoEnterIncludeScript(); 


                break;
            case 5 :
                // ../MmirTemplate.g:1:73: DoEnterIncludeStyle
                this.mDoEnterIncludeStyle(); 


                break;
            case 6 :
                // ../MmirTemplate.g:1:93: DoEnterLocalize
                this.mDoEnterLocalize(); 


                break;
            case 7 :
                // ../MmirTemplate.g:1:109: DoEnterYieldDeclaration
                this.mDoEnterYieldDeclaration(); 


                break;
            case 8 :
                // ../MmirTemplate.g:1:133: DoEnterYieldContent
                this.mDoEnterYieldContent(); 


                break;
            case 9 :
                // ../MmirTemplate.g:1:153: NL
                this.mNL(); 


                break;
            case 10 :
                // ../MmirTemplate.g:1:156: END_SCRIPT
                this.mEND_SCRIPT(); 


                break;
            case 11 :
                // ../MmirTemplate.g:1:167: CHAR
                this.mCHAR(); 


                break;
            case 12 :
                // ../MmirTemplate.g:1:172: COMMENT
                this.mCOMMENT(); 


                break;
            case 13 :
                // ../MmirTemplate.g:1:180: STRING
                this.mSTRING(); 


                break;
            case 14 :
                // ../MmirTemplate.g:1:187: SSTRING
                this.mSSTRING(); 


                break;
            case 15 :
                // ../MmirTemplate.g:1:195: END
                this.mEND(); 


                break;

        }

    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(MmirTemplateLexer, {
    DFA10_eotS:
        "\u0001\u0009\u0001\u0008\u0003\uffff\u0003\u0008\u000f\uffff",
    DFA10_eofS:
        "\u0017\uffff",
    DFA10_minS:
        "\u0001\u0000\u0001\u0028\u0003\uffff\u0001\u0040\u0002\u0000\u0005"+
    "\uffff\u0001\u0063\u0009\uffff",
    DFA10_maxS:
        "\u0001\uffff\u0001\u007b\u0003\uffff\u0001\u0040\u0002\uffff\u0005"+
    "\uffff\u0001\u0074\u0009\uffff",
    DFA10_acceptS:
        "\u0002\uffff\u0003\u0009\u0003\uffff\u0001\u000b\u0001\u000f\u0001"+
    "\u0001\u0001\u0002\u0001\u0003\u0001\uffff\u0001\u0006\u0001\u0007\u0001"+
    "\u0008\u0001\u000c\u0001\u000a\u0001\u000d\u0001\u000e\u0001\u0004\u0001"+
    "\u0005",
    DFA10_specialS:
        "\u0001\u0001\u0005\uffff\u0001\u0000\u0001\u0002\u000f\uffff}>",
    DFA10_transitionS: [
            "\u000a\u0008\u0001\u0002\u0002\u0008\u0001\u0002\u0014\u0008"+
            "\u0001\u0006\u0004\u0008\u0001\u0007\u0018\u0008\u0001\u0001"+
            "\u003c\u0008\u0001\u0005\u1faa\u0008\u0001\u0003\u0001\u0004"+
            "\udfd6\u0008",
            "\u0001\u000c\u0001\uffff\u0001\u0011\u0015\uffff\u0001\u000a"+
            "\u0022\uffff\u0001\u0010\u0008\uffff\u0001\u000e\u0006\uffff"+
            "\u0001\u000d\u0005\uffff\u0001\u000f\u0001\uffff\u0001\u000b",
            "",
            "",
            "",
            "\u0001\u0012",
            "\u0000\u0013",
            "\u0000\u0014",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u0015\u0010\uffff\u0001\u0016",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(MmirTemplateLexer, {
    DFA10_eot:
        org.antlr.runtime.DFA.unpackEncodedString(MmirTemplateLexer.DFA10_eotS),
    DFA10_eof:
        org.antlr.runtime.DFA.unpackEncodedString(MmirTemplateLexer.DFA10_eofS),
    DFA10_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirTemplateLexer.DFA10_minS),
    DFA10_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirTemplateLexer.DFA10_maxS),
    DFA10_accept:
        org.antlr.runtime.DFA.unpackEncodedString(MmirTemplateLexer.DFA10_acceptS),
    DFA10_special:
        org.antlr.runtime.DFA.unpackEncodedString(MmirTemplateLexer.DFA10_specialS),
    DFA10_transition: (function() {
        var a = [],
            i,
            numStates = MmirTemplateLexer.DFA10_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(MmirTemplateLexer.DFA10_transitionS[i]));
        }
        return a;
    })()
});

MmirTemplateLexer.DFA10 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 10;
    this.eot = MmirTemplateLexer.DFA10_eot;
    this.eof = MmirTemplateLexer.DFA10_eof;
    this.min = MmirTemplateLexer.DFA10_min;
    this.max = MmirTemplateLexer.DFA10_max;
    this.accept = MmirTemplateLexer.DFA10_accept;
    this.special = MmirTemplateLexer.DFA10_special;
    this.transition = MmirTemplateLexer.DFA10_transition;
};

org.antlr.lang.extend(MmirTemplateLexer.DFA10, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( ESC_DoEnter | DoEnterBlock | DoEnterStatement | DoEnterIncludeScript | DoEnterIncludeStyle | DoEnterLocalize | DoEnterYieldDeclaration | DoEnterYieldContent | NL | END_SCRIPT | CHAR | COMMENT | STRING | SSTRING | END );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA10_6 = input.LA(1);

                            s = -1;
                            if ( ((LA10_6>='\u0000' && LA10_6<='\uFFFF')) ) {s = 19;}

                            else s = 8;

                            if ( s>=0 ) return s;
                            break;
                        case 1 : 
                            var LA10_0 = input.LA(1);

                            s = -1;
                            if ( (LA10_0=='@') ) {s = 1;}

                            else if ( (LA10_0=='\n'||LA10_0=='\r') ) {s = 2;}

                            else if ( (LA10_0=='\u2028') ) {s = 3;}

                            else if ( (LA10_0=='\u2029') ) {s = 4;}

                            else if ( (LA10_0=='}') ) {s = 5;}

                            else if ( (LA10_0=='\"') ) {s = 6;}

                            else if ( (LA10_0=='\'') ) {s = 7;}

                            else if ( ((LA10_0>='\u0000' && LA10_0<='\t')||(LA10_0>='\u000B' && LA10_0<='\f')||(LA10_0>='\u000E' && LA10_0<='!')||(LA10_0>='#' && LA10_0<='&')||(LA10_0>='(' && LA10_0<='?')||(LA10_0>='A' && LA10_0<='|')||(LA10_0>='~' && LA10_0<='\u2027')||(LA10_0>='\u202A' && LA10_0<='\uFFFF')) ) {s = 8;}

                            else s = 9;

                            if ( s>=0 ) return s;
                            break;
                        case 2 : 
                            var LA10_7 = input.LA(1);

                            s = -1;
                            if ( ((LA10_7>='\u0000' && LA10_7<='\uFFFF')) ) {s = 20;}

                            else s = 8;

                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 10, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
 
})();