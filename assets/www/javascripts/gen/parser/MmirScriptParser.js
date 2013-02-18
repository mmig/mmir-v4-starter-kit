// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirScript.g 2013-02-13 18:45:51

var MmirScriptParser = function(input, state) {
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

    MmirScriptParser.superclass.constructor.call(this, input, state);

    this.dfa10 = new MmirScriptParser.DFA10(this);

         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(MmirScriptParser, {
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
    T__27: 27,
    DoExit: 23,
    DoExitStatement: 24,
    DoEnter: 25,
    WS: 26
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
    END_SCRIPT= 18,
    ESC_SEQ= 19,
    HEX_DIGIT= 20,
    UNICODE_ESC= 21,
    OCTAL_ESC= 22,
    T__27= 27,
    DoExit= 23,
    DoExitStatement= 24,
    DoEnter= 25,
    WS= 26;

// public instance methods/vars
org.antlr.lang.extend(MmirScriptParser, org.antlr.runtime.Parser, {
        

    getTokenNames: function() { return MmirScriptParser.tokenNames; },
    getGrammarFileName: function() { return "../MmirScript.g"; }
});
org.antlr.lang.augmentObject(MmirScriptParser.prototype, {


    // ../MmirScript.g:35:1: main returns [String theText] : t= text ( NL t= text )* ;
    // $ANTLR start "main"
    main: function() {
        var theText = null;

         var t = null;

        try {
            // ../MmirScript.g:39:2: (t= text ( NL t= text )* )
            // ../MmirScript.g:39:4: t= text ( NL t= text )*
            this.pushFollow(MmirScriptParser.FOLLOW_text_in_main59);
            t=this.text();

            this.state._fsp--;

             theText = ((t?this.input.toString(t.start,t.stop):null)?(t?this.input.toString(t.start,t.stop):null):''); 
            // ../MmirScript.g:39:48: ( NL t= text )*
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( (LA1_0==NL) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // ../MmirScript.g:39:49: NL t= text
                    this.match(this.input,NL,MmirScriptParser.FOLLOW_NL_in_main64); 
                    this.pushFollow(MmirScriptParser.FOLLOW_text_in_main68);
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
        MmirScriptParser.text_return = function(){};
        org.antlr.lang.extend(MmirScriptParser.text_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
        });
        return;
    })(),

    // ../MmirScript.g:42:1: text : ( other | DoExit | DoExitStatement | DoEnter | DoEnterStatement | CHAR )* ;
    // $ANTLR start "text"
    text: function() {
        var retval = new MmirScriptParser.text_return();
        retval.start = this.input.LT(1);

        try {
            // ../MmirScript.g:43:2: ( ( other | DoExit | DoExitStatement | DoEnter | DoEnterStatement | CHAR )* )
            // ../MmirScript.g:43:4: ( other | DoExit | DoExitStatement | DoEnter | DoEnterStatement | CHAR )*
            // ../MmirScript.g:43:4: ( other | DoExit | DoExitStatement | DoEnter | DoEnterStatement | CHAR )*
            loop2:
            do {
                var alt2=7;
                switch ( this.input.LA(1) ) {
                case STRING:
                case SSTRING:
                case COMMENT:
                    alt2=1;
                    break;
                case DoExit:
                    alt2=2;
                    break;
                case DoExitStatement:
                    alt2=3;
                    break;
                case DoEnter:
                    alt2=4;
                    break;
                case DoEnterStatement:
                    alt2=5;
                    break;
                case CHAR:
                    alt2=6;
                    break;

                }

                switch (alt2) {
                case 1 :
                    // ../MmirScript.g:43:6: other
                    this.pushFollow(MmirScriptParser.FOLLOW_other_in_text85);
                    this.other();

                    this.state._fsp--;



                    break;
                case 2 :
                    // ../MmirScript.g:43:14: DoExit
                    this.match(this.input,DoExit,MmirScriptParser.FOLLOW_DoExit_in_text89); 


                    break;
                case 3 :
                    // ../MmirScript.g:43:23: DoExitStatement
                    this.match(this.input,DoExitStatement,MmirScriptParser.FOLLOW_DoExitStatement_in_text93); 


                    break;
                case 4 :
                    // ../MmirScript.g:43:41: DoEnter
                    this.match(this.input,DoEnter,MmirScriptParser.FOLLOW_DoEnter_in_text97); 


                    break;
                case 5 :
                    // ../MmirScript.g:43:51: DoEnterStatement
                    this.match(this.input,DoEnterStatement,MmirScriptParser.FOLLOW_DoEnterStatement_in_text101); 


                    break;
                case 6 :
                    // ../MmirScript.g:43:70: CHAR
                    this.match(this.input,CHAR,MmirScriptParser.FOLLOW_CHAR_in_text105); 


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
        MmirScriptParser.stringArgAndContent_return = function(){};
        org.antlr.lang.extend(MmirScriptParser.stringArgAndContent_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
        });
        return;
    })(),

    // ../MmirScript.g:46:1: stringArgAndContent returns [String theName, String theContent] : stringArg ')' ( NL | WS )* start= '{' ( NL | CHAR )* ;
    // $ANTLR start "stringArgAndContent"
    stringArgAndContent: function() {
        var retval = new MmirScriptParser.stringArgAndContent_return();
        retval.start = this.input.LT(1);

        var start = null;
         var stringArg1 = null;


        		var startPos;
        	
        try {
            // ../MmirScript.g:57:2: ( stringArg ')' ( NL | WS )* start= '{' ( NL | CHAR )* )
            // ../MmirScript.g:57:4: stringArg ')' ( NL | WS )* start= '{' ( NL | CHAR )*
            this.pushFollow(MmirScriptParser.FOLLOW_stringArg_in_stringArgAndContent133);
            stringArg1=this.stringArg();

            this.state._fsp--;

            this.match(this.input,DoExitStatement,MmirScriptParser.FOLLOW_DoExitStatement_in_stringArgAndContent135); 
            // ../MmirScript.g:57:18: ( NL | WS )*
            loop3:
            do {
                var alt3=2;
                var LA3_0 = this.input.LA(1);

                if ( (LA3_0==NL||LA3_0==WS) ) {
                    alt3=1;
                }


                switch (alt3) {
                case 1 :
                    // ../MmirScript.g:
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

            start=this.match(this.input,DoEnter,MmirScriptParser.FOLLOW_DoEnter_in_stringArgAndContent146); 
            // ../MmirScript.g:57:38: ( NL | CHAR )*
            loop4:
            do {
                var alt4=2;
                var LA4_0 = this.input.LA(1);

                if ( ((LA4_0>=CHAR && LA4_0<=NL)) ) {
                    alt4=1;
                }


                switch (alt4) {
                case 1 :
                    // ../MmirScript.g:
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


    // ../MmirScript.g:65:1: parseStringArg returns [String theText] : stringArg EOF ;
    // $ANTLR start "parseStringArg"
    parseStringArg: function() {
        var theText = null;

         var stringArg2 = null;

        try {
            // ../MmirScript.g:66:2: ( stringArg EOF )
            // ../MmirScript.g:66:4: stringArg EOF
            this.pushFollow(MmirScriptParser.FOLLOW_stringArg_in_parseStringArg174);
            stringArg2=this.stringArg();

            this.state._fsp--;

            this.match(this.input,EOF,MmirScriptParser.FOLLOW_EOF_in_parseStringArg176); 
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


    // ../MmirScript.g:69:1: stringArg returns [String theText] : ( NL | WS )* (str= STRING | str= SSTRING ) ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )* ( NL | WS )* ;
    // $ANTLR start "stringArg"
    stringArg: function() {
        var theText = null;

        var str = null;


        	var strs;

        try {
            // ../MmirScript.g:77:2: ( ( NL | WS )* (str= STRING | str= SSTRING ) ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )* ( NL | WS )* )
            // ../MmirScript.g:77:4: ( NL | WS )* (str= STRING | str= SSTRING ) ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )* ( NL | WS )*
            // ../MmirScript.g:77:4: ( NL | WS )*
            loop5:
            do {
                var alt5=2;
                var LA5_0 = this.input.LA(1);

                if ( (LA5_0==NL||LA5_0==WS) ) {
                    alt5=1;
                }


                switch (alt5) {
                case 1 :
                    // ../MmirScript.g:
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

            // ../MmirScript.g:78:4: (str= STRING | str= SSTRING )
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
                    // ../MmirScript.g:79:3: str= STRING
                    str=this.match(this.input,STRING,MmirScriptParser.FOLLOW_STRING_in_stringArg217); 
                    if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                    break;
                case 2 :
                    // ../MmirScript.g:80:6: str= SSTRING
                    str=this.match(this.input,SSTRING,MmirScriptParser.FOLLOW_SSTRING_in_stringArg228); 
                    if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                    break;

            }

            // ../MmirScript.g:81:6: ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )*
            loop10:
            do {
                var alt10=2;
                alt10 = this.dfa10.predict(this.input);
                switch (alt10) {
                case 1 :
                    // ../MmirScript.g:82:5: ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING )
                    // ../MmirScript.g:82:5: ( NL | WS )*
                    loop7:
                    do {
                        var alt7=2;
                        var LA7_0 = this.input.LA(1);

                        if ( (LA7_0==NL||LA7_0==WS) ) {
                            alt7=1;
                        }


                        switch (alt7) {
                        case 1 :
                            // ../MmirScript.g:
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

                    this.match(this.input,27,MmirScriptParser.FOLLOW_27_in_stringArg251); 
                    // ../MmirScript.g:82:18: ( NL | WS )*
                    loop8:
                    do {
                        var alt8=2;
                        var LA8_0 = this.input.LA(1);

                        if ( (LA8_0==NL||LA8_0==WS) ) {
                            alt8=1;
                        }


                        switch (alt8) {
                        case 1 :
                            // ../MmirScript.g:
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

                    // ../MmirScript.g:83:7: (str= STRING | str= SSTRING )
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
                            // ../MmirScript.g:83:8: str= STRING
                            str=this.match(this.input,STRING,MmirScriptParser.FOLLOW_STRING_in_stringArg270); 
                            if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                            break;
                        case 2 :
                            // ../MmirScript.g:84:8: str= SSTRING
                            str=this.match(this.input,SSTRING,MmirScriptParser.FOLLOW_SSTRING_in_stringArg283); 
                            if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                            break;

                    }



                    break;

                default :
                    break loop10;
                }
            } while (true);

            // ../MmirScript.g:86:7: ( NL | WS )*
            loop11:
            do {
                var alt11=2;
                var LA11_0 = this.input.LA(1);

                if ( (LA11_0==NL||LA11_0==WS) ) {
                    alt11=1;
                }


                switch (alt11) {
                case 1 :
                    // ../MmirScript.g:
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


    // ../MmirScript.g:89:1: other : ( COMMENT | STRING | SSTRING );
    // $ANTLR start "other"
    other: function() {
        var COMMENT3 = null;
        var STRING4 = null;
        var SSTRING5 = null;

        try {
            // ../MmirScript.g:89:7: ( COMMENT | STRING | SSTRING )
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
                    // ../MmirScript.g:89:9: COMMENT
                    COMMENT3=this.match(this.input,COMMENT,MmirScriptParser.FOLLOW_COMMENT_in_other315); 
                    if(this.isDebug) printInfo('SCRIPT_BLOCK_comment',(COMMENT3?COMMENT3.getText():null));/*debug*/


                    break;
                case 2 :
                    // ../MmirScript.g:90:4: STRING
                    STRING4=this.match(this.input,STRING,MmirScriptParser.FOLLOW_STRING_in_other323); 
                    if(this.isDebug) printInfo('SCRIPT_BLOCK_String' ,(STRING4?STRING4.getText():null));/*debug*/


                    break;
                case 3 :
                    // ../MmirScript.g:91:4: SSTRING
                    SSTRING5=this.match(this.input,SSTRING,MmirScriptParser.FOLLOW_SSTRING_in_other332); 
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


    // ../MmirScript.g:94:1: line_end : ( NL | EOF );
    // $ANTLR start "line_end"
    line_end: function() {
        try {
            // ../MmirScript.g:94:9: ( NL | EOF )
            // ../MmirScript.g:
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

org.antlr.lang.augmentObject(MmirScriptParser, {
    DFA10_eotS:
        "\u0004\uffff",
    DFA10_eofS:
        "\u0002\u0002\u0002\uffff",
    DFA10_minS:
        "\u0002\u0007\u0002\uffff",
    DFA10_maxS:
        "\u0002\u001b\u0002\uffff",
    DFA10_acceptS:
        "\u0002\uffff\u0001\u0002\u0001\u0001",
    DFA10_specialS:
        "\u0004\uffff}>",
    DFA10_transitionS: [
            "\u0001\u0001\u0010\uffff\u0001\u0002\u0001\uffff\u0001\u0001"+
            "\u0001\u0003",
            "\u0001\u0001\u0010\uffff\u0001\u0002\u0001\uffff\u0001\u0001"+
            "\u0001\u0003",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(MmirScriptParser, {
    DFA10_eot:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptParser.DFA10_eotS),
    DFA10_eof:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptParser.DFA10_eofS),
    DFA10_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptParser.DFA10_minS),
    DFA10_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptParser.DFA10_maxS),
    DFA10_accept:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptParser.DFA10_acceptS),
    DFA10_special:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptParser.DFA10_specialS),
    DFA10_transition: (function() {
        var a = [],
            i,
            numStates = MmirScriptParser.DFA10_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(MmirScriptParser.DFA10_transitionS[i]));
        }
        return a;
    })()
});

MmirScriptParser.DFA10 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 10;
    this.eot = MmirScriptParser.DFA10_eot;
    this.eof = MmirScriptParser.DFA10_eof;
    this.min = MmirScriptParser.DFA10_min;
    this.max = MmirScriptParser.DFA10_max;
    this.accept = MmirScriptParser.DFA10_accept;
    this.special = MmirScriptParser.DFA10_special;
    this.transition = MmirScriptParser.DFA10_transition;
};

org.antlr.lang.extend(MmirScriptParser.DFA10, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "()* loopback of 81:6: ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )*";
    },
    dummy: null
});
 

// public class variables
org.antlr.lang.augmentObject(MmirScriptParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "STRING", "SSTRING", "CHAR", "NL", "END", "ESC_DoEnter", "COMMENT", "DoEnterBlock", "DoEnterStatement", "DoEnterIncludeScript", "DoEnterIncludeStyle", "DoEnterLocalize", "DoEnterYieldDeclaration", "DoEnterYieldContent", "END_SCRIPT", "ESC_SEQ", "HEX_DIGIT", "UNICODE_ESC", "OCTAL_ESC", "DoExit", "DoExitStatement", "DoEnter", "WS", "'+'"],
    FOLLOW_text_in_main59: new org.antlr.runtime.BitSet([0x00000082, 0x00000000]),
    FOLLOW_NL_in_main64: new org.antlr.runtime.BitSet([0x038014F0, 0x00000000]),
    FOLLOW_text_in_main68: new org.antlr.runtime.BitSet([0x00000082, 0x00000000]),
    FOLLOW_other_in_text85: new org.antlr.runtime.BitSet([0x03801472, 0x00000000]),
    FOLLOW_DoExit_in_text89: new org.antlr.runtime.BitSet([0x03801472, 0x00000000]),
    FOLLOW_DoExitStatement_in_text93: new org.antlr.runtime.BitSet([0x03801472, 0x00000000]),
    FOLLOW_DoEnter_in_text97: new org.antlr.runtime.BitSet([0x03801472, 0x00000000]),
    FOLLOW_DoEnterStatement_in_text101: new org.antlr.runtime.BitSet([0x03801472, 0x00000000]),
    FOLLOW_CHAR_in_text105: new org.antlr.runtime.BitSet([0x03801472, 0x00000000]),
    FOLLOW_stringArg_in_stringArgAndContent133: new org.antlr.runtime.BitSet([0x01000000, 0x00000000]),
    FOLLOW_DoExitStatement_in_stringArgAndContent135: new org.antlr.runtime.BitSet([0x06000080, 0x00000000]),
    FOLLOW_set_in_stringArgAndContent137: new org.antlr.runtime.BitSet([0x06000080, 0x00000000]),
    FOLLOW_DoEnter_in_stringArgAndContent146: new org.antlr.runtime.BitSet([0x000000C2, 0x00000000]),
    FOLLOW_set_in_stringArgAndContent149: new org.antlr.runtime.BitSet([0x000000C2, 0x00000000]),
    FOLLOW_stringArg_in_parseStringArg174: new org.antlr.runtime.BitSet([0x00000000, 0x00000000]),
    FOLLOW_EOF_in_parseStringArg176: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_stringArg200: new org.antlr.runtime.BitSet([0x040000B0, 0x00000000]),
    FOLLOW_STRING_in_stringArg217: new org.antlr.runtime.BitSet([0x0C000082, 0x00000000]),
    FOLLOW_SSTRING_in_stringArg228: new org.antlr.runtime.BitSet([0x0C000082, 0x00000000]),
    FOLLOW_set_in_stringArg244: new org.antlr.runtime.BitSet([0x0C000080, 0x00000000]),
    FOLLOW_27_in_stringArg251: new org.antlr.runtime.BitSet([0x040000B0, 0x00000000]),
    FOLLOW_set_in_stringArg253: new org.antlr.runtime.BitSet([0x040000B0, 0x00000000]),
    FOLLOW_STRING_in_stringArg270: new org.antlr.runtime.BitSet([0x0C000082, 0x00000000]),
    FOLLOW_SSTRING_in_stringArg283: new org.antlr.runtime.BitSet([0x0C000082, 0x00000000]),
    FOLLOW_set_in_stringArg300: new org.antlr.runtime.BitSet([0x04000082, 0x00000000]),
    FOLLOW_COMMENT_in_other315: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_STRING_in_other323: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SSTRING_in_other332: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_line_end0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();