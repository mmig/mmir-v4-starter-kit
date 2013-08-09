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
 */
var mobileDS = window.mobileDS ||
{};

/**
 * The YieldDeclaration class holds the name of the yield-declaration (which is a place-holder for the contentFor-fields and is used in the layouts: content, header, footer, dialogs, ...)
 * and its starting and ending position within the content-definition.
 * 
 * @class YieldDeclaration
 * @constructor
 * @param {Object} parsingElement with properties <code>name</code> {String}, <code>start</code> {Integer}, <code>end</code> {Integer}
 * @param {Integer} contentAreaType the type of the content area within the layout that this yield-declaration refers to (e.g. Layout.CONTENT_AREA_BODY )
 * @category core
 */ 
function YieldDeclaration(parsingElement, contentAreaType){
	
	this.name     = parsingElement.name;
	this.nameType = parsingElement.nameType;

	this.getValue = parsingElement.getValue;
	
	this.start    = parsingElement.start;
	this.end      = parsingElement.end;
	
	this.contentAreaType = contentAreaType;
    
	return this;
}


/**
 * Gets the name of a {@link mobileDS.YieldDeclaration} object (e.g. content, header, footer, dialogs, ...).
 * 
 * @function getName
 * @returns {String} Name - used by yield tags in layout
 * @public
 */ 
YieldDeclaration.prototype.getName = function(){
    return this.name;
};

YieldDeclaration.prototype.getNameType = function(){
    return this.nameType;
};

/**
 * Gets the type of the content area that this {@link mobileDS.YieldDeclaration} object refers to (i.e. "areas" in the layout, e.g. bodyContents, dialogsContent).
 * 
 * @function getAreaType
 * @returns {Integer} Content area type (see {@link mobileDS.Layout}, e.g. Layout.CONTENT_AREA_BODY)
 * @public
 */ 
YieldDeclaration.prototype.getAreaType = function(){
    return this.contentAreaType;
};

/**
 * Gets the start position (index) of a {@link mobileDS.YieldDeclaration} object.
 * 
 * @function getStart
 * @returns {Integer} Start position of the Yield within the content (e.g. the bodyContent or the dialogsContent)
 * @public
 */ 
YieldDeclaration.prototype.getStart = function(){
    return this.start;
};

/**
 * Gets the end position (index) of a {@link mobileDS.YieldDeclaration} object.
 * 
 * @function getEnd
 * @returns {Integer} End position of the Yield within the content (e.g. the bodyContent or the dialogsContent)
 * @public
 */ 
YieldDeclaration.prototype.getEnd = function(){
    return this.end;
};
