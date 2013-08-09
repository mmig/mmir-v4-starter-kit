/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/**
 * @module mobileDS.javascripts.tools
 * 
 */
var mobileDS = window.mobileDS || {};
mobileDS.parser = mobileDS.parser || {};
mobileDS.parser.element = mobileDS.parser.element || {};

//TODO detect&use Object.defineProperty (if positively detected), e.g.:
//	Object.defineProperty(mobileDS.parser.element, 'INCLUDE_SCRIPT', {value : 0, writable : false, configurable : false, enumerable : true});

/*
 * 
 * @category parser
 * @public
 */
mobileDS.parser.element.INCLUDE_SCRIPT 		= 0;
mobileDS.parser.element.INCLUDE_STYLE 		= 2;
mobileDS.parser.element.LOCALIZE	 		= 4;
mobileDS.parser.element.YIELD_DECLARATION 	= 8;
mobileDS.parser.element.YIELD_CONTENT 		= 16;
mobileDS.parser.element.BLOCK 				= 32;
mobileDS.parser.element.STATEMENT 			= 64;
mobileDS.parser.element.HELPER	 			= 128;
mobileDS.parser.element.IF		 			= 256;
mobileDS.parser.element.ELSE	 			= 512;
mobileDS.parser.element.FOR		 			= 1024;
mobileDS.parser.element.RENDER	 			= 2048;
mobileDS.parser.element.ESCAPE_ENTER		= 4096;
mobileDS.parser.element.ESCAPE_EXIT			= 8192;

mobileDS.parser.element.FOR_TYPE_ITER		= 16384;
mobileDS.parser.element.FOR_TYPE_STEP		= 32768;

mobileDS.parser.element.VAR_DECLARATION		= 65536;
mobileDS.parser.element.VAR_REFERENCE		= 131072;

mobileDS.parser.element.COMMENT				= 262144;

mobileDS.parser.element.DATA_NAME				= '__$$DATA$$__';
mobileDS.parser.element.DATA_ARGUMENT_NAME		= '@data';
mobileDS.parser.element.ARGUMENT_ARGUMENT_NAME	= '@argument';
