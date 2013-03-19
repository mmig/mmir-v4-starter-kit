// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirScriptStatement.g 2013-03-01 17:04:16

var MmirScriptStatementParser = function(input, state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){


        	this.isDebug = true;

        	function extractString(str){
        		if(str){
        			if(str.length > 0){
        				return str.substring(1,str.length - 1);
        			}
        			else return '';
        		}
        		return null;
        	}
        	this.extractString = extractString;

    }).call(this);

    MmirScriptStatementParser.superclass.constructor.call(this, input, state);

    this.dfa10 = new MmirScriptStatementParser.DFA10(this);

         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(MmirScriptStatementParser, {
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
    T__30: 30,
    T__31: 31,
    DoExitStatement: 28,
    WS: 29
});

(function(){
// public class variables
var EOF= -1,
    STRING= 4,
    SSTRING= 5,
    CHAR= 6,
    NL= 7,
    END= 8,
    ESC_DoEnter= 9,
    COMMENT= 10,
    DoEnterBlock= 11,
    DoEnterStatement= 12,
    DoEnterIncludeScript= 13,
    DoEnterIncludeStyle= 14,
    DoEnterLocalize= 15,
    DoEnterYieldDeclaration= 16,
    DoEnterYieldContent= 17,
    DoEnterHelper= 18,
    DoEnterRender= 19,
    DoEnterIfStatement= 20,
    DoEnterElseStatement= 21,
    DoEnterForStatement= 22,
    END_SCRIPT= 23,
    ESC_SEQ= 24,
    HEX_DIGIT= 25,
    UNICODE_ESC= 26,
    OCTAL_ESC= 27,
    T__30= 30,
    T__31= 31,
    DoExitStatement= 28,
    WS= 29;

// public instance methods/vars
org.antlr.lang.extend(MmirScriptStatementParser, org.antlr.runtime.Parser, {
        

    getTokenNames: function() { return MmirScriptStatementParser.tokenNames; },
    getGrammarFileName: function() { return "../MmirScriptStatement.g"; }
});
org.antlr.lang.augmentObject(MmirScriptStatementParser.prototype, {


    // ../MmirScriptStatement.g:61:1: main returns [String theText] : t= text ( NL t= text )* ;
    // $ANTLR start "main"
    main: function() {
        var theText = null;

         var t = null;

        try {
            // ../MmirScriptStatement.g:65:2: (t= text ( NL t= text )* )
            // ../MmirScriptStatement.g:65:4: t= text ( NL t= text )*
            this.pushFollow(MmirScriptStatementParser.FOLLOW_text_in_main62);
            t=this.text();

            this.state._fsp--;

             theText = ((t?this.input.toString(t.start,t.stop):null)?(t?this.input.toString(t.start,t.stop):null):''); 
            // ../MmirScriptStatement.g:65:48: ( NL t= text )*
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( (LA1_0==NL) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // ../MmirScriptStatement.g:65:49: NL t= text
                    this.match(this.input,NL,MmirScriptStatementParser.FOLLOW_NL_in_main67); 
                    this.pushFollow(MmirScriptStatementParser.FOLLOW_text_in_main71);
                    t=this.text();

                    this.state._fsp--;

                     theText = theText + '\r\n' + ((t?this.input.toString(t.start,t.stop):null)?(t?this.input.toString(t.start,t.stop):null):''); 


                    break;

                default :
                    break loop1;
                }
            } while (true);





            		if(this.isDebug) printInfo('SCRIPT_main.text', theText);//debug
            	
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return theText;
    },

    // inline static return class
    text_return: (function() {
        MmirScriptStatementParser.text_return = function(){};
        org.antlr.lang.extend(MmirScriptStatementParser.text_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
        });
        return;
    })(),

    // ../MmirScriptStatement.g:68:1: text : ( other | DoExitStatement | DoEnterStatement | CHAR )* ;
    // $ANTLR start "text"
    text: function() {
        var retval = new MmirScriptStatementParser.text_return();
        retval.start = this.input.LT(1);

        try {
            // ../MmirScriptStatement.g:69:2: ( ( other | DoExitStatement | DoEnterStatement | CHAR )* )
            // ../MmirScriptStatement.g:69:4: ( other | DoExitStatement | DoEnterStatement | CHAR )*
            // ../MmirScriptStatement.g:69:4: ( other | DoExitStatement | DoEnterStatement | CHAR )*
            loop2:
            do {
                var alt2=5;
                switch ( this.input.LA(1) ) {
                case STRING:
                case SSTRING:
                case COMMENT:
                    alt2=1;
                    break;
                case DoExitStatement:
                    alt2=2;
                    break;
                case DoEnterStatement:
                    alt2=3;
                    break;
                case CHAR:
                    alt2=4;
                    break;

                }

                switch (alt2) {
                case 1 :
                    // ../MmirScriptStatement.g:69:6: other
                    this.pushFollow(MmirScriptStatementParser.FOLLOW_other_in_text88);
                    this.other();

                    this.state._fsp--;



                    break;
                case 2 :
                    // ../MmirScriptStatement.g:69:14: DoExitStatement
                    this.match(this.input,DoExitStatement,MmirScriptStatementParser.FOLLOW_DoExitStatement_in_text92); 


                    break;
                case 3 :
                    // ../MmirScriptStatement.g:69:32: DoEnterStatement
                    this.match(this.input,DoEnterStatement,MmirScriptStatementParser.FOLLOW_DoEnterStatement_in_text96); 


                    break;
                case 4 :
                    // ../MmirScriptStatement.g:69:51: CHAR
                    this.match(this.input,CHAR,MmirScriptStatementParser.FOLLOW_CHAR_in_text100); 


                    break;

                default :
                    break loop2;
                }
            } while (true);




            retval.stop = this.input.LT(-1);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    stringArgAndContent_return: (function() {
        MmirScriptStatementParser.stringArgAndContent_return = function(){};
        org.antlr.lang.extend(MmirScriptStatementParser.stringArgAndContent_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
        });
        return;
    })(),

    // ../MmirScriptStatement.g:72:1: stringArgAndContent returns [String theName, String theContent] : stringArg ')' ( NL | WS )* start= '{' ( NL | CHAR )* ;
    // $ANTLR start "stringArgAndContent"
    stringArgAndContent: function() {
        var retval = new MmirScriptStatementParser.stringArgAndContent_return();
        retval.start = this.input.LT(1);

        var start = null;
         var stringArg1 = null;


        		var startPos;
        	
        try {
            // ../MmirScriptStatement.g:83:2: ( stringArg ')' ( NL | WS )* start= '{' ( NL | CHAR )* )
            // ../MmirScriptStatement.g:83:4: stringArg ')' ( NL | WS )* start= '{' ( NL | CHAR )*
            this.pushFollow(MmirScriptStatementParser.FOLLOW_stringArg_in_stringArgAndContent128);
            stringArg1=this.stringArg();

            this.state._fsp--;

            this.match(this.input,DoExitStatement,MmirScriptStatementParser.FOLLOW_DoExitStatement_in_stringArgAndContent130); 
            // ../MmirScriptStatement.g:83:18: ( NL | WS )*
            loop3:
            do {
                var alt3=2;
                var LA3_0 = this.input.LA(1);

                if ( (LA3_0==NL||LA3_0==WS) ) {
                    alt3=1;
                }


                switch (alt3) {
                case 1 :
                    // ../MmirScriptStatement.g:
                    if ( this.input.LA(1)==NL||this.input.LA(1)==WS ) {
                        this.input.consume();
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }



                    break;

                default :
                    break loop3;
                }
            } while (true);

            start=this.match(this.input,30,MmirScriptStatementParser.FOLLOW_30_in_stringArgAndContent141); 
            // ../MmirScriptStatement.g:83:38: ( NL | CHAR )*
            loop4:
            do {
                var alt4=2;
                var LA4_0 = this.input.LA(1);

                if ( ((LA4_0>=CHAR && LA4_0<=NL)) ) {
                    alt4=1;
                }


                switch (alt4) {
                case 1 :
                    // ../MmirScriptStatement.g:
                    if ( (this.input.LA(1)>=CHAR && this.input.LA(1)<=NL) ) {
                        this.input.consume();
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }



                    break;

                default :
                    break loop4;
                }
            } while (true);


            		retval.theName = stringArg1;
            		startPos = start.getStartIndex()+1;
            		
            		if(this.isDebug) print('Block.stringArgAndContent -> str='+stringArg1);
            	



            retval.stop = this.input.LT(-1);


            		var end = this.input.getTokens()[this.input.size()-1].getStopIndex()+1;
            		var theString = this.input.getTokenSource().input.data;
            		retval.theContent = theString.substring(startPos, end);
            		
            		if(this.isDebug) print('Block.stringArgAndContent -> content= "'+retval.theContent+'"');//debug
            	
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },


    // ../MmirScriptStatement.g:91:1: parseStringArg returns [String theText] : stringArg EOF ;
    // $ANTLR start "parseStringArg"
    parseStringArg: function() {
        var theText = null;

         var stringArg2 = null;

        try {
            // ../MmirScriptStatement.g:92:2: ( stringArg EOF )
            // ../MmirScriptStatement.g:92:4: stringArg EOF
            this.pushFollow(MmirScriptStatementParser.FOLLOW_stringArg_in_parseStringArg169);
            stringArg2=this.stringArg();

            this.state._fsp--;

            this.match(this.input,EOF,MmirScriptStatementParser.FOLLOW_EOF_in_parseStringArg171); 
            theText = stringArg2;



        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return theText;
    },


    // ../MmirScriptStatement.g:95:1: stringArg returns [String theText] : ( NL | WS )* (str= STRING | str= SSTRING ) ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )* ( NL | WS )* ;
    // $ANTLR start "stringArg"
    stringArg: function() {
        var theText = null;

        var str = null;


        	var strs;

        try {
            // ../MmirScriptStatement.g:103:2: ( ( NL | WS )* (str= STRING | str= SSTRING ) ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )* ( NL | WS )* )
            // ../MmirScriptStatement.g:103:4: ( NL | WS )* (str= STRING | str= SSTRING ) ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )* ( NL | WS )*
            // ../MmirScriptStatement.g:103:4: ( NL | WS )*
            loop5:
            do {
                var alt5=2;
                var LA5_0 = this.input.LA(1);

                if ( (LA5_0==NL||LA5_0==WS) ) {
                    alt5=1;
                }


                switch (alt5) {
                case 1 :
                    // ../MmirScriptStatement.g:
                    if ( this.input.LA(1)==NL||this.input.LA(1)==WS ) {
                        this.input.consume();
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }



                    break;

                default :
                    break loop5;
                }
            } while (true);

            // ../MmirScriptStatement.g:104:4: (str= STRING | str= SSTRING )
            var alt6=2;
            var LA6_0 = this.input.LA(1);

            if ( (LA6_0==STRING) ) {
                alt6=1;
            }
            else if ( (LA6_0==SSTRING) ) {
                alt6=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 6, 0, this.input);

                throw nvae;
            }
            switch (alt6) {
                case 1 :
                    // ../MmirScriptStatement.g:105:3: str= STRING
                    str=this.match(this.input,STRING,MmirScriptStatementParser.FOLLOW_STRING_in_stringArg212); 
                    if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                    break;
                case 2 :
                    // ../MmirScriptStatement.g:106:6: str= SSTRING
                    str=this.match(this.input,SSTRING,MmirScriptStatementParser.FOLLOW_SSTRING_in_stringArg223); 
                    if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                    break;

            }

            // ../MmirScriptStatement.g:107:6: ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )*
            loop10:
            do {
                var alt10=2;
                alt10 = this.dfa10.predict(this.input);
                switch (alt10) {
                case 1 :
                    // ../MmirScriptStatement.g:108:5: ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING )
                    // ../MmirScriptStatement.g:108:5: ( NL | WS )*
                    loop7:
                    do {
                        var alt7=2;
                        var LA7_0 = this.input.LA(1);

                        if ( (LA7_0==NL||LA7_0==WS) ) {
                            alt7=1;
                        }


                        switch (alt7) {
                        case 1 :
                            // ../MmirScriptStatement.g:
                            if ( this.input.LA(1)==NL||this.input.LA(1)==WS ) {
                                this.input.consume();
                                this.state.errorRecovery=false;
                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                throw mse;
                            }



                            break;

                        default :
                            break loop7;
                        }
                    } while (true);

                    this.match(this.input,31,MmirScriptStatementParser.FOLLOW_31_in_stringArg246); 
                    // ../MmirScriptStatement.g:108:18: ( NL | WS )*
                    loop8:
                    do {
                        var alt8=2;
                        var LA8_0 = this.input.LA(1);

                        if ( (LA8_0==NL||LA8_0==WS) ) {
                            alt8=1;
                        }


                        switch (alt8) {
                        case 1 :
                            // ../MmirScriptStatement.g:
                            if ( this.input.LA(1)==NL||this.input.LA(1)==WS ) {
                                this.input.consume();
                                this.state.errorRecovery=false;
                            }
                            else {
                                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                                throw mse;
                            }



                            break;

                        default :
                            break loop8;
                        }
                    } while (true);

                    // ../MmirScriptStatement.g:109:7: (str= STRING | str= SSTRING )
                    var alt9=2;
                    var LA9_0 = this.input.LA(1);

                    if ( (LA9_0==STRING) ) {
                        alt9=1;
                    }
                    else if ( (LA9_0==SSTRING) ) {
                        alt9=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 9, 0, this.input);

                        throw nvae;
                    }
                    switch (alt9) {
                        case 1 :
                            // ../MmirScriptStatement.g:109:8: str= STRING
                            str=this.match(this.input,STRING,MmirScriptStatementParser.FOLLOW_STRING_in_stringArg265); 
                            if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                            break;
                        case 2 :
                            // ../MmirScriptStatement.g:110:8: str= SSTRING
                            str=this.match(this.input,SSTRING,MmirScriptStatementParser.FOLLOW_SSTRING_in_stringArg278); 
                            if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                            break;

                    }



                    break;

                default :
                    break loop10;
                }
            } while (true);

            // ../MmirScriptStatement.g:112:7: ( NL | WS )*
            loop11:
            do {
                var alt11=2;
                var LA11_0 = this.input.LA(1);

                if ( (LA11_0==NL||LA11_0==WS) ) {
                    alt11=1;
                }


                switch (alt11) {
                case 1 :
                    // ../MmirScriptStatement.g:
                    if ( this.input.LA(1)==NL||this.input.LA(1)==WS ) {
                        this.input.consume();
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }



                    break;

                default :
                    break loop11;
                }
            } while (true);





            	if(strs) theText = strs.join(''); 
            	else theText ='';

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return theText;
    },


    // ../MmirScriptStatement.g:115:1: other : ( COMMENT | STRING | SSTRING );
    // $ANTLR start "other"
    other: function() {
        var COMMENT3 = null;
        var STRING4 = null;
        var SSTRING5 = null;

        try {
            // ../MmirScriptStatement.g:115:7: ( COMMENT | STRING | SSTRING )
            var alt12=3;
            switch ( this.input.LA(1) ) {
            case COMMENT:
                alt12=1;
                break;
            case STRING:
                alt12=2;
                break;
            case SSTRING:
                alt12=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 12, 0, this.input);

                throw nvae;
            }

            switch (alt12) {
                case 1 :
                    // ../MmirScriptStatement.g:115:9: COMMENT
                    COMMENT3=this.match(this.input,COMMENT,MmirScriptStatementParser.FOLLOW_COMMENT_in_other310); 
                    if(this.isDebug) printInfo('SCRIPT_BLOCK_comment',(COMMENT3?COMMENT3.getText():null));/*debug*/


                    break;
                case 2 :
                    // ../MmirScriptStatement.g:116:4: STRING
                    STRING4=this.match(this.input,STRING,MmirScriptStatementParser.FOLLOW_STRING_in_other318); 
                    if(this.isDebug) printInfo('SCRIPT_BLOCK_String' ,(STRING4?STRING4.getText():null));/*debug*/


                    break;
                case 3 :
                    // ../MmirScriptStatement.g:117:4: SSTRING
                    SSTRING5=this.match(this.input,SSTRING,MmirScriptStatementParser.FOLLOW_SSTRING_in_other327); 
                    if(this.isDebug) printInfo('SCRIPT_BLOCK_string' ,(SSTRING5?SSTRING5.getText():null));/*debug*/


                    break;

            }
        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return ;
    },


    // ../MmirScriptStatement.g:120:1: line_end : ( NL | EOF );
    // $ANTLR start "line_end"
    line_end: function() {
        try {
            // ../MmirScriptStatement.g:120:9: ( NL | EOF )
            // ../MmirScriptStatement.g:
            if ( this.input.LA(1)==EOF||this.input.LA(1)==NL ) {
                this.input.consume();
                this.state.errorRecovery=false;
            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return ;
    }

    // Delegated rules




}, true); // important to pass true to overwrite default implementations

org.antlr.lang.augmentObject(MmirScriptStatementParser, {
    DFA10_eotS:
        "\u0004\uffff",
    DFA10_eofS:
        "\u0002\u0002\u0002\uffff",
    DFA10_minS:
        "\u0002\u0007\u0002\uffff",
    DFA10_maxS:
        "\u0002\u001f\u0002\uffff",
    DFA10_acceptS:
        "\u0002\uffff\u0001\u0002\u0001\u0001",
    DFA10_specialS:
        "\u0004\uffff}>",
    DFA10_transitionS: [
            "\u0001\u0001\u0014\uffff\u0001\u0002\u0001\u0001\u0001\uffff"+
            "\u0001\u0003",
            "\u0001\u0001\u0014\uffff\u0001\u0002\u0001\u0001\u0001\uffff"+
            "\u0001\u0003",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(MmirScriptStatementParser, {
    DFA10_eot:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptStatementParser.DFA10_eotS),
    DFA10_eof:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptStatementParser.DFA10_eofS),
    DFA10_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptStatementParser.DFA10_minS),
    DFA10_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptStatementParser.DFA10_maxS),
    DFA10_accept:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptStatementParser.DFA10_acceptS),
    DFA10_special:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptStatementParser.DFA10_specialS),
    DFA10_transition: (function() {
        var a = [],
            i,
            numStates = MmirScriptStatementParser.DFA10_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(MmirScriptStatementParser.DFA10_transitionS[i]));
        }
        return a;
    })()
});

MmirScriptStatementParser.DFA10 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 10;
    this.eot = MmirScriptStatementParser.DFA10_eot;
    this.eof = MmirScriptStatementParser.DFA10_eof;
    this.min = MmirScriptStatementParser.DFA10_min;
    this.max = MmirScriptStatementParser.DFA10_max;
    this.accept = MmirScriptStatementParser.DFA10_accept;
    this.special = MmirScriptStatementParser.DFA10_special;
    this.transition = MmirScriptStatementParser.DFA10_transition;
};

org.antlr.lang.extend(MmirScriptStatementParser.DFA10, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "()* loopback of 107:6: ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )*";
    },
    dummy: null
});
 

// public class variables
org.antlr.lang.augmentObject(MmirScriptStatementParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "STRING", "SSTRING", "CHAR", "NL", "END", "ESC_DoEnter", "COMMENT", "DoEnterBlock", "DoEnterStatement", "DoEnterIncludeScript", "DoEnterIncludeStyle", "DoEnterLocalize", "DoEnterYieldDeclaration", "DoEnterYieldContent", "DoEnterHelper", "DoEnterRender", "DoEnterIfStatement", "DoEnterElseStatement", "DoEnterForStatement", "END_SCRIPT", "ESC_SEQ", "HEX_DIGIT", "UNICODE_ESC", "OCTAL_ESC", "DoExitStatement", "WS", "'{'", "'+'"],
    FOLLOW_text_in_main62: new org.antlr.runtime.BitSet([0x00000082, 0x00000000]),
    FOLLOW_NL_in_main67: new org.antlr.runtime.BitSet([0x100014F0, 0x00000000]),
    FOLLOW_text_in_main71: new org.antlr.runtime.BitSet([0x00000082, 0x00000000]),
    FOLLOW_other_in_text88: new org.antlr.runtime.BitSet([0x10001472, 0x00000000]),
    FOLLOW_DoExitStatement_in_text92: new org.antlr.runtime.BitSet([0x10001472, 0x00000000]),
    FOLLOW_DoEnterStatement_in_text96: new org.antlr.runtime.BitSet([0x10001472, 0x00000000]),
    FOLLOW_CHAR_in_text100: new org.antlr.runtime.BitSet([0x10001472, 0x00000000]),
    FOLLOW_stringArg_in_stringArgAndContent128: new org.antlr.runtime.BitSet([0x10000000, 0x00000000]),
    FOLLOW_DoExitStatement_in_stringArgAndContent130: new org.antlr.runtime.BitSet([0x60000080, 0x00000000]),
    FOLLOW_set_in_stringArgAndContent132: new org.antlr.runtime.BitSet([0x60000080, 0x00000000]),
    FOLLOW_30_in_stringArgAndContent141: new org.antlr.runtime.BitSet([0x000000C2, 0x00000000]),
    FOLLOW_set_in_stringArgAndContent144: new org.antlr.runtime.BitSet([0x000000C2, 0x00000000]),
    FOLLOW_stringArg_in_parseStringArg169: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_parseStringArg171: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_stringArg195: new org.antlr.runtime.BitSet([0x200000B0, 0x00000000]),
    FOLLOW_STRING_in_stringArg212: new org.antlr.runtime.BitSet([0xA0000082, 0x00000000]),
    FOLLOW_SSTRING_in_stringArg223: new org.antlr.runtime.BitSet([0xA0000082, 0x00000000]),
    FOLLOW_set_in_stringArg239: new org.antlr.runtime.BitSet([0xA0000080, 0x00000000]),
    FOLLOW_31_in_stringArg246: new org.antlr.runtime.BitSet([0x200000B0, 0x00000000]),
    FOLLOW_set_in_stringArg248: new org.antlr.runtime.BitSet([0x200000B0, 0x00000000]),
    FOLLOW_STRING_in_stringArg265: new org.antlr.runtime.BitSet([0xA0000082, 0x00000000]),
    FOLLOW_SSTRING_in_stringArg278: new org.antlr.runtime.BitSet([0xA0000082, 0x00000000]),
    FOLLOW_set_in_stringArg295: new org.antlr.runtime.BitSet([0x20000082, 0x00000000]),
    FOLLOW_COMMENT_in_other310: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_STRING_in_other318: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SSTRING_in_other327: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_line_end0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();