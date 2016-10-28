require("storageUtils").restoreObject({ classConstructor: "partial",name:"languageMenu",def:"<h2>@(mmir.LanguageManager.getInstance().getText('choose_language'))</h2>\r\n@var(par_available_languages)\r\n@var(size)\r\n@var(set_lang)\r\n@var(set_list_class)\r\n@var(set_list_theme)\r\n@{\r\n\t@par_available_languages = mmir.LanguageManager.getInstance().getLanguages();\r\n}@\r\n\r\n<ul id=\"languageListView\" class=\"ui-listview ui-listview-inset ui-corner-all ui-shadow\" data-role=\"listview\" data-theme=\"b\" data-divider-theme=\"b\" data-inset=\"true\">\r\n\r\n@for(@i = 0, @size = @par_available_languages.length; @i < @size; @i ++){\r\n\r\n\t@{ \r\n\t\t@set_lang = @par_available_languages[@i];\r\n\t\t\r\n\t\t@set_list_class = 'ui-li ui-li-static ';\r\n\t\tif(@i == 0){\r\n\t\t\t@set_list_class = 'ui-corner-top ';\r\n\t\t}\r\n\t\telse if(@i == @size - 1){\r\n\t\t\t@set_list_class = 'ui-corner-bottom ';\r\n\t\t}\r\n\t\t\r\n\t\t@set_list_theme = \r\n\t\t\t@set_lang == mmir.LanguageManager.getInstance().getLanguage()?\r\n\t\t\t\t'b' : 'a';\r\n\t\t\r\n\t\t@set_list_class += 'ui-body-' + @set_list_theme;\r\n\t}@\r\n\t\r\n\t<li style=\"padding: 0px;\" class=\"@(@set_list_class)\" data-theme=\"@(@set_list_theme)\" lang=\"@(@set_lang)\">\r\n\t\t<div class=\"flagIconHeight\" style=\"white-space: nowrap;\">\r\n\t\t\t<div id=\"flags-@(@set_lang)\" class=\"flags\" style=\"display: inline-block; vertical-align: middle; white-space: normal;\"></div>\r\n\t\t\t<div style=\"display: inline-block; text-align: center; vertical-align: middle; white-space: normal;\">@(@set_lang)</div>\r\n\t\t\t<div style=\"display: inline-block; vertical-align: middle; height: 100%;\"></div>\r\n\t\t</div>\r\n\t</li>\r\n\t\r\n}@\r\n\r\n</ul>\r\n",contentElement:require("storageUtils").restoreObject({ classConstructor: "contentElement",name:"ApplicationPartial",definition:"<h2>@(mmir.LanguageManager.getInstance().getText('choose_language'))</h2>\r\n@var(par_available_languages)\r\n@var(size)\r\n@var(set_lang)\r\n@var(set_list_class)\r\n@var(set_list_theme)\r\n@{\r\n\t@par_available_languages = mmir.LanguageManager.getInstance().getLanguages();\r\n}@\r\n\r\n<ul id=\"languageListView\" class=\"ui-listview ui-listview-inset ui-corner-all ui-shadow\" data-role=\"listview\" data-theme=\"b\" data-divider-theme=\"b\" data-inset=\"true\">\r\n\r\n@for(@i = 0, @size = @par_available_languages.length; @i < @size; @i ++){\r\n\r\n\t@{ \r\n\t\t@set_lang = @par_available_languages[@i];\r\n\t\t\r\n\t\t@set_list_class = 'ui-li ui-li-static ';\r\n\t\tif(@i == 0){\r\n\t\t\t@set_list_class = 'ui-corner-top ';\r\n\t\t}\r\n\t\telse if(@i == @size - 1){\r\n\t\t\t@set_list_class = 'ui-corner-bottom ';\r\n\t\t}\r\n\t\t\r\n\t\t@set_list_theme = \r\n\t\t\t@set_lang == mmir.LanguageManager.getInstance().getLanguage()?\r\n\t\t\t\t'b' : 'a';\r\n\t\t\r\n\t\t@set_list_class += 'ui-body-' + @set_list_theme;\r\n\t}@\r\n\t\r\n\t<li style=\"padding: 0px;\" class=\"@(@set_list_class)\" data-theme=\"@(@set_list_theme)\" lang=\"@(@set_lang)\">\r\n\t\t<div class=\"flagIconHeight\" style=\"white-space: nowrap;\">\r\n\t\t\t<div id=\"flags-@(@set_lang)\" class=\"flags\" style=\"display: inline-block; vertical-align: middle; white-space: normal;\"></div>\r\n\t\t\t<div style=\"display: inline-block; text-align: center; vertical-align: middle; white-space: normal;\">@(@set_lang)</div>\r\n\t\t\t<div style=\"display: inline-block; vertical-align: middle; height: 100%;\"></div>\r\n\t\t</div>\r\n\t</li>\r\n\t\r\n}@\r\n\r\n</ul>\r\n",internalHasDynamicContent:true,allContentElements:[require("storageUtils").restoreObject({ classConstructor: "parsingResult",start:4,end:68,type:64 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",name:"par_available_languages",nameType:"Identifier",start:75,end:104,type:65536 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",name:"size",nameType:"Identifier",start:106,end:116,type:65536 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",name:"set_lang",nameType:"Identifier",start:118,end:132,type:65536 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",name:"set_list_class",nameType:"Identifier",start:134,end:154,type:65536 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",name:"set_list_theme",nameType:"Identifier",start:156,end:176,type:65536 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",start:178,end:264,type:32 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",start:437,end:1455,type:1024,forControlType:"FORSTEP",content:require("storageUtils").restoreObject({ classConstructor: "contentElement",name:"@fragment",definition:"\r\n\r\n\t@{ \r\n\t\t@set_lang = @par_available_languages[@i];\r\n\t\t\r\n\t\t@set_list_class = 'ui-li ui-li-static ';\r\n\t\tif(@i == 0){\r\n\t\t\t@set_list_class = 'ui-corner-top ';\r\n\t\t}\r\n\t\telse if(@i == @size - 1){\r\n\t\t\t@set_list_class = 'ui-corner-bottom ';\r\n\t\t}\r\n\t\t\r\n\t\t@set_list_theme = \r\n\t\t\t@set_lang == mmir.LanguageManager.getInstance().getLanguage()?\r\n\t\t\t\t'b' : 'a';\r\n\t\t\r\n\t\t@set_list_class += 'ui-body-' + @set_list_theme;\r\n\t}@\r\n\t\r\n\t<li style=\"padding: 0px;\" class=\"@(@set_list_class)\" data-theme=\"@(@set_list_theme)\" lang=\"@(@set_lang)\">\r\n\t\t<div class=\"flagIconHeight\" style=\"white-space: nowrap;\">\r\n\t\t\t<div id=\"flags-@(@set_lang)\" class=\"flags\" style=\"display: inline-block; vertical-align: middle; white-space: normal;\"></div>\r\n\t\t\t<div style=\"display: inline-block; text-align: center; vertical-align: middle; white-space: normal;\">@(@set_lang)</div>\r\n\t\t\t<div style=\"display: inline-block; vertical-align: middle; height: 100%;\"></div>\r\n\t\t</div>\r\n\t</li>\r\n\t\r\n",internalHasDynamicContent:true,allContentElements:[require("storageUtils").restoreObject({ classConstructor: "parsingResult",start:5,end:409,type:32 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",start:448,end:466,type:64 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",start:480,end:498,type:64 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",start:506,end:518,type:64 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",start:601,end:613,type:64 }),require("storageUtils").restoreObject({ classConstructor: "parsingResult",start:817,end:829,type:64 })],initEvalFunctions: function initEvalFunctions(){
var par_available_languages;
var size;
var set_lang;
var set_list_class;
var set_list_theme;
var i;
var size;
var par_available_languages;
this.setRenderData = function(__$$DATA$$__){
par_available_languages = __$$DATA$$__["@par_available_languages"];
size = __$$DATA$$__["@size"];
set_lang = __$$DATA$$__["@set_lang"];
set_list_class = __$$DATA$$__["@set_list_class"];
set_list_theme = __$$DATA$$__["@set_list_theme"];
i = __$$DATA$$__["@i"];
size = __$$DATA$$__["@size"];
par_available_languages = __$$DATA$$__["@par_available_languages"];
};
var exportRenderDataTo = function(__$$DATA$$__){
__$$DATA$$__["@par_available_languages"] = par_available_languages;
__$$DATA$$__["@size"] = size;
__$$DATA$$__["@set_lang"] = set_lang;
__$$DATA$$__["@set_list_class"] = set_list_class;
__$$DATA$$__["@set_list_theme"] = set_list_theme;
__$$DATA$$__["@i"] = i;
__$$DATA$$__["@size"] = size;
__$$DATA$$__["@par_available_languages"] = par_available_languages;
 return __$$DATA$$__;};
this.exportRenderDataTo = exportRenderDataTo;
this.allContentElements[0].scriptEval=function scriptEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){

set_lang = par_available_languages[i];

set_list_class = 'ui-li ui-li-static ';
if(i == 0){
set_list_class = 'ui-corner-top ';
}
else if(i == size - 1){
set_list_class = 'ui-corner-bottom ';
}

set_list_theme =
set_lang == mmir.LanguageManager.getInstance().getLanguage()?
'b' : 'a';

set_list_class += 'ui-body-' + set_list_theme;

})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
this.allContentElements[1].scriptEval=function scriptEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){
return (set_list_class);
})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
this.allContentElements[2].scriptEval=function scriptEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){
return (set_list_theme);
})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
this.allContentElements[3].scriptEval=function scriptEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){
return (set_lang);
})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
this.allContentElements[4].scriptEval=function scriptEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){
return (set_lang);
})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
this.allContentElements[5].scriptEval=function scriptEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){
return (set_lang);
})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
},initView: function(){ var viewName = "languageMenu"; var ctrlName = "Application"; this.view = require("presentationManager").getPartial(ctrlName, viewName); this.getView = function(){return this.view;}; return this.view; },getView: function(){ return this.initView();},initRenderer: function(){ this.renderer = require("renderUtils"); },init: function(){ this.initRenderer();  } }),forInitEval:function forInitEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){
i = 0, size = par_available_languages.length;
})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;} })],initEvalFunctions: function initEvalFunctions(){
var par_available_languages;
var size;
var set_lang;
var set_list_class;
var set_list_theme;
this.setRenderData = function(__$$DATA$$__){
par_available_languages = __$$DATA$$__["@par_available_languages"];
size = __$$DATA$$__["@size"];
set_lang = __$$DATA$$__["@set_lang"];
set_list_class = __$$DATA$$__["@set_list_class"];
set_list_theme = __$$DATA$$__["@set_list_theme"];
};
var exportRenderDataTo = function(__$$DATA$$__){
__$$DATA$$__["@par_available_languages"] = par_available_languages;
__$$DATA$$__["@size"] = size;
__$$DATA$$__["@set_lang"] = set_lang;
__$$DATA$$__["@set_list_class"] = set_list_class;
__$$DATA$$__["@set_list_theme"] = set_list_theme;
 return __$$DATA$$__;};
this.exportRenderDataTo = exportRenderDataTo;
this.allContentElements[0].scriptEval=function scriptEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){
return (mmir.LanguageManager.getInstance().getText('choose_language'));
})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
this.allContentElements[6].scriptEval=function scriptEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){

par_available_languages = mmir.LanguageManager.getInstance().getLanguages();

})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
this.allContentElements[7].forInitEval=function forInitEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){
i = 0, size = par_available_languages.length;
})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
this.allContentElements[7].forConditionEval=function forConditionEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){
return (i < size);
})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
this.allContentElements[7].forIncrementEval=function forIncrementEval(__$$DATA$$__){
var __$$DATA$$__RESULT__ = (function(){
i ++;
})(); exportRenderDataTo(__$$DATA$$__); return __$$DATA$$__RESULT__;};
},initView: function(){ var viewName = "languageMenu"; var ctrlName = "Application"; this.view = require("presentationManager").getPartial(ctrlName, viewName); this.getView = function(){return this.view;}; return this.view; },getView: function(){ return this.initView();},initRenderer: function(){ this.renderer = require("renderUtils"); },init: function(){ this.initRenderer();  } }),initPublish: function(){ require("presentationManager").addPartial(this.getController(), this); },initController: function(){ var ctrlName = "Application"; this.controller = require("controllerManager").getController(ctrlName); },init: function(){ this.initController();  } }, true, 2);