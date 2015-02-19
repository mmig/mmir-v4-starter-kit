
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
		    	
	    	//MD5 checksum computation: for checking pre-compiled resources, e.g.
	    	// grammars (JSON->JS), and templates (eHTML->JS)
	    	, 'md5' : 'mmirf/vendor/libs/md5'
	    	, 'checksumUtils' : 'mmirf/tools/checksumUtils'
		    
			//grammar related
			, 'grammarConverter' : 'mmirf/semantic/grammarConverter'
			, 'semanticInterpreter' : 'mmirf/semantic/semanticInterpreter'
			, 'jscc':  'mmirf/vendor/libs/jscc-amd'
			, 'jison': 'mmirf/vendor/libs/jison'
			, 'pegjs': 'mmirf/vendor/libs/peg-0.8.0'
			, 'jsccGen':  'mmirf/env/grammar/jsccGenerator'
			, 'jisonGen': 'mmirf/env/grammar/jisonGenerator'
			, 'pegjsGen': 'mmirf/env/grammar/pegjsGenerator'
			
			, 'jsonlint': 'appTestSemantic/libs/jsonlint-loc'
			, 'esprima' : 'appTestSemantic/libs/esprima'
			
			, 'orioneditor': 'appTestSemantic/libs/built-editor-amd'
			
			, 'lodash': 'appTestSemantic/libs/lodash'
			
			, 'w2ui': 'appTestSemantic/libs/w2ui-1.4.2'
				
			//app code
			, 'grammarValidator' : 'appTestSemantic/jsonGrammarValidator'
			, 'grammarEditor': 'appTestSemantic/grammarEditor'
			, 'mainView': 'appTestSemantic/mainView'
		},
	
		shim : {
			
			  'jsonlint' : 		{exports: 'jsonlint'}
			, 'pegjs':       	{exports: 'PEG'}
			
			, 'md5': 			{exports : 'CryptoJS'}
			
			, 'w2ui': 			['jquery']
	
		}
    });

	var start = (function(){
			
		require(['jquery', 'constants', 'commonUtils', 'languageManager', 'semanticInterpreter', 'grammarConverter', 'grammarEditor'
		         , 'jsonlint', 'grammarValidator', 'lodash', 'mainView'
		         //, 'jqueryui'
					
			], function(
					$, constants, commonUtils,languageManager,semanticInterpreter,grammarConverter, editorModule
					,jsonlint, grammarValidator, lodash, mainView
			) {
			
			var _editorClassName = "editor";
			editor = editorModule.init(_editorClassName);
			 /*annotations
                 ERROR_MARKER,
                 WARNING_MARKER,
                 TASK_MARKER,
                 BREAKPOINT_MARKER,
                 BOOKMARK_MARKER,
                 FOLDING_MARKER,
                 CURRENT_BRACKET_MARKER,
                 MATCHING_BRACKET_MARKER,
                 CURRENT_LINE_MARKER,
                 CURRENT_SEARCH_MARKER,
                 MATCHING_SEARCH_MARKER,
                 READ_OCCURRENCE_MARKER,
                 WRITE_OCCURRENCE_MARKER,
                 SELECTED_LINKED_GROUP_MARKER,
                 CURRENT_LINKED_GROUP_MARKER,
                 LINKED_GROUP_MARKER,
                 BLAME_MARKER,
                 CURRENT_BLAME_MARKER
			 */
			 
			 ERROR_MARKER    = editorModule.ERROR_MARKER;
			 WARNING_MARKER  = editorModule.WARNING_MARKER;
			 BOOKMARK_MARKER = editorModule.BOOKMARK_MARKER;
			 
	         
//	         //make editor resizable (using jQuery UI)
//	         $('.editor').resizable({
//	        	 stop: function( event, ui ) { editor.resize(); }
//	         });
			 
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
				 
				 
				 
				 mainView.init(editor);
			 });

	 });
	
	})();

}());
