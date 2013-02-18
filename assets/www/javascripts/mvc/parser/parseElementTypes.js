﻿/*
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

/**
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

mobileDS.parser.element.isScript = function(element){
	
};
