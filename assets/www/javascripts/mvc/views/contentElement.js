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
 * The ContentElement class holds the name of the content-field (used via the yield-tag in the layouts: content, header, footer, dialogs, ...)
 * and its definition as HTML-String.
 * 
 * @class ContentElement
 * 
 * @param {Array} group or {Object} with properties <code>name</code> {String}, and <code>content</code> {String}
 * @param {Object} view the view that owns this ContentElement-element 
 * @param {Object} parser for the the content (optional) if supplied this object must have a function <code>parse({String})</code> (see templateParseUtil)
 * @param {Object} renderer for the the content (optional) if supplied, a <code>parser</code> must also be supplied; the renderer must have a function <code>parse({String})</code> (see templateRenderUtil)
 * @category core
 */
function ContentElement(group, view, parser, renderer){
	
	//TODO externalize as constant
	var SUB_ELEMENT_NAME = "@fragment";
	
	this.localizer  = mobileDS.LanguageManager.getInstance();
	this.parser     = parser;
	this.renderer   = renderer;
	this.view       = view;
	
	if(typeof group.name !== 'undefined' && typeof group.content !== 'undefined'){
		this.name = group.name;
		
		//check if the name needs to be converted from a "raw" value:
		if(typeof group.getValue === 'function' && typeof group.nameType !== 'undefined'){
			this.name = group.getValue(this.name, group.nameType, null);
		}
		
		this.definition = group.content;
	}
	else {
		this.name = group[1];
	    this.definition = group[2];
	}
	
	var parsingResult = parser.parse(this.definition, this.view);
	
	this.definition 	= parsingResult.rawTemplateText;
	
	this.localizations 	= parsingResult.localizations;
	this.escapes        = parsingResult.escapes;
	
	this.helpers		= parsingResult.helpers;

	this.scriptBlocks     = parsingResult.scriptBlocks;
	this.scriptStatements = parsingResult.scriptStatements;
////	this.includeScripts   = parsingResult.includeScripts;
////	this.includeStyles    = parsingResult.includeStyles;
	this.partials         = parsingResult.partials;
	
	this.ifs              = parsingResult.ifs;
	this.fors             = parsingResult.fors;
	
	this.vars             = parsingResult.vars;

	this.comments         = parsingResult.comments;
	
//	this.yields           = parsingResult.yields;
//	this.contentFors    = parsingResult.contentFors;
	
	//create ALL array and sort localizations etc. ...
	var all = this.localizations.concat(
			this.escapes, 
			this.helpers,
			this.scriptBlocks,
			this.scriptStatements,
////			this.includeScripts,
////			this.includeStyles,
			this.partials,
			this.ifs,
			this.fors,
			this.vars,
			this.comments//,
//			this.yields,
//			this.contentFors
	);
	
	//sorting function -> sort elements by occurrence in raw template text
	var sortAscByStart=function(parsedElem1, parsedElem2){
		return parsedElem1.getStart() - parsedElem2.getStart();
	};
	all.sort(sortAscByStart);

	this.allContentElements = all;
	
	var checkHasDynamicContent = function(contentElement){
		return	(contentElement.localizations 		&& contentElement.localizations.length 		> 0)
			|| 	(contentElement.helpers 			&& contentElement.helpers.length 			> 0)
			|| 	(contentElement.scriptBlocks 		&& contentElement.scriptBlocks.length 		> 0)
			|| 	(contentElement.scriptStatements 	&& contentElement.scriptStatements.length 	> 0)
			|| 	(contentElement.partials 			&& contentElement.partials.length 			> 0)
			|| 	(contentElement.ifs 				&& contentElement.ifs.length 				> 0)
			|| 	(contentElement.fors 				&& contentElement.fors.length 				> 0)
			|| 	(contentElement.vars 				&& contentElement.vars.length 				> 0)
		;//TODO if ContentElement supports more dynamic elements (e.g. child-ContentElement objects, For-Loops ...) then add appropriate checks here!
	};
	
	//"buffered" field that signifies if this ContentElement has dynamic content
	// (--> i.e. has to be evaluated on each rendering, or -if not- can be statically rendered once)
	this.internalHasDynamicContent = checkHasDynamicContent(this);
	
	
	//this creates a function for embedded JavaScript code:
	//	using a function pre-compiles codes, in order to avoid parsing the code  
	//  (by execution environment) each time the template is rendered
	var createJSEvalFunction = function(strFuncBody, strFuncName){
		
		//COMMENT: using new Function(..) may yield less performance than eval('function...'), 
		//         since the function-body using the Function(..)-method is re-evaluated on each invocation
		//         whereas when the eval('function...')-method behaves as if the function was declared statically 
		//         like a normal function-expression (after its first evaluation here).
		//
//		var func = new Function(mobileDS.parser.element.DATA_NAME, strFuncBody);
//		func.name = strFuncName;
		
		//NOTE: need a dummy variable to catch and return the create function-definition in the eval-statement
		//      (the awkward 'var dummy=...;dummy'-construction avoids leaking the dummy-var into the 
		//       global name-space, where the last ';dummy' represent the the return-statement for eval(..) )
		var func = eval( 'var dummy=function '+strFuncName+'('+mobileDS.parser.element.DATA_NAME+'){'+strFuncBody+'};dummy' );
		
		return func;
	};
	
	//init iter-variables
	var i=0,size=0;
	var parsedJS = null, preparedJSCode = null, forPropNameRef = null, forListNameRef = null;
	var forIterInit = null, forIterFunc = null;
	var renderPartialsElement = null, helperElement = null, ifElement = null, forElement = null, subContentElement = null;
	
	//prepare render-partial-elements
	for(i=0, size = this.partials.length; i < size; ++i){
		renderPartialsElement = this.partials[i];
		
		//for @render(ctrl,name, DATA):
		//  initialize the DATA-argument, if present:
		if(typeof renderPartialsElement.dataPos !== 'undefined'){
			//TODO use original parser/results instead of additional parsing pass
			parsedJS = parser.parseJS( 
				this.definition.substring( renderPartialsElement.dataPos.getStart(),  renderPartialsElement.dataPos.getEnd() ),
				this.getView()
			);
			preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);
			renderPartialsElement.argsEval = createJSEvalFunction('return ('+preparedJSCode+');', 'argsEval');
		}
	}
	
	//prepare helper-elements
	for(i=0, size = this.helpers.length; i < size; ++i){
		helperElement = this.helpers[i];
		
		//for @helper(name, DATA):
		//  initialize the DATA-argument, if present:
		if(typeof helperElement.dataPos !== 'undefined'){
			//TODO use original parser/results instead of additional parsing pass
			parsedJS = parser.parseJS( 
				this.definition.substring( helperElement.dataPos.getStart(),  helperElement.dataPos.getEnd() ),
				this.getView()
			);
			preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);
			helperElement.argsEval = createJSEvalFunction('return ('+preparedJSCode+');', 'argsEval');
		}
	}
	
	//prepare if-elements
	for(i=0, size = this.ifs.length; i < size; ++i){
		ifElement = this.ifs[i];
		
		//TODO use original parser/results instead of additional parsing pass
		parsedJS = parser.parseJS(ifElement.ifExpr, this.getView());
		preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences);
		ifElement.ifEval = createJSEvalFunction('return ('+preparedJSCode+');', 'ifEval');
	}
	
	//prepare for-elements
	for(i=0, size = this.fors.length; i < size; ++i){
		forElement = this.fors[i];

		if(forElement.forControlType === 'FORITER'){

//			forElement.forIterationExpr = ...;
//			forElement.forObjectExpr    = ...;

			forPropNameRef = forElement.forControlVarPos[0];
			forListNameRef = forElement.forControlVarPos[1];
			
			forElement.forPropName = this.definition.substring(forPropNameRef.getStart(), forPropNameRef.getEnd());
			forElement.forListName = this.definition.substring(forListNameRef.getStart(), forListNameRef.getEnd());
			
			//prepend variable-names with template-var-prefix if necessary:
			if( ! forElement.forPropName.startsWith('@')){
				forElement.forPropName = '@' + forElement.forPropName;
			}
			if( ! forElement.forListName.startsWith('@')){
				forElement.forListName = '@' + forElement.forListName;
			}
			
			forElement.forIterPos = null;
			
			if(!forIterInit){
				
				//the forIteration-function creates a list of all property names for the variable 
				// given in the FORITER statement
				
				forIterInit = function (data) {
					//TODO implement this using iteration-functionality of JavaScript (-> yield)
					var list = new Array(); 
					for(var theProp in data[this.forListName]){
						list.push(theProp);
					}
					return list;
				};
				
				//creates an iterator for the property-list:
				forIterFunc = function (data) {
					var iterList = this.forInitEval(data);
					var iterIndex = 0;
					return {
						hasNext : function(){
							return iterList.length > iterIndex;
						},
						next : function(){
							return iterList[iterIndex++];
						}
					};
				};
			}
			
			forElement.forInitEval = forIterInit;
			forElement.forIterator = forIterFunc;
		}
		else {
			
			//TODO use original parser/results instead of additional parsing pass
			parsedJS = parser.parseJS(forElement.forInitExpr, this.getView());
			preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);
			forElement.forInitEval = createJSEvalFunction(preparedJSCode+';', 'forInitEval');
			
			parsedJS = parser.parseJS(forElement.forConditionExpr, this.getView());
			preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);
			forElement.forConditionEval = createJSEvalFunction('return ('+preparedJSCode+');', 'forConditionEval');
			
			parsedJS = parser.parseJS(forElement.forIncrementExpr, this.getView());
			preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences, true);
			forElement.forIncrementEval = createJSEvalFunction(preparedJSCode+';', 'forIncrementEval');
		}
	}
	
	//recursively parse content-fields:
	for(i=0, size = all.length; i < size; ++i){
		subContentElement = all[i];
		
		if(typeof subContentElement.scriptContent === 'string'){
			
			var isScriptStatement = subContentElement.isScriptStatement();
			
			var parsedJS; 
			if(isScriptStatement===true){
				parsedJS = parser.parseJS(subContentElement.scriptContent, 'embeddedStatementTail', this.getView());
			}
			else {
				parsedJS = parser.parseJS(subContentElement.scriptContent, this.getView());
			}
			
			subContentElement.scriptContent = parsedJS;
			
			preparedJSCode = renderer.renderJS(parsedJS.rawTemplateText, parsedJS.varReferences); 
			
			if(isScriptStatement===true){
				preparedJSCode = 'return ('+preparedJSCode+');';
			}
			subContentElement.scriptEval = createJSEvalFunction(preparedJSCode, 'scriptEval');
			
			this.internalHasDynamicContent = true;
		}
		
		if(typeof subContentElement.content === 'string'){
			subContentElement.content = new ContentElement({name: SUB_ELEMENT_NAME, content: subContentElement.content}, view, parser, renderer);
			
			this.internalHasDynamicContent = this.internalHasDynamicContent || subContentElement.content.hasDynamicContent();
		}
		
		//IF-elements can have an additional ELSE-content field:
		if(subContentElement.hasElse() && typeof subContentElement.elseContent.content === 'string'){
			subContentElement.elseContent.content = new ContentElement({name: SUB_ELEMENT_NAME, content: subContentElement.elseContent.content}, view, parser, renderer);

			this.internalHasDynamicContent = this.internalHasDynamicContent || subContentElement.elseContent.content.hasDynamicContent();
		}
	}
	
    return this;
}


/**
 * Gets the name of a {@link mobileDS.ContentElement} object (content, header, footer, dialogs, ...).
 * 
 * @function getName
 * @returns {String} Name - used by yield tags in layout
 * @public
 */ 
ContentElement.prototype.getName = function(){
    return this.name;
};

/**
 * Gets the owner for this ContentElement, i.e. the {@link mobileDS.View} object.
 * 
 * @function getView
 * @returns {mobileDS.View} the owning View
 * @public
 */ 
ContentElement.prototype.getView = function(){
    return this.view;
};

/**
 * Gets the controller for this ContentElement.
 * 
 * @function getName
 * @returns {mobileDS.Controller} the Controller of the owning view
 * @public
 */ 
ContentElement.prototype.getController = function(){
    return this.view.getController();
};

/**
 * Gets the definition of a {@link mobileDS.ContentElement} object.
 * 
 * TODO remove this?
 * 
 * @function toHtml
 * @returns {String} The HTML content.
 * @public
 */
ContentElement.prototype.toHtml = function(){
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
ContentElement.prototype.toStrings = function(renderingBuffer, data){

	return this.renderer.renderContentElement(this, data, renderingBuffer);
	
};

ContentElement.prototype.getRawText = function(){
    return this.definition;
};

ContentElement.prototype.hasDynamicContent = function(){
    return this.internalHasDynamicContent; 
};

//MOVED to renderContentElement in ParserUtils
///** @private */
//ContentElement.prototype.doGetStringForElement = function(element, data){
//	
//	if(element.type === mobileDS.parser.element.LOCALIZE){
//		return this.doGetStringForLocalize(element, data);
//	}
//	else if(element.type === mobileDS.parser.element.HELPER){
//		return this.doGetStringForHelper(element, data);
//	}
//	else if(
//				element.type === mobileDS.parser.element.ESCAPE_ENTER
//			||	element.type === mobileDS.parser.element.ESCAPE_EXIT
//	){
//		return element.text;
//	}
//	else {
//		console.warn('ContentElement.doGetStringForElement: unknown element type '+element.type);
//		return '';
//	}
//};
//
///** @private */
//ContentElement.prototype.doGetStringForLocalize = function(localizeElement, data){
//	var text = this.localizer.getText(localizeElement.name);
//	if(!text){
//		console.warn('ContentElement.render(localize): could not find localization text for "'+contentElement.name+'"');
//		text = '';
//	}
//	return text;
//};
//
///** @private */
//ContentElement.prototype.doGetStringForHelper = function(helperElement, data){
//	//TODo handle case, when .helper is not a String
//	//TODo handle arguments for helper
//	var text = this.getController().performHelperAction(helperElement.helper, data);
//	if(!text){
//		console.warn('ContentElement.render(helper): no result for '+this.getController().getName()+'-helper >'+helperElement.helper+'<');
//		text = '';
//	}
//	return text.toString();
//};
