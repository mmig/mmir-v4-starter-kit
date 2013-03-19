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


var print = function(msg){//FIXME
	console.warn(msg);
};

var printInfo = function(prefix, msg){//FIXME
	console.log(prefix+msg);
};

/**
 * A Utility class for parsing (eHTML) templates.<br>
 * 
 * @example <code>mobileDS.ParserUtils.getInstance()</code>
 * @class ParserUtils
 * @category core
 */
mobileDS.parser.ParserUtils = (function(){
	

	var RENDER_MODE_LAYOUT 			= 0;
	var RENDER_MODE_PARTIAL 		= 2;
	var RENDER_MODE_VIEW_CONTENT 	= 4;
	var RENDER_MODE_VIEW_DIALOGS 	= 8;

    /**
     * Object containing the instance of the class ParserUtils 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance = null;
    
    var isDebug = true;//TODO read/set from configuration
    
    MmirTemplateLexer.prototype.emitErrorMessage = function(msg) {
		print('[ERROR] TemplateLexer: '+msg);
	};
//	MmirTemplateParser.prototype.emitErrorMessage = function(msg) {
//		print('[ERROR] TemplateParser: '+msg);
//	};
	
	ES3Lexer.prototype.emitErrorMessage = function(msg) {
		print('[ERROR] JavaScriptLexer_ES3: '+msg);
	};
	ES3Parser.prototype.emitErrorMessage = function(msg) {
		print('[ERROR] JavaScriptParser_ES3: '+msg);
	};
	
	MmirScriptBlockLexer.prototype.emitErrorMessage = function(msg) {
		print('[ERROR] ScriptBlockLexer: '+msg);
	};
	MmirScriptBlockParser.prototype.emitErrorMessage = function(msg) {
		print('[ERROR] ScriptBlockParser: '+msg);
	};
	
	MmirScriptStatementLexer.prototype.emitErrorMessage = function(msg) {
		print('[ERROR] ScriptStatementLexer: '+msg);
	};
	MmirScriptStatementParser.prototype.emitErrorMessage = function(msg) {
		print('[ERROR] ScriptStatementParser: '+msg);
	};
	
	MmirScriptContentLexer.prototype.emitErrorMessage = function(msg) {
		print('[ERROR] ContentLexer: '+msg);
	};
	MmirScriptContentParser.prototype.emitErrorMessage = function(msg) {
		print('[ERROR] ContentParser: '+msg);
	};
	
	var isArray = function(obj){
		
		//this is the initializer: the following will overwrite the isArray-function
		// with the appropriate version (use jQuery method, if present, otherwise use alternative)
		
		//if present, use jQuery method:
		if(typeof $ !== 'undefined'){
			isArray = $.isArray; 
		}
		else {
			//use the toString method with well-defined return-value from Object:
			var staticToString = Object.prototype.toString;
			
			isArray = function(obj){
				return staticToString.call(obj) === '[object Array]';
			};
		}
	};
	//initialize the isArray-function
	isArray();
	
	function internalParse(text) {
	    //text = text.replace(/\r\n?/g,"\n");
	    var input = new org.antlr.runtime.ANTLRStringStream(text);
	  	var lexer = new MmirTemplateLexer(input);
	  	
	  	lexer.isDebug = isDebug;
	  	
	  	var tokens = new org.antlr.runtime.CommonTokenStream(lexer);
		printInfo('TEXT_tokens',tokens);//FIXME debug
		var result 				= new Object();
		result.rawTemplateText 	= tokens.toString();
		result.scripts 			= lexer.includeScripts;
		result.styles 			= lexer.includeStyles;
		result.localizations 	= lexer.locales;
		result.ifs	 			= lexer.ifs;
		result.fors 			= lexer.fors;
		result.yields 			= lexer.yields;
		result.contentFors 		= lexer.yieldContents;
		result.helpers	 		= lexer.helpers;
		result.partials 		= lexer.renderPartials;
		//end: parsing results
		
		return result;
	}
	
    /**
	 * Constructor-Method of Class {@link mobileDS.ParserUtils}
	 * 
	 * @constructor
	 */
    function constructor(){
        //private members.
    	var localizer = mobileDS.LanguageManager.getInstance();

    	function renderLayout(result, contentForArray, renderingMode) {

    		//example for "rendering":
    		var all = result.scripts.concat(
    			result.styles, result.yields, result.localizations
    		);
    		
    		var sortAscByStart=function(parsedElem1, parsedElem2){
    			return parsedElem1.start - parsedElem2.start;
    		};
    		all.sort(sortAscByStart);
    		
    		var renderResult = new Array();
    		
    		var pos = 1;
    		for(var i=0, size = all.length; i < size; ++i){
    			
    			var scriptElem = all[i];
    			//render the "static" content, beginning from the 
    			//	lastly rendered "dynamic" element up to the start 
    			//  of the current "dynamic" element: 
    			renderResult.push(result.rawTemplateText.substring(pos-1, scriptElem.start));
    			
    			//render the current "dynamic" element:
    			var renderedElement = renderElement(scriptElem, contentForArray, renderingMode, result.rawTemplateText);
    			if(isArray(renderedElement)){
    				for(var r_i = 0, r_size = renderedElement.length; r_i < r_size; ++r_i){
    					renderResult.push(renderedElement[r_i]);
    				}
    			}
    			else {
        			renderResult.push(renderedElement);
    			}
    			
    			//set position-marker for "static" content after entry position
    			// of current "dynamic" element:
    			pos = scriptElem.end + 1;
    			
    			//alert('Replacing \n"'+rawTemplateText.substring(scriptElem.start, scriptElem.end)+'" with \n"'+content+'"');
    		}
    		
    		if(pos - 1 < result.rawTemplateText.length){
    			renderResult.push(result.rawTemplateText.substring(pos - 1));
    		}
    		
    		return renderResult.join('');
    	}
    	
    	function renderContent(htmlContentString, yieldDeclarationsArray, contentForArray, renderingMode, data) {

    		//TODO do this in the view-object? add parameter for enabling/disabling sorting?
    		var sortAscByStart=function(parsedElem1, parsedElem2){
    			return parsedElem1.start - parsedElem2.start;
    		};
    		yieldDeclarationsArray.sort(sortAscByStart);
    		
    		var renderResult = new Array();
    		
    		var pos = 1;
    		for(var i=0, size = yieldDeclarationsArray.length; i < size; ++i){
    			
    			var yieldDeclaration = yieldDeclarationsArray[i];
    			
    			if( 
    					(renderingMode === RENDER_MODE_VIEW_CONTENT && yieldDeclaration.getAreaType() !== Layout.prototype.CONTENT_AREA_BODY)
    				||	(renderingMode === RENDER_MODE_VIEW_DIALOGS && yieldDeclaration.getAreaType() !== Layout.prototype.CONTENT_AREA_DIALOGS)
    			){
    				continue;
    			}
    			
    			//render the "static" content, beginning from the 
    			//	lastly rendered "dynamic" element up to the start 
    			//  of the current "dynamic" element: 
    			renderResult.push(htmlContentString.substring(pos-1, yieldDeclaration.start));
    			
    			//render the current "dynamic" element:
//    			var renderedElement = 
    				renderYield(yieldDeclaration, contentForArray, renderingMode, htmlContentString, renderResult, data);
//    			if(isArray(renderedElement)){
//    				for(var r_i = 0, r_size = renderedElement.length; r_i < r_size; ++r_i){
//    					renderResult.push(renderedElement[r_i]);
//    				}
//    			}
//    			else {
//        			renderResult.push(renderedElement);
//    			}
    			
    			//set position-marker for "static" content after entry position
    			// of current "dynamic" element:
    			pos = yieldDeclaration.end + 1;
    			
    			//alert('Replacing \n"'+rawTemplateText.substring(yieldDeclaration.start, yieldDeclaration.end)+'" with \n"'+content+'"');
    		}
    		
    		if(pos - 1 < htmlContentString.length){
    			renderResult.push(htmlContentString.substring(pos - 1));
    		}
    		
    		return renderResult.join('');
    	}
    	
    	function renderElement(elem, contentForArray, renderingMode, rawTemplateText, data) {
    		var type = elem.type;
    		if(type === mobileDS.parser.element.INCLUDE_SCRIPT){
    			return renderIncludeScript(elem, renderingMode, rawTemplateText);
    		}
    		else if(type === mobileDS.parser.element.INCLUDE_STYLE){
    			return renderIncludeStyle(elem, renderingMode, rawTemplateText);
    		} 
    		else if(type === mobileDS.parser.element.LOCALIZE){
    			return renderLocalize(elem, renderingMode, rawTemplateText);
    		}
    		else if(type === mobileDS.parser.element.YIELD_DECLARATION){
    			return renderYield(elem, contentForArray, renderingMode, rawTemplateText, data);
    		}
    		
    		else if(type === mobileDS.parser.element.YIELD_CONTENT){
	    		//ignore: this should not be rendered itself, but instead its content should be rendered 
	    		//        in for the corresponding yield-declaration element.
    			console.warn('ParseUtil.renderElement: encountered YIELD_CONTENT for '+element.name+' -> this sould be handled by renderYieldDeclaration!');
    		}
    		
//    		else if(type === mobileDS.parser.element.BLOCK){
//    			
//    		}
//    		else if(type === mobileDS.parser.element.STATEMENT){
//    			
//    		}
    		else {
    			console.error('ParseUtil.renderElement: unknown element type -> '+type);
    			return null;
    		}
    	}
    	
    	function renderIncludeScript(elem, renderingMode, rawTemplateText){
    		return '<script  type="text/javascript" charset="utf-8" src="javascripts/'+elem.scriptPath+'.js"></script>';
    	}
    	
    	function renderIncludeStyle(elem, renderingMode, rawTemplateText){
    		return '<link rel="stylesheet" href="content/stylesheets/'+elem.stylePath+'.css" />';
    	}
    	
    	function renderLocalize(elem, renderingMode, rawTemplateText){
    		
    		if(RENDER_MODE_LAYOUT === renderingMode){
    			//TODO how to handle localizations in layout itself? (this would need re-rendering of layout during render-phase)
    			return rawTemplateText.substring(element.start, element.end);
    		}
    		
    		return localizer.getText(elem.name);
    	}
    	
    	function getContentForYield(name, contentForArray, renderingMode, rawTemplateText){
    		for(var i=0, size = contentForArray.length; i < size; ++i){
    			if(name === contentForArray[i].getName()){
    				return contentForArray[i];
    			}
    		}
    		return null;
    	}

    	function renderYield(element, contentForArray, renderingMode, rawTemplateText, renderingBuffer, data){
    		
    		if(RENDER_MODE_LAYOUT === renderingMode){
    			return rawTemplateText.substring(element.start, element.end);
    		}
    		else {
    		
	    		var contentFor = getContentForYield(element.name, contentForArray, renderingMode, rawTemplateText);
	    		if(!contentFor){
	    			console.warn('ParseUtil.renderYield: could not find content-definition for yield '+element.name);
	    			return '';
	    		}
	    		
	    		if(contentFor.hasDynamicContent()){
	    			return contentFor.toStrings(renderingBuffer, data);
	    		}
	    		else {
	    			if(renderingBuffer && isArray(renderingBuffer)){
	    				renderingBuffer.push(contentFor.getRawText());
	    			}
	    			return contentFor.getRawText();
	    		}

//	    		return contentFor.toHtml();
    		}
    	}
    	
    	//public members:
    	return {
    		parse: function(rawTemplateString){
    			return internalParse(rawTemplateString);
    		},
    		renderLayout: function(parseResult, contentForArray){
    			return renderLayout(parseResult, contentForArray, RENDER_MODE_LAYOUT);
    		},
    		renderViewContent: function(htmlContentString, yieldDeclarationsArray, contentForObjectsArray, data){
    			return renderContent(htmlContentString, yieldDeclarationsArray, contentForObjectsArray, RENDER_MODE_VIEW_CONTENT, data);
    		},
    		renderViewDialogs: function(htmlContentString, yieldDeclarationsArray, contentForObjectsArray, data){
    			return renderContent(htmlContentString, yieldDeclarationsArray, contentForObjectsArray, RENDER_MODE_VIEW_DIALOGS, data);
    		}
    	};
    }
    
    return {
        /**
         * Object containing the instance of the class {@link mobileDS.ParserUtils} 
         * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.ParserUtils}
         * @public
         */
        getInstance: function(){
            if (instance === null) {
                instance = constructor();
            }
            return instance;
        }
    };
    
    
})();