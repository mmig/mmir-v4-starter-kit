// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirScriptBlock.g 2013-03-01 17:04:15

var MmirScriptBlockLexer = function(input, state) {
// alternate constructor @todo
// public MmirScriptBlockLexer(CharStream input)
// public MmirScriptBlockLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){


        	this.isDebug = true;
        	
        	this.nesting = 0;
        	this.nestingBlock = 0;
        	
        	this.isParseAsStatement = function(){
        		return typeof this.parseAsStatement !== 'undefined' && this.parseAsStatement === true;
        	};

    }).call(this);

    this.dfa15 = new MmirScriptBlockLexer.DFA15(this);
    MmirScriptBlockLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(MmirScriptBlockLexer, {
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
    DoEnterHelper: 18,
    DoEnterRender: 19,
    DoEnterIfStatement: 20,
    DoEnterElseStatement: 21,
    DoEnterForStatement: 22,
    END_SCRIPT: 23,
    ESC_SEQ: 24,
    HEX_DIGIT: 25,
    UNICODE_ESC: 26,
    OCTAL_ESC: 27,
    T__31: 31,
    T__32: 32,
    DoExit: 28,
    DoEnter: 29,
    WS: 30
});

(function(){
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(MmirScriptBlockLexer, org.antlr.runtime.Lexer, {
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
    DoEnterHelper : 18,
    DoEnterRender : 19,
    DoEnterIfStatement : 20,
    DoEnterElseStatement : 21,
    DoEnterForStatement : 22,
    END_SCRIPT : 23,
    ESC_SEQ : 24,
    HEX_DIGIT : 25,
    UNICODE_ESC : 26,
    OCTAL_ESC : 27,
    T__31 : 31,
    T__32 : 32,
    DoExit : 28,
    DoEnter : 29,
    WS : 30,
    getGrammarFileName: function() { return "../MmirScriptBlock.g"; }
});
org.antlr.lang.augmentObject(MmirScriptBlockLexer.prototype, {
    // $ANTLR start T__31
    mT__31: function()  {
        try {
            var _type = this.T__31;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:20:7: ( ')' )
            // ../MmirScriptBlock.g:20:9: ')'
            this.match(')'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__31",

    // $ANTLR start T__32
    mT__32: function()  {
        try {
            var _type = this.T__32;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:21:7: ( '+' )
            // ../MmirScriptBlock.g:21:9: '+'
            this.match('+'); 



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__32",

    // $ANTLR start DoEnter
    mDoEnter: function()  {
        try {
            var _type = this.DoEnter;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:123:2: ( '{' )
            // ../MmirScriptBlock.g:123:4: '{'
            this.match('{'); 
            this.nestingBlock++; if(this.isDebug) print("opening level SCRIPT_BLOCK "+this.nestingBlock);/*debug*/



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoEnter",

    // $ANTLR start DoExit
    mDoExit: function()  {
        try {
            var _type = this.DoExit;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:127:2: ( '}' )
            // ../MmirScriptBlock.g:127:4: '}'
            this.match('}'); 

                      if ( this.nestingBlock <= 0 ) {
            		
                            this.emit(org.antlr.runtime.Token.EOF_TOKEN);
                            
                            if(this.isDebug) print("exiting embedded SCRIPT_BLOCK");//debug
                      }
                      else {
                            if(this.isDebug) print("closing level SCRIPT_BLOCK "+this.nestingBlock);//debug
                            
                            this.nestingBlock--;
                      }
                    



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "DoExit",

    // $ANTLR start NL
    mNL: function()  {
        try {
            var _type = this.NL;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:144:2: ( ( '\\r' )? '\\n' | '\\r' | '\\u2028' | '\\u2029' )
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
                    // ../MmirScriptBlock.g:144:4: ( '\\r' )? '\\n'
                    // ../MmirScriptBlock.g:144:4: ( '\\r' )?
                    var alt1=2;
                    var LA1_0 = this.input.LA(1);

                    if ( (LA1_0=='\r') ) {
                        alt1=1;
                    }
                    switch (alt1) {
                        case 1 :
                            // ../MmirScriptBlock.g:144:4: '\\r'
                            this.match('\r'); 


                            break;

                    }

                    this.match('\n'); 


                    break;
                case 2 :
                    // ../MmirScriptBlock.g:145:4: '\\r'
                    this.match('\r'); 


                    break;
                case 3 :
                    // ../MmirScriptBlock.g:146:4: '\\u2028'
                    this.match('\u2028'); 


                    break;
                case 4 :
                    // ../MmirScriptBlock.g:147:4: '\\u2029'
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

    // $ANTLR start WS
    mWS: function()  {
        try {
            var _type = this.WS;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:152:5: ( ( ' ' | '\\t' | NL ) )
            // ../MmirScriptBlock.g:152:7: ( ' ' | '\\t' | NL )
            // ../MmirScriptBlock.g:152:7: ( ' ' | '\\t' | NL )
            var alt3=3;
            switch ( this.input.LA(1) ) {
            case ' ':
                alt3=1;
                break;
            case '\t':
                alt3=2;
                break;
            case '\n':
            case '\r':
            case '\u2028':
            case '\u2029':
                alt3=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 3, 0, this.input);

                throw nvae;
            }

            switch (alt3) {
                case 1 :
                    // ../MmirScriptBlock.g:152:8: ' '
                    this.match(' '); 


                    break;
                case 2 :
                    // ../MmirScriptBlock.g:152:12: '\\t'
                    this.match('\t'); 


                    break;
                case 3 :
                    // ../MmirScriptBlock.g:152:18: NL
                    this.mNL(); 


                    break;

            }

            _channel=HIDDEN;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "WS",

    // $ANTLR start CHAR
    mCHAR: function()  {
        try {
            var _type = this.CHAR;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptBlock.g:154:6: (~ ( '\\n' | '\\r' ) )
            // ../MmirScriptBlock.g:154:8: ~ ( '\\n' | '\\r' )
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
            // ../MmirScriptBlock.g:157:5: ( '//' (~ ( '\\n' | '\\r' ) )* ( '\\r' )? '\\n' | '/*' ( options {greedy=false; } : . )* '*/' | '@*' ( options {greedy=false; } : . )* '*@' )
            var alt8=3;
            var LA8_0 = this.input.LA(1);

            if ( (LA8_0=='/') ) {
                var LA8_1 = this.input.LA(2);

                if ( (LA8_1=='/') ) {
                    alt8=1;
                }
                else if ( (LA8_1=='*') ) {
                    alt8=2;
                }
                else {
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 8, 1, this.input);

                    throw nvae;
                }
            }
            else if ( (LA8_0=='@') ) {
                alt8=3;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 8, 0, this.input);

                throw nvae;
            }
            switch (alt8) {
                case 1 :
                    // ../MmirScriptBlock.g:157:9: '//' (~ ( '\\n' | '\\r' ) )* ( '\\r' )? '\\n'
                    this.match("//"); 

                    // ../MmirScriptBlock.g:157:14: (~ ( '\\n' | '\\r' ) )*
                    loop4:
                    do {
                        var alt4=2;
                        var LA4_0 = this.input.LA(1);

                        if ( ((LA4_0>='\u0000' && LA4_0<='\t')||(LA4_0>='\u000B' && LA4_0<='\f')||(LA4_0>='\u000E' && LA4_0<='\uFFFF')) ) {
                            alt4=1;
                        }


                        switch (alt4) {
                        case 1 :
                            // ../MmirScriptBlock.g:157:14: ~ ( '\\n' | '\\r' )
                            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\f')||(this.input.LA(1)>='\u000E' && this.input.LA(1)<='\uFFFF') ) {
                                this.input.consume();

                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                        default :
                            break loop4;
                        }
                    } while (true);

                    // ../MmirScriptBlock.g:157:28: ( '\\r' )?
                    var alt5=2;
                    var LA5_0 = this.input.LA(1);

                    if ( (LA5_0=='\r') ) {
                        alt5=1;
                    }
                    switch (alt5) {
                        case 1 :
                            // ../MmirScriptBlock.g:157:28: '\\r'
                            this.match('\r'); 


                            break;

                    }

                    this.match('\n'); 
                    _channel=HIDDEN;


                    break;
                case 2 :
                    // ../MmirScriptBlock.g:158:9: '/*' ( options {greedy=false; } : . )* '*/'
                    this.match("/*"); 

                    // ../MmirScriptBlock.g:158:14: ( options {greedy=false; } : . )*
                    loop6:
                    do {
                        var alt6=2;
                        var LA6_0 = this.input.LA(1);

                        if ( (LA6_0=='*') ) {
                            var LA6_1 = this.input.LA(2);

                            if ( (LA6_1=='/') ) {
                                alt6=2;
                            }
                            else if ( ((LA6_1>='\u0000' && LA6_1<='.')||(LA6_1>='0' && LA6_1<='\uFFFF')) ) {
                                alt6=1;
                            }


                        }
                        else if ( ((LA6_0>='\u0000' && LA6_0<=')')||(LA6_0>='+' && LA6_0<='\uFFFF')) ) {
                            alt6=1;
                        }


                        switch (alt6) {
                        case 1 :
                            // ../MmirScriptBlock.g:158:42: .
                            this.matchAny(); 


                            break;

                        default :
                            break loop6;
                        }
                    } while (true);

                    this.match("*/"); 

                    _channel=HIDDEN;


                    break;
                case 3 :
                    // ../MmirScriptBlock.g:159:9: '@*' ( options {greedy=false; } : . )* '*@'
                    this.match("@*"); 

                    // ../MmirScriptBlock.g:159:14: ( options {greedy=false; } : . )*
                    loop7:
                    do {
                        var alt7=2;
                        var LA7_0 = this.input.LA(1);

                        if ( (LA7_0=='*') ) {
                            var LA7_1 = this.input.LA(2);

                            if ( (LA7_1=='@') ) {
                                alt7=2;
                            }
                            else if ( ((LA7_1>='\u0000' && LA7_1<='?')||(LA7_1>='A' && LA7_1<='\uFFFF')) ) {
                                alt7=1;
                            }


                        }
                        else if ( ((LA7_0>='\u0000' && LA7_0<=')')||(LA7_0>='+' && LA7_0<='\uFFFF')) ) {
                            alt7=1;
                        }


                        switch (alt7) {
                        case 1 :
                            // ../MmirScriptBlock.g:159:42: .
                            this.matchAny(); 


                            break;

                        default :
                            break loop7;
                        }
                    } while (true);

                    this.match("*@"); 

                    _channel=HIDDEN;


                    break;

            }
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
            // ../MmirScriptBlock.g:163:5: ( '\"' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"' )
            // ../MmirScriptBlock.g:163:8: '\"' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"'
            this.match('\"'); 
            // ../MmirScriptBlock.g:163:12: ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )*
            loop10:
            do {
                var alt10=2;
                var LA10_0 = this.input.LA(1);

                if ( ((LA10_0>='\u0000' && LA10_0<='!')||(LA10_0>='#' && LA10_0<='\uFFFF')) ) {
                    alt10=1;
                }
                else if ( (LA10_0=='\"') ) {
                    alt10=2;
                }


                switch (alt10) {
                case 1 :
                    // ../MmirScriptBlock.g:163:39: ( ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    // ../MmirScriptBlock.g:163:39: ( ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    var alt9=2;
                    var LA9_0 = this.input.LA(1);

                    if ( (LA9_0=='\\') ) {
                        alt9=1;
                    }
                    else if ( ((LA9_0>='\u0000' && LA9_0<='!')||(LA9_0>='#' && LA9_0<='[')||(LA9_0>=']' && LA9_0<='\uFFFF')) ) {
                        alt9=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 9, 0, this.input);

                        throw nvae;
                    }
                    switch (alt9) {
                        case 1 :
                            // ../MmirScriptBlock.g:163:40: ESC_SEQ
                            this.mESC_SEQ(); 


                            break;
                        case 2 :
                            // ../MmirScriptBlock.g:163:50: ~ ( '\\\\' | '\"' )
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
                    break loop10;
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
            // ../MmirScriptBlock.g:167:5: ( '\\'' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\'' )
            // ../MmirScriptBlock.g:167:8: '\\'' ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\''
            this.match('\''); 
            // ../MmirScriptBlock.g:167:13: ( options {greedy=false; } : ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )*
            loop12:
            do {
                var alt12=2;
                var LA12_0 = this.input.LA(1);

                if ( ((LA12_0>='\u0000' && LA12_0<='&')||(LA12_0>='(' && LA12_0<='\uFFFF')) ) {
                    alt12=1;
                }
                else if ( (LA12_0=='\'') ) {
                    alt12=2;
                }


                switch (alt12) {
                case 1 :
                    // ../MmirScriptBlock.g:167:40: ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    // ../MmirScriptBlock.g:167:40: ( ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    var alt11=2;
                    var LA11_0 = this.input.LA(1);

                    if ( (LA11_0=='\\') ) {
                        alt11=1;
                    }
                    else if ( ((LA11_0>='\u0000' && LA11_0<='&')||(LA11_0>='(' && LA11_0<='[')||(LA11_0>=']' && LA11_0<='\uFFFF')) ) {
                        alt11=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 11, 0, this.input);

                        throw nvae;
                    }
                    switch (alt11) {
                        case 1 :
                            // ../MmirScriptBlock.g:167:41: ESC_SEQ
                            this.mESC_SEQ(); 


                            break;
                        case 2 :
                            // ../MmirScriptBlock.g:167:51: ~ ( '\\\\' | '\\'' )
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
                    break loop12;
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
            // ../MmirScriptBlock.g:171:11: ( ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' ) )
            // ../MmirScriptBlock.g:171:13: ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )
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
            // ../MmirScriptBlock.g:175:5: ( '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' ) | UNICODE_ESC | OCTAL_ESC )
            var alt13=3;
            var LA13_0 = this.input.LA(1);

            if ( (LA13_0=='\\') ) {
                switch ( this.input.LA(2) ) {
                case '\"':
                case '\'':
                case '\\':
                case 'b':
                case 'f':
                case 'n':
                case 'r':
                case 't':
                    alt13=1;
                    break;
                case 'u':
                    alt13=2;
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                    alt13=3;
                    break;
                default:
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 13, 1, this.input);

                    throw nvae;
                }

            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 13, 0, this.input);

                throw nvae;
            }
            switch (alt13) {
                case 1 :
                    // ../MmirScriptBlock.g:175:9: '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' )
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
                    // ../MmirScriptBlock.g:176:9: UNICODE_ESC
                    this.mUNICODE_ESC(); 


                    break;
                case 3 :
                    // ../MmirScriptBlock.g:177:9: OCTAL_ESC
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
            // ../MmirScriptBlock.g:182:5: ( '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) )
            var alt14=3;
            var LA14_0 = this.input.LA(1);

            if ( (LA14_0=='\\') ) {
                var LA14_1 = this.input.LA(2);

                if ( ((LA14_1>='0' && LA14_1<='3')) ) {
                    var LA14_2 = this.input.LA(3);

                    if ( ((LA14_2>='0' && LA14_2<='7')) ) {
                        var LA14_4 = this.input.LA(4);

                        if ( ((LA14_4>='0' && LA14_4<='7')) ) {
                            alt14=1;
                        }
                        else {
                            alt14=2;}
                    }
                    else {
                        alt14=3;}
                }
                else if ( ((LA14_1>='4' && LA14_1<='7')) ) {
                    var LA14_3 = this.input.LA(3);

                    if ( ((LA14_3>='0' && LA14_3<='7')) ) {
                        alt14=2;
                    }
                    else {
                        alt14=3;}
                }
                else {
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 14, 1, this.input);

                    throw nvae;
                }
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 14, 0, this.input);

                throw nvae;
            }
            switch (alt14) {
                case 1 :
                    // ../MmirScriptBlock.g:182:9: '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); 
                    // ../MmirScriptBlock.g:182:14: ( '0' .. '3' )
                    // ../MmirScriptBlock.g:182:15: '0' .. '3'
                    this.matchRange('0','3'); 



                    // ../MmirScriptBlock.g:182:25: ( '0' .. '7' )
                    // ../MmirScriptBlock.g:182:26: '0' .. '7'
                    this.matchRange('0','7'); 



                    // ../MmirScriptBlock.g:182:36: ( '0' .. '7' )
                    // ../MmirScriptBlock.g:182:37: '0' .. '7'
                    this.matchRange('0','7'); 





                    break;
                case 2 :
                    // ../MmirScriptBlock.g:183:9: '\\\\' ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); 
                    // ../MmirScriptBlock.g:183:14: ( '0' .. '7' )
                    // ../MmirScriptBlock.g:183:15: '0' .. '7'
                    this.matchRange('0','7'); 



                    // ../MmirScriptBlock.g:183:25: ( '0' .. '7' )
                    // ../MmirScriptBlock.g:183:26: '0' .. '7'
                    this.matchRange('0','7'); 





                    break;
                case 3 :
                    // ../MmirScriptBlock.g:184:9: '\\\\' ( '0' .. '7' )
                    this.match('\\'); 
                    // ../MmirScriptBlock.g:184:14: ( '0' .. '7' )
                    // ../MmirScriptBlock.g:184:15: '0' .. '7'
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
            // ../MmirScriptBlock.g:189:5: ( '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT )
            // ../MmirScriptBlock.g:189:9: '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
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

    mTokens: function() {
        // ../MmirScriptBlock.g:1:8: ( T__31 | T__32 | DoEnter | DoExit | NL | WS | CHAR | COMMENT | STRING | SSTRING )
        var alt15=10;
        alt15 = this.dfa15.predict(this.input);
        switch (alt15) {
            case 1 :
                // ../MmirScriptBlock.g:1:10: T__31
                this.mT__31(); 


                break;
            case 2 :
                // ../MmirScriptBlock.g:1:16: T__32
                this.mT__32(); 


                break;
            case 3 :
                // ../MmirScriptBlock.g:1:22: DoEnter
                this.mDoEnter(); 


                break;
            case 4 :
                // ../MmirScriptBlock.g:1:30: DoExit
                this.mDoExit(); 


                break;
            case 5 :
                // ../MmirScriptBlock.g:1:37: NL
                this.mNL(); 


                break;
            case 6 :
                // ../MmirScriptBlock.g:1:40: WS
                this.mWS(); 


                break;
            case 7 :
                // ../MmirScriptBlock.g:1:43: CHAR
                this.mCHAR(); 


                break;
            case 8 :
                // ../MmirScriptBlock.g:1:48: COMMENT
                this.mCOMMENT(); 


                break;
            case 9 :
                // ../MmirScriptBlock.g:1:56: STRING
                this.mSTRING(); 


                break;
            case 10 :
                // ../MmirScriptBlock.g:1:63: SSTRING
                this.mSSTRING(); 


                break;

        }

    }

}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(MmirScriptBlockLexer, {
    DFA15_eotS:
        "\u0005\uffff\u0001\u0014\u0005\uffff\u0004\u000f\u000a\uffff",
    DFA15_eofS:
        "\u0019\uffff",
    DFA15_minS:
        "\u0001\u0000\u0004\uffff\u0001\u000a\u0005\uffff\u0002\u002a\u0002"+
    "\u0000\u000a\uffff",
    DFA15_maxS:
        "\u0001\uffff\u0004\uffff\u0001\u000a\u0005\uffff\u0001\u002f\u0001"+
    "\u002a\u0002\uffff\u000a\uffff",
    DFA15_acceptS:
        "\u0001\uffff\u0001\u0001\u0001\u0002\u0001\u0003\u0001\u0004\u0001"+
    "\uffff\u0003\u0005\u0002\u0006\u0004\uffff\u0001\u0007\u0001\u0001\u0001"+
    "\u0002\u0001\u0003\u0001\u0004\u0001\u0005\u0001\u0006\u0001\u0008\u0001"+
    "\u0009\u0001\u000a",
    DFA15_specialS:
        "\u0001\u0001\u000c\uffff\u0001\u0002\u0001\u0000\u000a\uffff}>",
    DFA15_transitionS: [
            "\u0009\u000f\u0001\u000a\u0001\u0006\u0002\u000f\u0001\u0005"+
            "\u0012\u000f\u0001\u0009\u0001\u000f\u0001\u000d\u0004\u000f"+
            "\u0001\u000e\u0001\u000f\u0001\u0001\u0001\u000f\u0001\u0002"+
            "\u0003\u000f\u0001\u000b\u0010\u000f\u0001\u000c\u003a\u000f"+
            "\u0001\u0003\u0001\u000f\u0001\u0004\u1faa\u000f\u0001\u0007"+
            "\u0001\u0008\udfd6\u000f",
            "",
            "",
            "",
            "",
            "\u0001\u0006",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u0016\u0004\uffff\u0001\u0016",
            "\u0001\u0016",
            "\u0000\u0017",
            "\u0000\u0018",
            "",
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

org.antlr.lang.augmentObject(MmirScriptBlockLexer, {
    DFA15_eot:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptBlockLexer.DFA15_eotS),
    DFA15_eof:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptBlockLexer.DFA15_eofS),
    DFA15_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptBlockLexer.DFA15_minS),
    DFA15_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptBlockLexer.DFA15_maxS),
    DFA15_accept:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptBlockLexer.DFA15_acceptS),
    DFA15_special:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptBlockLexer.DFA15_specialS),
    DFA15_transition: (function() {
        var a = [],
            i,
            numStates = MmirScriptBlockLexer.DFA15_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(MmirScriptBlockLexer.DFA15_transitionS[i]));
        }
        return a;
    })()
});

MmirScriptBlockLexer.DFA15 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 15;
    this.eot = MmirScriptBlockLexer.DFA15_eot;
    this.eof = MmirScriptBlockLexer.DFA15_eof;
    this.min = MmirScriptBlockLexer.DFA15_min;
    this.max = MmirScriptBlockLexer.DFA15_max;
    this.accept = MmirScriptBlockLexer.DFA15_accept;
    this.special = MmirScriptBlockLexer.DFA15_special;
    this.transition = MmirScriptBlockLexer.DFA15_transition;
};

org.antlr.lang.extend(MmirScriptBlockLexer.DFA15, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( T__31 | T__32 | DoEnter | DoExit | NL | WS | CHAR | COMMENT | STRING | SSTRING );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA15_14 = input.LA(1);

                            s = -1;
                            if ( ((LA15_14>='\u0000' && LA15_14<='\uFFFF')) ) {s = 24;}

                            else s = 15;

                            if ( s>=0 ) return s;
                            break;
                        case 1 : 
                            var LA15_0 = input.LA(1);

                            s = -1;
                            if ( (LA15_0==')') ) {s = 1;}

                            else if ( (LA15_0=='+') ) {s = 2;}

                            else if ( (LA15_0=='{') ) {s = 3;}

                            else if ( (LA15_0=='}') ) {s = 4;}

                            else if ( (LA15_0=='\r') ) {s = 5;}

                            else if ( (LA15_0=='\n') ) {s = 6;}

                            else if ( (LA15_0=='\u2028') ) {s = 7;}

                            else if ( (LA15_0=='\u2029') ) {s = 8;}

                            else if ( (LA15_0==' ') ) {s = 9;}

                            else if ( (LA15_0=='\t') ) {s = 10;}

                            else if ( (LA15_0=='/') ) {s = 11;}

                            else if ( (LA15_0=='@') ) {s = 12;}

                            else if ( (LA15_0=='\"') ) {s = 13;}

                            else if ( (LA15_0=='\'') ) {s = 14;}

                            else if ( ((LA15_0>='\u0000' && LA15_0<='\b')||(LA15_0>='\u000B' && LA15_0<='\f')||(LA15_0>='\u000E' && LA15_0<='\u001F')||LA15_0=='!'||(LA15_0>='#' && LA15_0<='&')||LA15_0=='('||LA15_0=='*'||(LA15_0>=',' && LA15_0<='.')||(LA15_0>='0' && LA15_0<='?')||(LA15_0>='A' && LA15_0<='z')||LA15_0=='|'||(LA15_0>='~' && LA15_0<='\u2027')||(LA15_0>='\u202A' && LA15_0<='\uFFFF')) ) {s = 15;}

                            if ( s>=0 ) return s;
                            break;
                        case 2 : 
                            var LA15_13 = input.LA(1);

                            s = -1;
                            if ( ((LA15_13>='\u0000' && LA15_13<='\uFFFF')) ) {s = 23;}

                            else s = 15;

                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 15, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
 
})();