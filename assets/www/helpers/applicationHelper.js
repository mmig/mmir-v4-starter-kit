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
 * @module mobileDS.helpers
 * 
 */

/**
 * The ApplicationHelper's purpose was to create the language selection menu.<br>
 * It would probably be best to use a partial for this purpose. 
 * 
 * @class ApplicationHelper
 * @constructor
 */
var ApplicationHelper = function(){
    this.name = "ApplicationHelper";
    this.language_menu;
	this.language_choosen_action = 'mobileDS.PresentationManager.getInstance().renderPreviousView()';
	this.listItemTheme="b";
	this.listItemThemeCurrent="e";
};

/**
 * 
 * This function loads the helper of the controller - if it exists.
 * 
 * @method initialize_language_menu
 * @param {Object} ctrl Controller which stores the available languages
 * @param {Object} data the event-data (un-used)
 * @deprecated TODO use partials instead
 * @public
 */
ApplicationHelper.prototype.get_language_menu = function(ctrl, data){
	
	var self = this;

	// Function generating the listview of the languages
	function getLanguageListView(par_available_languages){
		var htmlListSelect='';
		
		var ul = $("<ul>");
		ul.attr( "data-role", "listview" );
		ul.attr( "data-theme", self.listItemTheme );
		ul.attr( "data-divider-theme", self.listItemTheme );
		ul.attr( "data-inset", "true" );
		ul.attr( "id", "languageListView" );
		ul.attr( "class", "ui-listview ui-listview-inset ui-corner-all ui-shadow" );
		
		var class_li="";
		/// JQuery-Creation of HTML-Elements
		for (var i in par_available_languages){
			var li = $("<li>");
			var divcontainer=$("<div>");
			var divicon=$("<div>");
			var divtext=$("<div>");
			var divheight=$("<div>");
			
			class_li = "ui-li ui-li-static ";
			
			if (i == 0){
				class_li += "ui-corner-top ";
			}
			if (i == (par_available_languages.length - 1)){
				class_li += "ui-corner-bottom ";
			}
			
			// check if item is current language--- if so: mark by another theme
			if (mobileDS.LanguageManager.getInstance().getLanguage() === par_available_languages[i]){
				li.attr( "data-theme", self.listItemThemeCurrent );
				class_li += "ui-body-"+self.listItemThemeCurrent;
			} else {
				li.attr( "data-theme", self.listItemTheme );
				class_li += "ui-body-"+self.listItemTheme;
			}
			
			li.addClass( class_li );
			li.css("padding", "0px" );
			
			// add onclick actions: do register these in view's controller (in on_page_load_xxx)
			
			li.attr('lang',par_available_languages[i]);
			
			// Here the height of the li-Element is defined -- taken from style-class 'flagIconHeight' 
			divcontainer.css("white-space", "nowrap");
			divcontainer.addClass("flagIconHeight");
			
			// create the div-element with flag icon
			divicon.css("display", "inline-block");
			divicon.css("vertical-align", "middle");
			divicon.css("white-space", "normal");
			divicon.addClass("flags");
			divicon.attr("id", "flags-"+par_available_languages[i]);
			divcontainer.append(divicon);
			
			// create the div-element containing the text
			divtext.css("display", "inline-block");
			divtext.css("text-align", "center");
			divtext.css("vertical-align", "middle");
			divtext.css("white-space", "normal");
			divtext.text(par_available_languages[i]);
			divcontainer.append(divtext);
			
			// create a helper-div-element so that the other are centered vertically
			divheight.css("display", "inline-block");
			divheight.css("vertical-align", "middle");
			divheight.css("height", "100%");
			divcontainer.append(divheight);
			
			li.append(divcontainer);
			ul.append(li);
		}
		return $('<div></div>').append(ul.clone()).html();
	}
	
	var languageMenuStr = '<h2>'+mobileDS.LanguageManager.getInstance().getText("choose_language")+'</h2>';

	var available_languages = mobileDS.LanguageManager.getInstance().getLanguages();
	languageMenuStr += getLanguageListView(available_languages);
	
	return languageMenuStr;
};