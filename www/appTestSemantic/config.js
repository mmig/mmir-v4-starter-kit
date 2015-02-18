
//declare GrammarConvert-class in global namespace (will be set during initialization);
var GrammarConverter;
var jsl = {};
var GrammarValidator;

var editor;
var isEqual;

var ERROR_MARKER, WARNING_MARKER, BOOKMARK_MARKER;

(function () {
    
    
    require.config({
		
		config: {
		    'constants': {
		        forBrowser: true
		    }
		},
	
		paths : {
		    
		    // core
	 	    'main': 'mmirf/main'
		    // lib
		    , 'jquery': 'mmirf/vendor/libs/jquery-2.1.3'
		    
		    // globals and AMDs
	 	    , 'constants': 'mmirf/tools/constants'
	 	    , 'commonUtils': 'mmirf/tools/commonUtils'
		    , 'stringExtension': 'mmirf/tools/extensions/StringExtensions'		
		    , 'dictionary': 'mmirf/tools/dictionary'
		    , 'paramsParseFunc': 'mmirf/tools/paramsParseFunc'
			, 'env': 'mmirf/tools/envDetect'
			, 'envInit': 'mmirf/tools/envInit'
	
		    // @chsc03 required by contentElement, renderUtils, declared in presentationManager
		    , 'languageManager': 'mmirf/manager/settings/languageManager'
		    , 'configurationManager': 'mmirf/manager/settings/configurationManager'
		    
			//grammar related
			, 'grammarConverter' : 'mmirf/semantic/grammarConverter'
			, 'semanticInterpreter' : 'mmirf/semantic/semanticInterpreter'
			, 'jscc':  'mmirf/vendor/libs/jscc-amd'
			, 'jison': 'mmirf/vendor/libs/jison'
			, 'pegjs': 'mmirf/vendor/libs/peg-0.8.0'
			, 'jsccGen':  'mmirf/env/grammar/jsccGenerator'
			, 'jisonGen': 'mmirf/env/grammar/jisonGenerator'
			, 'pegjsGen': 'mmirf/env/grammar/pegjsGenerator'
			
			, 'grammarValidator' : 'appTestSemantic/jsonGrammarValidator'
			, 'jsonlint': 'appTestSemantic/libs/jsonlint-loc'
			, 'esprima' : 'appTestSemantic/libs/esprima'
			
			, 'orioneditor': 'appTestSemantic/libs/built-editor-amd'
			
			, 'lodash': 'appTestSemantic/libs/lodash'
			
			, 'jqueryui': 'appTestSemantic/libs/jquery-ui'
			, 'w2ui': 'appTestSemantic/libs/w2ui-1.4.2'
		},
	
		shim : {
			
			  'jsonlint' : {exports: 'jsonlint'}
			, 'pegjs':       	{exports: 'PEG'}
			
			, 'jqueryui': ['jquery']
			, 'w2ui': ['jquery']
	
		}
    });

	var start = (function(){
			
		require(['jquery', 'constants', 'commonUtils', 'languageManager', 'semanticInterpreter', 'grammarConverter', 'orioneditor'
		         , 'jsonlint', 'grammarValidator', 'lodash'
		         , 'jqueryui', 'w2ui'
					
			], function(
					$, constants, commonUtils,languageManager,semanticInterpreter,grammarConverter, _editor
					,jsonlint, grammarValidator, lodash
			) {
			
			 var _editorClassName = "editor";
			 editor = _editor({className: _editorClassName, lang: "js"})[0];
			 editor.val = function(str){
				 
				 if(typeof str !== 'undefined'){
					 this.setText(str);
					 
				 }
				 else {
					 return this.getText();
				 }
			 }
			 
			 editor.getTextView().getModel().addEventListener("Changed", function(event){
				 if(event.addedLineCount > 0 || event.removedLineCount > 0){
					 
					 var lines = editor.getModel().getLineCount();
					 
					 if(lines > 0){
						 //resize editor window to the text's full height
						 $(editor._domNode).height( editor.getTextView().getLineHeight() * lines + 8);
						 //update editor-view
						 editor.resize();
					 }
					 
				 }
			 });
			 
			 editor.getTextView().getModel().addEventListener("Changed", validateJsonGrammar);
			 
			 var _annotations = require('orion/editor/annotations');
			 /*var _annotationList = [ 
			                     _annotations.AnnotationType.ANNOTATION_ERROR,
			                     _annotations.AnnotationType.ANNOTATION_WARNING,
			                     _annotations.AnnotationType.ANNOTATION_TASK,
			                     _annotations.AnnotationType.ANNOTATION_BREAKPOINT,
			                     _annotations.AnnotationType.ANNOTATION_BOOKMARK,
			                     _annotations.AnnotationType.ANNOTATION_FOLDING,
			                     _annotations.AnnotationType.ANNOTATION_CURRENT_BRACKET,
			                     _annotations.AnnotationType.ANNOTATION_MATCHING_BRACKET,
			                     _annotations.AnnotationType.ANNOTATION_CURRENT_LINE,
			                     _annotations.AnnotationType.ANNOTATION_CURRENT_SEARCH,
			                     _annotations.AnnotationType.ANNOTATION_MATCHING_SEARCH,
			                     _annotations.AnnotationType.ANNOTATION_READ_OCCURRENCE,
			                     _annotations.AnnotationType.ANNOTATION_WRITE_OCCURRENCE,
			                     _annotations.AnnotationType.ANNOTATION_SELECTED_LINKED_GROUP,
			                     _annotations.AnnotationType.ANNOTATION_CURRENT_LINKED_GROUP,
			                     _annotations.AnnotationType.ANNOTATION_LINKED_GROUP,
			                     _annotations.AnnotationType.ANNOTATION_BLAME,
			                     _annotations.AnnotationType.ANNOTATION_CURRENT_BLAME
			 ];*/
			 
			 ERROR_MARKER    = _annotations.AnnotationType.ANNOTATION_ERROR;
			 WARNING_MARKER  = _annotations.AnnotationType.ANNOTATION_WARNING;
			 BOOKMARK_MARKER = _annotations.AnnotationType.ANNOTATION_BOOKMARK;
			 
			 //taken from esprima/customeditor.js:
			 editor.addErrorMarker = function (start, end, description) {
				 var annotationModel = this.getAnnotationModel();
				 var mAnnotations = require('orion/editor/annotations');
				 var marker = mAnnotations.AnnotationType.createAnnotation(
						 WARNING_MARKER, start, end, description
				 );
				 annotationModel.addAnnotation(marker);
	         };
	         editor.addMarker = function (type, start, end, description) {
				 var annotationModel = this.getAnnotationModel();
				 var mAnnotations = require('orion/editor/annotations');
				 var marker = mAnnotations.AnnotationType.createAnnotation(
						 type, start, end, description
				 );
				 annotationModel.addAnnotation(marker);
	         };
	         editor.removeAllErrorMarkers = function () {
	             var annotationModel = this.getAnnotationModel();
				 var mAnnotations = require('orion/editor/annotations');
	             annotationModel.removeAnnotations(ERROR_MARKER);
	             annotationModel.removeAnnotations(WARNING_MARKER);
	             annotationModel.removeAnnotations(BOOKMARK_MARKER);
	         };
	         
	         //make editor resizable (using jQuery UI)
	         $('.editor').resizable({
	        	 stop: function( event, ui ) { editor.resize(); }
	         });
			 
			 GrammarValidator = grammarValidator;
			 
			 isEqual = function(a,b){
				 return lodash.isEqual(a,b);
			 };
			 
			 $(function() {
			
				 //export dependencies into mmir-package:
				 mmir = {
						 Constants: constants,
						 CommonUtils: commonUtils,
						 LanguageManager: languageManager,
						 SemanticInterpreter: semanticInterpreter
				 };
				 
				 GrammarConverter = grammarConverter;
				 
				 jsl.parser = jsonlint;
				 
				 console.log('dom ready');
	
				 // start commonUtils
				 commonUtils.init()
	
				 	 // start the app
					 .then(function() {
					 
//						initJqmBookmarking();// in initJqmNav.js
						initPage();// in app.js
	
					 });
				 
				 
				 
//				 $('#semantic-test-main').w2layout({
//				        name: 'GrammarTester',
//				        panels: [
//				            { type: 'top', size: 60 },
//				            { type: 'left', size: 150, resizable: true },
//				            { type: 'right', size: 150, resizable: true }
//				        ]
//				 });
//				 
//				 w2ui.GrammarTester.set('main', {
//					 content: '<div id="tabs" style="width: 100%;"></div><div id="selected-tab" style="padding: 10px 0px">tab1</div>',
//					 title: 'Semantic Tester',
////					 content: $('#inputBox')[0],
////					 tabs: {
////					        name     : 'tabs',
////					        active     : 'tab1',
////					        tabs    : [
////					            { id: 'tab1', caption: 'Tab 1' },
////					            { id: 'tab2', caption: 'Tab 2' },
////					            { id: 'tab3', caption: 'Tab 3' },
////					            { id: 'tab4', caption: 'Tab 4' }
////					        ],
////					        onClick: function (event) {
////					            $('#selected-tab').html(event.target);
////					        }
////					 },
//					 toolbar: {
//						 items: [
//						         { id: 'bt1', type: 'button', caption: 'Button 1', img: 'icon-page' },
//						         { id: 'bt2', type: 'button', caption: 'Button 2', img: 'icon-page' },
//						         { id: 'bt3', type: 'button', caption: 'Button 3', img: 'icon-page' }
//					         ],
//				         onClick: function (event) {
//				        	 console.log('event toolbar');
//				         }
//					 } 
//
//				 });
//				 
//				 $('#tabs').w2tabs({
//				        name     : 'tabs',
//				        active     : 'tab1',
//				        tabs    : [
//				            { id: 'tab1', caption: 'Tab 1' },
//				            { id: 'tab2', caption: 'Tab 2' },
//				            { id: 'tab3', caption: 'Tab 3' },
//				            { id: 'tab4', caption: 'Tab 4' }
//				        ],
//				        onClick: function (event) {
//				            $('#selected-tab').html(event.target);
//				        }
//				 });
//				 
//				 w2ui.GrammarTester.showTabs('main');
//				 w2ui.GrammarTester.showToolbar('main');
				 
				 var pstyle = 'border: 1px solid #dfdfdf; padding: 5px;';
				 $('#semantic-test-main').w2layout({
				        name: 'GrammarTester',
				        panels: [
//				            { type: 'top', size: 50, resizable: true, style: pstyle, content: 'top' },
				            { type: 'left', size: 200, resizable: true, style: pstyle, content: 'left' },
				            { type: 'main', style: pstyle + 'border-top: 0px;', content: 'main', 
				                tabs: {
				                    active: 'tab1',
				                    tabs: [
				                        { id: 'tab1', caption: 'Tab 1' },
				                        { id: 'tab2', caption: 'Tab 2' },
				                        { id: 'tab3', caption: 'Tab 3' },
				                    ],
				                    onClick: function (event) {
				                        this.owner.content('main', event);
				                    }
				                },
				                toolbar: {
				                    items: [
				                        { type: 'check',  id: 'item1', caption: 'Check', img: 'icon-page', checked: true },
				                        { type: 'break',  id: 'break0' },
				                        { type: 'menu',   id: 'item2', caption: 'Drop Down', img: 'icon-folder', items: [
				                            { text: 'Item 1', icon: 'icon-page' }, 
				                            { text: 'Item 2', icon: 'icon-page' }, 
				                            { text: 'Item 3', value: 'Item Three', icon: 'icon-page' }
				                        ]},
				                        { type: 'break', id: 'break1' },
				                        { type: 'radio',  id: 'item3',  group: '1', caption: 'Radio 1', img: 'icon-page', hint: 'Hint for item 3', checked: true },
				                        { type: 'radio',  id: 'item4',  group: '1', caption: 'Radio 2', img: 'icon-page', hint: 'Hint for item 4' },
				                        { type: 'spacer' },
				                        { type: 'button',  id: 'item5',  caption: 'Item 5', icon: 'w2ui-icon-check', hint: 'Hint for item 5' }
				                    ],
				                    onClick: function (event) {
				                        this.owner.content('main', event);
				                    }
				                }
				            }
				        ]
				    });
			 });

	 });
	
	})();

}());
