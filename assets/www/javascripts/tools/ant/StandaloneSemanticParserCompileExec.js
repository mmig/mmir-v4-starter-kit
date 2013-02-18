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
 * Standalone script for generating the parsing-code for the semantic/SemanticInterpreter:
 *  * read grammar definition in JSON format
 *  * generate JSCC grammar from JSON definition, and compile it to parser code
 *  * store parser code into >theCompiledGrammarTargetPath< (e.g. "gen/grammar.js", see build.settings)
 */

var semanticInterpreter;

var compiledParser;
var compileCount = 0;

var IS_DEBUG_ENABLED = true;

console.log('Path to JSON grammar: "'+theJSONGrammarPath+'"');

var theJSONGrammarURL = theJSONGrammarPath;
var theCompiledOutputFile = theCompiledGrammarTargetPath;

var theJSONgrammar = 'un-initialized';

theJSONgrammar = loadLocalFile(theJSONGrammarURL);
semanticInterpreter = mobileDS.SemanticInterpreter.getNewInstance(theJSONgrammar, 'compiled_grammar');
var compiledParser = semanticInterpreter.getGrammarParserText();

//normalize newlines:
// convert windows/mac to unix newlines
compiledParser = compiledParser.replaceAll('\r\n','\n').replaceAll('\r','\n');
// convert to windows style newlines:
compiledParser = compiledParser.replaceAll('\n','\r\n');
//append an empty last line:
compiledParser += '\r\n';


console.log('------------------------------------------------ finished compiling ---------------------------');

saveToFile(compiledParser, theCompiledOutputFile);

console.log('------------------------------------------------ finished! ---------------------------');