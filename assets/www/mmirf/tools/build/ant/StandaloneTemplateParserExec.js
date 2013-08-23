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
 * Standalone script for parsing ehtml-templates (views, layouts, partials):
 *  - trigger initializations
 *  - read ehtml files
 *  - parse the read files
 *  
 *  REQUIRES: 
 *  global function init(): returns an array of "MODULE functions".
 *  A single "MODULE function" is created by wrapping the content of a JS-file into a function,
 *  creating a "closure module".
 *  NOTE that some "MODULE functions" are expected to return (i.e. export) arrays of objects that were created
 *  within; the first element in the array is expected to be a String ID, 
 *         and the following elements the exported objects from the "MODULE function",
 *         e.g.: ['someModule', obj1, obj2]
 */

var initArray = init();

for(var i=0, size = initArray.length; i < size; ++i){
	var result = initArray[i].call(window, arguments);
	if(result && result[0] == "org"){
		org = result[1];
	}
	else if(result && result[0] == "template-parser"){
		ES3Lexer = result[1];
		ES3Parser = result[2];
		MmirScriptBlockLexer = result[3];
		MmirScriptBlockParser = result[4];
		MmirScriptContentLexer = result[5];
		MmirScriptContentParser = result[6];
		MmirScriptStatementLexer = result[7];
		MmirScriptStatementParser = result[8];
		MmirTemplateLexer = result[9];
		//MmirTemplateParser = result[10];
	}
	else if(result && result[0] == "dictionary"){
		Dictionary = result[1];
	}
	else if(result && result[0] == "jpath"){
		JPath = result[1];
	}
	else if(result && result[0] == "commonUtils"){
		var commonUtils = result[1];
		
		//"export" isArray to dummy jQuery:
	    $.isArray = commonUtils.isArray;
		

		//replace getLocalScript: ANT-executed JavaScript enviornments are DOMless 
		//  -> load & eval scripts instead of adding to document header
		commonUtils.getLocalScript = function (scriptUrl, success, fail){
			var content = loadLocalFile(scriptUrl, 'text');
			//console.log('loaded from '+scriptUrl+': '+content);
			try{
				eval(content);
				
				//try to export the loaded classes 
				// (at least for controllers and helpers; models are not needed when parsing template files!)
				if( scriptUrl.indexOf('controllers/') !== -1 || scriptUrl.indexOf('helpers/') !== -1){
					var i = scriptUrl.lastIndexOf('/');
					var name = scriptUrl.substring(i+1, scriptUrl.length-3);
					name = name[0].toUpperCase() + name.substring(1);
					window[name] = eval(name);
					//console.log('trying to export Controller: '+ window[name] );
				}
			} catch (exc){
				if(fail) fail(exc);
				return;
			}
			if(success) success();
		};
		
		//initialize (i.e. read directories.json)
		commonUtils.initialize();
	}
	else if(result && result[0] == "mvc"){
		Controller = result[1];
		Helper = result[2];
		ContentElement = result[3];
		Layout = result[4];
		View = result[5];
		Partial = result[6];
		YieldDeclaration = result[7];
		
		//export "classes" into the global window object:
		window["Controller"] = Controller;
		window["Helper"] = Helper;
		window["ContentElement"] = ContentElement;
		window["Layout"] = Layout;
		window["View"] = View;
		window["Partial"] = Partial;
		window["YieldDeclaration"] = YieldDeclaration;
	}
	else if(result && result[0] == "parseUtils"){
		
		var context 			= result[1];
		printImpl 				= result[2];
		printInfoImpl 			= result[3];
		parserPrintDebugImpl 	= result[4];
		parserPrintInfoImpl 	= result[5];
		parserPrintWarningImpl 	= result[6];
		parserPrintErrorImpl 	= result[7];
		//parserCreatePrintMessageImpl 	= result[8];
		print 				= function() { };//printImpl.apply(context, arguments); }
		printInfo 			= function() { };//printInfoImpl.apply(context, arguments); }
		parserPrintDebug 	= function() { };//parserPrintDebugImpl.apply(context, arguments); }
		parserPrintInfo 	= function() { };//parserPrintInfoImpl.apply(context, arguments); }
		parserPrintWarning 	= function() { parserPrintWarningImpl.apply(context, arguments); }
		parserPrintError 	= function() { parserPrintErrorImpl.apply(context, arguments); }
		//parserCreatePrintMessage = function() { return parserCreatePrintMessageImpl.apply(context, arguments); }

	    MmirTemplateLexer.prototype.emitErrorMessageRRR = function(msg) {
	    	console.error( parserCreatePrintMessage('[ERROR] TemplateLexer: ',msg) );
		};
	//	MmirTemplateParser.prototype.emitErrorMessage = function(msg) {
	//		parserPrintError('[ERROR] TemplateParser: ',msg);
	//	};
		
		ES3Lexer.prototype.emitErrorMessage = function(msg) {
			parserPrintError('[ERROR] JavaScriptLexer_ES3: ',msg);
		};
		ES3Parser.prototype.emitErrorMessage = function(msg) {
			parserPrintError('[ERROR] JavaScriptParser_ES3: ',msg);
		};
		
		MmirScriptBlockLexer.prototype.emitErrorMessage = function(msg) {
			parserPrintError('[ERROR] ScriptBlockLexer: ',msg);
		};
		MmirScriptBlockParser.prototype.emitErrorMessage = function(msg) {
			parserPrintError('[ERROR] ScriptBlockParser: ',msg);
		};
		
		MmirScriptStatementLexer.prototype.emitErrorMessage = function(msg) {
			parserPrintError('[ERROR] ScriptStatementLexer: ',msg);
		};
		MmirScriptStatementParser.prototype.emitErrorMessage = function(msg) {
			parserPrintError('[ERROR] ScriptStatementParser: ',msg);
		};
		
		MmirScriptContentLexer.prototype.emitErrorMessage = function(msg) {
			parserPrintError('[ERROR] ContentLexer: ',msg);
		};
		MmirScriptContentParser.prototype.emitErrorMessage = function(msg) {
			parserPrintError('[ERROR] ContentParser: ',msg);
		};
	}
}
//after initializing:
//  re-enable log-messages for parsing templates
console.log = consoleLogImpl;
console.debug = consoleDebugImpl;
//for ANT it makes no difference, if messages are written into the std-out or err-out
//		-> "normalize" messages into std-out 
//		(-> this avoids synchronization problems when both streams are displayed in same output stream)
console.info  = console.log;
console.warn  = console.log;
console.error = console.log;

console.log('------------------------------------------------ completed initialization ---------------------------');

// trigger parsing of templates:
mobileDS.ControllerManager.create(

	function afterLoadingControllers(ctrlManager){
	
		controllerManager = ctrlManager;
		

		isDebugOutput = true;
		
		//FIX: halt execution -> do not allow to continue, in case a template file could not be read!
		var isError = false;
		var originalAjax = $.ajax;
		$.ajax = function(options){
			var originalErrorFunc = options.error;
			options.error = function(exc){
				if(originalErrorFunc){
					originalErrorFunc(exc);
				}

//				console.log('Standalone-Template-Parser.ajax-shim: '+(exc.stack?exc.stack:exc));
//				throw(exc);
				isError = true;
			};
			return originalAjax(options);
		};
		
	    mobileDS.PresentationManager.getInstance();

		if(isError){
			throw(new Error('Encountered errors while reading templates files: abort parsing!'));
		}
	    
	    console.log('------------------------------------------------ finished parsing *.ehtml templates ---------------------------');
	}

);
