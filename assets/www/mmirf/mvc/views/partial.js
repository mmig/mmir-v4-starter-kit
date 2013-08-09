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
 * @module mobileDS.mvc.views
 * 
 */
var mobileDS = window.mobileDS ||
{};

/**
 * The Partial class is a containing the definition of the partial and methods to access the definition.
 * 
 * @class Partial
 * @constructor
 * @param {Object} ctrl Controller instance / object
 * @param {String} name Name of the Partial 
 * @param {String} definition Partial description
 * @category core
 */
function Partial(ctrl, name, definition){
//    var HTMLCommentRegExp = /<!--[\s\S]*?-->/g;
    
	definition = definition.replace(mobileDS.CommonUtils.getInstance().regexHTMLComment, '');//remove HTML comments!  .replace(HTMLCommentRegExp,"");
    this.controller = ctrl;
    this.def = definition;
    this.name = name;
//    console.log("[Partial] parsed Partial '" +this.controller + "-"+this.name+ "'.");
    
    var parser = mobileDS.parser.ParserUtils.getInstance();
    var renderer = mobileDS.parser.RenderUtils.getInstance();
    
    var contentElementInfo = {
    		//this name is purely informational:
    		name : this.controller.getName() + 'Partial',
    		content : this.def
    	};
    this.contentElement = new ContentElement(contentElementInfo, this, parser, renderer);
}

/**
 * Gets the definition of a partial.
 * 
 * @function getDefinition
 * @returns {String} The partial description string
 */
Partial.prototype.getDefinition = function(){
    return this.def;
};

/**
 * Gets the name of a partial. 
 * 
 * @function getName
 * @returns {String} The name of the partial
 */
Partial.prototype.getName = function(){
	return this.name;
};

/**
 * Gets the controller of a partial - each partial is assigned to a specific controller, although they can be used from different controllers.
 * 
 * @function getController
 * @returns {Object} The controller of the partial
 */
Partial.prototype.getController = function(){
    return this.controller;
};

/**
 * Gets the {@link mobileDS.ContentElement}, i.e. the content that this instance represents.
 * 
 * @function getContentElement
 * @returns {mobileDS.ContentElement} The ContentElement object
 */
Partial.prototype.getContentElement = function(){
    return this.contentElement;
};