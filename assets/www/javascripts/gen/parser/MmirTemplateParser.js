// $ANTLR 3.3 Nov 30, 2010 12:50:56 ../MmirTemplate.g 2013-02-13 18:45:50

var MmirTemplateParser = function(input, state) {
    if (!state) {
        state = new org.antlr.runtime.RecognizerSharedState();
    }

    (function(){
    }).call(this);

    MmirTemplateParser.superclass.constructor.call(this, input, state);


         

    /* @todo only create adaptor if output=AST */
    this.adaptor = new org.antlr.runtime.tree.CommonTreeAdaptor();

};

org.antlr.lang.augmentObject(MmirTemplateParser, {
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
    OCTAL_ESC= 22;

// public instance methods/vars
org.antlr.lang.extend(MmirTemplateParser, org.antlr.runtime.Parser, {
        
    setTreeAdaptor: function(adaptor) {
        this.adaptor = adaptor;
    },
    getTreeAdaptor: function() {
        return this.adaptor;
    },

    getTokenNames: function() { return MmirTemplateParser.tokenNames; },
    getGrammarFileName: function() { return "../MmirTemplate.g"; }
});
org.antlr.lang.augmentObject(MmirTemplateParser.prototype, {

    // inline static return class
    main_return: (function() {
        MmirTemplateParser.main_return = function(){};
        org.antlr.lang.extend(MmirTemplateParser.main_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ../MmirTemplate.g:193:1: main : text ;
    // $ANTLR start "main"
    main: function() {
        var retval = new MmirTemplateParser.main_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var text1 = null;


        try {
            // ../MmirTemplate.g:194:2: ( text )
            // ../MmirTemplate.g:194:4: text
            root_0 = this.adaptor.nil();

            this.pushFollow(MmirTemplateParser.FOLLOW_text_in_main39);
            text1=this.text();

            this.state._fsp--;

            this.adaptor.addChild(root_0, text1.getTree());



            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    text_return: (function() {
        MmirTemplateParser.text_return = function(){};
        org.antlr.lang.extend(MmirTemplateParser.text_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ../MmirTemplate.g:197:1: text : ( line )+ ;
    // $ANTLR start "text"
    text: function() {
        var retval = new MmirTemplateParser.text_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

         var line2 = null;


        try {
            // ../MmirTemplate.g:198:2: ( ( line )+ )
            // ../MmirTemplate.g:198:4: ( line )+
            root_0 = this.adaptor.nil();

            // ../MmirTemplate.g:198:4: ( line )+
            var cnt1=0;
            loop1:
            do {
                var alt1=2;
                var LA1_0 = this.input.LA(1);

                if ( ((LA1_0>=STRING && LA1_0<=DoEnterYieldContent)) ) {
                    alt1=1;
                }


                switch (alt1) {
                case 1 :
                    // ../MmirTemplate.g:198:4: line
                    this.pushFollow(MmirTemplateParser.FOLLOW_line_in_text51);
                    line2=this.line();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, line2.getTree());


                    break;

                default :
                    if ( cnt1 >= 1 ) {
                        break loop1;
                    }
                        var eee = new org.antlr.runtime.EarlyExitException(1, this.input);
                        throw eee;
                }
                cnt1++;
            } while (true);




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    line_return: (function() {
        MmirTemplateParser.line_return = function(){};
        org.antlr.lang.extend(MmirTemplateParser.line_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ../MmirTemplate.g:201:1: line : ( other | STRING | SSTRING | CHAR )* ( NL | END ) ;
    // $ANTLR start "line"
    line: function() {
        var retval = new MmirTemplateParser.line_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var STRING4 = null;
        var SSTRING5 = null;
        var CHAR6 = null;
        var set7 = null;
         var other3 = null;

        var STRING4_tree=null;
        var SSTRING5_tree=null;
        var CHAR6_tree=null;
        var set7_tree=null;

        try {
            // ../MmirTemplate.g:201:7: ( ( other | STRING | SSTRING | CHAR )* ( NL | END ) )
            // ../MmirTemplate.g:201:9: ( other | STRING | SSTRING | CHAR )* ( NL | END )
            root_0 = this.adaptor.nil();

            // ../MmirTemplate.g:201:9: ( other | STRING | SSTRING | CHAR )*
            loop2:
            do {
                var alt2=5;
                switch ( this.input.LA(1) ) {
                case ESC_DoEnter:
                case COMMENT:
                case DoEnterBlock:
                case DoEnterStatement:
                case DoEnterIncludeScript:
                case DoEnterIncludeStyle:
                case DoEnterLocalize:
                case DoEnterYieldDeclaration:
                case DoEnterYieldContent:
                    alt2=1;
                    break;
                case STRING:
                    alt2=2;
                    break;
                case SSTRING:
                    alt2=3;
                    break;
                case CHAR:
                    alt2=4;
                    break;

                }

                switch (alt2) {
                case 1 :
                    // ../MmirTemplate.g:201:10: other
                    this.pushFollow(MmirTemplateParser.FOLLOW_other_in_line65);
                    other3=this.other();

                    this.state._fsp--;

                    this.adaptor.addChild(root_0, other3.getTree());


                    break;
                case 2 :
                    // ../MmirTemplate.g:201:18: STRING
                    STRING4=this.match(this.input,STRING,MmirTemplateParser.FOLLOW_STRING_in_line69); 
                    STRING4_tree = this.adaptor.create(STRING4);
                    this.adaptor.addChild(root_0, STRING4_tree);



                    break;
                case 3 :
                    // ../MmirTemplate.g:201:27: SSTRING
                    SSTRING5=this.match(this.input,SSTRING,MmirTemplateParser.FOLLOW_SSTRING_in_line73); 
                    SSTRING5_tree = this.adaptor.create(SSTRING5);
                    this.adaptor.addChild(root_0, SSTRING5_tree);



                    break;
                case 4 :
                    // ../MmirTemplate.g:201:37: CHAR
                    CHAR6=this.match(this.input,CHAR,MmirTemplateParser.FOLLOW_CHAR_in_line77); 
                    CHAR6_tree = this.adaptor.create(CHAR6);
                    this.adaptor.addChild(root_0, CHAR6_tree);



                    break;

                default :
                    break loop2;
                }
            } while (true);

            set7=this.input.LT(1);
            if ( (this.input.LA(1)>=NL && this.input.LA(1)<=END) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set7));
                this.state.errorRecovery=false;
            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    },

    // inline static return class
    other_return: (function() {
        MmirTemplateParser.other_return = function(){};
        org.antlr.lang.extend(MmirTemplateParser.other_return,
                          org.antlr.runtime.ParserRuleReturnScope,
        {
            getTree: function() { return this.tree; }
        });
        return;
    })(),

    // ../MmirTemplate.g:204:1: other : ( ESC_DoEnter | COMMENT | DoEnterBlock | DoEnterStatement | DoEnterIncludeScript | DoEnterIncludeStyle | DoEnterLocalize | DoEnterYieldDeclaration | DoEnterYieldContent );
    // $ANTLR start "other"
    other: function() {
        var retval = new MmirTemplateParser.other_return();
        retval.start = this.input.LT(1);

        var root_0 = null;

        var set8 = null;

        var set8_tree=null;

        try {
            // ../MmirTemplate.g:204:7: ( ESC_DoEnter | COMMENT | DoEnterBlock | DoEnterStatement | DoEnterIncludeScript | DoEnterIncludeStyle | DoEnterLocalize | DoEnterYieldDeclaration | DoEnterYieldContent )
            // ../MmirTemplate.g:
            root_0 = this.adaptor.nil();

            set8=this.input.LT(1);
            if ( (this.input.LA(1)>=ESC_DoEnter && this.input.LA(1)<=DoEnterYieldContent) ) {
                this.input.consume();
                this.adaptor.addChild(root_0, this.adaptor.create(set8));
                this.state.errorRecovery=false;
            }
            else {
                var mse = new org.antlr.runtime.MismatchedSetException(null,this.input);
                throw mse;
            }




            retval.stop = this.input.LT(-1);

            retval.tree = this.adaptor.rulePostProcessing(root_0);
            this.adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }
        catch (re) {
            if (re instanceof org.antlr.runtime.RecognitionException) {
                this.reportError(re);
                this.recover(this.input,re);
                retval.tree = this.adaptor.errorNode(this.input, retval.start, this.input.LT(-1), re);
            } else {
                throw re;
            }
        }
        finally {
        }
        return retval;
    }

    // Delegated rules




}, true); // important to pass true to overwrite default implementations

 

// public class variables
org.antlr.lang.augmentObject(MmirTemplateParser, {
    tokenNames: ["<invalid>", "<EOR>", "<DOWN>", "<UP>", "STRING", "SSTRING", "CHAR", "NL", "END", "ESC_DoEnter", "COMMENT", "DoEnterBlock", "DoEnterStatement", "DoEnterIncludeScript", "DoEnterIncludeStyle", "DoEnterLocalize", "DoEnterYieldDeclaration", "DoEnterYieldContent", "END_SCRIPT", "ESC_SEQ", "HEX_DIGIT", "UNICODE_ESC", "OCTAL_ESC"],
    FOLLOW_text_in_main39: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_line_in_text51: new org.antlr.runtime.BitSet([0x0003FFF2, 0x00000000]),
    FOLLOW_other_in_line65: new org.antlr.runtime.BitSet([0x0003FFF0, 0x00000000]),
    FOLLOW_STRING_in_line69: new org.antlr.runtime.BitSet([0x0003FFF0, 0x00000000]),
    FOLLOW_SSTRING_in_line73: new org.antlr.runtime.BitSet([0x0003FFF0, 0x00000000]),
    FOLLOW_CHAR_in_line77: new org.antlr.runtime.BitSet([0x0003FFF0, 0x00000000]),
    FOLLOW_set_in_line81: new org.antlr.runtime.BitSet([0x00000002, 0x00000000]),
    FOLLOW_set_in_other0: new org.antlr.runtime.BitSet([0x00000002, 0x00000000])
});

})();