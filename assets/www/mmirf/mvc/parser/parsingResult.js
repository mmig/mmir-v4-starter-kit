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
 * Dependencies:
 * 
 *  * mobileDS.parser.element (parseElementTypes.js)
 *  * ANTLR TokenStream (antlr3-all.js)
 * 
 * @module mobileDS.tools
 * 
 */
var mobileDS = window.mobileDS || {};
mobileDS.parser = mobileDS.parser || {};

/**
 * ParsingResult represents an element that was detected during parsing.
 * 
 * The detected element is referenced by the properties <code>start</code> and <code>end</code>
 * that refer to the start-index and end-index within the parsed text.
 * 
 * The ParsingResult has a <code>type</code> property which refers to the kind of element
 * that was detected (see constants in mobileDS.parser.element).
 * 
 * In addition the ParsingResult may have several properties that depend of its type. In general,
 * these properties refer to detected parts of the element (e.g. for a invocation-statement, these
 * may refer to its arguments).
 * 
 * @class ParsingResult
 * @param {org.antlr.runtime.CommonTokenStream} thetokens (optional) the TokenStream that corresponds to this parsed element;
 * 												when provided, the TokenStream is used to set the start- and end-
 * 												property of the new instance.
 * 		  {org.antlr.runtime.Token} thetokens (optional) if the parameter is a single Token object, then the start- and end-
 * 												property for the new instance is set by this token object
 * 
 * @category parser
 */
mobileDS.parser.ParsingResult = function (thetokens){
	var isSet = false;
	
	//try to extract start-/end-indexes from the argument:
	if(thetokens){
		//NOTE: must invoke getTokens() for initializing size() etc.!
		if(thetokens instanceof org.antlr.runtime.CommonTokenStream && thetokens.getTokens() && thetokens.size() > 0){
			this.start = thetokens.getTokens()[0].getStartIndex();
			this.end = thetokens.getTokens()[thetokens.size()-1].getStopIndex();
			
			isSet = true;
		}
		else if(thetokens instanceof org.antlr.runtime.CommonToken || thetokens instanceof org.antlr.runtime.Token){
			this.start = thetokens.getStartIndex();
			this.end = thetokens.getStopIndex();
						
			isSet = true;
		}
		else if(typeof thetokens.getToken !== 'undefined' && (typeof thetokens.getToken().getStartIndex !== 'undefined' && typeof thetokens.getToken().getStopIndex !== 'undefined')){
			this.start = thetokens.getToken().getStartIndex();
			this.end = thetokens.getToken().getStopIndex();
						
			isSet = true;
		}
		else if(typeof thetokens.getStartIndex !== 'undefined' && typeof thetokens.getStopIndex !== 'undefined'){
			this.start = thetokens.getStartIndex();
			this.end = thetokens.getStopIndex();
						
			isSet = true;
		}
		else {
			var type = Object.prototype.toString.call(thetokens);//.match(/^\[object (.*)\]$/)[1];
			console.warn('unknown argument type: '+type);//debug
		}
	}
	
	if(isSet === false) {
		this.start = -1;
		this.end   = -1;
	}
};

/**
 * Set the start position (index) for this parsed element with regard to the TokenStream of the complete input.
 * 
 * @function setStartFrom
 * @param {org.antlr.runtime.CommonTokenStream} thetokens (optional) the TokenStream that corresponds to this parsed element;
 * 												when provided, the TokenStream is used to set the start-property of this object.
 * 
 * @public
 */
mobileDS.parser.ParsingResult.prototype.setStartFrom = function(thetokens){
	//NOTE: must invoke getTokens() for initializing size() etc.!
	if(thetokens.getTokens() && thetokens.size() > 0){
		this.start = thetokens.getTokens()[0].getStartIndex();
	} 
	else {
		this.start = -1;
	}
};

/**
 * Set the end position (index) for this parsed element with regard to the TokenStream of the complete input.
 * 
 * @function setEndFrom
 * @param {org.antlr.runtime.CommonTokenStream} thetokens (optional) the TokenStream that corresponds to this parsed element;
 * 												when provided, the TokenStream is used to set the end-property of this object.
 * 
 * @public
 */
mobileDS.parser.ParsingResult.prototype.setEndFrom = function(thetokens){
	//NOTE: must invoke getTokens() for initializing size() etc.!
	if(thetokens.getTokens() && thetokens.size() > 0){
		this.end = thetokens.getTokens()[thetokens.size()-1].getStopIndex();
	} 
	else {
		this.end = -1;
	}
};
mobileDS.parser.ParsingResult.prototype.getStart = function(){
	return this.start;
};
mobileDS.parser.ParsingResult.prototype.getEnd = function(){
	return this.end;
};

/**
 * Get the type of this parsed element, i.e. as which type this element was parsed.
 * 
 * The type corresponds to one of the type defined in {mobileDS.parser.element}.
 * 
 * @function setEndFrom
 * @return {mobileDS.parser.element} the type for this ParsingResult
 * 
 * @public
 */
mobileDS.parser.ParsingResult.prototype.getType = function(){
	return this.type;
};

//helper function for converting properties to the correct value.
// By default, the ParsingResult only contains "raw" property values.
// Which properties are available, depends on the type of the ParsingResult (see templateProcessor.js)
mobileDS.parser.ParsingResult.prototype.getValue = function(rawPropertyValue, proptertyType, data){
	
	if(proptertyType === 'StringLiteral'){
		return rawPropertyValue.substring(1, rawPropertyValue.length-1);
	}
	else if(proptertyType === 'Identifier'){
		return data['@' + rawPropertyValue];
	}
	else if(proptertyType === 'IdentifierNameAmpersatStart'){
		return data[rawPropertyValue];
	}
	else if(proptertyType === 'OBJECT'){
		return rawPropertyValue;//TODO
	}
	else if(proptertyType === 'DecimalLiteral'){
		return parseFloat(rawPropertyValue);
	}
//	else if(typeof proptertyType === 'undefined'){
//		return rawPropertyValue;
//	}
	else
		return rawPropertyValue;
};

mobileDS.parser.ParsingResult.prototype.hasVarReferences = function(){
	return false;//TODO implement this
};

mobileDS.parser.ParsingResult.prototype.isScriptTag = function(){
	if( mobileDS.parser.element.INCLUDE_SCRIPT === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isStyleTag = function(){
	if( mobileDS.parser.element.INCLUDE_STYLE === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isLocalize = function(){
	if( mobileDS.parser.element.LOCALIZE === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isYield = function(){
	if( mobileDS.parser.element.YIELD_DECLARATION === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isYieldContent = function(){
	if( mobileDS.parser.element.YIELD_CONTENT === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isScriptBlock = function(){
	if( mobileDS.parser.element.BLOCK === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isScriptStatement = function(){
	if( mobileDS.parser.element.STATEMENT === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isHelper = function(){
	if( mobileDS.parser.element.HELPER === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isIf = function(){
	if( mobileDS.parser.element.IF === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.hasElse = function(){
	if(this.isIf() && typeof this.elseContent != 'undefined'){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isElse = function(){
	if( mobileDS.parser.element.ELSE === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isFor = function(){
	if( mobileDS.parser.element.FOR === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isRender = function(){
	if( mobileDS.parser.element.RENDER === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isEscapeEnter = function(){
	if( mobileDS.parser.element.ESCAPE_ENTER === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isEscapeExit = function(){
	if( mobileDS.parser.element.ESCAPE_EXIT === this.getType() ){
		return true;
	}
	return false;
};

mobileDS.parser.ParsingResult.prototype.isEscape = function(){
	return this.isEscapeEnter() || this.isEscapeExit();
};
