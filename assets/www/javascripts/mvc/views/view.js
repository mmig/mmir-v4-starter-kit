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
 * @module mobileDS.javascripts.mvc.views
 * 
 */
var mobileDS = window.mobileDS ||
{};


/**
 * The View class is a kind of interface-class which gives access to the methods and data of a helper (which itself belongs to a controller)<br>
 * Apart from initialising some properties, the constructor also parses the view description and looks for needed helper methods.
 * 
 * @class View
 * @constructor
 * @param {Object} ctrl Controller instance / object
 * @param {String} name Name of the View 
 * @param {String} definition View description
 * @category core
 */
function View(ctrl, name, definition){
    
//	console.log("[View] '" + name + "' loaded.");
    // remove HTML comments from View
    definition = definition.replace(mobileDS.CommonUtils.getInstance().html_comment_regex, '');//remove HTML comments!  .replace(HTMLCommentRegExp,"");
	
    /**
     * The controller to which this view belongs.
     * 
     * @property controller
     * @type Object
     * @public
     */
    this.controller = ctrl;
	
    /**
     * The description of the view in eHTML.
     * 
     * @property def
     * @type String
     * @public
     */
    this.def = definition;
	
    /**
     * The name of the view.
     * 
     * @property name
     * @type String
     * @public
     */
    this.name = name.toLowerCase();
   
	
    /**
     * An array of all the views {@link mobileDS.ContentFor} objects.<br>
     * 
     * @property contentFors
     * @type Array
     * @public
     */
    this.contentFors = new Array();
   
	
    /**
     * An array of all names of the for the view required helper methods.
     * 
     * @property helperMethods
     * @type Array
     * @public
     */
    this.helperMethods = new Array();
    

    var parser = mobileDS.parser.ParserUtils.getInstance();
    
    
    var parseResult = parser.parse(this.def);
    
    //TODO handle scripts (BLOCK, STATEMENTS) -> this.helperMethods
    
    for(var i=0, size = parseResult.contentFors.length; i < size ; ++i){
    	this.contentFors.push(new ContentFor(parseResult.contentFors[i], this.controller, parser));
    }
    
}


/**
 * Executes all helper methods that were specified / referenced in the view; with **data** as parameter.
 * 
 * @function executeHelperMethods
 * @param {Object} data Parameter to pass to the helper methods
 */
View.prototype.executeHelperMethods = function(data){
	var self = this;
	
	$.each(self.getHelperMethods(), function(index, h_method){
		//if(index == self.getHelperMethods().length -1){
		//	console.log("calling an action in view  : " + h_method );
		//	self.controller.performHelperAction(h_method, data, mobileDS.PresentationManager.getInstance().render_view_successor(self.controller.getName(), self.name, self, self.controller));
		//	console.log("action berformed : " + h_method);
		//}else{
			self.controller.performHelperAction(h_method, data);
		//}
	
	});
};


/**
 * Gets the definition of a view.
 * 
 * @function getDefinition
 * @returns {String} The view description string
 */
View.prototype.getDefinition = function(){
    return this.def;
};


/**
 * Gets the name of a view. 
 * 
 * @function getName
 * @returns {String} The name of the view
 */
View.prototype.getName = function(){
    return this.name;
};


/**
 * Gets a specific {@link mobileDS.ContentFor} object by name. 
 * 
 * @function getContentFor
 * @param {String} name Name of the ContentFor object
 * @returns {object} The wanted ContentFor object or null
 */
View.prototype.getContentFor = function( name){
    var result = null;
	//this.controller = ctrl;
    $.each(this.contentFors, function(index, content){
    
        if (content.getName() == name) {
            result = content;
        }
    });
    return result;
};


/**
 * Gets an array of all helper methods. 
 * 
 * @function getHelperMethods
 * @returns {Array} Array of all helper methods
 */
View.prototype.getHelperMethods = function(){
	return this.helperMethods;
};


/**
 * The ContentFor class holds the name of the content-field (used via the yield-tag in the layouts: content, header, footer, dialogs, ...)
 * and its definition as HTML-String.
 * 
 * @class ContentFor
 * @constructor
 * @param {Array} group or {Object} with properties <code>name</code> {String}, and <code>content</code> {String}
 * @param {Object} controller the controller of the view that owns this ContentFor-element 
 * @param {Object} parser for the the content (optional) if supplied this object must have a function <code>parse({String})</code> (see templateParseUtil)
 * @category core
 */ 
function ContentFor(group, controller, parser){
	
	this.localizer = mobileDS.LanguageManager.getInstance();
	
	this.controller = controller;
	
	if(typeof group.name !== 'undefined' && typeof group.content !== 'undefined'){
		this.name = group.name;
		this.definition = group.content;
	}
	else {
		this.name = group[1];
	    this.definition = group[2];
	}
	
	var parsingResult = parser.parse(this.definition);
	
	this.definition 	= parsingResult.rawTemplateText;
	this.localizations 	= parsingResult.localizations;
	this.helpers		= parsingResult.helpers;
	
	this.allContentElements = null;
	
	//TODO enable this (recursive contentFors; and something similar for  for-/if- etc. contents...)
//	this.contentFors = new Array();
//	var contentDefs  = parsingResult.yieldContents;
//	for(var i=0, size = contentDefs.length; i < size; ++i){
//		this.contentFors.push(new ContentFor(contentDefs[i], parser));
//	}
	
	//TODO create ALL array and sort localizations, contentFors etc. ...
//	var sortAscByStart=function(parsedElem1, parsedElem2){
//		return parsedElem1.start - parsedElem2.start;
//	};
//	all.sort(sortAscByStart);
	
    return this;
}


/**
 * Gets the name of a {@link mobileDS.ContentFor} object (content, header, footer, dialogs, ...).
 * 
 * @function getName
 * @returns {String} Name - used by yield tags in layout
 * @public
 */ 
ContentFor.prototype.getName = function(){
    return this.name;
};


/**
 * Gets the definition of a {@link mobileDS.ContentFor} object.
 * 
 * TODO remove this?
 * 
 * @function toHtml
 * @returns {String} The HTML content.
 * @public
 */
ContentFor.prototype.toHtml = function(){
//	return this.definition;
	return this.toStrings().join('');
};

/**
 * Renders this object into the renderingBuffer.
 * 
 * @param renderingBuffer {Array} of Strings (if <code>null</code> a new buffer will be created)
 * @param data {Any} (optional) the event data with which the rendering was invoked
 * @returns {Array} of Strings the renderingBuffer with the contents of this object added at the end
 */
ContentFor.prototype.toStrings = function(renderingBuffer, data){

	if(this.allContentElements == null){
		
		this.allContentElements = this.localizations.concat(this.helpers);//TODO also add other parsed-elements
		
		var sortAscByStart=function(parsedElem1, parsedElem2){
			return parsedElem1.start - parsedElem2.start;
		};
		
		this.allContentElements.sort(sortAscByStart);
	}
	
	var renderResult = renderingBuffer;
	if(!renderResult){
		renderResult = new Array();
	}
	
	var pos = 1;
	for(var i=0, size = this.allContentElements.length; i < size; ++i){
		
		var contentElement = this.allContentElements[i];
				
		//render the "static" content, beginning from the 
		//	lastly rendered "dynamic" element up to the start 
		//  of the current "dynamic" element: 
		renderResult.push(this.definition.substring(pos-1, contentElement.start));
		
		//render the current "dynamic" element:
//		if(contentElement is localization)...
		var text = this.doGetStringForElement(contentElement, data);
		renderResult.push(text);
//		else if(contentElement is ...)
		
		//set position-marker for "static" content after entry position
		// of current "dynamic" element:
		pos = contentElement.end + 1;
		
		//alert('Replacing \n"'+rawTemplateText.substring(contentElement.start, contentElement.end)+'" with \n"'+content+'"');
	}
	
	if(pos - 1 < this.definition.length){
		if(pos === 1){
			renderResult.push(this.definition);
		}
		else {
			renderResult.push(this.definition.substring(pos-1));
		}
	}
	
	return renderResult;
};

/** @private */
ContentFor.prototype.doGetStringForElement = function(element, data){
	
	if(element.type === mobileDS.parser.element.LOCALIZE){
		return this.doGetStringForLocalize(element, data);
	}
	else if(element.type === mobileDS.parser.element.HELPER){
		return this.doGetStringForHelper(element, data);
	}
	else {
		console.warn('ContentFor.doGetStringForElement: unknown element type '+element.type);
		return '';
	}
};

/** @private */
ContentFor.prototype.doGetStringForLocalize = function(localizeElement, data){
	var text = this.localizer.getText(localizeElement.name);
	if(!text){
		console.warn('ContentFor.render(localize): could not find localization text for "'+contentElement.name+'"');
		text = '';
	}
	return text;
};

/** @private */
ContentFor.prototype.doGetStringForHelper = function(helperElement, data){
	//TODO handle case, when .helper is not a String
	//TODO handle arguments for helper
	var text = this.controller.performHelperAction(helperElement.helper, data);
	if(!text){
		console.warn('ContentFor.render(helper): no result for helper >'+helperElement.helper+'<');
		text = '';
	}
	return text.toString();
};

ContentFor.prototype.getRawText = function(){
    return this.definition;
};

ContentFor.prototype.hasDynamicContent = function(){
    return (this.localizations && this.localizations.length > 0)
    		|| (this.helpers && this.helpers.length > 0);//TODO if ContentFor supports more dynamic (e.g. child-ContentFor objects, For-Loops ...) then add appropriate checks here! 
};

ContentFor.prototype.getLocalizations = function(){
    return this.localizations;
};
