// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirScriptContent.g 2013-03-01 17:04:16

var MmirScriptContentParser = function(input, state) {
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

    MmirScriptContentParser.superclass.constructor.call(this, input, state);

    this.dfa12 = new MmirScriptContentParser.DFA12(this);

         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(MmirScriptContentParser, {
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
    T__33: 33,
    T__34: 34,
    T__35: 35,
    EscapeExit: 28,
    DoExit: 29,
    WS: 30,
    ESC_EXIT_SEQ: 31,
    EXIT_SEQ: 32
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
    T__33= 33,
    T__34= 34,
    T__35= 35,
    EscapeExit= 28,
    DoExit= 29,
    WS= 30,
    ESC_EXIT_SEQ= 31,
    EXIT_SEQ= 32;

// public instance methods/vars
org.antlr.lang.extend(MmirScriptContentParser, org.antlr.runtime.Parser, {
        

    getTokenNames: function() { return MmirScriptContentParser.tokenNames; },
    getGrammarFileName: function() { return "../MmirScriptContent.g"; }
});
org.antlr.lang.augmentObject(MmirScriptContentParser.prototype, {


    // ../MmirScriptContent.g:54:1: main returns [String theText] : t= text ( NL t= text )* ;
    // $ANTLR start "main"
    main: function() {
        var theText = null;

         var t = null;

        try {
            // ../MmirScriptContent.g:58:2: (t= text ( NL t= text )* )
            // ../MmirScriptContent.g:58:4: t= text ( NL t= text )*
            this.pushFollow(MmirScriptContentParser.FOLLOW_text_in_main63);
            t=this.text();

            this.state._fsp--;

             theText = ((t?this.input.toString(t.start,t.stop):null)?(t?this.input.toString(t.start,t.stop):null):''); 
            // ../MmirScriptContent.g:58:48: ( NL t= text )*
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( (LA1_0==NL) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // ../MmirScriptContent.g:58:49: NL t= text
                    this.match(this.input,NL,MmirScriptContentParser.FOLLOW_NL_in_main68); 
                    this.pushFollow(MmirScriptContentParser.FOLLOW_text_in_main72);
                    t=this.text();

                    this.state._fsp--;

                     theText = theText + '\r\n' + ((t?this.input.toString(t.start,t.stop):null)?(t?this.input.toString(t.start,t.stop):null):''); 


                    break;

                default :
                    break loop1;
                }
            } while (true);





            		if(this.isDebug) printInfo('CONTENT_text', theText);//debug
            	
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
        MmirScriptContentParser.text_return = function(){};
        org.antlr.lang.extend(MmirScriptContentParser.text_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
        });
        return;
    })(),

    // ../MmirScriptContent.g:61:1: text : ( CHAR | EscapeExit | DoExit )* ( other ( CHAR | EscapeExit | DoExit )* )* ;
    // $ANTLR start "text"
    text: function() {
        var retval = new MmirScriptContentParser.text_return();
        retval.start = this.input.LT(1);

        try {
            // ../MmirScriptContent.g:62:2: ( ( CHAR | EscapeExit | DoExit )* ( other ( CHAR | EscapeExit | DoExit )* )* )
            // ../MmirScriptContent.g:62:4: ( CHAR | EscapeExit | DoExit )* ( other ( CHAR | EscapeExit | DoExit )* )*
            // ../MmirScriptContent.g:62:4: ( CHAR | EscapeExit | DoExit )*
            loop2:
            do {
                var alt2=2;
                var LA2_0 = this.input.LA(1);

                if ( (LA2_0==CHAR||(LA2_0>=EscapeExit && LA2_0<=DoExit)) ) {
                    alt2=1;
                }


                switch (alt2) {
                case 1 :
                    // ../MmirScriptContent.g:
                    if ( this.input.LA(1)==CHAR||(this.input.LA(1)>=EscapeExit && this.input.LA(1)<=DoExit) ) {
                        this.input.consume();
                        this.state.errorRecovery=false;
                    }
                    else {
                        var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                        throw mse;
                    }



                    break;

                default :
                    break loop2;
                }
            } while (true);

            // ../MmirScriptContent.g:62:34: ( other ( CHAR | EscapeExit | DoExit )* )*
            loop4:
            do {
                var alt4=2;
                var LA4_0 = this.input.LA(1);

                if ( ((LA4_0>=STRING && LA4_0<=SSTRING)||LA4_0==COMMENT) ) {
                    alt4=1;
                }


                switch (alt4) {
                case 1 :
                    // ../MmirScriptContent.g:62:36: other ( CHAR | EscapeExit | DoExit )*
                    this.pushFollow(MmirScriptContentParser.FOLLOW_other_in_text103);
                    this.other();

                    this.state._fsp--;

                    // ../MmirScriptContent.g:62:42: ( CHAR | EscapeExit | DoExit )*
                    loop3:
                    do {
                        var alt3=2;
                        var LA3_0 = this.input.LA(1);

                        if ( (LA3_0==CHAR||(LA3_0>=EscapeExit && LA3_0<=DoExit)) ) {
                            alt3=1;
                        }


                        switch (alt3) {
                        case 1 :
                            // ../MmirScriptContent.g:
                            if ( this.input.LA(1)==CHAR||(this.input.LA(1)>=EscapeExit && this.input.LA(1)<=DoExit) ) {
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



                    break;

                default :
                    break loop4;
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
        MmirScriptContentParser.stringArgAndContent_return = function(){};
        org.antlr.lang.extend(MmirScriptContentParser.stringArgAndContent_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
        });
        return;
    })(),

    // ../MmirScriptContent.g:65:1: stringArgAndContent returns [String theName, String theContent] : stringArg ')' ( NL | WS )* start= '{' ( NL | CHAR )* ;
    // $ANTLR start "stringArgAndContent"
    stringArgAndContent: function() {
        var retval = new MmirScriptContentParser.stringArgAndContent_return();
        retval.start = this.input.LT(1);

        var start = null;
         var stringArg1 = null;


        		var startPos;
        	
        try {
            // ../MmirScriptContent.g:76:2: ( stringArg ')' ( NL | WS )* start= '{' ( NL | CHAR )* )
            // ../MmirScriptContent.g:76:4: stringArg ')' ( NL | WS )* start= '{' ( NL | CHAR )*
            this.pushFollow(MmirScriptContentParser.FOLLOW_stringArg_in_stringArgAndContent144);
            stringArg1=this.stringArg();

            this.state._fsp--;

            this.match(this.input,33,MmirScriptContentParser.FOLLOW_33_in_stringArgAndContent146); 
            // ../MmirScriptContent.g:76:18: ( NL | WS )*
            loop5:
            do {
                var alt5=2;
                var LA5_0 = this.input.LA(1);

                if ( (LA5_0==NL||LA5_0==WS) ) {
                    alt5=1;
                }


                switch (alt5) {
                case 1 :
                    // ../MmirScriptContent.g:
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

            start=this.match(this.input,34,MmirScriptContentParser.FOLLOW_34_in_stringArgAndContent157); 
            // ../MmirScriptContent.g:76:38: ( NL | CHAR )*
            loop6:
            do {
                var alt6=2;
                var LA6_0 = this.input.LA(1);

                if ( ((LA6_0>=CHAR && LA6_0<=NL)) ) {
                    alt6=1;
                }


                switch (alt6) {
                case 1 :
                    // ../MmirScriptContent.g:
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
                    break loop6;
                }
            } while (true);


            		retval.theName = stringArg1;
            		startPos = start.getStartIndex()+1;
            		
            		if(this.isDebug) print('CONTENT_stringArgAndContent -> str='+stringArg1);//debug
            	



            retval.stop = this.input.LT(-1);


            		var end = this.input.getTokens()[this.input.size()-1].getStopIndex()+1;
            		var theString = this.input.getTokenSource().input.data;
            		retval.theContent = theString.substring(startPos, end);
            		
            		if(this.isDebug) print('CONTENT_stringArgAndContent -> content= "'+retval.theContent+'"');//debug
            	
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


    // ../MmirScriptContent.g:85:1: stringArg returns [String theText] : ( NL | WS )* (str= STRING | str= SSTRING ) ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )* ( NL | WS )* ;
    // $ANTLR start "stringArg"
    stringArg: function() {
        var theText = null;

        var str = null;


        		var strs;
        	
        try {
            // ../MmirScriptContent.g:93:2: ( ( NL | WS )* (str= STRING | str= SSTRING ) ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )* ( NL | WS )* )
            // ../MmirScriptContent.g:93:4: ( NL | WS )* (str= STRING | str= SSTRING ) ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )* ( NL | WS )*
            // ../MmirScriptContent.g:93:4: ( NL | WS )*
            loop7:
            do {
                var alt7=2;
                var LA7_0 = this.input.LA(1);

                if ( (LA7_0==NL||LA7_0==WS) ) {
                    alt7=1;
                }


                switch (alt7) {
                case 1 :
                    // ../MmirScriptContent.g:
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

            // ../MmirScriptContent.g:94:4: (str= STRING | str= SSTRING )
            var alt8=2;
            var LA8_0 = this.input.LA(1);

            if ( (LA8_0==STRING) ) {
                alt8=1;
            }
            else if ( (LA8_0==SSTRING) ) {
                alt8=2;
            }
            else {
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 8, 0, this.input);

                throw nvae;
            }
            switch (alt8) {
                case 1 :
                    // ../MmirScriptContent.g:95:3: str= STRING
                    str=this.match(this.input,STRING,MmirScriptContentParser.FOLLOW_STRING_in_stringArg214); 
                    if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                    break;
                case 2 :
                    // ../MmirScriptContent.g:96:6: str= SSTRING
                    str=this.match(this.input,SSTRING,MmirScriptContentParser.FOLLOW_SSTRING_in_stringArg225); 
                    if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                    break;

            }

            // ../MmirScriptContent.g:97:6: ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )*
            loop12:
            do {
                var alt12=2;
                alt12 = this.dfa12.predict(this.input);
                switch (alt12) {
                case 1 :
                    // ../MmirScriptContent.g:98:5: ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING )
                    // ../MmirScriptContent.g:98:5: ( NL | WS )*
                    loop9:
                    do {
                        var alt9=2;
                        var LA9_0 = this.input.LA(1);

                        if ( (LA9_0==NL||LA9_0==WS) ) {
                            alt9=1;
                        }


                        switch (alt9) {
                        case 1 :
                            // ../MmirScriptContent.g:
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
                            break loop9;
                        }
                    } while (true);

                    this.match(this.input,35,MmirScriptContentParser.FOLLOW_35_in_stringArg248); 
                    // ../MmirScriptContent.g:98:18: ( NL | WS )*
                    loop10:
                    do {
                        var alt10=2;
                        var LA10_0 = this.input.LA(1);

                        if ( (LA10_0==NL||LA10_0==WS) ) {
                            alt10=1;
                        }


                        switch (alt10) {
                        case 1 :
                            // ../MmirScriptContent.g:
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
                            break loop10;
                        }
                    } while (true);

                    // ../MmirScriptContent.g:99:7: (str= STRING | str= SSTRING )
                    var alt11=2;
                    var LA11_0 = this.input.LA(1);

                    if ( (LA11_0==STRING) ) {
                        alt11=1;
                    }
                    else if ( (LA11_0==SSTRING) ) {
                        alt11=2;
                    }
                    else {
                        var nvae =
                            new org.antlr.runtime.NoViableAltException("", 11, 0, this.input);

                        throw nvae;
                    }
                    switch (alt11) {
                        case 1 :
                            // ../MmirScriptContent.g:99:8: str= STRING
                            str=this.match(this.input,STRING,MmirScriptContentParser.FOLLOW_STRING_in_stringArg267); 
                            if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                            break;
                        case 2 :
                            // ../MmirScriptContent.g:100:8: str= SSTRING
                            str=this.match(this.input,SSTRING,MmirScriptContentParser.FOLLOW_SSTRING_in_stringArg280); 
                            if(!strs)strs=new Array();strs.push(this.extractString((str?str.getText():null)));


                            break;

                    }



                    break;

                default :
                    break loop12;
                }
            } while (true);

            // ../MmirScriptContent.g:102:7: ( NL | WS )*
            loop13:
            do {
                var alt13=2;
                var LA13_0 = this.input.LA(1);

                if ( (LA13_0==NL||LA13_0==WS) ) {
                    alt13=1;
                }


                switch (alt13) {
                case 1 :
                    // ../MmirScriptContent.g:
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
                    break loop13;
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


    // ../MmirScriptContent.g:105:1: content returns [String theContent] : ( NL | WS )* start= '{' ( NL | CHAR )* ;
    // $ANTLR start "content"
    content: function() {
        var theContent = null;

        var start = null;


        		var startPos;
        	
        try {
            // ../MmirScriptContent.g:116:2: ( ( NL | WS )* start= '{' ( NL | CHAR )* )
            // ../MmirScriptContent.g:116:4: ( NL | WS )* start= '{' ( NL | CHAR )*
            // ../MmirScriptContent.g:116:4: ( NL | WS )*
            loop14:
            do {
                var alt14=2;
                var LA14_0 = this.input.LA(1);

                if ( (LA14_0==NL||LA14_0==WS) ) {
                    alt14=1;
                }


                switch (alt14) {
                case 1 :
                    // ../MmirScriptContent.g:
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
                    break loop14;
                }
            } while (true);

            start=this.match(this.input,34,MmirScriptContentParser.FOLLOW_34_in_content337); 
            // ../MmirScriptContent.g:116:24: ( NL | CHAR )*
            loop15:
            do {
                var alt15=2;
                var LA15_0 = this.input.LA(1);

                if ( ((LA15_0>=CHAR && LA15_0<=NL)) ) {
                    alt15=1;
                }


                switch (alt15) {
                case 1 :
                    // ../MmirScriptContent.g:
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
                    break loop15;
                }
            } while (true);


            		startPos = start.getStartIndex()+1;
            		
            		if(this.isDebug) print('CONTENT_content -> start at '+startPos);//debug
            	




            		var end = this.input.getTokens()[this.input.size()-1].getStopIndex()+1;
            		var theString = this.input.getTokenSource().input.data;
            		theContent = theString.substring(startPos, end);
            		
            		if(this.isDebug) print('CONTENT_content -> content= "'+theContent+'"');//debug
            	
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
        return theContent;
    },


    // ../MmirScriptContent.g:124:1: other : ( COMMENT | STRING | SSTRING );
    // $ANTLR start "other"
    other: function() {
        var COMMENT2 = null;
        var STRING3 = null;
        var SSTRING4 = null;

        try {
            // ../MmirScriptContent.g:124:7: ( COMMENT | STRING | SSTRING )
            var alt16=3;
            switch ( this.input.LA(1) ) {
            case COMMENT:
                alt16=1;
                break;
            case STRING:
                alt16=2;
                break;
            case SSTRING:
                alt16=3;
                break;
            default:
                var nvae =
                    new org.antlr.runtime.NoViableAltException("", 16, 0, this.input);

                throw nvae;
            }

            switch (alt16) {
                case 1 :
                    // ../MmirScriptContent.g:124:9: COMMENT
                    COMMENT2=this.match(this.input,COMMENT,MmirScriptContentParser.FOLLOW_COMMENT_in_other362); 
                    if(this.isDebug) printInfo('CONTENT_comment',(COMMENT2?COMMENT2.getText():null));/*debug*/


                    break;
                case 2 :
                    // ../MmirScriptContent.g:125:4: STRING
                    STRING3=this.match(this.input,STRING,MmirScriptContentParser.FOLLOW_STRING_in_other370); 
                    if(this.isDebug) printInfo('CONTENT_String' ,(STRING3?STRING3.getText():null));/*debug*/


                    break;
                case 3 :
                    // ../MmirScriptContent.g:126:4: SSTRING
                    SSTRING4=this.match(this.input,SSTRING,MmirScriptContentParser.FOLLOW_SSTRING_in_other379); 
                    if(this.isDebug) printInfo('CONTENT_string' ,(SSTRING4?SSTRING4.getText():null));/*debug*/


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


    // ../MmirScriptContent.g:129:1: line_end : ( NL | EOF );
    // $ANTLR start "line_end"
    line_end: function() {
        try {
            // ../MmirScriptContent.g:129:9: ( NL | EOF )
            // ../MmirScriptContent.g:
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

org.antlr.lang.augmentObject(MmirScriptContentParser, {
    DFA12_eotS:
        "\u0004\uffff",
    DFA12_eofS:
        "\u0004\uffff",
    DFA12_minS:
        "\u0002\u0007\u0002\uffff",
    DFA12_maxS:
        "\u0002\u0023\u0002\uffff",
    DFA12_acceptS:
        "\u0002\uffff\u0001\u0002\u0001\u0001",
    DFA12_specialS:
        "\u0004\uffff}>",
    DFA12_transitionS: [
            "\u0001\u0001\u0016\uffff\u0001\u0001\u0002\uffff\u0001\u0002"+
            "\u0001\uffff\u0001\u0003",
            "\u0001\u0001\u0016\uffff\u0001\u0001\u0002\uffff\u0001\u0002"+
            "\u0001\uffff\u0001\u0003",
            "",
            ""
    ]
});

org.antlr.lang.augmentObject(MmirScriptContentParser, {
    DFA12_eot:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentParser.DFA12_eotS),
    DFA12_eof:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentParser.DFA12_eofS),
    DFA12_min:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptContentParser.DFA12_minS),
    DFA12_max:
        org.antlr.runtime.DFA.unpackEncodedStringToUnsignedChars(MmirScriptContentParser.DFA12_maxS),
    DFA12_accept:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentParser.DFA12_acceptS),
    DFA12_special:
        org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentParser.DFA12_specialS),
    DFA12_transition: (function() {
        var a = [],
            i,
            numStates = MmirScriptContentParser.DFA12_transitionS.length;
        for (i=0; i<numStates; i++) {
            a.push(org.antlr.runtime.DFA.unpackEncodedString(MmirScriptContentParser.DFA12_transitionS[i]));
        }
        return a;
    })()
});

MmirScriptContentParser.DFA12 = function(recognizer) {
    this.recognizer = recognizer;
    this.decisionNumber = 12;
    this.eot = MmirScriptContentParser.DFA12_eot;
    this.eof = MmirScriptContentParser.DFA12_eof;
    this.min = MmirScriptContentParser.DFA12_min;
    this.max = MmirScriptContentParser.DFA12_max;
    this.accept = MmirScriptContentParser.DFA12_accept;
    this.special = MmirScriptContentParser.DFA12_special;
    this.transition = MmirScriptContentParser.DFA12_transition;
};

org.antlr.lang.extend(MmirScriptContentParser.DFA12, org.antlr.runtime.DFA, {
    getDescription: function() {
        return "()* loopback of 97:6: ( ( NL | WS )* '+' ( NL | WS )* (str= STRING | str= SSTRING ) )*";
    },
    dummy: null
});
 

// public class variables
org.antlr.lang.augmentObject(MmirScriptContentParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "STRING", "SSTRING", "CHAR", "NL", "END", "ESC_DoEnter", "COMMENT", "DoEnterBlock", "DoEnterStatement", "DoEnterIncludeScript", "DoEnterIncludeStyle", "DoEnterLocalize", "DoEnterYieldDeclaration", "DoEnterYieldContent", "DoEnterHelper", "DoEnterRender", "DoEnterIfStatement", "DoEnterElseStatement", "DoEnterForStatement", "END_SCRIPT", "ESC_SEQ", "HEX_DIGIT", "UNICODE_ESC", "OCTAL_ESC", "EscapeExit", "DoExit", "WS", "ESC_EXIT_SEQ", "EXIT_SEQ", "')'", "'{'", "'+'"],
    FOLLOW_text_in_main63: new org.antlr.runtime.BitSet([0x00000082, 0x00000000]),
    FOLLOW_NL_in_main68: new org.antlr.runtime.BitSet([0x300004F0, 0x00000000]),
    FOLLOW_text_in_main72: new org.antlr.runtime.BitSet([0x00000082, 0x00000000]),
    FOLLOW_set_in_text88: new org.antlr.runtime.BitSet([0x30000472, 0x00000000]),
    FOLLOW_other_in_text103: new org.antlr.runtime.BitSet([0x30000472, 0x00000000]),
    FOLLOW_set_in_text105: new org.antlr.runtime.BitSet([0x30000472, 0x00000000]),
    FOLLOW_stringArg_in_stringArgAndContent144: new org.antlr.runtime.BitSet([0x00000000, 0x00000002]),
    FOLLOW_33_in_stringArgAndContent146: new org.antlr.runtime.BitSet([0x40000080, 0x00000004]),
    FOLLOW_set_in_stringArgAndContent148: new org.antlr.runtime.BitSet([0x40000080, 0x00000004]),
    FOLLOW_34_in_stringArgAndContent157: new org.antlr.runtime.BitSet([0x000000C2, 0x00000000]),
    FOLLOW_set_in_stringArgAndContent160: new org.antlr.runtime.BitSet([0x000000C2, 0x00000000]),
    FOLLOW_set_in_stringArg197: new org.antlr.runtime.BitSet([0x400000B0, 0x00000000]),
    FOLLOW_STRING_in_stringArg214: new org.antlr.runtime.BitSet([0x40000082, 0x00000008]),
    FOLLOW_SSTRING_in_stringArg225: new org.antlr.runtime.BitSet([0x40000082, 0x00000008]),
    FOLLOW_set_in_stringArg241: new org.antlr.runtime.BitSet([0x40000080, 0x00000008]),
    FOLLOW_35_in_stringArg248: new org.antlr.runtime.BitSet([0x400000B0, 0x00000000]),
    FOLLOW_set_in_stringArg250: new org.antlr.runtime.BitSet([0x400000B0, 0x00000000]),
    FOLLOW_STRING_in_stringArg267: new org.antlr.runtime.BitSet([0x40000082, 0x00000008]),
    FOLLOW_SSTRING_in_stringArg280: new org.antlr.runtime.BitSet([0x40000082, 0x00000008]),
    FOLLOW_set_in_stringArg297: new org.antlr.runtime.BitSet([0x40000082, 0x00000000]),
    FOLLOW_set_in_content328: new org.antlr.runtime.BitSet([0x40000080, 0x00000004]),
    FOLLOW_34_in_content337: new org.antlr.runtime.BitSet([0x000000C2, 0x00000000]),
    FOLLOW_set_in_content340: new org.antlr.runtime.BitSet([0x000000C2, 0x00000000]),
    FOLLOW_COMMENT_in_other362: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_STRING_in_other370: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_SSTRING_in_other379: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_line_end0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();