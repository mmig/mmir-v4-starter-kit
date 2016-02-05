
//dependencies: w2popup


/**
  * 
  * @class TestGrammarApp
  * @name TestGrammarApp
  */
define(['require', 'jquery', 'mainView', 'appUtil'
        , 'constants', 'commonUtils', 'languageManager', 'configurationManager', 'semanticInterpreter', 'grammarConverter'
        , 'mainView', 'validationUtil', 'checksumUtils', 'waitDialog'
        , 'initApp', 'w2ui'
    ], 
function(require, $, view, util
		, constants, commonUtils,languageManager, configurationManager,semanticInterpreter, GrammarConverter
		, mainView, validationUtil, checksumUtils, waitDialog
//		, init, w2ui //w2uipopup
){
	

	/**
	 * @private
	 * @memberOf TestGrammarApp
	 */
	var IS_FILE_READING_API = false;
	
	/**
	 * enable/disable additional processing for stopwords by using an
	 * alternative function for removing stopwords.
	 * 
	 * @private
	 * @memberOf TestGrammarApp
	 */
	var isEnableAlternateStopwordProcessing = false;
	
	/**
	 * the document's search/query part of its URL.
	 * @private
	 * @type String
	 * @memberOf TestGrammarApp
	 */
	var params = document.location.search;
	if( /[\?&]enable-alt=true/igm.test(params) ){
		isEnableAlternateStopwordProcessing = true;
	}
	
	//if alt-stopword processing is disabled:
	//  hide/remove corresponding GUI elements on page
	//  (and use remaining space for default GUI elements instead)
	if( ! isEnableAlternateStopwordProcessing){
		
		$(function(){
			$('#altProcInterpretationCol').hide();
			$('#altProcStopwordCol').hide();
//				$('#defaultProcInterpretationCol').attr('colspan','2').css('width','50%');
//				$('#defaultProcStopwordCol').attr('colspan','2').css('width','50%');
		});
		
	}
	
	/**
	 * ID for the grammar generator / engine -- see mmirf/env/grammar/*
	 * 
	 * @private
	 * @type String
	 * @memberOf TestGrammarApp
	 */
	var _initialGrammarGenerator = configurationManager.get('grammarCompiler', true, void(0));

	/**
	 * parse query/search string for grammar-generator "argument"
	 * 
	 * @private
	 * @type RegExp
	 * @memberOf TestGrammarApp
	 */
	var matchGenParam = /[\?&]gen=([^&]+)/igm.exec(params);
	if(matchGenParam){
		_initialGrammarGenerator = matchGenParam[1];
	};

	/**
	 * App initializer (triggered on-doc-ready by jQuery; see below)
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	var _initAppOnDocReady = function() {

		//export dependencies into global mmir-package
		// (we need to do this explicitly, since we did not use the framework's init-mechanism)
		mmir = {
				/** @memberOf mmir */
				Constants: constants,
				CommonUtils: commonUtils,
				LanguageManager: languageManager,
				SemanticInterpreter: semanticInterpreter
		};


		console.log('dom ready');

		// start commonUtils
		commonUtils.init()

		// start the app
		.then(function() {
			
			//trigger initialization of the main-view:
			initMainView(semanticInterpreter);

		});

		mainView.init(editor);
	};
	//register with jQuery ondocready:
	$(_initAppOnDocReady);
	
	
	
	/**
	 * Initialize the main-view 
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	var initMainView = function initPageImpl(semanticInterpreter){
	
//		semanticInterpreter = mmir.SemanticInterpreter.getInstance();
		semanticInterpreter.get_json_grammar_url = function(id) { return 'config/languages/'+id+'/grammar.json'; };
		
		if(_initialGrammarGenerator && _initialGrammarGenerator !== semanticInterpreter.getGrammarEngine()){
			semanticInterpreter.setGrammarEngine(_initialGrammarGenerator);
		}
		
		var grammarCompileMode = configurationManager.get('grammarAsyncCompileMode', true);
		if(typeof grammarCompileMode !== 'undefined'){
			semanticInterpreter.setEngineCompileMode(grammarCompileMode);
		}
		
		var languageManager = mmir.LanguageManager.getInstance();
				
		//get a default/"starting" language
		var defLang = languageManager.getLanguage();
		if( ! languageManager.existsGrammar(defLang)){
			defLang = null;
		}

		//create list with languages for which a grammar is available
		var allLangs = languageManager.getLanguages();
		var langs = [];
		for(var i=0, size = allLangs.length; i < size ; ++i){
			
			if(languageManager.existsGrammar(allLangs[i])){
				langs.push( allLangs[i] );
				
				if(defLang === null){
					defLang = allLangs[i];
				}
			}
			
		}
		
		if(defLang === null){
			defLang = '';
		}
		
		
		var isLang = function(id){
			for(var i=0,size=langs.length; i < size; ++i){
				if(langs[i] === id){
					return true;
				}
				return false;
			}
		};
		
		//include "synthetic" URL in generated compilers
		// if browser/execution environments supports this feature, then the eval()'ed compilers will
		// be available in the debugger at source-URL
		configurationManager.set('grammar.jscc.genSourceUrl', true);
		configurationManager.set('grammar.jison.genSourceUrl', true);
		configurationManager.set('grammar.pegjs.genSourceUrl', true);

		
		////////////////// Initialize Sidebar: //////////////////////////
		
		var defLangViewModel, _tmpViewModel, _tmpId;
		for(var i=0,size=langs.length; i < size; ++i){
			
			_tmpId = langs[i];
			_tmpViewModel = view.addProjectGrammar(_tmpId, semanticInterpreter.get_json_grammar_url(_tmpId));
			
			if(_tmpId === defLang){
				defLangViewModel = _tmpViewModel;
			}
		}

		if(defLangViewModel){
			view.selectGrammar(defLangViewModel.viewId);
			//HACK: UI may not be fully initialized yet
			//		... as a result, the emulated click may not (visually) mark the entry as selected
			//      -> need to explicitly set the entry as selected
			view.__setGrammarSelected(defLangViewModel.viewId);
		}
		
//		$('#grammar-id').val(defLang);//TOD replace grammar-id element with property in data-model
		
		/**
		 * Handler function that is trigger when a grammar-item is selected in main view (sidebar).
		 * 
		 * @private
		 * @name onGrammarSelectHandler
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var onGrammarSelectHandler = function(event, ui) {
			

			var prevGrammarItem = view.getSelectedGrammarItem();
			var prevGrammarId, prevGrammarViewId;
			if(prevGrammarItem){
				prevGrammarId = prevGrammarItem.model.id;//$('#grammar-id').val();
				prevGrammarViewId = prevGrammarItem.model.viewId;
			}
			view.updateCurrentGrammarText();
			
			var currentGrammarModel = view.getGrammarItem(event).model;
			var currentGrammarId = currentGrammarModel.id;
			
			//FIX russa: need to remove GrammarConvert from SemanticInterpreter:
			//    otherwise, the newly compiled grammar will modify the
			//    existing/registered grammar (with the same ID)
			//    ... which would not be a problem, if we dicard the old grammar,
			//    but in case of the Grammar Editor we may want to reload the
			//    old grammar again, so we need to protect it from modification
			//    by removing it, before we compile the new grammar.
			if(prevGrammarId === currentGrammarId){//need to remove old grammar (but only if they have different types ... TODO check types too)
				semanticInterpreter.removeGrammar(prevGrammarId);
			}
			
			var currentLangSelection = currentGrammarId;//$(this).val();
//			$('#grammar-id').val(currentLangSelection);
			
			//FIXME TODO add re-load action for AJAX-loaded grammars (i.e. type 'project' / for 'file', re-load could open the file-selection dlg...?)
			if(currentGrammarModel.type === 'project' && !currentGrammarModel.getJson() ){
			
				var callback = function (jsonGrammar, grammarText){
					if(jsonGrammar){
						
						currentGrammarModel.setJson(jsonGrammar);
						currentGrammarModel.setJsonText(grammarText);
						
						view.clearView();
						
						initPageWithJsonGrammar(view, currentGrammarModel, function(){
							//set "saved-dirty" to false (this JSON was loaded from a file)
							view.setDirtySaved(false);
							
							view.verifyDirtyCompiled(currentGrammarModel);
						});
					}
					else {
						// loading failed -> "revert" selection
						
						currentGrammarModel.isMissingResource = true;
						console.error('faild to load grammar from "'+ currentGrammarModel.url+'"');
						
						//TODO: remove sidebar-entry?
						view.disableSidbarItem(currentGrammarModel.viewId);
						view.selectGrammar(prevGrammarViewId);
					}
				};
				_loadJsonGrammar(currentGrammarModel, callback);
				
			}
			else if(currentGrammarModel.type === 'file' || currentGrammarModel.type === 'compiled' || currentGrammarModel.type === 'project'){
				
				//set "saved-dirty" to false, if the JSON was loaded from a file
				var isSavedDirty = currentGrammarModel.type === 'file' || currentGrammarModel.type === 'project' || ! currentGrammarModel.isStored();
				var callback = function(){
					view.updateDirtySaved(isSavedDirty);
					view.verifyDirtyCompiled(currentGrammarModel);
				};
				
				initPageWithJsonGrammar(view, currentGrammarModel, callback);
				
			}
			else {
				console.error('unknow grammar data: ', currentGrammarModel);
			}
			
		};//END: onGrammarSelectHandler(event, ui) {
		view.onGrammarSelect(onGrammarSelectHandler);
		
		

		////////////////// Initialize Toolbar: //////////////////////////
		/**
		 * Helper for executing a specific download-action.
		 * Used in {@link #handleDownload}.
		 * 
		 * @private
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var createDownload = function(action){
			var strData, fileName;
			switch(action){
			case 'save-json':
				fileName = 'grammar.json';
				strData = view.getJsonGrammarText();
				
				//HACK reset "saved-dirty" flag (but really we do not know, if saving was successful...)
				view.setDirtySaved(false);
				
				break;
			case 'save-js':
				fileName = view.getSelectedGrammarId() + '_grammar.js';
				strData = view.getCompiledGrammarText();
				break;
			case 'save-checksum':
				fileName = 'grammar.json_' + view.getSelectedGrammarId() + '.checksum.txt';
				strData = checksumUtils.createContent( view.getJsonGrammarText() );
				break;
			case 'save-grammar-def':
				fileName = 'grammar.' +  semanticInterperter.getGrammarEngine() + '.def.txt';
				strData = view.getIntermediateGrammarText();
				break;
			default:
				console.error('unknown SAVE operation, triggered from ', event.target);
				return;/////////////////////// EARLY EXIT ////////////////////////////
			}
			
			return {data: strData, file: fileName};
		};

		semanticInterperter = require('semanticInterpreter');
		/**
		 * Handler function for toolbar button/menu "Save ..."
		 * 
		 * @private
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var handleDownload = function(event){
			
			var selection = event.target? event.target : event;
			if( ! /^select-save-action:/.test(selection)){
				return;/////////////////////// EARLY EXIT /////////////////////////
			}
			
			//extract save-action from event
			//EXAMPLE: event.target === "select-save-action:save-js"
			var action = /:(.+?)$/.exec(selection);
			action = action && action.length > 1? action[1] : void(0);
			
			//NOTE this handler will also be called for opening/closing the menu.
			// EXAMPLE: event.target === "select-save-action"
			if(!action){
				return;/////////////////////// EARLY EXIT //////////////////////
			}
			
			if(action === 'save-all'){
				var actions = ['save-json', 'save-js', 'save-checksum', 'save-grammar-def'];
				var act, data;
				for(var i=0,size=actions.length; i < size; ++i){
					act = actions[i];
					data = createDownload(act);
					if(!data){
						console.error('ERROR -> no data for SAVE ACTION: '+act);
					}
					else {
						view.triggerDownload(data.data, data.file);
					}
				}
			}
			else {
				var data = createDownload(action);
				if(!data){
					console.error('unknow SAVE ACTION: '+action);
				}
				else {
					view.triggerDownload(data.data, data.file);
				}
			}
			
		};
		
		/**
		 * HELPER create an "info item" for menus
		 * @private
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var _createMenuBtnInfo = function(savePath, id){
			var infoSaveBtn = view.__getToolbarButton(savePath, id);
			infoSaveBtn.disabled = true;
			return infoSaveBtn;
		};
		
		//TODO menu-creation (with view-internal objects) should be done within view! 
		var saveEntries = [];
		saveEntries.push(view.__getToolbarButton('Save JSON...', 				'save-json'));
		saveEntries.push(_createMenuBtnInfo('/www/config/languages/&lt;ID&gt;/grammar.json', 'save-json-info'));
		saveEntries.push(view.__getToolbarButton('Save JS...', 					'save-js'));
		saveEntries.push(_createMenuBtnInfo('/www/gen/grammar/&lt;ID&gt;_grammar.js', 'save-js-info'));
		saveEntries.push(view.__getToolbarButton('Save Checksum...',	 		'save-checksum'));
		saveEntries.push(_createMenuBtnInfo('/www/gen/grammar/grammar.json_&lt;ID&gt;.checksum.txt', 'save-checksum-info'));
		saveEntries.push(view.__getToolbarSeparator());
		saveEntries.push(view.__getToolbarButton('Save Grammar Def...',			'save-grammar-def'));
		saveEntries.push(view.__getToolbarButton('Save All...', 				'save-all', function(){ console.error('TODO impl. save-all!'); }));
		
//		view.addToolbarButton('Save JSON...', 					'save-json', handleDownload);
//		view.addToolbarButton('Save JS...', 					'save-js', handleDownload);
//		view.addToolbarButton('Save Checksum...',	 			'save-checksum', handleDownload);
//		view.addToolbarButton('Save Intermediate Grammar...', 	'save-grammar-def', handleDownload);
////		view.addToolbarButton('Save All...', 					'save-all', function(){ console.error('TODO impl. save-all!'); });
		
		/**
		 * Toolbar menu entry for save/download actions
		 * @private
		 * @type ToolbarMenu
		 * @memberOf TestGrammarApp.MainView
		 */
		var saveActionSelectMenu = {type: 'menu',   id: 'select-save-action', caption: 'Save...', icon: 'fa fa-floppy-o', items: saveEntries};
		view.__addToolbar(saveActionSelectMenu, {event: 'click', func: handleDownload}, true);
		
		
		
		view.addToolbarSeparator();
		
		initFileApi(view);//<- adds "Load..." to toolbar
		
		
		view.addToolbarSeparator();
		
		
		
		view.addToolbarButton('Compile', 'compile-grammar', function(){ compileCurrentInput(view); });
		
//		semanticInterperter = require('semanticInterpreter');
		/**
		 * Handler for selecting a grammar engine in toolbar menu.
		 * @private
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var handleSelectEngine = function(event){
			
			var selection = event.target? event.target : event;
			if( ! /^select-grammar-engine:/.test(selection)){
				return;
			}
			
			//extract engine-ID from event
			//EXAMPLE: event.target === "select-grammar-engine:jison-engine"
			var engineId = /:(.+?)$/.exec(selection);
			engineId = engineId && engineId.length > 1? engineId[1] : void(0);
			
			//NOTE this handler will also be called for opening/closing the menu.
			// EXAMPLE: event.target === "select-grammar-engine"
			if(!engineId){
				return;
			}
			
			//extract engine name from engine-ID, EXAMPLE STRING: "jison-engine"
			var engine = /^(.+?)-/.exec(engineId)[1];
			
			if(engine !== semanticInterperter.getGrammarEngine()){
				//select the engine:
				semanticInterperter.setGrammarEngine(engine);
				
				view.setGrammarEngineSelected(semanticInterperter.getGrammarEngine());
				
				view.setDirtyCompiled();
			}
		};
		
		//TODO menu-creation (with view-internal objects) should be done within view! 
		var engineEntries = [];
		engineEntries.push(view.__getToolbarButton('JSCC Engine',  'jscc-engine'));
		engineEntries.push(view.__getToolbarButton('jison Engine', 'jison-engine'));
		engineEntries.push(view.__getToolbarButton('PEGjs Engine', 'pegjs-engine'));
		/**
		 * Toolbar menu entry for selecting a grammar engine.
		 * @private
		 * @type ToolbarMenu
		 * @memberOf TestGrammarApp.MainView
		 */
		var engineSelectMenu = {type: 'menu',  id: 'select-grammar-engine', caption: 'Grammar Compiler', icon: 'fa fa-cogs', items: engineEntries};
		view.__addToolbar(engineSelectMenu, {event: 'click', func: handleSelectEngine}, true);
		
		view.selectGrammarEngine(semanticInterperter.getGrammarEngine() + '-engine');
		view.setGrammarEngineSelected(semanticInterperter.getGrammarEngine());
		
		view.addToolbarSeparator();
		
//		var validateLabel = 'Validate';
		var validateIconLabel = '<span class="fa-stack fix-w2ui-toolbar-icon"><i class="fa fa-file-o fa-stack-1x fa-lg"></i> <i class="fa fa fa-check fa-stack-1x"></i></span> <span>Validate</span>';
		view.addToolbarButton(validateIconLabel, 'validate-grammar', function(){ view.validateGrammar(); });
		
		var isAutoValidationEnabled = view.isAutoValidationEnabled();
		view.addToolbarStateButton('Auto Validation', 'auto-validation', function(evt){
			view.setAutoValidationEnabled( ! evt.item.checked );
		}, isAutoValidationEnabled);

		view.addToolbarSeparator();
		
		
		/**
		 * Helper for getting the corresponding function name for an "recode action"
		 * Used in {@link #handleGrammarRecode}.
		 * @private
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var getGrammarRecodeFunction = function(recodeFuncAction){
			
			switch(recodeFuncAction){
			case 'mask':
				return 'maskJSON';
			case 'unmask':
				return 'unmaskJSON';
			case 'encode-umlauts':
				return 'encodeUmlauts';
			case 'decode-umlauts':
				return 'decodeUmlauts';
			default:
				return;//DEFAULT: return void
			}
			
		};
		/**
		 * Helper for getting the corresponding function name for an help/info item in the "recode menu"
		 * Used in {@link #handleGrammarRecode}.
		 * @private
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var getGrammarRecodeInfo = function(recodeFuncAction){

			switch(recodeFuncAction){
			case 'info-mask':
				return 'popupMaskingInfo';
			case 'info-upgrade':
				return 'popupFormatConversionInfo';
			default:
				return;//DEFAULT: return void
			}
			
		};
		/**
		 * Handler for menu selection in toolbar menu "recode tools"
		 * @private
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var handleGrammarRecode = function(event){
			
			var recodeTool = event.target? event.target : event;
			if( ! /^grammar-tool-recode:/.test(recodeTool)){
				return;
			}
			
			//extract recode-function from event
			//EXAMPLE: event.target === "grammar-tool-recode:unmask"
			var recodeFuncAction = /:(.+?)$/.exec(recodeTool);
			recodeFuncAction = recodeFuncAction && recodeFuncAction.length > 1? recodeFuncAction[1] : void(0);
			
			var infoAction, recodeFunc;
			if(recodeFuncAction === 'reformat-json-grammar'){
				
				var text = view.getJsonGrammarText();
				var json = _inputTextToJSON(view, text);
				if(json){
					view.setJsonGrammarText( util.formatJson(json) );
				}
				
			}
			else if(recodeFunc = getGrammarRecodeFunction(recodeFuncAction)){
				var selectedGrammar = view.getSelectedGrammarItem();
				if(selectedGrammar){
					_convertJsonTo(view, selectedGrammar.model, recodeFunc);
				}
				else {
					console.error('Grammar Tool: no (valid) grammar selected, could not execute "'+recodeFunc+'"');//TODO show error to the app-console?
				}
			}
			else if(infoAction = getGrammarRecodeInfo(recodeFuncAction)){
				
				var dlg = $('#'+infoAction);
				var title = dlg.data('title');
				
				_showInfoDialog(title, dlg.html());
			}
			else {
				//this should not happen...
				console.error('Grammar Tool: invalid grammar action: "'+recodeFuncAction+'"');
			}
			
		};
		
		//TODO menu-creation (with view-internal objects) should be done within view! 
		var grammarToolEntries = [];
		grammarToolEntries.push(view.__getToolbarButton('masking...', 'info-mask'));
		grammarToolEntries.push(view.__getToolbarButton('show non-ASCII masking',  'mask'));
		grammarToolEntries.push(view.__getToolbarButton('hide non-ASCII masking', 'unmask'));
		grammarToolEntries.push(view.__getToolbarSeparator());
		grammarToolEntries.push(view.__getToolbarButton('upgrading...', 'info-upgrade'));
		grammarToolEntries.push(view.__getToolbarButton('downgrade to old non-ASCII coding', 'encode-umlauts'));
		grammarToolEntries.push(view.__getToolbarButton('upgrade from old non-ASCII coding', 'decode-umlauts'));
		grammarToolEntries.push(view.__getToolbarSeparator());
		grammarToolEntries.push(view.__getToolbarButton('Reformat JSON', 'reformat-json-grammar'));
		/**
		 * Toolbar menu "Grammar Tools" (recode tools).
		 * @private
		 * @type ToolbarMenu
		 * @memberOf TestGrammarApp.MainView
		 */
		var grammarToolMenu = {type: 'menu',   id: 'grammar-tool-recode', caption: 'Grammar Tools', icon: 'fa fa-wrench', items: grammarToolEntries};
		view.__addToolbar(grammarToolMenu, {event: 'click', func: handleGrammarRecode}, true);
		
		view.addToolbarSeparator();
		
		
		view.addToolbarStateButton('Console', 'toggle-console', function(){ view.toggleConsole(); });
		
		//TODO this is a HACK for including a "stacked" font-awesome icon (-> define it within the label) ... but e.g. this needs to explictly set the color in order to match the other icons...
		var terminalIconlabel = '<span class="fa-stack fix-w2ui-toolbar-icon"><i class="fa fa-square-o fa-stack-2x"></i> <i class="fa fa-terminal fa-stack-1x"></i></span> <span>Test</span>';
		view.addToolbarStateButton(terminalIconlabel, 'toggle-interpreter', function(){ view.toggleInterpreter(); });
		
		view.clickToolbarButton('toggle-interpreter');
		
		view.addToolbarSeparator();
		
		
		view.__addToolbar({type: 'spacer', id: 'spacer1'});
		
		view.addToolbarButton('Help', 'app-help', function(){ 
			var dlg = $('#popupAppHelpInfo');
			var title = dlg.data('title');
			
			_showInfoDialog(title, dlg.html());
		});
		
		
		////////////////// Intialize Test Interpretation Panel: //////////////////////////
		
		/**
		 * Handler for <code>interpretation</code> (i.e. test semantics extraction for a phrase)
		 * @private
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var handleProcessInterpretation = function(event){//expects: data.view <- view
			event.preventDefault();
			var view = event.data.view;
			var viewModel = view.getSelectedGrammarItem().model;
			processInterpretation(view, viewModel);
		};
		
		//NOTE: need to register handlers on document.body, since the elements themsevels may 
		//      get removed / re-added from the document (which would remove their handlers)
		$(document.body).on('click', '#btn-test-semantic', {view: view}, handleProcessInterpretation);
		$(document.body).on('submit', '#form-test-semantic', {view: view}, handleProcessInterpretation);
		
		/**
		 * Handler for <code>benchmark interpretation function</code>
		 * @private
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var handleBenchmarkInterpretation = function(event){//expects: data.view <- view
			event.preventDefault();
			var view = event.data.view;
			var viewModel = view.getSelectedGrammarItem().model;
			benchmarkInterpretation(view, viewModel);
		};
		
		//NOTE: need to register handlers on document.body, since the elements themsevels may 
		//      get removed / re-added from the document (which would remove their handlers)
		$(document.body).on('click', '#btn-benchmark-semantic', {view: view}, handleBenchmarkInterpretation);
		
		
		//////////////////Intialize Test Stopword Panel: //////////////////////////
		/**
		 * Handler for <code>stopword removal</code> (i.e. test stopword removal for a phrase)
		 * @private
		 * @type Function
		 * @memberOf TestGrammarApp.MainView
		 */
		var handleTestStopword = function(event){//expects: data.view <- view
			event.preventDefault();
			var view = event.data.view;
			var viewModel = view.getSelectedGrammarItem().model;
			processStopword(view, viewModel);
		};

		//NOTE: need to register handlers on document.body, since the elements themsevels may 
		//      get removed / re-added from the document (which would remove their handlers)
		$(document.body).on('click', '#btn-test-stopword', {view: view}, handleTestStopword);
		$(document.body).on('submit', '#form-test-stopword', {view: view}, handleTestStopword);
		

//		var createInfoPopUp = function(dialogElementId, buttonId){
//			
////			$('#'+dialogElementId).dialog({
////				modal: true,
////				dialogClass: 'info',
////				autoOpen: false
////			});
////			$('#'+buttonId).button({
////				icons: { primary: 'ui-icon-info' },
////				text: false
////			}).on('click', function(event){
////				event.preventDefault();
////				$('#'+dialogElementId).dialog('open');
////			});
//			
//			$('#'+buttonId).on('click', function(event){
//				$(this).w2overlay({ html: $('#'+dialogElementId).html()});
//			});
//		};
//		
//		createInfoPopUp('popupGrammarIdInfo','openPopupGrammarIdInfo');
		
		
//		util.cleanInlineHandler();
//		
		
		//export showWait/hideWait to mainView
//		mainView.showWaitDialog = _showLoader;
		mainView.hideWaitDialog = _hideLoader;
	};
	
	/**
	 * Set a grammar (JSON-text, intermediate grammar-text, compiled JS-text) in
	 * the main view.
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function initPageWithJsonGrammar(view, viewModel, callback) {
		
		var doSetViewWithCompiledGrammar = function() {
			
			view.setIntermediateGrammarText( viewModel.getIntermediateGrammar() );
			view.setJsonGrammarText(viewModel.getJsonText());
			view.setCompiledGrammarText( viewModel.getCompiledGrammar() );

			var jsonGrammar = viewModel.getJson();
			var examplePhrase = '';
			if (typeof jsonGrammar.example_phrase !== 'undefined') {
				examplePhrase = jsonGrammar.example_phrase;
			}

			view.setTestInterpretationText(examplePhrase);
			
			processInterpretation(view, viewModel);

			_hideLoader();
			
			if(callback){
				callback();
			}
		};
		
		//do not proceed, if we already have the compiled JavaScript
		var gc = viewModel.getGrammarConverter();
		if(gc && gc.getGrammarDef() && gc.getGrammarSource()){// && gc == semanticInterpreter.getGrammarConverter(viewModel.id)){
			semanticInterpreter.addGrammar(viewModel.id, gc /*FIXME need to set file-format-version!!! */);
			doSetViewWithCompiledGrammar();
			return;
		}

		var doCompile = function() {
			
			semanticInterpreter
					.createGrammar(
							viewModel.getJson(),
							viewModel.id,//getLanguage(),
							function(grammarConverter) {

								viewModel.setGrammarConverter(grammarConverter, semanticInterpreter.getGrammarEngine());
								view.updateGrammarItem(viewModel.viewId);
								doSetViewWithCompiledGrammar();
					});
		};

		_showLoader('Compiling JSON Grammar...', 50, doCompile);
	}

	var _hideLoaderTimer;
	var _showLoaderTimer;
	/**
	 * Shows a wait dialog.
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function _showLoader(text, delay, func, argsArray) {

		clearTimeout(_hideLoaderTimer);
		
		if (!delay) {
			_showLoaderTimer = setTimeout(function() {
//				w2utils.lock(w2ui.layout.box, text, true);
				waitDialog.show(text, 'app');
				if(func){
					func.apply(null, argsArray);
				}
			}, 50);
			
		} else {
			_showLoaderTimer = setTimeout(function() {
				
//					w2utils.lock(w2ui.layout.box, text, true);
					waitDialog.show(text, 'app');
					
					if(func){
						setTimeout(function() {
							func.apply(null, argsArray);
						}, delay);
					}
//				}
			}, 50);
		}

	}

	/**
	 * Hides the wait dialog
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function _hideLoader() {
//		w2utils.unlock(w2ui.layout.box);
		
		clearTimeout(_showLoaderTimer);
		
		_hideLoaderTimer = setTimeout(function(){
			waitDialog.hide('app');
		}, 50);
	}
	
	/**
	 * Modifies / cleans the JSON object:
	 * should be applied after loading and before further processing. 
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function _cleanJsonGrammar(jsonGrammar){
		
//		//DISABLED: clean-up (do not modify the grammar, in order to preserve checksum-validation)
//		if (jsonGrammar['comment_license']) {
//			delete jsonGrammar['comment_license'];
//		}
		
		return jsonGrammar;
	}
	
	/**
	 * Loads a JSON grammar via AJAX (uses viewModel.url as URL)
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function _loadJsonGrammar(viewModel, cb) {
		
		//DISABLED russa: for now, always reload the JSON-file...
//		if(viewModel.getJson() && viewModel.getJsonText()){
//			cb(viewModel.getJson(), viewModel.getJsonText());
//		}
		
		var successFunc = function(gcInstance, xhr) {
			if (gcInstance.json_grammar_definition) {
				
				//clean-up
				_cleanJsonGrammar(gcInstance.json_grammar_definition);

				cb(gcInstance.json_grammar_definition, xhr.responseText);
				
			} else {
				
				cb(false);
				
			}
		};
		
		var errorFunc = function(gcInstance) {
			//TODO replace with w2ui popup & handle error (i.e. remove or disable sidepanel entry for this grammar ...)
			alert("Initialize:\n failed to load JSON grammar file from\n '" + viewModel.url + "'!");
			cb(false);
		};

		var gc = new GrammarConverter();

		var doLoadGrammar = function() {

			gc.loadGrammar(successFunc, errorFunc, viewModel.url, false);

			_hideLoader();
		};

		_showLoader('Loading JSON Grammar...', 50, doLoadGrammar);

	}
	
	/**
	 * HELPER initializes the File API functionality, i.e. loading a file via HTML file-input.
	 * 
	 * Adds a toolbar button for loading files
	 * 
	 * OR if browser does not support File API, adds an text-input box that allows
	 * loading files via AJAX.
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function initFileApi(view) {
		
		
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			IS_FILE_READING_API = true;
			$('#file-selector').on('change', {view: view}, _loadJsonGrammarFromFile);

			view.addToolbarButton('Load JSON...', 'load-grammar', function(){
				$('#file-selector').click();
			});
			
		} else {
			
			//browser cannot load files -> provide input-box (can only load files by URLs...)

			var urlInput = view.__getToolbarButton(void(0), 'grammar-url-input-item');
			urlInput.type = 'html';
			urlInput.html = ' Grammar URL:'+
				            '    <input id="grammar-url-input-box" type="text" size="10" style="padding: 3px; border-radius: 2px; border: 1px solid silver"/>'+
				            '</div>';
			view.__addToolbar(urlInput);
			
			view.addToolbarButton('Load', 'load-grammar-url', function(){
				var urlInput = view.__getToolbarJqElement('grammar-url-input-box');
				var url = urlInput.val();
				var id = /\/([^\/]+)$/igm.exec(url);//try to use last path-segment as ID
				id = id? id[1] : url; 
				var viewModel = view.addProjectGrammar(id, url);
				view.selectGrammar(viewModel.viewId);
			});
		}
	}
	
	/**
	 * Handler for processing file selections via the File API:
	 * loads the file as JSON and adds an grammar-item to the main-view (sidebar)
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function _loadJsonGrammarFromFile(evt) {

		_showLoader('Loading JSON Grammar from file...');

		var view = evt.data.view;
		
		var files = evt.target.files; // FileList object

		// Loop through the FileList (should be only one, since "multiple" is not set)
		for (var i = 0, f; f = files[i]; i++) {

			var reader = new FileReader();
			var theFileName = f.name;

			// Closure to capture the file information.
			reader.onload = function(theFileEvent) {

				//TODO replace with w2ui popup-dlg
				var theGrammarId = prompt(
						'Please enter an ID for the grammar:', theFileName);
				if (theGrammarId === null) {
					//cancel selected -> reset file-selection-field & loader
					_hideLoader();
					$('#file-selector').val(null);
					return;///////////////////////////// EARLY EXIT ////////////////////////
				}

				var prevSel = view.getSelectedGrammarId();//$('#lang-selector option:selected').val();
//				$('#grammar-id').val(theGrammarId);				


				var grammarText = theFileEvent.target.result;
				try{
					var jsonGrammar = $.parseJSON(grammarText);
	
					_cleanJsonGrammar(jsonGrammar);
					
					var viewModel = view.addLoadedGrammar(theGrammarId, jsonGrammar, theFileName);
					viewModel.setJsonText(grammarText);
					
					view.clearView();
					
					view.selectGrammar(viewModel.viewId);
					
				} catch (err){
					//TODO show error dialog
					console.error('Error loading JSON grammar from file "'+theFileName+'": '+(err.stack?err.stack:err));
					
					
					//this will show an error message dialog to the user (with details about the JSON error)
					var json = _inputTextToJSON(view, grammarText);
					if(json){
						//this should not happen ... (-> text could be parsed as JSON!!!)
//						_showErrorDialog(
//							'Error Loading JSON File',
//							'Could not load file '+theFileName+' as JSON.',
//							'<pre>'+(err.stack?err.stack:err)+'</pre>'
//						);
						console.error('Non-native JSON successfully parsed file "'+theFileName+'", original error: '+(err.stack?err.stack:err));
					}
					
					
				}
				
				$('#file-selector').val(null);

			};

			reader.onerror = function(theFileEvent) {
				var msg = '';
				var e = theFileEvent.target.error;

				switch (e.code) {
				case FileError.QUOTA_EXCEEDED_ERR:
					msg = 'QUOTA_EXCEEDED_ERR';
					break;
				case FileError.NOT_FOUND_ERR:
					msg = 'NOT_FOUND_ERR';
					break;
				case FileError.SECURITY_ERR:
					msg = 'SECURITY_ERR';
					break;
				case FileError.INVALID_MODIFICATION_ERR:
					msg = 'INVALID_MODIFICATION_ERR';
					break;
				case FileError.INVALID_STATE_ERR:
					msg = 'INVALID_STATE_ERR';
					break;
				default:
					msg = 'Unknown Error';
					break;
				}
				;
				
				_showErrorDialog(
					'Error Loading JSON File',
					'Could not load file '+theFileName+' as JSON: '+msg,
					'<pre>'+(e.stack?e.stack:e)+'</pre>'
				);
			};

			// Read in the file as text (UTF-8)
			reader.readAsText(f);
		}
	}

	/**
	 * Handler for the "compile" action:
	 * re-compiles the current input of the editor in the main-view
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function compileCurrentInput(view) {
		
		var grammarText = view.getJsonGrammarText();
		var jsonGrammar = _inputTextToJSON(view, grammarText);
		if (!jsonGrammar) {
			return;
		}

//		clearOut(view);
		view.clearView();

		validationUtil.validateGrammar();

		semanticInterpreter = mmir.SemanticInterpreter.getInstance();

		var langCode = view.getSelectedGrammarItem().model.id;//getLanguage();

		if (semanticInterpreter.hasGrammar(langCode)) {

			//TODO replace with w2ui popup-dlg 
			langCode = prompt('About to replace grammar for:\n' + langCode
					+ '\n\n\nIf you do not want to replace the grammar\n'
					+ 'please enter a different ID:', langCode);

			if (langCode === null) {
				//-> cancel selected
				return;///////////////////////////// EARLY EXIT ////////////////////////
			}
//			else {
//				$('#grammar-id').val(langCode);
//			}
		}
		
		var viewModel = view.addCompiledGrammar(langCode, jsonGrammar);
		viewModel.setJsonText(grammarText);

		view.selectGrammar(viewModel.viewId);

	}
	
	/**
	 * Handler for "test interpretation" action
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function processInterpretation(view, viewModel) {

		var asr_result = view.getTestInterpretationText();
		
		var res, res2;
		try{
			res = semanticInterpreter.getASRSemantic(asr_result.toLowerCase(), viewModel.id);
		} catch (err){
			view.printError('Could not evalute phrase "'+asr_result+'": '+err);
		}

		
		if (isEnableAlternateStopwordProcessing) {
			try{
				res2 = semanticInterpreter.getASRSemantic_alt(asr_result.toLowerCase(), viewModel.id);
			} catch (err2){
				view.printError('Could not evalute (ALTERNATIVE METHOD) phrase "'+asr_result+'": '+err2);
			}
		}

		view.clearInterpretationTestResult();

		$('#benchmark-time').text('');
		$('#benchmark-time-mod').text('');

		view.setInterpretationTestResult(res);

		if (isEnableAlternateStopwordProcessing) {
			view.setInterpretationTestResult(res2, true);
		}

		processStopword(view, viewModel, asr_result);
	}

	/**
	 * Handler for "benchmark interpretation function" action.
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function benchmarkInterpretation(view, viewModel) {

		var asr_result = view.getTestInterpretationText();

		var res, res2;
		var isAbortBenchmark = false;
		try{
			res = semanticInterpreter.getASRSemantic(asr_result.toLowerCase(), viewModel.id);
		} catch (err){
			isAbortBenchmark = 'Canceled benchmarking: Cannot evalute phrase "'+asr_result+'": '+err;
			view.printError(isAbortBenchmark);
		}
		
		if (isEnableAlternateStopwordProcessing) {
			try{
				res2 = semanticInterpreter.getASRSemantic_alt(asr_result.toLowerCase(), viewModel.id);
			} catch (err){
				var errMsg = 'Canceled benchmarking: Cannot evalute (ALTERNATIVE METHOD) phrase "'+asr_result+'": '+err;
				view.printError(errMsg);
				if(isAbortBenchmark){
					isAbortBenchmark += errMsg;
				} else {
					isAbortBenchmark = errMsg;
				}
			}
			
		}
		
		if(isAbortBenchmark){
			_showErrorDialog(
					'Canceled Benchmarking',
					'Cancled benchmarking, because of an evalution error in the test phrase.',
					isAbortBenchmark
			);
			return;///////////////////////////// EARLY EXIT ////////////////////////
		}

//		clearInterpret(view);
		view.clearInterpretationTestResult();

		var DEFAULT_ITERATIONS = 10000;//TODO make this configurable
		var iterations = DEFAULT_ITERATIONS;

		//TODO replace with w2ui popup-dlg
		iterations = prompt(
				'Starting Benchmark for evaluting Stopword-Processing implementations.'
						+ '\n\nWARNING: This may take several minutes.'
						+ '\n\nSpecifiy loops for repeat:', iterations);

		//was cancel selected?
		if (iterations === null) {
			return;///////////////////////////// EARLY EXIT ////////////////////////
		}

		iterations = parseInt(iterations);

		if (isNaN(iterations)) {
			iterations = DEFAULT_ITERATIONS;
		}

		var doStartBenchmark = function() {

			var startTime = new Date();
			for (var i = 0; i < iterations; ++i) {
				semanticInterpreter.getASRSemantic(asr_result.toLowerCase(), viewModel.id);
			}
			var diffTime = new Date() - startTime;

			$('#benchmark-time').text(iterations + ' interations in ' + diffTime + ' ms');

			if (isEnableAlternateStopwordProcessing) {
				var startTimeAlt = new Date();
				for (var i = 0; i < iterations; ++i) {
					semanticInterpreter.getASRSemantic_alt(asr_result.toLowerCase(), viewModel.id);
				}
				var diffTimeAlt = new Date() - startTimeAlt;

				$('#benchmark-time-mod').text(
						iterations + ' interations in ' + diffTimeAlt
								+ ' ms (alt. method)');
			}

			view.setInterpretationTestResult(res);

			if (isEnableAlternateStopwordProcessing) {
				view.setInterpretationTestResult(res2, true);
			}

			processStopword(view, viewModel, asr_result);

			_hideLoader();
		};

		_showLoader('Benchmarking (' + iterations + ' loops)...', 50,
				doStartBenchmark);

	}

	/**
	 * Handler for "test stopword removal" action.
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function processStopword(view, viewModel, text) {
		
		if (typeof text === 'undefined' || text == null) {
			//no text in arguments -> use the text from input-field
			text = view.getTestStopwordText();
		}
		else {
			//text in arguments: triggered by processInterpretation -> set the input-field to text
			view.setTestStopwordText(text);
		}
		
		var res;
		try{
			res = semanticInterpreter.removeStopwords(text, viewModel.id);
		} catch (err){
			view.printError('Could not remove stopwords in phrase "'+text+'": '+err);
		}
		

		var res2;
		if (isEnableAlternateStopwordProcessing) { 
			try{
				res2 = semanticInterpreter.removeStopwords_alt(text, viewModel.id);
			} catch (err){
				view.printError('Could not remove stopwords (ALT METHOD) in phrase "'+text+'": '+err);
			}
		}
		
		view.clearStopwordTestResult();
		
		view.setStopwordTestResult(res);
		
		if (isEnableAlternateStopwordProcessing) {
			view.setStopwordTestResult(res2, true);
		}
	}
	
	/**
	 * HELPER for executing a "recode grammar" action
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 * 
	 * @param {MainView} view
	 * 					the main view
	 * @param {GrammarViewModel} viewModel
	 * 					the view model with the grammar data
	 * @param {String} convertFuncName
	 * 					the name of the converter-function that should
	 * 					be applied to the JSON grammar object.
	 * 					Supported converter-functions:
	 * 					<code>{@link GrammarConverter#maskJSON}</code>
	 * 					<code>{@link GrammarConverter#unmaskJSON}</code>
	 * 					<code>{@link GrammarConverter#encodeUmlauts}</code>
	 * 					<code>{@link GrammarConverter#decodeUmlauts}</code>
	 */
	function _convertJsonTo(view, viewModel, convertFuncName){
		
		var jsonFromEditor = _inputTextToJSON(view);
		if (!jsonFromEditor) {
			//NOTE: if there was a parsing error for the JSON, 
			//      _inputTextToJSON() already showed an error message.
			return;
		}

		var converter = new GrammarConverter();
		
		var recodingFunc;
		if(convertFuncName === 'encodeUmlauts' || convertFuncName === 'decodeUmlauts'){
			//-> these need to mapped to the generic recoding-function of GrammarConverter
			//set the specific recoding-function (used by the generic JSON-recoder):
			recodingFunc = converter[convertFuncName];
			//as convert-function, set the generict recoding-function:
			convertFuncName = 'recodeJSON';
		}
		
		var jsonGrammar = converter[convertFuncName].call(converter, jsonFromEditor, recodingFunc);//FIXME should we store this modified grammar to the viewModel?

//		view.clearJsonGrammarText();
		
		//TODO instead of formatting: do "in-place" replacement of masked values (using jsonlint-loc)
		view.setJsonGrammarText( util.formatJson(jsonGrammar) );
		
	}

	/**
	 * HELPER for converting the current editor input (or the text argument)
	 * 		  into a JSON object.
	 * 
	 * If the text is an invalid JSON definition, an error dialog will be shown
	 * to the user.
	 * 
	 *  NOTE this helper should only be used in reaction to an explicit user action.
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function _inputTextToJSON(view, text) {
		
		if(typeof text === 'undefined'){
			text = view.getJsonGrammarText();
		}
		
		var jsonObj = validationUtil.validateJson(text, function(err){
			
//			var doSelectLine = function(){
//				util.selectLine(lineNo, view.getEditor());
//				setTimeout(function() {
//					util.selectLine(lineNo, view.getEditor());
//				}, 500);
//			};
			
			var msg = err.message;
			
			//show error in Error/Warning box
//			view.clearConsoleOut();
			view.printError(msg.replace(/\^\r?\n/igm, '^ \n'));//<- one "marker" at the line end gets removed -> add a space before linebreak

//			setTimeout(function() {
				
				_showErrorDialog('Error: Invalid JSON Fromat',
						'Error on parsing grammar text into a JSON object.',
						'<pre>' + msg + '</pre>'
//						, doSelectLine, doSelectLine
				);
				
//			}, 100);
		});
		
		if(jsonObj){
			return jsonObj;
		}
		return false;
	}

	/**
	 * HELPER for showing an INFO Dialog to the user.
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function _showInfoDialog(title, text, onOpenFunc, onCloseFunc) {

		var dlg = $("#infoPopup");

		if (!title) {
			title = '';
		}
		if (!text) {
			text = '';
		}

		var $title = $('#infoPopupTitle', dlg);
		$title.find('i').attr('class', 'fa fa-info-circle');//icon
		$title.find('span').html(title);//title
		
		var $content = $('#infoPopupContent', dlg);
		$content.find('#infoPopupText').html(text);//info details
		
		var onOpenWrapper = function(event){
			event.onComplete = function(){
				util.cleanInlineHandler();
			};
			if(onOpenFunc){
				onOpenFunc.apply(this,arguments);
			}
		};
		
		w2popup.open({
			title  : $title.html(),
		    body   : $content.html(),
		    width  : 700,
		    height : 450,
		    color  : '#CCE7FF',
		    onOpen : onOpenWrapper,
		    onClose: onCloseFunc
		});
	}
	
	/**
	 * HELPER for showing an ERROR Dialog to the user.
	 * 
	 * @private
	 * @type Function
	 * @memberOf TestGrammarApp
	 */
	function _showErrorDialog(title, caption, text, onOpenFunc, onCloseFunc) {

		var dlg = $("#errorPopup");

		if (!title) {
			title = '';
		}
		if (!caption) {
			caption = '';
		}
		if (!text) {
			text = '';
		}

		var $title = $('#errorPopupTitle', dlg);
		$title.find('i').attr('class', 'fa fa-exclamation-triangle');//icon
		$title.find('span').html(title);//title text
		
		var $content = $('#errorPopupContent', dlg);
		$content.find('#errorPopupCaption').html(caption);//caption
		$content.find('#errorPopupText').html(text);//details description

		var onOpenWrapper = function(event){
			event.onComplete = function(){
				util.cleanInlineHandler();
			};
			if(onOpenFunc){
				onOpenFunc.apply(this,arguments);
			}
		};
		
		w2popup.open({
			title  : $title.html(),
		    body   : $content.html(),
		    color  : '#FFC6C6',
		    onOpen : onOpenWrapper,
		    onClose: onCloseFunc
		});
	}

	return {};
});