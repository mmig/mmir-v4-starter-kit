(function(){
  var semanticInterpreter = require("semanticInterpreter");
var options = {fileFormat:4,execMode:"sync"};
var grammarFunc = function(asr_recognized_text){
var theGrammarConverterInstance = this;

 
  var _$result = '';
  var _$v_play_inf = {};
  var _$rest = {};
  var _$play = {};


/*
	JS/CC: A LALR(1) Compiler-Compiler written in JavaScript
	Copyright (C) 2007, 2008 by J.M.K S.F. Software Technologies, Jan Max Meyer
	http://www.jmksf.com ++ jscc<-AT->jmksf.com
	
	File:	jscc.html
	Author:	Jan Max Meyer
	Usage:	Modified parser template for the Web Environment Module
			Based on "driver_web.js_" parser template, but NOT in the public domain!
	
	You may use, modify and distribute this software under the terms and conditions
	of the Artistic License. Please see ARTISTIC for more information.

	Driver for the JS/CC Web Environment with integrated HTML parse tree generator!
	
	Features:
	- Parser trace messages
	- Integrated panic-mode error recovery
	MOD REDUCED: removed -> Parse tree construction for the JS/CC web environment
*/

var _dbg_withtrace		= false;
var _dbg_string			= new String();

function __dbg_print( text )
{
	_dbg_string += text + "\n";
}

function __lex( info )
{
	var state		= 0;
	var match		= -1;
	var match_pos	= 0;
	var start		= 0;
	var pos			= info.offset + 1;

	do
	{
		pos--;
		state = 0;
		match = -2;
		start = pos;

		if( info.src.length <= start )
			return 7;

		do
		{

switch( state )
{
	case 0:
		if( info.src.charCodeAt( pos ) == 9 || info.src.charCodeAt( pos ) == 32 ) state = 1;
		else if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 98 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 103 ) || ( info.src.charCodeAt( pos ) >= 105 && info.src.charCodeAt( pos ) <= 114 ) || ( info.src.charCodeAt( pos ) >= 116 && info.src.charCodeAt( pos ) <= 118 ) || ( info.src.charCodeAt( pos ) >= 120 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 104 ) state = 5;
		else if( info.src.charCodeAt( pos ) == 97 ) state = 29;
		else if( info.src.charCodeAt( pos ) == 115 ) state = 39;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 42;
		else if( info.src.charCodeAt( pos ) == 119 ) state = 47;
		else state = -1;
		break;

	case 1:
		state = -1;
		match = 1;
		match_pos = pos;
		break;

	case 2:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 3:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 4:
		if( info.src.charCodeAt( pos ) == 126 ) state = 7;
		else state = -1;
		break;

	case 5:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 126 ) state = 4;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 6:
		state = -1;
		match = 2;
		match_pos = pos;
		break;

	case 7:
		if( info.src.charCodeAt( pos ) == 48 ) state = 22;
		else state = -1;
		break;

	case 8:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 126 ) state = 9;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 9:
		if( info.src.charCodeAt( pos ) == 126 ) state = 25;
		else state = -1;
		break;

	case 10:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 3;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 11:
		if( info.src.charCodeAt( pos ) == 70 ) state = 12;
		else state = -1;
		break;

	case 12:
		if( info.src.charCodeAt( pos ) == 54 ) state = 14;
		else state = -1;
		break;

	case 13:
		if( info.src.charCodeAt( pos ) == 70 ) state = 15;
		else state = -1;
		break;

	case 14:
		if( info.src.charCodeAt( pos ) == 126 ) state = 23;
		else state = -1;
		break;

	case 15:
		if( info.src.charCodeAt( pos ) == 54 ) state = 26;
		else state = -1;
		break;

	case 16:
		if( info.src.charCodeAt( pos ) == 114 ) state = 17;
		else state = -1;
		break;

	case 17:
		if( info.src.charCodeAt( pos ) == 101 ) state = 19;
		else state = -1;
		break;

	case 18:
		if( info.src.charCodeAt( pos ) == 114 ) state = 20;
		else state = -1;
		break;

	case 19:
		if( info.src.charCodeAt( pos ) == 110 ) state = 6;
		else state = -1;
		break;

	case 20:
		if( info.src.charCodeAt( pos ) == 101 ) state = 19;
		else state = -1;
		break;

	case 21:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 103 ) || ( info.src.charCodeAt( pos ) >= 105 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 104 ) state = 8;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 22:
		if( info.src.charCodeAt( pos ) == 48 ) state = 11;
		else state = -1;
		break;

	case 23:
		if( info.src.charCodeAt( pos ) == 126 ) state = 16;
		else state = -1;
		break;

	case 24:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 10;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 25:
		if( info.src.charCodeAt( pos ) == 48 ) state = 27;
		else state = -1;
		break;

	case 26:
		if( info.src.charCodeAt( pos ) == 126 ) state = 28;
		else state = -1;
		break;

	case 27:
		if( info.src.charCodeAt( pos ) == 48 ) state = 13;
		else state = -1;
		break;

	case 28:
		if( info.src.charCodeAt( pos ) == 126 ) state = 18;
		else state = -1;
		break;

	case 29:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || info.src.charCodeAt( pos ) == 97 || ( info.src.charCodeAt( pos ) >= 99 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 21;
		else if( info.src.charCodeAt( pos ) == 98 ) state = 43;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 30:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 107 ) || ( info.src.charCodeAt( pos ) >= 109 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 108 ) state = 24;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 31:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 24;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 32:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || info.src.charCodeAt( pos ) == 97 || ( info.src.charCodeAt( pos ) >= 99 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 98 ) state = 24;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 33:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 30;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 34:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 109 ) || ( info.src.charCodeAt( pos ) >= 111 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 110 ) state = 31;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 35:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 32;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 36:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 105 ) state = 33;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 37:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 34;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 38:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 102 ) || ( info.src.charCodeAt( pos ) >= 104 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 103 ) state = 35;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 39:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 111 ) || ( info.src.charCodeAt( pos ) >= 113 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 112 ) state = 36;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 40:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 106 ) || ( info.src.charCodeAt( pos ) >= 108 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 107 ) state = 37;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 41:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 114 ) state = 38;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 42:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 113 ) || ( info.src.charCodeAt( pos ) >= 115 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 114 ) state = 40;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 43:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 114 ) || ( info.src.charCodeAt( pos ) >= 116 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 115 ) state = 39;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 44:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 41;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 45:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 99 ) || ( info.src.charCodeAt( pos ) >= 101 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 100 ) state = 44;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 46:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 100 ) || ( info.src.charCodeAt( pos ) >= 102 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 101 ) state = 45;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

	case 47:
		if( ( info.src.charCodeAt( pos ) >= 65 && info.src.charCodeAt( pos ) <= 90 ) || info.src.charCodeAt( pos ) == 95 || ( info.src.charCodeAt( pos ) >= 97 && info.src.charCodeAt( pos ) <= 104 ) || ( info.src.charCodeAt( pos ) >= 106 && info.src.charCodeAt( pos ) <= 122 ) ) state = 2;
		else if( info.src.charCodeAt( pos ) == 105 ) state = 46;
		else state = -1;
		match = 3;
		match_pos = pos;
		break;

}


			pos++;

		}
		while( state > -1 );

	}
	while( 1 > -1 && match == 1 );

	if( match > -1 )
	{
		info.att = info.src.substr( start, match_pos - start );
		info.offset = match_pos;
		
switch( match )
{
	case 2:
		{
		 _$v_play_inf[info.att] = info.att; 
		}
		break;

	case 3:
		{
		 _$rest[info.att] = info.att; 
		}
		break;

}


	}
	else
	{
		info.att = new String();
		match = -1;
	}

	return match;
}


function __parse( src, err_off, err_la, semanticAnnotationResult )
{
	var		sstack			= new Array();
	var		vstack			= new Array();
	var 	err_cnt			= 0;
	var		act;
	var		go;
	var		la;
	var		rval;
	var 	parseinfo		= new Function( "", "var offset; var src; var att;" );
	var		info			= new parseinfo();
	
	//Visual parse tree generation
	var 	treenode		= new Function( "", "var sym; var att; var child;" );
	var		treenodes		= new Array();
	var		tree			= new Array();
	var		tmptree			= null;
	
/* Pop-Table */
var pop_tab = new Array(
	new Array( 0/* utterance' */, 1 ),
	new Array( 5/* utterance */, 1 ),
	new Array( 6/* PLAY */, 1 ),
	new Array( 4/* phrases */, 1 )
);

/* Action-Table */
var act_tab = new Array(
	/* State 0 */ new Array( 2/* "V_PLAY_INF" */,4 ),
	/* State 1 */ new Array( 7/* "$" */,0 ),
	/* State 2 */ new Array( 7/* "$" */,-1 ),
	/* State 3 */ new Array( 7/* "$" */,-3 ),
	/* State 4 */ new Array( 7/* "$" */,-2 )
);

/* Goto-Table */
var goto_tab = new Array(
	/* State 0 */ new Array( 5/* utterance */,1 , 4/* phrases */,2 , 6/* PLAY */,3 ),
	/* State 1 */ new Array(  ),
	/* State 2 */ new Array(  ),
	/* State 3 */ new Array(  ),
	/* State 4 */ new Array(  )
);



/* Symbol labels */
var labels = new Array(
	"utterance'" /* Non-terminal symbol */,
	"WHITESPACE" /* Terminal symbol */,
	"V_PLAY_INF" /* Terminal symbol */,
	"REST" /* Terminal symbol */,
	"phrases" /* Non-terminal symbol */,
	"utterance" /* Non-terminal symbol */,
	"PLAY" /* Non-terminal symbol */,
	"$" /* Terminal symbol */
);


	
	info.offset = 0;
	info.src = src;
	info.att = new String();
	
	if( !err_off )
		err_off	= new Array();
	if( !err_la )
	err_la = new Array();
	
	sstack.push( 0 );
	vstack.push( 0 );
	
	la = __lex( info );

	while( true )
	{
		act = 6;
		for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
		{
			if( act_tab[sstack[sstack.length-1]][i] == la )
			{
				act = act_tab[sstack[sstack.length-1]][i+1];
				break;
			}
		}

		if( _dbg_withtrace && sstack.length > 0 )
		{
			__dbg_print( "\nState " + sstack[sstack.length-1] + "\n" +
							"\tLookahead: " + labels[la] + " (\"" + info.att + "\")\n" +
							"\tAction: " + act + "\n" + 
							"\tSource: \"" + info.src.substr( info.offset, 30 ) + ( ( info.offset + 30 < info.src.length ) ?
									"..." : "" ) + "\"\n" +
							"\tStack: " + sstack.join() + "\n" +
							"\tValue stack: " + vstack.join() + "\n" );
		}
		
			
		//Panic-mode: Try recovery when parse-error occurs!
		if( act == 6 )
		{
			if( _dbg_withtrace )
				__dbg_print( "Error detected: There is no reduce or shift on the symbol " + labels[la] );
			
			err_cnt++;
			err_off.push( info.offset - info.att.length );			
			err_la.push( new Array() );
			for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
				err_la[err_la.length-1].push( labels[act_tab[sstack[sstack.length-1]][i]] );
			
			//Remember the original stack!
			var rsstack = new Array();
			var rvstack = new Array();
			for( var i = 0; i < sstack.length; i++ )
			{
				rsstack[i] = sstack[i];
				rvstack[i] = vstack[i];
			}
			
			while( act == 6 && la != 7 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery\n" +
									"Current lookahead: " + labels[la] + " (" + info.att + ")\n" +
									"Action: " + act + "\n\n" );
				if( la == -1 )
					info.offset++;
					
				while( act == 6 && sstack.length > 0 )
				{
					sstack.pop();
					vstack.pop();
					
					if( sstack.length == 0 )
						break;
						
					act = 6;
					for( var i = 0; i < act_tab[sstack[sstack.length-1]].length; i+=2 )
					{
						if( act_tab[sstack[sstack.length-1]][i] == la )
						{
							act = act_tab[sstack[sstack.length-1]][i+1];
							break;
						}
					}
				}
				
				if( act != 6 )
					break;
				
				for( var i = 0; i < rsstack.length; i++ )
				{
					sstack.push( rsstack[i] );
					vstack.push( rvstack[i] );
				}
				
				la = __lex( info );
			}
			
			if( act == 6 )
			{
				if( _dbg_withtrace )
					__dbg_print( "\tError recovery failed, terminating parse process..." );
				break;
			}


			if( _dbg_withtrace )
				__dbg_print( "\tError recovery succeeded, continuing" );
		}
		
		/*
		if( act == 6 )
			break;
		*/
		
		
		//Shift
		if( act > 0 )
		{
			//Parse tree
			var node = new treenode();
			node.sym = labels[ la ];
			node.att = info.att;
			node.child = new Array();
			tree.push( treenodes.length );
			treenodes.push( node );
			
			if( _dbg_withtrace )
				__dbg_print( "Shifting symbol: " + labels[la] + " (" + info.att + ")" );
		
			sstack.push( act );
			vstack.push( info.att );
			
			la = __lex( info );
			
			if( _dbg_withtrace )
				__dbg_print( "\tNew lookahead symbol: " + labels[la] + " (" + info.att + ")" );
		}
		//Reduce
		else
		{		
			act *= -1;
			
			if( _dbg_withtrace )
				__dbg_print( "Reducing by producution: " + act );
			
			rval = void(0);
			
			if( _dbg_withtrace )
				__dbg_print( "\tPerforming semantic action..." );
			
switch( act )
{
	case 0:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
	case 1:
	{
		  console.log(_$result); semanticAnnotationResult.result = _$result; 
	}
	break;
	case 2:
	{
		 rval = vstack[ vstack.length - 1 ]; var play_temp = {}; play_temp['phrases'] = {};play_temp['phrases']['v_play_inf'] = [];play_temp['phrases']['v_play_inf'][0] = {tok: vstack[ vstack.length - 1 ],i: 0};
		var _$phrase = rval; play_temp['phrase']=_$phrase; play_temp['utterance']='play'; play_temp['engine']='jscc'; play_temp['semantic'] = {"Play":{}}; _$play[_$phrase] = play_temp; _$result = play_temp; 
	}
	break;
	case 3:
	{
		rval = vstack[ vstack.length - 1 ];
	}
	break;
}



			tmptree = new Array();

			if( _dbg_withtrace )
				__dbg_print( "\tPopping " + pop_tab[act][1] + " off the stack..." );
				
			for( var i = 0; i < pop_tab[act][1]; i++ )
			{			
				tmptree.push( tree.pop() );

				sstack.pop();
				vstack.pop();
			}
									
			go = -1;
			for( var i = 0; i < goto_tab[sstack[sstack.length-1]].length; i+=2 )
			{
				if( goto_tab[sstack[sstack.length-1]][i] == pop_tab[act][0] )
				{
					go = goto_tab[sstack[sstack.length-1]][i+1];
					break;
				}
			}
			
			//Parse tree
			var node = new treenode();
			node.sym = labels[ pop_tab[act][0] ];
			node.att = rval;
			node.child = tmptree.reverse();
			tree.push( treenodes.length );
			treenodes.push( node );
			
			if( act == 0 )
				break;
				
			if( _dbg_withtrace )
				__dbg_print( "\tPushing non-terminal " + labels[ pop_tab[act][0] ] );
				
			sstack.push( go );
			vstack.push( rval );			
		}
		
		if( _dbg_withtrace )
		{		
			alert( _dbg_string );
			_dbg_string = new String();
		}
	}

	if( _dbg_withtrace )
	{
		__dbg_print( "\nParse complete." );
		alert( _dbg_string );
	}
	
	if( err_cnt == 0 )
	{}
	
	return err_cnt;
}


var _semanticAnnotationResult = { result: {}};
__parse( asr_recognized_text, new Array(), new Array(), _semanticAnnotationResult);
return _semanticAnnotationResult.result;

};
semanticInterpreter.addGrammar("de", grammarFunc, options);

semanticInterpreter.setStopwords("de",["bitte"]);
return grammarFunc;
})();
