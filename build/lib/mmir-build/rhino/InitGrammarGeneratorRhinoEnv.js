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


/*
 * Initializer for Standalone Grammar Generator script (StandaloneSemanticParserCompileExec.js)
 * in Rhino environment.
 * 
 */

var theJSONGrammarPath 				= arguments && arguments.length > 0? arguments[0] : null;
var theJSONGrammarFileName			= arguments && arguments.length > 1? arguments[1] : null;
var theJSONGrammarLanguageStr	 	= arguments && arguments.length > 2? arguments[2] : null;
var theCompiledGrammarTargetPath 	= arguments && arguments.length > 3? arguments[3] : null;
var theCompiledGrammarTargetFileName= arguments && arguments.length > 4? arguments[4] : null;
var theJsLibPath					= arguments && arguments.length > 5? arguments[5] : null;

var theGrammarEngine				= arguments && arguments.length > 6? arguments[6] : null;


//initialize requirejs
load('build/lib/r.js');//FIXME use:  ${buildDirLib}r.js

//STUB need requirejs' define() as definejs() in NodeJS environment,
//     since NodeJS has its own require() / define() functions
// (for Rhino: just "copy" requirejs' define into definejs)
var definejs = define;
require.define = define;

var requiren = require;

module = {};

jqueryDeferredModuleUri = 'lib/jquery-deferred';
jqueryDeferred = null;

require(['./build/lib/nodejs-jquery-deferred/lib/jquery-core.js'], function(jqcore){
	definejs('jquery-core.js', ['module'], function(){ return jQuery;});
	require(['jquery-core.js', './build/lib/nodejs-jquery-deferred/lib/jquery-callbacks.js'], function(jqcallbacks){
		definejs('jquery-callbacks.js', ['module'], function(){ return jQuery;});
		require(['jquery-callbacks.js','./build/lib/nodejs-jquery-deferred/lib/jquery-deferred.js'], function(){
			
			definejs(jqueryDeferredModuleUri, ['module'], function(){ return jQuery;});
			require([jqueryDeferredModuleUri], function(){ jqueryDeferred = jQuery; return jQuery;});
		});
	});
});