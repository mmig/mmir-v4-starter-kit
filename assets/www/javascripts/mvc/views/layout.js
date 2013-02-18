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
 */
var mobileDS = window.mobileDS ||
{};

/*function Layout(name, jsonDef){
 this.def = new JPath(jsonDef);
 this.name = name;
 this.yields = new Array();
 
 var headJson = this.def.query('head');
 var bodyJson = this.def.query('body');
 this.head = this.parseHead(new JPath(headJson));
 this.body = this.parseBody(new JPath(bodyJson));
 
 }
 */
/**
 * The Layout class 
 * The constructor parses the layout and divides them into containers (headerContents, bodyContents, dialogsContents).
 * 
 * @class Layout
 * @constructor
 * @param {String} name Name of the Layout 
 * @param {String} definition layout description
 * @category core
 */

Layout.prototype.CONTENT_AREA_HEAD 		= 0;
Layout.prototype.CONTENT_AREA_BODY 		= 2;
Layout.prototype.CONTENT_AREA_DIALOGS 	= 4;

function Layout(name, definition){
//	console.log("[Layout] initialize '"+name+"'.");

	/**
     * The definition string of the layout (ehtml-format, taken from assets/www/views/layout/*.ehtml)
     * 
     * @property def
     * @type Object
     * @public
     */
    this.def = definition.replace(mobileDS.CommonUtils.getInstance().html_comment_regex, '');//remove HTML comments!

	/**
     * The name of the layout. 
     * 
     * @property name
     * @type String
     * @public
     */
    this.name = name.toLowerCase();//TODO remove toLowerCase conversion for all controller, view etc. names!

	/**
     * This variable holds the contents of the header part of the layout.
     * 
     * @property headerContents
     * @type String
     * @public
     * @deprecated unused
     */
    this.headerContents = "";

	/**
     * This variable holds the contents of the body part of the layout.
     * 
     * @property bodyContents
     * @type String
     * @public
     * @deprecated unused
     */
    this.bodyContents = "";

	/**
     * This variable holds the contents of the dialogs part of the layout.
     * 
     * @property dialogsContents
     * @type String
     * @public
     */
    this.dialogsContents = "";

	/**
     * An associative array holding the contents of the different containers: header, body, footer and dialogs
     * 
     * @property yields
     * @type Array
     * @public
     */
    this.yields = new Array();

    var parser = mobileDS.parser.ParserUtils.getInstance();
    
    var parseResult = parser.parse(this.def);
    var renderedLayout = parser.renderLayout(parseResult, null/*FIXME?*/);
    
    //NOTE: parsing a string as HTML via jQuery etc. does not work (removes head, body,... tags):
//    var doc = new DOMParser().parseFromString(renderedLayout, "text/html");
//    if(!doc){
//    	doc = document.implementation.createHTMLDocument('LAYOUT');
//    }
//    var $layout = $(doc);//$.parseHTML(renderedLayout, doc);
//    
//    var headerElements = $('head', $layout);
//    for(var i=0, size = headerElements.length; i < size; ++i){
//    	this.headerContents += headerElements[i].outerHTML;
//    }
//    
//    var bodyElement = $('body', $layout);
//    this.bodyContents = bodyElement.html();
//    var dialogElement = $('dialogs', $layout);
//    this.dialogsContents = dialogElement.html();
//    
    

//    //TODO remove this (replace with HTML parser)

    var self = this;
    //remove all HTML comments
    var pureHtml = renderedLayout;
    
    //matching: <script some attributes...> some content but no child-tags allowed! </script>
    //      or: <script some attributes... />
    var regExpScriptTag = /((<script([\r\n]|[^<])*?>)(([\r\n]|[^<])*?)(<\/script>))|(<script([\r\n]|[^<])*?\/>)/igm;
    // regExpScriptTag[0]: complete match
    // regExpScriptTag[1]: script with start and end tag (if matched)
    // regExpScriptTag[7]: self-closing script (if matched)
    var matchScriptTag = null;
    
    self.headerContents = '';
    
    var removedScriptAndLinkHmtl = new Array();
//    var matchIndex;
    while(matchScriptTag = regExpScriptTag.exec(pureHtml)){
//    	matchIndex = matchScriptTag[1] ? 1 : (matchScriptTag[7]? 7 : -1);
    	
    	if(matchScriptTag[0]){//matchIndex != -1){
    		self.headerContents += matchScriptTag[0];//[matchIndex];
    		//remove script tag, and continue search
//    		pureHtml = pureHtml.substring(0,matchScriptTag.index) + pureHtml.substring(matchScriptTag.index + matchScriptTag[0].length);// pureHtml.replace(matchScriptTag[matchIndex], '');

    	    removedScriptAndLinkHmtl.push({start: matchScriptTag.index, end: matchScriptTag.index + matchScriptTag[0].length});
    	}
    }
    
    //matching: <link some attributes...> some content but no child-tags allowed! </link>
    //      or: <link some attributes... />
    var regExpLinkTag = /((<link([\r\n]|[^<])*?>)(([\r\n]|[^<])*?)(<\/link>))|(<link([\r\n]|[^<])*?\/>)/igm;
    // regExpScriptTag[0]: complete match
    // regExpScriptTag[1]: link with start and end tag (if matched)
    // regExpScriptTag[7]: self-closing link (if matched)
    var matchLinkTag = null;
    
    while(matchLinkTag = regExpLinkTag.exec(pureHtml)){

    	if(matchLinkTag[0]){
    		self.headerContents += matchLinkTag[0];

    	    removedScriptAndLinkHmtl.push({start: matchLinkTag.index, end: matchLinkTag.index + matchLinkTag[0].length});
    	}
    }
    
    //only need to "process" removed script/link tags, if some were found:
    if(removedScriptAndLinkHmtl.length > 0){
    	
    	removedScriptAndLinkHmtl.sort(function(a,b){
    		return a.start - b.start;
    	});
    	
    	var cleanedHtml = new Array();
    	var remPos = 0;
    	var removalElement = removedScriptAndLinkHmtl[0];
		
    	for(var i=0, size = removedScriptAndLinkHmtl.length; i < size; ++i){
    		removalElement = removedScriptAndLinkHmtl[i];
    		
    		var text = pureHtml.substring(remPos, removalElement.start);
    		cleanedHtml.push(text);
    		
    		remPos = removalElement.end;
    	}
    	//add rest of the HTML if necessary
	    if(removalElement.end < pureHtml.length){
	    	cleanedHtml.push(pureHtml.substring(removalElement.end));
	    }
	    //replace HTML with the removed/clean version:
	    pureHtml = cleanedHtml.join('');
    }
    
    var regExpBodyTag = /(<body([\r\n]|.)*?>)(([\r\n]|.)*?)(<\/body>)/igm;
    // matchBodyTag[0]: complete match
    // matchBodyTag[1]: body start tag
    // matchBodyTag[2]: last CHAR within body start tag, before closing, e.g. "...lskdjf>" -> "f"
    // matchBodyTag[3]: body text content
    // matchBodyTag[4]: last CHAR within body text content, before closing, e.g. "...lsk</body>" -> "k"
    // matchBodyTag[5]: body end tag
    var matchBodyTag = regExpBodyTag.exec(pureHtml);
    
    self.bodyContents = '';
    
    if(matchBodyTag && matchBodyTag[3]){
	    self.bodyContents += matchBodyTag[3];
    }
    else {
    	//TODO throw error?
    	console.error('Layout.<constructor>: Layout template does not contain a <body> element!');
    }
    
    
    var regExpDialogsTag = /(<dialogs([\r\n]|.)*?>)(([\r\n]|.)*?)(<\/dialogs>)/igm;
    // matchDialogsTag[0]: complete match
    // matchDialogsTag[1]: dialogs start tag
    // matchDialogsTag[2]: last CHAR within dialogs start tag, before closing, e.g. "...lskdjf>" -> "f"
    // matchDialogsTag[3]: dialogs text content
    // matchDialogsTag[4]: last CHAR within dialogs text content, before closing, e.g. "...lsk</dialogs>" -> "k"
    // matchDialogsTag[5]: dialogs end tag
    var matchDialogsTag = regExpDialogsTag.exec(pureHtml);
    
    self.dialogsContents = '';
    if(matchDialogsTag && matchDialogsTag[3]){
	    self.dialogsContents += matchDialogsTag[3];
    }
    
    var parseBodyResult = parser.parse(this.bodyContents);
    for(var i=0, size = parseBodyResult.yields.length; i < size ; ++i){
    	this.yields.push(new YieldDeclaration(parseBodyResult.yields[i], Layout.prototype.CONTENT_AREA_BODY));
    }
    
    var parseDialogResult = parser.parse(this.dialogsContents);
    for(var i=0, size = parseDialogResult.yields.length; i < size ; ++i){
    	this.yields.push(new YieldDeclaration(parseDialogResult.yields[i], Layout.prototype.CONTENT_AREA_DIALOGS));
    }
    //END todo
}

/**
 * This methods returns an associative array holding the contents of the different containers: header, body, footer and dialogs.
 * 
 * @function getYields
 * @returns {Array} An associative array holding the contents of the different containers: header, body, footer and dialogs
 * @public
 */
Layout.prototype.getYields = function(){
	return this.yields;
};

/**
 * This methods returns the contents of the header part of the layout.
 * 
 * @function getHeaderContents
 * @returns {String} The contents of the header part of the layout
 * @public
 */
Layout.prototype.getHeaderContents = function(){
    return this.headerContents;
};

/**
 * This methods returns the contents of the dialog part of the layout.
 * 
 * @function getDialogsContents
 * @returns {String} The contents of the dialog part of the layout
 * @public
 */
Layout.prototype.getDialogsContents = function(){
	return this.dialogsContents;
};

/**
 * This methods returns the contents of the body part of the layout.
 * 
 * @function getBodyContents
 * @returns {String} The contents of the body part of the layout
 * @public
 */
Layout.prototype.getBodyContents = function(){
    return this.bodyContents;
};

/**
 * Gets the name of the layout.
 * 
 * @function getName
 * @returns {String} The name of the layout.
 * @public
 */
Layout.prototype.getName = function(){
    return this.name;
};

/**
 * Create the header of the layout.
 * 
 * TODO check this implementation -> is it conform with code for handling eHTML templates?
 * 
 * @function parseHead
 * @param {Object} jsonDef definition of the header
 * @returns {String} The header
 * @deprecated unused
 * @public
 */
Layout.prototype.parseHead = function(jsonDef){
    var head = "<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">";
    
    if (jsonDef != null) {
    
    
        var stylesheetPaths = jsonDef.query('/stylesheets/path');
        var jsPaths = jsonDef.query('/javascripts/path');
        
        $.each(stylesheetPaths, function(index, stPath){
            head += "<link rel=\"stylesheet\" href=\"content/stylesheets/" + stPath + ".css\"/>";
        });
        
        $.each(jsPaths, function(index, jsPath){
            head += "<script  type=\"text/javascript\" charset=\"utf-8\"  src=\"javascripts/\"" + jsPath + ".js\"></script>";
        });
    }
    
    head += "</head>";
    
    return head;
};

/**
 * Create the body of the layout.
 * 
 * TODO check this implementation -> is it conform with code for handling eHTML templates?
 * 
 * @function parseBody
 * @param {Object} jsonDef definition of the body
 * @returns {String} The body
 * @deprecated unused
 * @public
 */
Layout.prototype.parseBody = function(jsonDef){
	var body = "<body><div id=\"pageContainer\" data-role=\"page\" class=\"type-interior\">";
    if (jsonDef != null) {
        var header = new JPath(jsonDef.query('header'));
        var content = new JPath(jsonDef.query('content'));
        var footer = new JPath(jsonDef.query('footer'));
        
        if (header) {
            var headerYield = header.query('yield');
            body += " <div id=\"pageHeader\" data-role=\"header\" data-position=\"fixed\">";
            if (headerYield) {
                body += "\"yield\":\"" + headerYield + "\"";
                this.yields['header'] = headerYield;
            }
            body += "</div>";
        }
        
        if (content) {
            var contentYield = content.query('yield');
            body += " <div id=\"pageContent\">";
            if (contentYield) {
                body += "\"yield\":\"" + contentYield + "\"";
                this.yields['content'] = contentYield;
            }
            body += "</div>";
        }
        
        if (footer) {
            var footerYield = footer.query('yield');
            body += " <div id=\"pageFooter\" data-role=\"footer\" data-position=\"fixed\">";
            if (footerYield) {
                body += "\"yield\":\"" + footerYield + "\"";
                this.yields['footer'] = footerYield;
            }
            body += "</div>";
        }
        //currently all body components (header, content, and footer could only contains "yield"
    
    }
    
    body += "</div></body>";
    
    if(IS_DEBUG_ENABLED) console.debug("body : " + body);//debug
    
    return body;
};

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
	
	this.name = parsingElement.name;
	this.start = parsingElement.start;
	this.end = parsingElement.end;
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

