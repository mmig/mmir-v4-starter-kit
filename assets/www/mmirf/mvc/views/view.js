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
    definition = definition.replace(mobileDS.CommonUtils.getInstance().regexHTMLComment, '');//remove HTML comments!  .replace(HTMLCommentRegExp,"");
	
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
    this.name = name;
   
	
    /**
     * An array of all the views {@link mobileDS.ContentElement} objects.<br>
     * 
     * @property contentFors
     * @type Array
     * @public
     */
    this.contentFors = new Array();
   
	
    /**
     *
     * An array of all names of the for the view required helper methods.
     * 
     * @deprecated helper methods must now explicitly called in template definition (using syntax <code>@helper(name,args)</code>)
     * 
     * @property helperMethods
     * @type Array
     * @public
     */
    this.helperMethods = new Array();
    

    var parser = mobileDS.parser.ParserUtils.getInstance();
    var renderer = mobileDS.parser.RenderUtils.getInstance();
    
    
    var parseResult = parser.parse(this.def, this);
    
    for(var i=0, size = parseResult.contentFors.length; i < size ; ++i){
    	this.contentFors.push(new ContentElement(parseResult.contentFors[i], this, parser, renderer));
    }
    
}


/**
 * Executes all helper methods that were specified / referenced in the view; with **data** as parameter.
 * 
 * @deprecated helper methods must now explicitly called in template definition (using syntax <code>@helper(name,args)</code>)
 * 
 * @function executeHelperMethods
 * @param {Object} data Parameter to pass to the helper methods
 */
View.prototype.executeHelperMethods = function(data){
	for(var i=0, size = this.getHelperMethods().length; i < size ; ++i){
		this.controller.performHelper(this.getHelperMethods()[i], data);
    }
//	var self = this;
//	$.each(self.getHelperMethods(), function(index, h_method){
//		//if(index == self.getHelperMethods().length -1){
//		//	console.log("calling an action in view  : " + h_method );
//		//	self.controller.performHelper(h_method, data, mobileDS.PresentationManager.getInstance().doRenderView(self.controller.getName(), self.name, self, self.controller));
//		//	console.log("action berformed : " + h_method);
//		//}else{
//			self.controller.performHelper(h_method, data);
//		//}
//	
//	});
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
 * Gets the name of a view. 
 * 
 * @function getController
 * @returns {Object} The controller for the view
 */
View.prototype.getController = function(){
    return this.controller;
};


/**
 * Gets a specific {@link mobileDS.ContentElement} object by name. 
 * 
 * @function getContentElement
 * @param {String} name Name of the ContentElement object
 * @returns {object} The wanted ContentElement object or null
 */
View.prototype.getContentElement = function( name){
//    var result = null;
//	//this.controller = ctrl;
//    $.each(this.contentFors, function(index, content){
//    
//        if (content.getName() == name) {
//            result = content;
//        }
//    });
//    return result;
    
    for(var i=0, size = this.contentFors.length; i < size ; ++i){
    	if(this.contentFors[i].getName() == name){
    		return this.contentFors[i];/////////////////////// EARLY EXIT /////////////////////////////
    	}
    }
    return null;
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
