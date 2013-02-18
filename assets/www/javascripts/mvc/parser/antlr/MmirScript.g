grammar MmirScript;

options {
	tokenVocab = MmirTemplate;
	language = JavaScript;
}

@lexer::members {

	this.isDebug = true;
	
	this.nesting = 0;
	this.nestingBlock = 0;
	
	this.isParseAsStatement = function(){
		return typeof this.parseAsStatement !== 'undefined' && this.parseAsStatement === true;
	};
}

@parser::members {

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
}
main returns[String theText]
	@after{
		if(this.isDebug) printInfo('SCRIPT_main.text', $theText);//debug
	}
	: t=text { $theText = ($t.text?$t.text:''); } (NL t=text { $theText = $theText + '\r\n' + ($t.text?$t.text:''); })*
	;

text
	: ( other | DoExit | DoExitStatement | DoEnter | DoEnterStatement | CHAR )*
	;

stringArgAndContent returns[String theName, String theContent]	
	@init{
		var startPos;
	}
	@after{
		var end = this.input.getTokens()[this.input.size()-1].getStopIndex()+1;
		var theString = this.input.getTokenSource().input.data;
		$theContent = theString.substring(startPos, end);
		
		if(this.isDebug) print('Block.stringArgAndContent -> content= "'+$theContent+'"');//debug
	}
	: stringArg ')' (NL|WS)* start='{'  (NL  | CHAR )*
	{
		$theName = $stringArg.theText;
		startPos = start.getStartIndex()+1;
		
		if(this.isDebug) print('Block.stringArgAndContent -> str='+$stringArg.theText);
	}
	;
parseStringArg returns[String theText]
	: stringArg EOF {$theText = $stringArg.theText;}
	;

stringArg returns[String theText]
@init{
	var strs;
}
@after{
	if(strs) $theText = strs.join(''); 
	else $theText='';
}
	: (NL|WS)* 
	  (
		str=STRING {if(!strs)strs=new Array();strs.push(this.extractString($str.text));}
	  |	str=SSTRING {if(!strs)strs=new Array();strs.push(this.extractString($str.text));}
	  ) ( 
	  	(NL|WS)* '+' (NL|WS)* 
	  	  (str=STRING {if(!strs)strs=new Array();strs.push(this.extractString($str.text));}
	  	  |str=SSTRING {if(!strs)strs=new Array();strs.push(this.extractString($str.text));}
	  	 )
	  )* (NL|WS)*
	;

other	: COMMENT  {if(this.isDebug) printInfo('SCRIPT_BLOCK_comment',$COMMENT.text);/*debug*/}
	| STRING   {if(this.isDebug) printInfo('SCRIPT_BLOCK_String' ,$STRING.text);/*debug*/}
	| SSTRING  {if(this.isDebug) printInfo('SCRIPT_BLOCK_string' ,$SSTRING.text);/*debug*/}
	;
	
line_end:	NL | EOF;

DoEnter
	:	'{' {this.nestingBlock++; if(this.isDebug) print("opening level SCRIPT_BLOCK "+this.nestingBlock);/*debug*/}
        ;
        
DoExit
	:	'}'
	{
          if ( this.nestingBlock <= 0 ) {
		
                this.emit(org.antlr.runtime.Token.EOF_TOKEN);
                
                if(this.isDebug) print("exiting embedded SCRIPT_BLOCK");//debug
          }
          else {
                if(this.isDebug) print("closing level SCRIPT_BLOCK "+this.nestingBlock);//debug
                
                this.nestingBlock--;
          }
        }
	;

DoEnterStatement 
	:	'(' {this.nesting++; if(this.isDebug) print("opening level STATEMENT_BLOCK "+this.nesting);/*debug*/}
        ;
        
DoExitStatement:	 ')'
	{
          if ( this.nesting <= 0 ) {
          
                this.emit(org.antlr.runtime.Token.EOF_TOKEN);
                
                if(this.isDebug) print("exiting embedded SCRIPT_STATEMENT");//debug
          }
          else {
                if(this.isDebug) print("closing level SCRIPT_STATEMENT "+this.nesting);//debug
                
                this.nesting--;
          }
        }
	;

NL
	: '\r'? '\n'
	| '\r'		// Line feed.
	| '\u2028'	// Line separator.
	| '\u2029'	// Paragraph separator.
	;


WS
    : (' '|'\t'| NL ) {$channel=HIDDEN;};
    
CHAR	:	~('\n'|'\r');

COMMENT
    :   '//' ~('\n'|'\r')* '\r'? '\n'  {$channel=HIDDEN;}
    |   '/*' ( options {greedy=false;} : . )* '*/'  {$channel=HIDDEN;}
    |   '@*' ( options {greedy=false;} : . )* '*@'  {$channel=HIDDEN;}
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