
var mmir = window.mmir || {};

(function () {

    mmir.require = require.config({

      debugMode: true,

     	context: 'mmirtestsemint',//requirejs module context: MMIR Test Semantic Interpreter

  		config: {
  			'initApp': {
  				grammarEditorClass: 'editor',
  				waitDialogCssPath: 'appTestSemantic/css/'
  			}
		},

		paths : {

		    // core
	 	    'mmirf/main': 'mmirf/main'

		    // globals and AMDs
	 	    , 'mmirf/constants': 'mmirf/tools/constants'
	 	    , 'mmirf/commonUtils': 'mmirf/tools/commonUtils'
		    , 'mmirf/stringExtension': 'mmirf/tools/extensions/StringExtensions'
		    , 'mmirf/dictionary': 'mmirf/tools/dictionary'
		    , 'mmirf/paramsParseFunc': 'mmirf/tools/paramsParseFunc'
			  , 'mmirf/env': 'mmirf/tools/envDetect'
			  , 'mmirf/envInit': 'mmirf/tools/envInit'

        , 'mmirf/encodeUtils': 'mmirf/tools/extensions/EncodeUtils'

		    // @chsc03 required by contentElement, renderUtils, declared in presentationManager
		    , 'mmirf/languageManager': 'mmirf/manager/settings/languageManager'
		    , 'mmirf/configurationManager': 'mmirf/manager/settings/configurationManager'

	    	//MD5 checksum computation: for checking pre-compiled resources, e.g.
	    	// grammars (JSON->JS), and templates (eHTML->JS)
	    	, 'mmirf/md5' : 'mmirf/vendor/libs/md5'
	    	, 'mmirf/checksumUtils' : 'mmirf/tools/checksumUtils'

		    , 'mmirf/logger' : 'mmirf/tools/logger'
		    , 'mmirf/stacktrace' : 'mmirf/vendor/libs/stacktrace-v0.6.4'

			//grammar related
			, 'mmirf/grammarConverter' : 'mmirf/semantic/grammarConverter'
			, 'mmirf/semanticInterpreter' : 'mmirf/semantic/semanticInterpreter'
			, 'mmirf/asyncGrammar': 'semantic/asyncGrammar'
			, 'mmirf/jscc':  'mmirf/vendor/libs/jscc-amd'
			, 'mmirf/jison': 'mmirf/vendor/libs/jison'
			, 'mmirf/pegjs': 'mmirf/vendor/libs/peg-0.9.0'
			, 'mmirf/asyncGen': 'mmirf/env/grammar/asyncGenerator'
			, 'mmirf/jsccGen':  'mmirf/env/grammar/jsccGenerator'
			, 'mmirf/jsccAsyncGen':  'mmirf/env/grammar/jsccAsyncGenerator'
			, 'mmirf/jisonAsyncGen': 'mmirf/env/grammar/jisonAsyncGenerator'
			, 'mmirf/jisonGen': 'mmirf/env/grammar/jisonGenerator'
			, 'mmirf/pegjsGen': 'mmirf/env/grammar/pegjsGenerator'
			, 'mmirf/pegjsAsyncGen': 'mmirf/env/grammar/pegjsAsyncGenerator'

      // libs
      , 'jquery': 'appTestSemantic/libs/jquery-3.2.1'
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

			'mmirf/pegjs':       	{exports: 'PEG'}
			, 'mmirf/md5': 			{exports : 'CryptoJS'}

		  , 'jsonlint' : 		{exports: 'jsonlint'}
			, 'w2ui': 			['jquery']

		},

    packages: [{
  		'name': 'mmirf/util'
  		, 'location': 'mmirf/tools/util_purejs'
    }]
    });

    //start application:
    mmir.require(['app']);

}());
