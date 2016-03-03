
var mmir = window.mmir || {};

(function () {
    
    mmir.require = require.config({
    	
    	debugMode: true,
    	
//    	context: 'mmirtestsemint',//requirejs module context: MMIR Test Semantic Interpreter
    	
		config: {
			'initApp': {
				grammarEditorClass: 'editor',
				waitDialogCssPath: 'appTestSemantic/css/'
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

		    , 'logger' : 'mmirf/tools/logger'
		    , 'stacktrace' : 'mmirf/vendor/libs/stacktrace-v0.6.4'
		    
			//grammar related
			, 'grammarConverter' : 'mmirf/semantic/grammarConverter'
			, 'semanticInterpreter' : 'mmirf/semantic/semanticInterpreter'
			, 'asyncGrammar': 'semantic/asyncGrammar'
			, 'jscc':  'mmirf/vendor/libs/jscc-amd'
			, 'jison': 'mmirf/vendor/libs/jison'
			, 'pegjs': 'mmirf/vendor/libs/peg-0.9.0'
			, 'asyncGen': 'mmirf/env/grammar/asyncGenerator'
			, 'jsccGen':  'mmirf/env/grammar/jsccGenerator'
			, 'jsccAsyncGen':  'mmirf/env/grammar/jsccAsyncGenerator'
			, 'jisonAsyncGen': 'mmirf/env/grammar/jisonAsyncGenerator'
			, 'jisonGen': 'mmirf/env/grammar/jisonGenerator'
			, 'pegjsGen': 'mmirf/env/grammar/pegjsGenerator'
			, 'pegjsAsyncGen': 'mmirf/env/grammar/pegjsAsyncGenerator'
			
			, 'jsonlint': 'appTestSemantic/libs/jsonlint-loc'
			, 'esprima' : 'appTestSemantic/libs/esprima'
			
			, 'orioneditor': 'appTestSemantic/libs/built-editor-amd'
			
			, 'lodash': 'appTestSemantic/libs/lodash'
			
			, 'w2ui': 'appTestSemantic/libs/w2ui-1.4.2'
				
			, 'waitDialog': 'appTestSemantic/libs/stdlne-wait-dlg'
				
			//app code
			, 'app': 'appTestSemantic/app'
			, 'initApp': 'appTestSemantic/initApp'
			, 'appUtil': 'appTestSemantic/appUtil'
			, 'validationUtil': 'appTestSemantic/validationUtil'
			, 'grammarValidator' : 'appTestSemantic/jsonGrammarValidator'
			, 'grammarEditor': 'appTestSemantic/grammarEditor'
			, 'mainView': 'appTestSemantic/mainView'
			, 'viewModel': 'appTestSemantic/viewModel'
		},
	
		shim : {
			
			  'jsonlint' : 		{exports: 'jsonlint'}
			, 'pegjs':       	{exports: 'PEG'}
			
			, 'md5': 			{exports : 'CryptoJS'}
			
			, 'w2ui': 			['jquery']
	
		}
    });

    //start application:
    mmir.require(['app']);

}());
