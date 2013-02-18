// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirScriptContent.g 2013-02-13 18:45:52

var MmirScriptContentLexer = function(input, state) {
// alternate constructor @todo
// public MmirScriptContentLexer(CharStream input)
// public MmirScriptContentLexer(CharStream input, RecognizerSharedState state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){

        	this.isDebug = true;

    }).call(this);

    this.dfa11 = new MmirScriptContentLexer.DFA11(this);
    MmirScriptContentLexer.superclass.constructor.call(this, input, state);


};

org.antlr.lang.augmentObject(MmirScriptContentLexer, {
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
    OCTAL_ESC: 22,
    T__28: 28,
    T__29: 29,
    T__30: 30,
    EscapeExit: 23,
    DoExit: 24,
    WS: 25,
    ESC_EXIT_SEQ: 26,
    EXIT_SEQ: 27
});

(function(){
var HIDDEN = org.antlr.runtime.Token.HIDDEN_CHANNEL,
    EOF = org.antlr.runtime.Token.EOF;
org.antlr.lang.extend(MmirScriptContentLexer, org.antlr.runtime.Lexer, {
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
    T__28 : 28,
    T__29 : 29,
    T__30 : 30,
    EscapeExit : 23,
    DoExit : 24,
    WS : 25,
    ESC_EXIT_SEQ : 26,
    EXIT_SEQ : 27,
    getGrammarFileName: function() { return "../MmirScriptContent.g"; }
});
org.antlr.lang.augmentObject(MmirScriptContentLexer.prototype, {
    // $ANTLR start T__28
    mT__28: function()  {
        try {
            var _type = this.T__28;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:12:7: ( ')' )
            // ../MmirScriptContent.g:12:9: ')'
            this.match(')'); if (this.state.failed) return ;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__28",

    // $ANTLR start T__29
    mT__29: function()  {
        try {
            var _type = this.T__29;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:13:7: ( '{' )
            // ../MmirScriptContent.g:13:9: '{'
            this.match('{'); if (this.state.failed) return ;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__29",

    // $ANTLR start T__30
    mT__30: function()  {
        try {
            var _type = this.T__30;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:14:7: ( '+' )
            // ../MmirScriptContent.g:14:9: '+'
            this.match('+'); if (this.state.failed) return ;



            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "T__30",

    // $ANTLR start EscapeExit
    mEscapeExit: function()  {
        try {
            var _type = this.EscapeExit;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:87:2: ( '}@@' )
            // ../MmirScriptContent.g:87:4: '}@@'
            this.match("}@@"); if (this.state.failed) return ;




            this.state.type = _type;
            this.state.channel = _channel;
        }
        finally {
        }
    },
    // $ANTLR end "EscapeExit",

    // $ANTLR start DoExit
    mDoExit: function()  {
        try {
            var _type = this.DoExit;
            var _channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
            // ../MmirScriptContent.g:88:8: ( '}@' )
            // ../MmirScriptContent.g:88:10: '}@'
            this.match("}@"); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {

                              this.emit(org.antlr.runtime.Token.EOF_TOKEN);
                              
                              if(this.isDebug) print("exiting embedded CONTENT");//debug
                        
                      
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
            // ../MmirScriptContent.g:97:2: ( ( '\\r' )? '\\n' | '\\r' | '\\u2028' | '\\u2029' )
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
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 2, 0, this.input);

                throw nvae;
            }

            switch (alt2) {
                case 1 :
                    // ../MmirScriptContent.g:97:4: ( '\\r' )? '\\n'
                    // ../MmirScriptContent.g:97:4: ( '\\r' )?
                    var alt1=2;
                    var LA1_0 = this.input.LA(1);

                    if ( (LA1_0=='\r') ) {
                        alt1=1;
                    }
                    switch (alt1) {
                        case 1 :
                            // ../MmirScriptContent.g:97:4: '\\r'
                            this.match('\r'); if (this.state.failed) return ;


                            break;

                    }

                    this.match('\n'); if (this.state.failed) return ;


                    break;
                case 2 :
                    // ../MmirScriptContent.g:98:4: '\\r'
                    this.match('\r'); if (this.state.failed) return ;


                    break;
                case 3 :
                    // ../MmirScriptContent.g:99:4: '\\u2028'
                    this.match('\u2028'); if (this.state.failed) return ;


                    break;
                case 4 :
                    // ../MmirScriptContent.g:100:4: '\\u2029'
                    this.match('\u2029'); if (this.state.failed) return ;


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
            // ../MmirScriptContent.g:104:5: ( ( ' ' | '\\t' | NL ) )
            // ../MmirScriptContent.g:104:7: ( ' ' | '\\t' | NL )
            // ../MmirScriptContent.g:104:7: ( ' ' | '\\t' | NL )
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
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 3, 0, this.input);

                throw nvae;
            }

            switch (alt3) {
                case 1 :
                    // ../MmirScriptContent.g:104:8: ' '
                    this.match(' '); if (this.state.failed) return ;


                    break;
                case 2 :
                    // ../MmirScriptContent.g:104:12: '\\t'
                    this.match('\t'); if (this.state.failed) return ;


                    break;
                case 3 :
                    // ../MmirScriptContent.g:104:18: NL
                    this.mNL(); if (this.state.failed) return ;


                    break;

            }

            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
            }



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
            // ../MmirScriptContent.g:106:6: (~ ( '\\n' | '\\r' ) )
            // ../MmirScriptContent.g:106:8: ~ ( '\\n' | '\\r' )
            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='\t')||(this.input.LA(1)>='\u000B' && this.input.LA(1)<='\f')||(this.input.LA(1)>='\u000E' && this.input.LA(1)<='\uFFFF') ) {
                this.input.consume();
            this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
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
            // ../MmirScriptContent.g:109:5: ( '@*' ( options {greedy=false; } : . )* '*@' )
            // ../MmirScriptContent.g:113:6: '@*' ( options {greedy=false; } : . )* '*@'
            this.match("@*"); if (this.state.failed) return ;

            // ../MmirScriptContent.g:113:11: ( options {greedy=false; } : . )*
            loop4:
            do {
                var alt4=2;
                var LA4_0 = this.input.LA(1);

                if ( (LA4_0=='*') ) {
                    var LA4_1 = this.input.LA(2);

                    if ( (LA4_1=='@') ) {
                        alt4=2;
                    }
                    else if ( ((LA4_1>='\u0000' && LA4_1<='?')||(LA4_1>='A' && LA4_1<='\uFFFF')) ) {
                        alt4=1;
                    }


                }
                else if ( ((LA4_0>='\u0000' && LA4_0<=')')||(LA4_0>='+' && LA4_0<='\uFFFF')) ) {
                    alt4=1;
                }


                switch (alt4) {
                case 1 :
                    // ../MmirScriptContent.g:113:39: .
                    this.matchAny(); if (this.state.failed) return ;


                    break;

                default :
                    break loop4;
                }
            } while (true);

            this.match("*@"); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {
              _channel=HIDDEN;
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
            // ../MmirScriptContent.g:118:5: ( '\"' ( options {greedy=false; } : ( ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ | ( EXIT_SEQ )=> EXIT_SEQ | ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"' )
            // ../MmirScriptContent.g:118:8: '\"' ( options {greedy=false; } : ( ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ | ( EXIT_SEQ )=> EXIT_SEQ | ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )* '\"'
            this.match('\"'); if (this.state.failed) return ;
            // ../MmirScriptContent.g:118:12: ( options {greedy=false; } : ( ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ | ( EXIT_SEQ )=> EXIT_SEQ | ESC_SEQ | ~ ( '\\\\' | '\"' ) ) )*
            loop6:
            do {
                var alt6=2;
                var LA6_0 = this.input.LA(1);

                if ( (LA6_0=='\"') ) {
                    alt6=2;
                }
                else if ( ((LA6_0>='\u0000' && LA6_0<='!')||(LA6_0>='#' && LA6_0<='\uFFFF')) ) {
                    alt6=1;
                }


                switch (alt6) {
                case 1 :
                    // ../MmirScriptContent.g:118:39: ( ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ | ( EXIT_SEQ )=> EXIT_SEQ | ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    // ../MmirScriptContent.g:118:39: ( ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ | ( EXIT_SEQ )=> EXIT_SEQ | ESC_SEQ | ~ ( '\\\\' | '\"' ) )
                    var alt5=4;
                    var LA5_0 = this.input.LA(1);

                    if ( (LA5_0=='}') ) {
                        var LA5_1 = this.input.LA(2);

                        if ( (LA5_1=='@') ) {
                            var LA5_4 = this.input.LA(3);

                            if ( (LA5_4=='@') && (this.synpred1_MmirScriptContent())) {
                                alt5=1;
                            }
                            else if ( (this.synpred2_MmirScriptContent()) ) {
                                alt5=2;
                            }
                            else if ( (true) ) {
                                alt5=4;
                            }
                            else {
                                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                                var nvae =
                                    new org.antlr.runtime.NoViableAltException("", 5, 4, this.input);

                                throw nvae;
                            }
                        }
                        else if ( ((LA5_1>='\u0000' && LA5_1<='?')||(LA5_1>='A' && LA5_1<='\uFFFF')) ) {
                            alt5=4;
                        }
                        else {
                            if (this.state.backtracking>0) {this.state.failed=true; return ;}
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 5, 1, this.input);

                            throw nvae;
                        }
                    }
                    else if ( (LA5_0=='\\') ) {
                        alt5=3;
                    }
                    else if ( ((LA5_0>='\u0000' && LA5_0<='!')||(LA5_0>='#' && LA5_0<='[')||(LA5_0>=']' && LA5_0<='|')||(LA5_0>='~' && LA5_0<='\uFFFF')) ) {
                        alt5=4;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return ;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 5, 0, this.input);

                        throw nvae;
                    }
                    switch (alt5) {
                        case 1 :
                            // ../MmirScriptContent.g:118:40: ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ
                            this.mESC_EXIT_SEQ(); if (this.state.failed) return ;


                            break;
                        case 2 :
                            // ../MmirScriptContent.g:118:71: ( EXIT_SEQ )=> EXIT_SEQ
                            this.mEXIT_SEQ(); if (this.state.failed) return ;


                            break;
                        case 3 :
                            // ../MmirScriptContent.g:118:94: ESC_SEQ
                            this.mESC_SEQ(); if (this.state.failed) return ;


                            break;
                        case 4 :
                            // ../MmirScriptContent.g:118:104: ~ ( '\\\\' | '\"' )
                            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='!')||(this.input.LA(1)>='#' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                                this.input.consume();
                            this.state.failed=false;
                            }
                            else {
                                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                    }



                    break;

                default :
                    break loop6;
                }
            } while (true);

            this.match('\"'); if (this.state.failed) return ;



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
            // ../MmirScriptContent.g:122:5: ( '\\'' ( options {greedy=false; } : ( ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ | ( EXIT_SEQ )=> EXIT_SEQ | ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\'' )
            // ../MmirScriptContent.g:122:8: '\\'' ( options {greedy=false; } : ( ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ | ( EXIT_SEQ )=> EXIT_SEQ | ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )* '\\''
            this.match('\''); if (this.state.failed) return ;
            // ../MmirScriptContent.g:122:13: ( options {greedy=false; } : ( ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ | ( EXIT_SEQ )=> EXIT_SEQ | ESC_SEQ | ~ ( '\\\\' | '\\'' ) ) )*
            loop8:
            do {
                var alt8=2;
                var LA8_0 = this.input.LA(1);

                if ( (LA8_0=='\'') ) {
                    alt8=2;
                }
                else if ( ((LA8_0>='\u0000' && LA8_0<='&')||(LA8_0>='(' && LA8_0<='\uFFFF')) ) {
                    alt8=1;
                }


                switch (alt8) {
                case 1 :
                    // ../MmirScriptContent.g:122:40: ( ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ | ( EXIT_SEQ )=> EXIT_SEQ | ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    // ../MmirScriptContent.g:122:40: ( ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ | ( EXIT_SEQ )=> EXIT_SEQ | ESC_SEQ | ~ ( '\\\\' | '\\'' ) )
                    var alt7=4;
                    var LA7_0 = this.input.LA(1);

                    if ( (LA7_0=='}') ) {
                        var LA7_1 = this.input.LA(2);

                        if ( (LA7_1=='@') ) {
                            var LA7_4 = this.input.LA(3);

                            if ( (LA7_4=='@') && (this.synpred3_MmirScriptContent())) {
                                alt7=1;
                            }
                            else if ( (this.synpred4_MmirScriptContent()) ) {
                                alt7=2;
                            }
                            else if ( (true) ) {
                                alt7=4;
                            }
                            else {
                                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                                var nvae =
                                    new org.antlr.runtime.NoViableAltException("", 7, 4, this.input);

                                throw nvae;
                            }
                        }
                        else if ( ((LA7_1>='\u0000' && LA7_1<='?')||(LA7_1>='A' && LA7_1<='\uFFFF')) ) {
                            alt7=4;
                        }
                        else {
                            if (this.state.backtracking>0) {this.state.failed=true; return ;}
                            var nvae =
                                new org.antlr.runtime.NoViableAltException("", 7, 1, this.input);

                            throw nvae;
                        }
                    }
                    else if ( (LA7_0=='\\') ) {
                        alt7=3;
                    }
                    else if ( ((LA7_0>='\u0000' && LA7_0<='&')||(LA7_0>='(' && LA7_0<='[')||(LA7_0>=']' && LA7_0<='|')||(LA7_0>='~' && LA7_0<='\uFFFF')) ) {
                        alt7=4;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return ;}
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 7, 0, this.input);

                        throw nvae;
                    }
                    switch (alt7) {
                        case 1 :
                            // ../MmirScriptContent.g:122:41: ( ESC_EXIT_SEQ )=> ESC_EXIT_SEQ
                            this.mESC_EXIT_SEQ(); if (this.state.failed) return ;


                            break;
                        case 2 :
                            // ../MmirScriptContent.g:122:72: ( EXIT_SEQ )=> EXIT_SEQ
                            this.mEXIT_SEQ(); if (this.state.failed) return ;


                            break;
                        case 3 :
                            // ../MmirScriptContent.g:122:95: ESC_SEQ
                            this.mESC_SEQ(); if (this.state.failed) return ;


                            break;
                        case 4 :
                            // ../MmirScriptContent.g:122:105: ~ ( '\\\\' | '\\'' )
                            if ( (this.input.LA(1)>='\u0000' && this.input.LA(1)<='&')||(this.input.LA(1)>='(' && this.input.LA(1)<='[')||(this.input.LA(1)>=']' && this.input.LA(1)<='\uFFFF') ) {
                                this.input.consume();
                            this.state.failed=false;
                            }
                            else {
                                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                this.recover(mse);
                                throw mse;}



                            break;

                    }



                    break;

                default :
                    break loop8;
                }
            } while (true);

            this.match('\''); if (this.state.failed) return ;



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
            // ../MmirScriptContent.g:126:11: ( ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' ) )
            // ../MmirScriptContent.g:126:13: ( '0' .. '9' | 'a' .. 'f' | 'A' .. 'F' )
            if ( (this.input.LA(1)>='0' && this.input.LA(1)<='9')||(this.input.LA(1)>='A' && this.input.LA(1)<='F')||(this.input.LA(1)>='a' && this.input.LA(1)<='f') ) {
                this.input.consume();
            this.state.failed=false;
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
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
            // ../MmirScriptContent.g:130:5: ( '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' ) | UNICODE_ESC | OCTAL_ESC )
            var alt9=3;
            var LA9_0 = this.input.LA(1);

            if ( (LA9_0=='\\') ) {
                switch ( this.input.LA(2) ) {
                case '\"':
                case '\'':
                case '\\':
                case 'b':
                case 'f':
                case 'n':
                case 'r':
                case 't':
                    alt9=1;
                    break;
                case 'u':
                    alt9=2;
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                    alt9=3;
                    break;
                default:
                    if (this.state.backtracking>0) {this.state.failed=true; return ;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 9, 1, this.input);

                    throw nvae;
                }

            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 9, 0, this.input);

                throw nvae;
            }
            switch (alt9) {
                case 1 :
                    // ../MmirScriptContent.g:130:9: '\\\\' ( 'b' | 't' | 'n' | 'f' | 'r' | '\\\"' | '\\'' | '\\\\' )
                    this.match('\\'); if (this.state.failed) return ;
                    if ( this.input.LA(1)=='\"'||this.input.LA(1)=='\''||this.input.LA(1)=='\\'||this.input.LA(1)=='b'||this.input.LA(1)=='f'||this.input.LA(1)=='n'||this.input.LA(1)=='r'||this.input.LA(1)=='t' ) {
                        this.input.consume();
                    this.state.failed=false;
                    }
                    else {
                        if (this.state.backtracking>0) {this.state.failed=true; return ;}
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        this.recover(mse);
                        throw mse;}



                    break;
                case 2 :
                    // ../MmirScriptContent.g:131:9: UNICODE_ESC
                    this.mUNICODE_ESC(); if (this.state.failed) return ;


                    break;
                case 3 :
                    // ../MmirScriptContent.g:132:9: OCTAL_ESC
                    this.mOCTAL_ESC(); if (this.state.failed) return ;


                    break;

            }
        }
        finally {
        }
    },
    // $ANTLR end "ESC_SEQ",

    // $ANTLR start ESC_EXIT_SEQ
    mESC_EXIT_SEQ: function()  {
        try {
            // ../MmirScriptContent.g:137:2: ( '}@@' )
            // ../MmirScriptContent.g:137:4: '}@@'
            this.match("}@@"); if (this.state.failed) return ;




        }
        finally {
        }
    },
    // $ANTLR end "ESC_EXIT_SEQ",

    // $ANTLR start EXIT_SEQ
    mEXIT_SEQ: function()  {
        try {
            // ../MmirScriptContent.g:141:2: ( '}@' )
            // ../MmirScriptContent.g:141:4: '}@'
            this.match("}@"); if (this.state.failed) return ;

            if ( this.state.backtracking===0 ) {

                              this.emit(org.antlr.runtime.Token.EOF_TOKEN);
                              
                              if(this.isDebug) print("IN_STRING: exiting embedded CONTENT");//debug
                        
                      
            }



        }
        finally {
        }
    },
    // $ANTLR end "EXIT_SEQ",

    // $ANTLR start OCTAL_ESC
    mOCTAL_ESC: function()  {
        try {
            // ../MmirScriptContent.g:152:5: ( '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) ( '0' .. '7' ) | '\\\\' ( '0' .. '7' ) )
            var alt10=3;
            var LA10_0 = this.input.LA(1);

            if ( (LA10_0=='\\') ) {
                var LA10_1 = this.input.LA(2);

                if ( ((LA10_1>='0' && LA10_1<='3')) ) {
                    var LA10_2 = this.input.LA(3);

                    if ( ((LA10_2>='0' && LA10_2<='7')) ) {
                        var LA10_4 = this.input.LA(4);

                        if ( ((LA10_4>='0' && LA10_4<='7')) ) {
                            alt10=1;
                        }
                        else {
                            alt10=2;}
                    }
                    else {
                        alt10=3;}
                }
                else if ( ((LA10_1>='4' && LA10_1<='7')) ) {
                    var LA10_3 = this.input.LA(3);

                    if ( ((LA10_3>='0' && LA10_3<='7')) ) {
                        alt10=2;
                    }
                    else {
                        alt10=3;}
                }
                else {
                    if (this.state.backtracking>0) {this.state.failed=true; return ;}
                    var nvae =
                        new org.antlr.runtime.NoViableAltException("", 10, 1, this.input);

                    throw nvae;
                }
            }
            else {
                if (this.state.backtracking>0) {this.state.failed=true; return ;}
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 10, 0, this.input);

                throw nvae;
            }
            switch (alt10) {
                case 1 :
                    // ../MmirScriptContent.g:152:9: '\\\\' ( '0' .. '3' ) ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); if (this.state.failed) return ;
                    // ../MmirScriptContent.g:152:14: ( '0' .. '3' )
                    // ../MmirScriptContent.g:152:15: '0' .. '3'
                    this.matchRange('0','3'); if (this.state.failed) return ;



                    // ../MmirScriptContent.g:152:25: ( '0' .. '7' )
                    // ../MmirScriptContent.g:152:26: '0' .. '7'
                    this.matchRange('0','7'); if (this.state.failed) return ;



                    // ../MmirScriptContent.g:152:36: ( '0' .. '7' )
                    // ../MmirScriptContent.g:152:37: '0' .. '7'
                    this.matchRange('0','7'); if (this.state.failed) return ;





                    break;
                case 2 :
                    // ../MmirScriptContent.g:153:9: '\\\\' ( '0' .. '7' ) ( '0' .. '7' )
                    this.match('\\'); if (this.state.failed) return ;
                    // ../MmirScriptContent.g:153:14: ( '0' .. '7' )
                    // ../MmirScriptContent.g:153:15: '0' .. '7'
                    this.matchRange('0','7'); if (this.state.failed) return ;



                    // ../MmirScriptContent.g:153:25: ( '0' .. '7' )
                    // ../MmirScriptContent.g:153:26: '0' .. '7'
                    this.matchRange('0','7'); if (this.state.failed) return ;





                    break;
                case 3 :
                    // ../MmirScriptContent.g:154:9: '\\\\' ( '0' .. '7' )
                    this.match('\\'); if (this.state.failed) return ;
                    // ../MmirScriptContent.g:154:14: ( '0' .. '7' )
                    // ../MmirScriptContent.g:154:15: '0' .. '7'
                    this.matchRange('0','7'); if (this.state.failed) return ;





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
            // ../MmirScriptContent.g:159:5: ( '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT )
            // ../MmirScriptContent.g:159:9: '\\\\' 'u' HEX_DIGIT HEX_DIGIT HEX_DIGIT HEX_DIGIT
            this.match('\\'); if (this.state.failed) return ;
            this.match('u'); if (this.state.failed) return ;
            this.mHEX_DIGIT(); if (this.state.failed) return ;
            this.mHEX_DIGIT(); if (this.state.failed) return ;
            this.mHEX_DIGIT(); if (this.state.failed) return ;
            this.mHEX_DIGIT(); if (this.state.failed) return ;



        }
        finally {
        }
    },
    // $ANTLR end "UNICODE_ESC",

    mTokens: function() {
        // ../MmirScriptContent.g:1:8: ( T__28 | T__29 | T__30 | EscapeExit | DoExit | NL | WS | CHAR | COMMENT | STRING | SSTRING )
        var alt11=11;
        alt11 = this.dfa11.predict(this.input);
        switch (alt11) {
            case 1 :
                // ../MmirScriptContent.g:1:10: T__28
                this.mT__28(); if (this.state.failed) return ;


                break;
            case 2 :
                // ../MmirScriptContent.g:1:16: T__29
                this.mT__29(); if (this.state.failed) return ;


                break;
            case 3 :
                // ../MmirScriptContent.g:1:22: T__30
                this.mT__30(); if (this.state.failed) return ;


                break;
            case 4 :
                // ../MmirScriptContent.g:1:28: EscapeExit
                this.mEscapeExit(); if (this.state.failed) return ;


                break;
            case 5 :
                // ../MmirScriptContent.g:1:39: DoExit
                this.mDoExit(); if (this.state.failed) return ;


                break;
            case 6 :
                // ../MmirScriptContent.g:1:46: NL
                this.mNL(); if (this.state.failed) return ;


                break;
            case 7 :
                // ../MmirScriptContent.g:1:49: WS
                this.mWS(); if (this.state.failed) return ;


                break;
            case 8 :
                // ../MmirScriptContent.g:1:52: CHAR
                this.mCHAR(); if (this.state.failed) return ;


                break;
            case 9 :
                // ../MmirScriptContent.g:1:57: COMMENT
                this.mCOMMENT(); if (this.state.failed) return ;


                break;
            case 10 :
                // ../MmirScriptContent.g:1:65: STRING
                this.mSTRING(); if (this.state.failed) return ;


                break;
            case 11 :
                // ../MmirScriptContent.g:1:72: SSTRING
                this.mSSTRING(); if (this.state.failed) return ;


                break;

        }

    },

    // $ANTLR start "synpred1_MmirScriptContent"
    synpred1_MmirScriptContent_fragment: function() {
        // ../MmirScriptContent.g:118:40: ( ESC_EXIT_SEQ )
        // ../MmirScriptContent.g:118:41: ESC_EXIT_SEQ
        this.mESC_EXIT_SEQ(); if (this.state.failed) return ;


    },
    // $ANTLR end "synpred1_MmirScriptContent",

    // $ANTLR start "synpred2_MmirScriptContent"
    synpred2_MmirScriptContent_fragment: function() {
        // ../MmirScriptContent.g:118:71: ( EXIT_SEQ )
        // ../MmirScriptContent.g:118:72: EXIT_SEQ
        this.mEXIT_SEQ(); if (this.state.failed) return ;


    },
    // $ANTLR end "synpred2_MmirScriptContent",

    // $ANTLR start "synpred3_MmirScriptContent"
    synpred3_MmirScriptContent_fragment: function() {
        // ../MmirScriptContent.g:122:41: ( ESC_EXIT_SEQ )
        // ../MmirScriptContent.g:122:42: ESC_EXIT_SEQ
        this.mESC_EXIT_SEQ(); if (this.state.failed) return ;


    },
    // $ANTLR end "synpred3_MmirScriptContent",

    // $ANTLR start "synpred4_MmirScriptContent"
    synpred4_MmirScriptContent_fragment: function() {
        // ../MmirScriptContent.g:122:72: ( EXIT_SEQ )
        // ../MmirScriptContent.g:122:73: EXIT_SEQ
        this.mEXIT_SEQ(); if (this.state.failed) return ;


    },
    // $ANTLR end "synpred4_MmirScriptContent"

    synpred3_MmirScriptContent: function() {
        this.state.backtracking++;
        var start = this.input.mark();
        try {
            this.synpred3_MmirScriptContent_fragment(); // can never throw exception
        } catch (re) {
            alert("impossible: "+re.toString());
        }
        var success = !this.state.failed;
        this.input.rewind(start);
        this.state.backtracking--;
        this.state.failed=false;
        return success;
    },
    synpred1_MmirScriptContent: function() {
        this.state.backtracking++;
        var start = this.input.mark();
        try {
            this.synpred1_MmirScriptContent_fragment(); // can never throw exception
        } catch (re) {
            alert("impossible: "+re.toString());
        }
        var success = !this.state.failed;
        this.input.rewind(start);
        this.state.backtracking--;
        this.state.failed=false;
        return success;
    },
    synpred2_MmirScriptContent: function() {
        this.state.backtracking++;
        var start = this.input.mark();
        try {
            this.synpred2_MmirScriptContent_fragment(); // can never throw exception
        } catch (re) {
            alert("impossible: "+re.toString());
        }
        var success = !this.state.failed;
        this.input.rewind(start);
        this.state.backtracking--;
        this.state.failed=false;
        return success;
    },
    synpred4_MmirScriptContent: function() {
        this.state.backtracking++;
        var start = this.input.mark();
        try {
            this.synpred4_MmirScriptContent_fragment(); // can never throw exception
        } catch (re) {
            alert("impossible: "+re.toString());
        }
        var success = !this.state.failed;
        this.input.rewind(start);
        this.state.backtracking--;
        this.state.failed=false;
        return success;
    }
}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(MmirScriptContentLexer, {
    DFA11_eotS:
        "\u0004\uffff\u0001\u000e\u0001\u0013\u0005\uffff\u0003\u000e\u0004"+
    "\uffff\u0001\u0019\u0007\uffff",
    DFA11_eofS:
        "\u001a\uffff",
    DFA11_minS:
        "\u0001\u0000\u0003\uffff\u0001\u0040\u0001\u000a\u0005\uffff\u0001"+
    "\u002a\u0002\u0000\u0004\uffff\u0001\u0040\u0007\uffff",
    DFA11_maxS:
        "\u0001\uffff\u0003\uffff\u0001\u0040\u0001\u000a\u0005\uffff\u0001"+
    "\u002a\u0002\uffff\u0004\uffff\u0001\u0040\u0007\uffff",
    DFA11_acceptS:
        "\u0001\uffff\u0001\u0001\u0001\u0002\u0001\u0003\u0002\uffff\u0003"+
    "\u0006\u0002\u0007\u0003\uffff\u0001\u0008\u0001\u0001\u0001\u0002\u0001"+
    "\u0003\u0001\uffff\u0001\u0006\u0001\u0007\u0001\u0009\u0001\u000a\u0001"+
    "\u000b\u0001\u0004\u0001\u0005",
    DFA11_specialS:
        "\u0001\u0001\u000b\uffff\u0001\u0002\u0001\u0000\u000c\uffff}>",
    DFA11_transitionS: [
            "\u0009\u000e\u0001\u000a\u0001\u0006\u0002\u000e\u0001\u0005"+
            "\u0012\u000e\u0001\u0009\u0001\u000e\u0001\u000c\u0004\u000e"+
            "\u0001\u000d\u0001\u000e\u0001\u0001\u0001\u000e\u0001\u0003"+
            "\u0014\u000e\u0001\u000b\u003a\u000e\u0001\u0002\u0001\u000e"+
            "\u0001\u0004\u1faa\u000e\u0001\u0007\u0001\u0008\udfd6\u000e",
            "",
            "",
            "",
            "\u0001\u0012",
            "\u0001\u0006",
            "",
            "",
            "",
            "",
            "",
            "\u0001\u0015",
            "\u0000\u0016",
            "\u0000\u0017",
            "",
            "",
            "",
            "",
            "\u0001\u0018",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(MmirScriptContentLexer, {
    DFA11_eot:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentLexer.DFA11_eotS),
    DFA11_eof:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentLexer.DFA11_eofS),
    DFA11_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptContentLexer.DFA11_minS),
    DFA11_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptContentLexer.DFA11_maxS),
    DFA11_accept:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentLexer.DFA11_acceptS),
    DFA11_special:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentLexer.DFA11_specialS),
    DFA11_transition: (function() {
        var a = [],
            i,
            numStates = MmirScriptContentLexer.DFA11_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentLexer.DFA11_transitionS[i]));
        }
        return a;
    })()
});

MmirScriptContentLexer.DFA11 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 11;
    this.eot = MmirScriptContentLexer.DFA11_eot;
    this.eof = MmirScriptContentLexer.DFA11_eof;
    this.min = MmirScriptContentLexer.DFA11_min;
    this.max = MmirScriptContentLexer.DFA11_max;
    this.accept = MmirScriptContentLexer.DFA11_accept;
    this.special = MmirScriptContentLexer.DFA11_special;
    this.transition = MmirScriptContentLexer.DFA11_transition;
};

org.antlr.lang.extend(MmirScriptContentLexer.DFA11, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "1:1: Tokens : ( T__28 | T__29 | T__30 | EscapeExit | DoExit | NL | WS | CHAR | COMMENT | STRING | SSTRING );";
    },
    specialStateTransition: function(s, input) {
        var _s = s;
        /* bind to recognizer so semantic predicates can be evaluated */
        var retval = (function(s, input) {
            switch ( s ) {
                        case 0 : 
                            var LA11_13 = input.LA(1);

                            s = -1;
                            if ( ((LA11_13>='\u0000' && LA11_13<='\uFFFF')) ) {s = 23;}

                            else s = 14;

                            if ( s>=0 ) return s;
                            break;
                        case 1 : 
                            var LA11_0 = input.LA(1);

                            s = -1;
                            if ( (LA11_0==')') ) {s = 1;}

                            else if ( (LA11_0=='{') ) {s = 2;}

                            else if ( (LA11_0=='+') ) {s = 3;}

                            else if ( (LA11_0=='}') ) {s = 4;}

                            else if ( (LA11_0=='\r') ) {s = 5;}

                            else if ( (LA11_0=='\n') ) {s = 6;}

                            else if ( (LA11_0=='\u2028') ) {s = 7;}

                            else if ( (LA11_0=='\u2029') ) {s = 8;}

                            else if ( (LA11_0==' ') ) {s = 9;}

                            else if ( (LA11_0=='\t') ) {s = 10;}

                            else if ( (LA11_0=='@') ) {s = 11;}

                            else if ( (LA11_0=='\"') ) {s = 12;}

                            else if ( (LA11_0=='\'') ) {s = 13;}

                            else if ( ((LA11_0>='\u0000' && LA11_0<='\b')||(LA11_0>='\u000B' && LA11_0<='\f')||(LA11_0>='\u000E' && LA11_0<='\u001F')||LA11_0=='!'||(LA11_0>='#' && LA11_0<='&')||LA11_0=='('||LA11_0=='*'||(LA11_0>=',' && LA11_0<='?')||(LA11_0>='A' && LA11_0<='z')||LA11_0=='|'||(LA11_0>='~' && LA11_0<='\u2027')||(LA11_0>='\u202A' && LA11_0<='\uFFFF')) ) {s = 14;}

                            if ( s>=0 ) return s;
                            break;
                        case 2 : 
                            var LA11_12 = input.LA(1);

                            s = -1;
                            if ( ((LA11_12>='\u0000' && LA11_12<='\uFFFF')) ) {s = 22;}

                            else s = 14;

                            if ( s>=0 ) return s;
                            break;
            }
        }).call(this.recognizer, s, input);
        if (!org.antlr.lang.isUndefined(retval)) {
            return retval;
        }
        if (this.recognizer.state.backtracking>0) {this.recognizer.state.failed=true; return -1;}
        var nvae =
            new org.antlr.runtime.NoViableAltException(this.getDescription(), 11, _s, input);
        this.error(nvae);
        throw nvae;
    },
    dummy: null
});
 
})();