grammar MmirScriptContent;

options {
	tokenVocab = MmirTemplate;
	language = JavaScript;
}

@lexer::members {
	this.isDebug = true;
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
		if(this.isDebug) printInfo('CONTENT_text', $theText);//debug
	}
	: t=text { $theText = ($t.text?$t.text:''); } (NL t=text { $theText = $theText + '\r\n' + ($t.text?$t.text:''); })*
	;
	
text
	: (CHAR | EscapeExit | DoExit)* ( other (CHAR | EscapeExit | DoExit)* )*
	;

stringArgAndContent returns[String theName, String theContent]	
	@init{
		var startPos;
	}
	@after{
		var end = this.input.getTokens()[this.input.size()-1].getStopIndex()+1;
		var theString = this.input.getTokenSource().input.data;
		$theContent = theString.substring(startPos, end);
		
		if(this.isDebug) print('CONTENT_stringArgAndContent -> content= "'+$theContent+'"');//debug
	}
	: stringArg ')' (NL|WS)* start='{'  (NL  | CHAR )*
	{
		$theName = $stringArg.theText;
		startPos = start.getStartIndex()+1;
		
		if(this.isDebug) print('CONTENT_stringArgAndContent -> str='+$stringArg.theText);//debug
	}
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

other	: COMMENT  {if(this.isDebug) printInfo('CONTENT_comment',$COMMENT.text);/*debug*/}
	| STRING   {if(this.isDebug) printInfo('CONTENT_String' ,$STRING.text);/*debug*/}
	| SSTRING  {if(this.isDebug) printInfo('CONTENT_string' ,$SSTRING.text);/*debug*/}
	;
	
line_end:	NL | EOF;

EscapeExit 
	:	'}@@';
DoExit	:	'}@'
	{
                this.emit(org.antlr.runtime.Token.EOF_TOKEN);
                
                if(this.isDebug) print("exiting embedded CONTENT");//debug
          
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
    :   
//    	'//' ~('\n'|'\r')* '\r'? '\n' 
//    |   '/*' ( options {greedy=false;} : . )* '*/' 
//    |   
    	'@*' ( options {greedy=false;} : . )* '*@'  {$channel=HIDDEN;}
    ;


STRING
    :  '"' ( options {greedy=false;}: ((ESC_EXIT_SEQ)=>ESC_EXIT_SEQ | (EXIT_SEQ)=>EXIT_SEQ | ESC_SEQ | ~('\\'|'"') ))* '"'
    ;
    
SSTRING
    :  '\'' ( options {greedy=false;}: ((ESC_EXIT_SEQ)=>ESC_EXIT_SEQ | (EXIT_SEQ)=>EXIT_SEQ | ESC_SEQ | ~('\\'|'\'') ))* '\''
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
ESC_EXIT_SEQ 
	:	'}@@';

fragment
EXIT_SEQ
	:	'}@'
	{
                this.emit(org.antlr.runtime.Token.EOF_TOKEN);
                
                if(this.isDebug) print("IN_STRING: exiting embedded CONTENT");//debug
          
        }
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

