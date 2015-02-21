
//dependencies: w2popup



define(['jquery', 'mainView', 'appUtil'
        , 'constants', 'commonUtils', 'languageManager', 'semanticInterpreter', 'grammarConverter'
        , 'mainView', 'validationUtil'
        , 'appInit', 'w2ui'
    ], 
function($, view, util
		, constants, commonUtils,languageManager,semanticInterpreter, GrammarConverter
		, mainView, validationUtil
//		, init, w2ui //w2uipopup
){
	
	var IS_FILE_READING_API = false;
	

	
	//enable/disable additional processing for stopwords by using an
	//	alternative function for removing stopwords
	var isEnableAlternateStopwordProcessing = false;
	
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
	
	//ID for the grammar generator / engine -- see mmirf/env/grammar/*
	var _initialGrammarGenerator;

	//parse query/search string for grammar-generator "argument"
	var matchGenParam = /[\?&]gen=([^&]+)/igm.exec(params);
	if(matchGenParam){
		_initialGrammarGenerator = matchGenParam[1];
	};


	$(function() {

		//export dependencies into mmir-package:
		mmir = {
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

			initPage(semanticInterpreter);// in app.js

		});



		mainView.init(editor);
	});
	
	
	
	
	var initPage = function initPageImpl(semanticInterpreter){
	
//		semanticInterpreter = mmir.SemanticInterpreter.getInstance();
		semanticInterpreter.get_json_grammar_url = function(id) { return 'config/languages/'+id+'/grammar.json'; };
		
		if(_initialGrammarGenerator && _initialGrammarGenerator !== semanticInterpreter.getGrammarEngine()){
			semanticInterpreter.setGrammarEngine(_initialGrammarGenerator);
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
		}
		
		$('#grammar-id').val(defLang);//TODO replace grammar-id element with property in data-model
//		theJSONGrammarURL = semanticInterpreter.get_json_grammar_url(defLang);
		
//		$('#lang-selector-manual-input').hide();
//		$('#lang-selector').replaceWith($.parseHTML(langMenu));
////		$('#lang-selector').selectmenu({ inline: true });

		view.onGrammarSelect(function(event, ui) {
			
//			var prevLang = view.getSelectedGrammarId();//$('#grammar-id').val();
			view.updateCurrentGrammarText();
			
			var currentGrammarModel = view.getGrammar(event).model;
			var currentGrammarId = currentGrammarModel.id;
			
			var currentLangSelection = currentGrammarId;//$(this).val();
			$('#grammar-id').val(currentLangSelection);
			
			
			if(currentGrammarModel.type === 'project'){
			
//				theJSONGrammarURL = currentGrammarModel.url;//semanticInterpreter.get_json_grammar_url(currentLangSelection);
				
				var callback = function (jsonGrammar, grammarText){
					if(jsonGrammar){
						
						currentGrammarModel.setJson(jsonGrammar);
						currentGrammarModel.setJsonText(grammarText);
						
						clearInput(view);
						clearOut(view);
						clearInterpret(view);
						clearStopword(view);
						
						initPageWithJsonGrammar(view, currentGrammarModel, function(){
							//set "saved-dirty" to false (this JSON was loaded from a file)
							view.setDirtySaved(false);
							
							view.verifyDirtyCompiled(currentGrammarModel);
						});
					}
					else {
						// loading failed -> "revert" selection
//						$('#lang-selector option[value="'+currentLangSelection+'"]').prop('selected', null);
//						if( isLang(prevLang) ){
//							$('#lang-selector option[value="'+prevLang+'"]').prop('selected', 'selected');
//						}
//						else {
//							var OPTION_GRAMMAR_FROM_FILE = 'file-option';
//							var OPTION_GRAMMAR_FROM_TEXTINPUT = 'textinput-option';
//							//reset to temp-selection entry (either file or from textinput)
//							var fileSelection = $('#lang-selector option[value="'+OPTION_GRAMMAR_FROM_FILE+'"]');
//							if(fileSelection.length > 0){
//								fileSelection.prop('selected', 'selected');
//							}
//							else {
//								$('#lang-selector option[value="'+OPTION_GRAMMAR_FROM_TEXTINPUT+'"]').prop('selected', 'selected');
//							}
//						}
//						
//						$('#lang-selector').selectmenu('refresh', true);
//						currentLangSelection = prevLang;
//						
//						$('#grammar-id').val(prevLang);
						
						currentGrammarModel.isMissingResource = true;
						console.error('faild to load resource '+ currentGrammarModel.url);
						//TODO: disable sidebar-entry & select previous entry(?)
						
					}
				};
				loadJsonGrammar(currentGrammarModel, callback);
				
			}
			else if(currentGrammarModel.type === 'file' || currentGrammarModel.type === 'compiled'){
				
				//set "saved-dirty" to false, if the JSON was loaded from a file
				var isSavedDirty = currentGrammarModel.type === 'file' || ! currentGrammarModel.isStored();
				var callback = function(){
					view.updateDirtySaved(isSavedDirty);
					view.verifyDirtyCompiled(currentGrammarModel);
				};
				
				initPageWithJsonGrammar(view, currentGrammarModel, callback);
				
			}
			else {
				console.error('unknow grammar data: ', currentGrammarModel);
			}
			
		});//END: onGrammarSelect(function(event, ui) {
		
		

		////////////////// Initialize Toolbar: //////////////////////////
		
		var createDownload = function(action){
			var strData, fileName;
			switch(action){
			case 'save-json':
				fileName = 'grammar.json';
				strData = view.getEditorText();
				
				//HACK reset "saved-dirty" flag (but really we do not know, if saving was successful...)
				view.setDirtySaved(false);
				
				break;
			case 'save-js':
				fileName = view.getSelectedGrammarId() + '_grammar.js';
				strData = view.getCompiledGrammarText();
				break;
			case 'save-checksum':
				fileName = 'grammar.json_' + view.getSelectedGrammarId() + '.checksum.txt';
				strData = checksumUtils.createContent( view.getEditorText() );
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
		
		//TODO menu-creation (with view-internal objects) should be done within view! 
		var saveEntries = [];
		saveEntries.push(view.__getToolbarButton('Save JSON...', 				'save-json'));
		saveEntries.push(view.__getToolbarButton('Save JS...', 					'save-js'));
		saveEntries.push(view.__getToolbarButton('Save Checksum...',	 		'save-checksum'));
		saveEntries.push(view.__getToolbarButton('Save Grammar Def...',			'save-grammar-def'));
		saveEntries.push(view.__getToolbarButton('Save All...', 				'save-all', function(){ console.error('TODO impl. save-all!'); }));
		
//		view.addToolbarButton('Save JSON...', 					'save-json', handleDownload);
//		view.addToolbarButton('Save JS...', 					'save-js', handleDownload);
//		view.addToolbarButton('Save Checksum...',	 			'save-checksum', handleDownload);
//		view.addToolbarButton('Save Intermediate Grammar...', 	'save-grammar-def', handleDownload);
////		view.addToolbarButton('Save All...', 					'save-all', function(){ console.error('TODO impl. save-all!'); });
		
		
		var saveActionSelectMenu = {type: 'menu',   id: 'select-save-action', caption: 'Save...', icon: 'fa fa-floppy-o', items: saveEntries};
		view.__addToolbar(saveActionSelectMenu, {event: 'click', func: handleDownload});
		
		
		
		view.addToolbarSeparator();
		
		initFileApi(view);//<- adds "Load..." to toolbar
		
		
		view.addToolbarSeparator();
		
		view.addToolbarButton('Compile', 'compile-grammar', function(){ compileCurrentInput(view); });
		
//		semanticInterperter = require('semanticInterpreter'); 
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
		var engineSelectMenu = {type: 'menu',   id: 'select-grammar-engine', caption: 'Grammar Compiler', icon: 'fa fa-cogs', items: engineEntries};
		view.__addToolbar(engineSelectMenu, {event: 'click', func: handleSelectEngine});
		
		view.selectGrammarEngine(semanticInterperter.getGrammarEngine() + '-engine');
		
		view.addToolbarSeparator();

		view.addToolbarStateButton('Console', 'toggle-console', function(){ view.toggleConsole(); });
		view.addToolbarStateButton('Test', 'toggle-interpreter', function(){ view.toggleInterpreter(); });
		view.clickToolbarButton('toggle-interpreter');
		
		view.addToolbarSeparator();
		
		
		////////////////// Intialize Test Interpretation Panel: //////////////////////////
		
		var handleProcessInterpretation = function(event){//expects: data.view <- view
			event.preventDefault();
			var view = event.data.view;
			processInterpretation(view);
		};
		
		$('#btn-test-semantic').on('click', {view: view}, handleProcessInterpretation);
		$('#form-test-semantic').on('submit', {view: view}, handleProcessInterpretation);
		
		
		var handleBenchmarkInterpretation = function(event){//expects: data.view <- view
			event.preventDefault();
			var view = event.data.view;
			benchmarkInterpretation(view);
		};
		
		$('#btn-benchmark-semantic').on('click', {view: view}, handleBenchmarkInterpretation);
		
		
		
		
		//overwrite default-impl. for getLanguage (-> use grammar-ID-field value instead of input-field's)
		getLanguage = function(){
			return $('#grammar-id').val();
		};

		var createInfoPopUp = function(dialogElementId, buttonId){
			
//			$('#'+dialogElementId).dialog({
//				modal: true,
//				dialogClass: 'info',
//				autoOpen: false
//			});
//			$('#'+buttonId).button({
//				icons: { primary: 'ui-icon-info' },
//				text: false
//			}).on('click', function(event){
//				event.preventDefault();
//				$('#'+dialogElementId).dialog('open');
//			});
			
			$('#'+buttonId).on('click', function(event){
				$(this).w2overlay({ html: $('#'+dialogElementId).html()});
			});
		};
		
		createInfoPopUp('popupGrammarIdInfo','openPopupGrammarIdInfo');
		createInfoPopUp('popupMaskingInfo','openPopupMaskingInfo');
		createInfoPopUp('popupFormatConversionInfo','openPopupFormatConversionInfo');
		
	};

	//	jQuery(document).ready(function(){
	//		mmir.CommonUtils.initialize(initPage);
	//	});

	function getLanguage() {
		var id = $('#lang-selector-field').val();
		$('#grammar-id').val(id);
		return id;
	}

	function initPageWithJsonGrammar(view, viewModel, callback) {
		
		var doSetViewWithCompiledGrammar = function() {
			
			printGrammarDefinition(view, viewModel);
			printInput(view, viewModel.getJsonText());
			printCompiledParserDefinition(view, viewModel);

			validationUtil.validateCompiledGrammar(viewModel);

			var jsonGrammar = viewModel.getJson();
			var examplePhrase = '';
			if (typeof jsonGrammar.example_phrase !== 'undefined') {
				examplePhrase = jsonGrammar.example_phrase;
			}

			view.setExamplePhrase(examplePhrase);
			
			processInterpretation(view, viewModel);

			_hideLoader();
			
			if(callback){
				callback();
			}
		};
		
		//do not procced, if we already have the compiled JavaScript
		var gc = viewModel.getGrammarConverter();
		if(gc && gc == semanticInterpreter.getGrammarConverter(viewModel.id)){
			doSetViewWithCompiledGrammar();
			return;
		}

		var doCompile = function() {
			
			semanticInterpreter
					.createGrammar(
							viewModel.getJson(),
							getLanguage(),
							function(grammarConverter) {

								viewModel.setGrammarConverter(grammarConverter, semanticInterpreter.getGrammarEngine());
								doSetViewWithCompiledGrammar();
					});
		};

		_showLoader('Compiling JSON Grammar...', 50, doCompile);
	}

	function _showLoader(text, delay, func, argsArray) {

		if (!delay) {
			
			w2popup.lock(text, true);
			if(func){
				func.apply(null, argsArray);
			}
			
		} else {
			setTimeout(function() {
				
					w2popup.lock(text, true);
					
					if(func){
						setTimeout(function() {
							func.apply(null, argsArray);
						}, delay);
					}
//				}
			}, 50);
		}

	}

	function _hideLoader() {
		w2popup.unlock();
	}
	
	function cleanJsonGrammar(jsonGrammar){
		
//		//DISABLED: clean-up (do not modify the grammar, in order to preserve checksum-validation)
//		if (jsonGrammar['comment_license']) {
//			delete jsonGrammar['comment_license'];
//		}
		
		return jsonGrammar;
	}

	function loadJsonGrammar(viewModel, cb) {
		
		//DISABLED russa: for now, always reload the JSON-file...
//		if(viewModel.getJson() && viewModel.getJsonText()){
//			cb(viewModel.getJson(), viewModel.getJsonText());
//		}
		
		var successFunc = function(gcInstance, xhr) {
			if (gcInstance.json_grammar_definition) {
				
				//clean-up
				cleanJsonGrammar(gcInstance.json_grammar_definition);

				cb(gcInstance.json_grammar_definition, xhr.responseText);
				
			} else {
				
				cb(false);
				
			}
		};
		
		var errorFunc = function(gcInstance) {
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

	function initFileApi(view) {
		
		
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			IS_FILE_READING_API = true;
			$('#file-selector').on('change', {view: view}, loadJsonGrammarFromFile);

			view.addToolbarButton('Load JSON...', 'load-grammar', function(){
				$('#file-selector').click();
			});

//			// show / use button instead of "raw file input" element:
//			$('#file-selector')
//					.parent()
//					.append(
//							'<input type="button" id="file-load-btn" value="Load File..."></input>');
//
//			$('#file-load-btn')
//			//init button:
//			.button()
//			// "proxy" button-click to the file-selector element:
//			.on('click', function() {
//				$('#file-selector').click();
//			});
//
//			//hide the file-selector element:
//			$('#file-selector').hide();
		} else {
			//browser cannot load files -> hide elements
			$('#file-selector').hide();
			$('#file-load-btn').hide();
		}
	}

	function loadJsonGrammarFromFile(evt) {

		_showLoader('Loading JSON Grammar from file...');

		var view = evt.data.view;
		
		var files = evt.target.files; // FileList object

		// Loop through the FileList (should be only one, since "multiple" is not set)
		for (var i = 0, f; f = files[i]; i++) {

			var reader = new FileReader();
			var theFileName = f.name;

			// Closure to capture the file information.
			reader.onload = function(theFileEvent) {

				var theGrammarId = prompt(
						'Please enter an ID for the grammar:', theFileName);
				if (theGrammarId === null) {
					//cancel selected -> reset file-selection-field & loader
					_hideLoader();
					$('#file-selector').val(null);
					return;///////////////////////////// EARLY EXIT ////////////////////////
				}

				var prevSel = view.getSelectedGrammarId();//$('#lang-selector option:selected').val();
				$('#grammar-id').val(theGrammarId);				

				clearInput(view);
				clearOut(view);
				clearInterpret(view);
				clearStopword(view);

				var grammarText = theFileEvent.target.result;
				var jsonGrammar = $.parseJSON(grammarText);

				cleanJsonGrammar(jsonGrammar);
				
				var viewModel = view.addLoadedGrammar(theGrammarId, jsonGrammar, theFileName);
				viewModel.setJsonText(grammarText);
				
				view.selectGrammar(viewModel.viewId);
				
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

				alert('Error: ' + msg);
			};

			// Read in the file as text (UTF-8)
			reader.readAsText(f);
		}
	}

	function compileCurrentInput(view) {

		var jsonGrammar = inputTextToJSON(view);
		if (!jsonGrammar) {
			return;
		}
		
		var grammarText = view.getEditorText();

		clearOut(view);

		validationUtil.validateGrammar();

		semanticInterpreter = mmir.SemanticInterpreter.getInstance();

		var langCode = getLanguage();

		if (semanticInterpreter.hasGrammar(langCode)) {
			langCode = prompt('About to replace grammar for:\n' + langCode
					+ '\n\n\nIf you do not want to replace the grammar\n'
					+ 'please enter a different ID:', langCode);

			if (langCode === null) {
				//-> cancel selected
				return;///////////////////////////// EARLY EXIT ////////////////////////
			} else {
				$('#grammar-id').val(langCode);
			}
		}
		
		var viewModel = view.addCompiledGrammar(langCode, jsonGrammar);
		viewModel.setJsonText(grammarText);

		view.selectGrammar(viewModel.viewId);

	}

	function processInterpretation(view) {

		var asr_result = view.getExamplePhrase();
		var res = semanticInterpreter.getASRSemantic(asr_result.toLowerCase(),
				getLanguage());

		var res2;
		if (isEnableAlternateStopwordProcessing) {
			res2 = semanticInterpreter.getASRSemantic_alt(asr_result
					.toLowerCase(), getLanguage());
		}

		clearInterpret();

		$('#benchmark-time').text('');
		$('#benchmark-time-mod').text('');

		printInterpretation(res);

		if (isEnableAlternateStopwordProcessing) {
			printInterpretationAlt(res2);
		}

		stopword(asr_result);
	}

	function benchmarkInterpretation(view) {

		var asr_result = view.getExamplePhrase();
		var res = semanticInterpreter.getASRSemantic(asr_result.toLowerCase(),
				getLanguage());

		var res2;
		if (isEnableAlternateStopwordProcessing) {
			res2 = semanticInterpreter.getASRSemantic_alt(asr_result
					.toLowerCase(), getLanguage());
		}

		clearInterpret();

		var DEFAULT_ITERATIONS = 10000;
		var iterations = DEFAULT_ITERATIONS;

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
				semanticInterpreter.getASRSemantic(asr_result.toLowerCase(),
						getLanguage());
			}
			var diffTime = new Date() - startTime;

			$('#benchmark-time').text(iterations + ' interations in ' + diffTime + ' ms');

			if (isEnableAlternateStopwordProcessing) {
				var startTimeAlt = new Date();
				for (var i = 0; i < iterations; ++i) {
					semanticInterpreter.getASRSemantic_alt(asr_result
							.toLowerCase(), getLanguage());
				}
				var diffTimeAlt = new Date() - startTimeAlt;

				$('#benchmark-time-mod').text(
						iterations + ' interations in ' + diffTimeAlt
								+ ' ms (alt. method)');
			}

			printInterpretation(res);

			if (isEnableAlternateStopwordProcessing) {
				printInterpretationAlt(res2);
			}

			stopword(asr_result);

			_hideLoader();
		};

		_showLoader('Benchmarking (' + iterations + ' loops)...', 50,
				doStartBenchmark);

	}

	function stopword(text) {
		console.info('TODO impl. stopword(text)');
//		var sw_result;
//		if (typeof text === 'undefined' || text == null) {
//			sw_result = document.getElementById("stopwordInputBox").value;
//		} else {
//			sw_result = text;
//			document.getElementById("stopwordInputBox").value = sw_result;
//		}
//		var res = semanticInterpreter.removeStopwords(sw_result.toLowerCase(),
//				getLanguage());
//
//		var res2;
//		if (isEnableAlternateStopwordProcessing) {
//			res2 = semanticInterpreter.removeStopwords_alt(sw_result
//					.toLowerCase(), getLanguage());
//		}
//
//		clearStopword();
//		printStopword(res, res2);
	}

	
	
	function clearInput() {
		//$('#inputBox').val('');
		view.setEditorText('');
	}

	function clearOut(view) {
		var outputBox = document.getElementById("outputBox");
		outputBox.textContent = "";
		view.clearIntermediateGrammarText();
		view.clearCompiledGrammarText();
		clearInterpret(view);
		clearStopword(view);
	}

	function clearInterpret(view) {
		var outputBox = document.getElementById("interpretationBox");
		outputBox.textContent = "";
		outputBox = document.getElementById("interpretationBoxAlt");
		outputBox.textContent = "";
	}

	function clearStopword(view) {
		var outputBox = document.getElementById("stopwordBox");
		outputBox.textContent = "";
		outputBox = document.getElementById("stopwordBox2");
		outputBox.textContent = "";
	}

	

	function printGrammarDefinition(view, viewModel){
		
//		view.layoutConfig.$compiledGrammarEl.find('#compiledParserOutBox')[0].textContent = viewModel.getIntermediateGrammar();
		view.setIntermediateGrammarText( viewModel.getIntermediateGrammar() );
	};

	function printCompiledParserDefinition(view, viewModel) {
//		view.layoutConfig.$compiledGrammarEl.find('#compiledParserOutBox')[0].textContent = viewModel.getIntermediateGrammar();
		view.setCompiledGrammarText( viewModel.getCompiledGrammar() );
	};

	var printInterpretation = function(text) {
		doPrintInterpretation(text, true);
	};

	var printInterpretationAlt = function(text) {
		doPrintInterpretation(text, false);
	};

	var doPrintInterpretation = (function() {
		var outputBox1;
		var outputBox2;
		return function(text, inNormalNotAlt) {
			if (typeof text == "object") {
				if (typeof text.semantic === 'string') {
					text.semantic = JSON.parse(text.semantic);
				}
				text = JSON.stringify(text, null, 2);
			} else
				text = text.replace(/([^\r])\n/g, "$1\r\n");

			if (!outputBox1)
				outputBox1 = document.getElementById("interpretationBox");
			if (!outputBox2)
				outputBox2 = document.getElementById("interpretationBoxAlt");

			var outputBox = inNormalNotAlt ? outputBox1 : outputBox2;

			if (typeof text == "string") {
				outputBox.appendChild(document.createTextNode(text + "\r\n"));
			} else {
				for (var i = 0; i < text.length; i++) {
					outputBox.appendChild(document.createTextNode(text[i]
							+ "\r\n"));
				}
			}
		};
	})();

	var printStopword = (function() {
		var outputBox;
		var outputBox2;
		return function(text, text2) {
			text = text.replace(/([^\r])\n/g, "$1\r\n");
			if (!outputBox)
				outputBox = document.getElementById("stopwordBox");
			if (typeof text == "string") {
				outputBox.appendChild(document.createTextNode(text + "\r\n"));
			} else {
				for (var i = 0; i < text.length; i++) {
					outputBox.appendChild(document.createTextNode(text[i]
							+ "\r\n"));
				}
			}

			if (isEnableAlternateStopwordProcessing) {
				text2 = text2.replace(/([^\r])\n/g, "$1\r\n");
				if (!outputBox2)
					outputBox2 = document.getElementById("stopwordBox2");
				if (typeof text2 == "string") {
					outputBox2.appendChild(document.createTextNode(text2
							+ "\r\n"));
				} else {
					for (var i = 0; i < text2.length; i++) {
						outputBox2.appendChild(document.createTextNode(text2[i]
								+ "\r\n"));
					}
				}
			}
		};
	})();

	var printInput = function(view, text) {
		validationUtil.resetGrammarValidation();//thePrevValidatedJSONgrammar = null;
		view.setEditorText(text);

	};

	var selectJsonGrammar = function() {
		var t = editor.getText();
		editor.setSelection(0, t.length, true, function() {
			editor.focus();
		});//start, end, isScrollToSelection, callback
	};

	var selectJsjcGrammar = (function() {
		var outputBox;
		return function(text) {
			if (!outputBox)
				outputBox = document.getElementById('compileOutBox');

			outputBox.select();
		};
	})();

	var selectCompiledCode = (function() {
		var outputBox;
		return function(text) {
			if (!outputBox)
				outputBox = document.getElementById('compiledParserOutBox');

			outputBox.select();
		};
	})();

	function maskJsonValues(view, viewModel) {

		if (!inputTextToJSON(view)) {
			return;
		}

		var converter = new GrammarConverter();
		var jsonGrammar = converter.maskJSON(viewModel.getJson());//FIXME should we modify a copy of the JSON-grammar?

		clearInput(view);
		printInput(view, JSON.stringify(jsonGrammar, null, 2));
	}

	function unmaskJsonValues(view, viewModel) {
		if (!inputTextToJSON(view)) {
			return;
		}

		var converter = new GrammarConverter();
		var jsonGrammar = converter.unmaskJSON(viewModel.getJson());//FIXME should we modify a copy of the JSON-grammar?

		clearInput(view);
		printInput(view, JSON.stringify(jsonGrammar, null, 2));
	}

	function convertFromOldJSONFormat(view, viewModel) {
		if (!inputTextToJSON(view)) {
			return;
		}

		var converter = new GrammarConverter();
		var jsonGrammar = converter.recodeJSON(viewModel.getJson(),//FIXME should we modify a copy of the JSON-grammar?
				converter.decodeUmlauts);

		clearInput(view);
		printInput(view, JSON.stringify(jsonGrammar, null, 2));
	}

	function convertToOldJSONFormat(view, viewModel) {
		if (!inputTextToJSON(view)) {
			return;
		}

		var converter = new GrammarConverter();
		var jsonGrammar = converter.recodeJSON(viewModel.getJson(),//FIXME should we modify a copy of the JSON-grammar?
				converter.encodeUmlauts);

		clearInput(view);
		printInput(view, JSON.stringify(jsonGrammar, null, 2));
	}

	function inputTextToJSON(view) {
		
		var text = view.getEditorText();
		
		var jsonObj = validationUtil.validateJson(text, function(err){
			
//			var doSelectLine = function(){
//				util.selectLine(lineNo, view.getEditor());
//				setTimeout(function() {
//					util.selectLine(lineNo, view.getEditor());
//				}, 500);
//			};
			
			var msg = err.message;
			
			//show error in Error/Warining box
			clearOut(view);
			util.printError(msg.replace(/\^\r?\n/igm, '^ \n'));//<- one "marker" at the line end gets removed -> add a space before linebreak

//			setTimeout(function() {
				
				showError('Error',
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

	

//	require(['jquery','w2ui'], function($){
//		$(function(){
//			$('#parseErrorPopup').dialog({
//				modal: true,
//				dialogClass: 'error',
//				autoOpen: false
//			});
//		});
//	});
	
	function showError(title, caption, text, onOpenFunc, onCloseFunc) {

		var dlg = $("#parseErrorPopup");

		if (!title) {
			title = '';
		}
		if (!caption) {
			caption = '';
		}
		if (!text) {
			text = '';
		}

		$('#parseErrorPopupTitle', dlg).html('');//title);
		$('#parseErrorPopupCaption', dlg).html(caption);
		$('#parseErrorPopupText', dlg).html(text);

		if (onOpenFunc) {
			dlg.one("open", onOpenFunc);
		}
		if (onCloseFunc) {
			dlg.one("close", onCloseFunc);
		}
		
		//TODO convert jQuery Mobile Dialog to w2popup correctly (ie. re-format / define HTML nicely for w2popup) 
		
//		dlg.dialog("open");
		w2popup.open({
			title  : title,
		    body   : dlg.html()
		});
	}

	return {};
});