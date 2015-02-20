
//dependencies: w2popup

var IS_DEBUG_ENABLED = true;
	
	var IS_FILE_READING_API = false;
	
	var DEFAULT_EXAMPLE_PHRASE = 'Radio spielen';
	
	var LOADER_THEME = 'b';
	
	if(!console){
		console = new Object();
	}
	if(!console.log){
		console.log = function(msg){ alert(msg);};
	}
	if(!console.debug){
		console.debug = console.log;
	}
	if(!console.info){
		console.info = console.log;
	}
	if(!console.warn){
		console.warn = console.log;
	}
	if(!console.error){
		console.error = console.log;
	}

	var forBrowser = true;
	
	//enable/disable additional processing for stopwords by using an
	//	alternative function for removing stopwords
	var isEnableAlternateStopwordProcessing = false;
	
	var params = document.location.search;
	if( /enable-alt=true/igm.test(params) ){
		isEnableAlternateStopwordProcessing = true;
	}
	
	//if alt-stopword processing is disabled:
	//  hide/remove corresponding GUI elements on page
	//  (and use remaining space for default GUI elements instead)
	if( ! isEnableAlternateStopwordProcessing){
		
		require(['jquery'], function($){
			$(function(){
				$('#altProcInterpretationCol').hide();
				$('#altProcStopwordCol').hide();
//				$('#defaultProcInterpretationCol').attr('colspan','2').css('width','50%');
//				$('#defaultProcStopwordCol').attr('colspan','2').css('width','50%');
			});
		});
		
	}
	
	require(['pegjs'], function(PEG){
		PEG.printError = _error;
	});
	
	require(['jison'], function(jison){
		jison.printError = _error;
	});
	
	require(['esprima'], function(jsParser){
		
	});
	
	require(['jscc'], function(jscc){
		
		//set print-function of JS/CC so that errors, warnings etc.
		// are outputed into a "text box" on the page
		jscc.set_printError(_error);
		jscc.set_printWarning(_warning);
		jscc.set_printInfo(_print);
	});
	
	//ID for the grammar generator / engine -- see mmirf/env/grammar/*
	var grammarGenerator;
	
	//parse query / search string for this document -> extract paramaters
	require(['paramsParseFunc'], function(parseUrlQueries){
		var params = parseUrlQueries(document.location.search);
		
		if(params.has('gen')){
			grammarGenerator = params['gen'];
		}
	});
	
	var semanticInterpreter;// = mmir.SemanticInterpreter.getInstance();
	//semanticInterpreter.get_json_grammar_url = function(id) { return 'config/languages/'+id+'/grammar.json'; };
	
	//TODO: (1) load directory_strucutre file and detect available JSON grammars, (2) create drop-down menu for languages
	//semanticInterpreter.setCurrentGrammar('de');

	var checksumUtils;
	require(['checksumUtils'],function(checksum){
		checksumUtils = checksum;
		checksumUtils.init();
	});
	
	var inputElement;
	var interpretElement;
	var stopwordElement;
	
	var compiledParser;
	var compileCount = 0;
	
	var theJSONGrammarURL = 'un-initialized';//semanticInterpreter.get_json_grammar_url('de');
	var theJSONgrammar = 'un-initialized';
	
	var OPTION_GRAMMAR_FROM_FILE = 'file-option';
	var OPTION_GRAMMAR_FROM_TEXTINPUT = 'textinput-option';
	
	var initPage = function initPageImpl(){
	
		semanticInterpreter = mmir.SemanticInterpreter.getInstance();
		semanticInterpreter.get_json_grammar_url = function(id) { return 'config/languages/'+id+'/grammar.json'; };
		
		if(grammarGenerator && grammarGenerator !== semanticInterpreter.getGrammarEngine()){
			semanticInterpreter.setGrammarEngine(grammarGenerator);
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
		
//		var langMenu = createLanguageMenu(langs, defLang);
		var isLang = function(id){
			for(var i=0,size=langs.length; i < size; ++i){
				if(langs[i] === id){
					return true;
				}
				return false;
			}
		};
		
		var view = require('mainView');
		

		////////////////// Initialize Sidebar: //////////////////////////
		
		for(var i=0,size=langs.length; i < size; ++i){
			view.addProjectGrammar(langs[i], semanticInterpreter.get_json_grammar_url(langs[i]));
		}

		view.selectGrammar(defLang);
		
		$('#grammar-id').val(defLang);//TODO replace grammar-id element with property in data-model
		theJSONGrammarURL = semanticInterpreter.get_json_grammar_url(defLang);
		
//		$('#lang-selector-manual-input').hide();
//		$('#lang-selector').replaceWith($.parseHTML(langMenu));
////		$('#lang-selector').selectmenu({ inline: true });

		view.onGrammarSelect(function(event, ui) {
			
			var prevLang = view.getSelectedGrammarId();//$('#grammar-id').val();

			var currentGrammarModel = view.getGrammar(event).model;
			var currentGrammarId = currentGrammarModel.id;
			
			var currentLangSelection = currentGrammarId;//$(this).val();
			$('#grammar-id').val(currentLangSelection);
			
			
			if(currentGrammarModel.type === 'project'){
			
				theJSONGrammarURL = currentGrammarModel.uri;//semanticInterpreter.get_json_grammar_url(currentLangSelection);
				
				var callback = function (isSuccess){
					if(isSuccess){
						
//						//if previous selection was loaded-from-file -> remove file entry
//						//	 (a new one will be created, next time a grammar is loaded from file or textinput)
//						if( !isLang(prevLang) ){
//							$('#lang-selector option[value="'+OPTION_GRAMMAR_FROM_FILE+'"]').remove();
//							$('#lang-selector option[value="'+OPTION_GRAMMAR_FROM_TEXTINPUT+'"]').remove();
//						}
						
						clearInput(view);
						clearOut(view);
						clearInterpret(view);
						clearStopword(view);
						
						initPageWithJsonGrammar(view);
					}
					else {
						// loading failed -> "revert" selection
						$('#lang-selector option[value="'+currentLangSelection+'"]').prop('selected', null);
						if( isLang(prevLang) ){
							$('#lang-selector option[value="'+prevLang+'"]').prop('selected', 'selected');
						}
						else {
							//reset to temp-selection entry (either file or from textinput)
							var fileSelection = $('#lang-selector option[value="'+OPTION_GRAMMAR_FROM_FILE+'"]');
							if(fileSelection.length > 0){
								fileSelection.prop('selected', 'selected');
							}
							else {
								$('#lang-selector option[value="'+OPTION_GRAMMAR_FROM_TEXTINPUT+'"]').prop('selected', 'selected');
							}
						}
						
						$('#lang-selector').selectmenu('refresh', true);
						currentLangSelection = prevLang;
						
						$('#grammar-id').val(prevLang);
						
					}
				};
				loadJsonGrammar(callback);
				
			}
			else if(currentGrammarModel.type === 'file' || currentGrammarModel.type === 'compiled'){
				
				theJSONgrammar = currentGrammarModel.json;
				
				//$('#inputBox').val(JSON.stringify(theJSONgrammar, null, 2));
				editor.val(JSON.stringify(currentGrammarModel.json, null, 2));

				initPageWithJsonGrammar(view);
				
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
				strData = editor.val();
				break;
			case 'save-js':
				fileName = view.getSelectedGrammarId() + '_grammar.js';
//				strData = document.getElementById("compiledParserOutBox").textContent;
				strData = view.getCompiledGrammarText();
				break;
			case 'save-checksum':
				fileName = 'grammar.json_' + view.getSelectedGrammarId() + '.checksum.txt';
				strData = checksumUtils.createContent( editor.val() );
				break;
			case 'save-grammar-def':
				fileName = 'grammar.' +  semanticInterperter.getGrammarEngine() + '.def.txt';
//				strData = document.getElementById("compileOutBox").textContent;
				strData = view.getIntermediateGrammarText();
				break;
			default:
				console.error('unknown SAVE operation, triggered from ', event.target);
				return;/////////////////////// EARLY EXIT ////////////////////////////
			}
			
			return {data: strData, file: fileName};
		};

		var semanticInterperter = require('semanticInterpreter');
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
		
		view.addToolbarButton('Compile', 'compile-grammar', function(){ parseInput(view); });
		
		semanticInterperter = require('semanticInterpreter'); 
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
			
			//select the engine:
			semanticInterperter.setGrammarEngine(engine);
			
			view.setGrammarEngineSelected(semanticInterperter.getGrammarEngine());
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
		
		if(!inputElement) 
			inputElement = document.getElementById("inputBox");
			
		if(!interpretElement) 
			interpretElement = document.getElementById("interpretationInputBox");
			
		if(!stopwordElement) 
			stopwordElement = document.getElementById("stopwordInputBox");
			

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
		
		var callback = function(isSuccess) {
			if (isSuccess) {
				initPageWithJsonGrammar(view);
			} else {
				$('#file-selector').trigger('click');
			}
		};

		loadJsonGrammar(callback);
	};

	//	jQuery(document).ready(function(){
	//		mmir.CommonUtils.initialize(initPage);
	//	});

	function getLanguage() {
		var id = $('#lang-selector-field').val();
		$('#grammar-id').val(id);
		return id;
	}

	function initPageWithJsonGrammar(view) {

		var doInit = function() {

			semanticInterpreter = mmir.SemanticInterpreter.getInstance();
			semanticInterpreter
					.createGrammar(
							theJSONgrammar,
							getLanguage(),
							function() {

								printGrammarDefinition();
								printInput(JSON.stringify(theJSONgrammar, null, 2));
								printCompiledParserDefinition();

								doProcessEvalErrors(getLanguage());

								var examplePhrase;
								if (typeof theJSONgrammar.example_phrase !== 'undefined') {
									examplePhrase = theJSONgrammar.example_phrase;
								} else {
									examplePhrase = DEFAULT_EXAMPLE_PHRASE;
								}

//								interpretElement.value = examplePhrase;
								view.setExamplePhrase(examplePhrase);
								
								processInterpretation(view);

								_hideLoader();
							});
		};

		_showLoader('Compiling JSON Grammar...', 50, doInit);
	}

	function _showLoader(text, delay, func, argsArray) {

		if (!delay) {

//			if ($.mobile) {
//				$.mobile.loading('show', {
//					text : text,
//					theme : LOADER_THEME,
//					textVisible : true
//				});
//			}
			
			w2popup.lock(text, true);
			if(func){
				func.apply(null, argsArray);
			}
		} else {
			setTimeout(function() {
//				if ($.mobile) {
//					$.mobile.loading('show', {
//						text : text,
//						theme : LOADER_THEME,
//						textVisible : true
//					});
//					setTimeout(function() {
//						func.apply(null, argsArray);
//					}, delay);
//				} else {
				
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

	function loadJsonGrammar(cb) {
		if (!semanticInterpreter) {
			semanticInterpreter = mmir.SemanticInterpreter;
		}

		var successFunc = function(gcInstance) {
			if (gcInstance.json_grammar_definition) {

				theJSONgrammar = gcInstance.json_grammar_definition;
				if (theJSONgrammar['comment_license']) {
					delete theJSONgrammar['comment_license'];
				}

				cb(true)
			} else {
				cb(false);
			}
		};
		var errorFunc = function(gcInstance) {
			alert("Initialize:\n failed to load JSON grammar file from\n '"
					+ theJSONGrammarURL + "'!");
			cb(false);
		};

		var gc = new GrammarConverter();

		var doLoadGrammar = function() {

			gc.loadGrammar(successFunc, errorFunc, theJSONGrammarURL, false);

			_hideLoader();
		};

		_showLoader('Loading JSON Grammar...', 50, doLoadGrammar);

	}

	function initFileApi(view) {
		
		
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			IS_FILE_READING_API = true;
			$('#file-selector').on('change', {view: view}, loadJsonGrammarFromFile);

			view.addToolbarButton('Load JSON...', 'load-grammar', function(){$('#file-selector').click();});

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

//				//update selection menu:
//				//	* (if previous selection was a file or compiled from textinput: remove the previous entry)
//				//	* create an entry for the file selection
//				//	* de-select previous entry
//				//	* select the new file-entry (and update selection menu)
//				$(
//						'#lang-selector  option[value="'
//								+ OPTION_GRAMMAR_FROM_FILE + '"]').remove();
//				$(
//						'#lang-selector  option[value="'
//								+ OPTION_GRAMMAR_FROM_TEXTINPUT + '"]')
//						.remove();
//
//				var fileOptionEntry = createLanguageMenuEntry(theGrammarId,
//						null, null, OPTION_GRAMMAR_FROM_FILE);//lang, menuElem, defaultSelection, value);
//				$('#lang-selector').append(
//						$.parseHTML(fileOptionEntry.join('')));
//
//				//de-select previous selection
//				$('#lang-selector option[value="' + prevSel + '"]').prop(
//						'selected', null);
//
//				//select new file-entry
//				$(
//						'#lang-selector option[value="'
//								+ OPTION_GRAMMAR_FROM_FILE + '"]').prop(
//						'selected', 'selected');
//				//update GUI
//				$('#lang-selector').selectmenu('refresh', true);
				

				clearInput(view);
				clearOut(view);
				clearInterpret(view);
				clearStopword(view);

				theJSONgrammar = $.parseJSON(theFileEvent.target.result);

				if (theJSONgrammar['comment_license']) {
					delete theJSONgrammar['comment_license'];
				}
				
				view.addLoadedGrammar(theGrammarId, theJSONgrammar, theFileName);

				view.selectGrammar(theGrammarId);
				
//				//$('#inputBox').val(JSON.stringify(theJSONgrammar, null, 2));
//				editor.val(JSON.stringify(theJSONgrammar, null, 2));
//
//				initPageWithJsonGrammar(view);
				
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

	function parseInput(view) {

		if (!inputTextToJSON(view)) {
			return;
		}

		clearOut(view);

		validateJsonGrammar();

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

//		//update entries in selection menu if necessary:
//		// -> if an entry does not yet exist:
//		//    * create a new entry for this grammar-ID
//		//    * de-deselect previous selection
//		//    * if previous was temporary entry (ie. a file or from the text-input): remove it
//		//    * select new entry (and update GUI)
//		if (!semanticInterpreter.hasGrammar(langCode)) {
//
//			var prevSel = $('#lang-selector option:selected').val();
//
//			//remove temporary entries (may not exists)
//			$(
//					'#lang-selector  option[value="' + OPTION_GRAMMAR_FROM_FILE
//							+ '"]').remove();
//			$(
//					'#lang-selector  option[value="'
//							+ OPTION_GRAMMAR_FROM_TEXTINPUT + '"]').remove();
//
//			var textinputOptionEntry = createLanguageMenuEntry(langCode, null,
//					null, OPTION_GRAMMAR_FROM_TEXTINPUT);//lang, menuElem, defaultSelection, value);
//			$('#lang-selector').append(
//					$.parseHTML(textinputOptionEntry.join('')));
//
//			//de-select previous selection
//			$('#lang-selector option[value="' + prevSel + '"]').prop(
//					'selected', null);
//
//			//select the newly generated entry:
//			$(
//					'#lang-selector option[value="'
//							+ OPTION_GRAMMAR_FROM_TEXTINPUT + '"]').prop(
//					'selected', 'selected');
//
//			//update GUI
//			$('#lang-selector').selectmenu('refresh', true);
//
//		}

//		var doParseAndCompile = function() {
//			semanticInterpreter
//					.createGrammar(
//							theJSONgrammar,
//							langCode,
//							function() {
//								printGrammarDefinition();
//								printCompiledParserDefinition();
//
//								doProcessEvalErrors(langCode);
//
//								if (typeof theJSONgrammar.example_phrase !== 'undefined') {
//									var examplePhrase = theJSONgrammar.example_phrase;
//									interpretElement.value = examplePhrase;
//									processInterpretation(view);
//								}
//
//								_hideLoader();
//							});
//		};
//
//		_showLoader('Parsing and Compiling JSON Grammar...', 50,
//				doParseAndCompile);
		
		view.addCompiledGrammar(langCode, theJSONgrammar);

		view.selectCompiledGrammar(langCode);

	}

	function doProcessEvalErrors(langCode) {

		var getLocationAsString = function(e) {
			return 'line ' + e.lineNumber + ':' + e.column + '(offset '
					+ e.index + ')';
		};
		var currentGrammar = semanticInterpreter.getGrammarConverter(langCode);
		if (currentGrammar.executeGrammar.hasErrors) {
			var jsParser = require('esprima');
			var text = currentGrammar.getJSGrammar();

			try {
				var syntax = jsParser.parse(text, {
					tolerant : true,
					loc : true
				});
				var errors = syntax.errors;

				if (errors.length > 0) {
					_error('Invalid JavaScript code for grammar "' + langCode
							+ '". Total issues: ' + errors.length);
					for (i = 0; i < errors.length; i += 1) {
						_error('    At ' + getLocationAsString(errors[i])
								+ ': ' + errors[i].description);
					}
				}
			} catch (err) {
				_error(err.description + ' in JavaScript code for grammar "'
						+ langCode + '" at ' + getLocationAsString(err));
				console.error(err);
			}
		}
	}

	function processInterpretation(view) {

		var asr_result = view.getExamplePhrase();//interpretElement.value;
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

		var asr_result = view.getExamplePhrase();//interpretElement.value;
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
//			sw_result = stopwordElement.value;
//		} else {
//			sw_result = text;
//			stopwordElement.value = sw_result;
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

	function printGrammarDefinition() {
		printCompile(semanticInterpreter
				.getGrammarDefinitionText(getLanguage()));
	}

	function printCompiledParserDefinition() {
		printCompiledParser(semanticInterpreter
				.getGrammarParserText(getLanguage()));
	}

	function clearInput() {
		//$('#inputBox').val('');
		editor.val('');
	}

	function clearOut(view) {
		var outputBox = document.getElementById("outputBox");
		outputBox.textContent = "";
//		outputBox = document.getElementById("compileOutBox");
//		outputBox.textContent = "";
		view.clearIntermediateGrammarText();
//		outputJSBox = document.getElementById("compiledParserOutBox");
//		outputJSBox.textContent = "";
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

	function _error(msg) {
		print("ERROR: " + msg);
	}

	function _warning(msg) {
		print("WARNING: " + msg);
	}

	function _print(msg) {
		print("INFO: " + msg);
	}

	var print = (function() {
		var outputBox;
		var $outputBox;
		return function(text) {
			text = text.replace(/([^\r])\n/g, "$1\r\n");
			if (!outputBox) {
				outputBox = document.getElementById("outputBox");
			}
			if (!$outputBox) {
				$outputBox = $(outputBox);
			}

			var isScroll = false;
			//autoscroll, if scroll position is at the very bottom:
			var scrollPos = outputBox.scrollHeight - $outputBox.innerHeight()
					+ (outputBox.offsetWidth - outputBox.clientWidth);
			var isScroll = outputBox.scrollTop + 4 >= scrollPos;

			if (typeof text == "string") {
				outputBox.appendChild(document.createTextNode(text + "\r\n"));
			} else {
				for (var i = 0; i < text.length; i++) {
					outputBox.appendChild(document.createTextNode(text[i]
							+ "\r\n"));
				}
			}

			if (isScroll) {
				$outputBox.scrollTop(outputBox.scrollHeight
						- $outputBox.innerHeight() + 20);
			}
		};
	})();

	var printCompile = (function() {
		var outputBoxC;
		return function(text) {
			//text = text.replace(/([^\r])\n/g, "$1\r\n");
			if (!outputBoxC)
				outputBoxC = document.getElementById("compileOutBox");

			outputBoxC.textContent = text + "\r\n";
		};
	})();

	var printCompiledParser = (function() {
		var outputBox;
		return function(text) {
			//text = text.replace(/([^\r])\n/g, "$1\r\n");
			if (!outputBox)
				outputBox = document.getElementById("compiledParserOutBox");
			if (typeof text == "string") {
				outputBox.textContent = text + "\r\n";
			} else {
				for (var i = 0; i < text.length; i++) {
					outputBox.appendChild(document.createTextNode(text[i]
							+ "\r\n"));
				}
			}
		};
	})();

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

	var printInput = (function() {
		var outputBox;
		return function(text) {
			//text = text.replace(/([^\r])\n/g, "$1\r\n");
			if (!outputBox)
				outputBox = document.getElementById("inputBox");

			if (typeof text !== "string") {
				text = text.join('\r\n');
			}

			//$(outputBox).val(text+'\r\n');
			thePrevValidatedJSONgrammar = null;
			editor.val(text + '\r\n');
			return;

			/*
			if(typeof text == "string") {
				outputBox.appendChild(document.createTextNode(text + "\r\n"));
			} else {
				for(var i=0;i<text.length;i++) {
					outputBox.appendChild(document.createTextNode(text[i]
							+ "\r\n"));
				}
			}
			 */
		};
	})();

	var selectJsonGrammar = (function() {
		var outputBox;
		return function() {
			if (!outputBox)
				outputBox = document.getElementById('inputBox');

			//outputBox.select();
			var t = editor.getText();
			editor.setSelection(0, t.length, true, function() {
				editor.focus();
			});//start, end, isScrollToSelection, callback

		};
	})();

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

	//select the text of a line in a DOM textarea
	var selectLine = (function() {//(domTextArea, lineNo)

		/**
		 * Get the start/end position of a selection
		 * in a text-component:
		 * {
		 * 	start: START_INDEX,
		 * 	end:   END_INDEX,
		 * }
		 * 
		 * If no selection is made, the cursor position is returned
		 * (i.e. start === end)
		 */
		function getSelection(domTextComponent) {
			var startPos;
			var endPos;
			// IE version
			if (document.selection != undefined) {
				domTextComponent.focus();
				var sel = document.selection.createRange();
				startPos = sel;
				endPos = sel;
			}
			// Mozilla version
			else if (domTextComponent.selectionStart != undefined) {
				startPos = domTextComponent.selectionStart;
				endPos = domTextComponent.selectionEnd;
			} else {
				console.error('unknow selection mechanism...');
			}

			return {
				start : startPos,
				end : endPos
			};
		}

		/**
		 * selects a range in a text-component.
		 * If start === end, an empty selection is made, i.e. the cursor position is set.
		 */
		function setSelection(domTextComponent, start, end, doRequestFocus) {
			// Mozilla version
			if (domTextComponent.setSelectionRange) {
				if (typeof doRequestFocus === 'undefined'
						|| doRequestFocus !== false) {
					domTextComponent.focus();
				}
				domTextComponent.setSelectionRange(start, end);
			}
			// IE version
			else if (domTextComponent.createTextRange) {
				var range = domTextComponent.createTextRange();
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select();
			}
			if (typeof doRequestFocus === 'undefined'
					|| doRequestFocus !== false) {
				domTextComponent.focus();
			}
		}

		//get JSON for start / end position in str for line no. i
		var getPositionForLine = (function() {//(str, i)

			var detectLinebreak = /(\r?\n|\r)/igm;

			/**
			 *
			 * Get the index in the String str, where line number lineNo
			 * starts.
			 * 
			 * New lines begin after \n, \r\n, or \r.
			 * 
			 * If lineNo is <= 1, the function returns always 0.
			 * 
			 * If the lineNo is greater than the count of lines in str, the string length itself is returned. 
			 * 
			 * @function getIndexForLine
			 * @param {String} str the string
			 * @param {Number} lineNo the line number (first line is 1)
			 * 
			 */
			var getStart = function(str, lineNo) {
				if (lineNo <= 1) {
					return 0;
				}
				var match;
				var count = 1;
				while (match = detectLinebreak.exec(str)) {
					//ASSERT: lineNo >= 2
					if (++count == lineNo) {
						break;
					}
				}

				//reset regexpr:
				detectLinebreak.lastIndex = 0;

				if (match) {
					return match.index + match[1].length;
				}

				//request line-no. >= 2 AND loop "detect enough" linebreaks => the request line index starts after strings ends => return string's length
				return str.length;
			};

			return function(str, i) {
				var start = getStart(str, i);

				var end = str.length;
				if (start < end) {
					detectLinebreak.lastIndex = start;
					var match;
					if (match = detectLinebreak.exec(str)) {
						end = match.index;
					}
					detectLinebreak.lastIndex = 0;
				}

				return {
					start : start,
					end : end
				};
			};
		})();//END: getPositionForLine

		return function selectLineImpl(theTextArea, line) {

			if (!line) {
				line = theTextArea;
				var str = editor.val();

				var m = editor.getModel();
				var pos = {
					start : m.getLineStart(line - 1),
					end : m.getLineEnd(line - 1)
				}

				console.log('selectLine(%s) -> ', line, pos);

				editor.setSelection(pos.start, pos.end, true);
				return; /////////////////////// EARLY EXIT ///////////////
			}

			var $ta = $(theTextArea);
			var ta = $ta[0];

			var str = $ta.val();

			var pos = getPositionForLine(str, line);

			console.log('selectLine(%s) -> ', line, pos);

			setSelection(ta, pos.start, pos.end, true);
		}
	})();

	function maskJsonValues(view) {

		if (!inputTextToJSON(view)) {
			return;
		}

		var converter = new GrammarConverter();
		theJSONgrammar = converter.maskJSON(theJSONgrammar);

		clearInput(view);
		printInput(JSON.stringify(theJSONgrammar, null, 2));
	}

	function unmaskJsonValues(view) {
		if (!inputTextToJSON(view)) {
			return;
		}

		var converter = new GrammarConverter();
		theJSONgrammar = converter.unmaskJSON(theJSONgrammar);

		clearInput(view);
		printInput(JSON.stringify(theJSONgrammar, null, 2));
	}

	function convertFromOldJSONFormat(view) {
		if (!inputTextToJSON(view)) {
			return;
		}

		var converter = new GrammarConverter();
		theJSONgrammar = converter.recodeJSON(theJSONgrammar,
				converter.decodeUmlauts);

		clearInput(view);
		printInput(JSON.stringify(theJSONgrammar, null, 2));
	}

	function convertToOldJSONFormat(view) {
		if (!inputTextToJSON(view)) {
			return;
		}

		var converter = new GrammarConverter();
		theJSONgrammar = converter.recodeJSON(theJSONgrammar,
				converter.encodeUmlauts);

		clearInput(view);
		printInput(JSON.stringify(theJSONgrammar, null, 2));
	}

	function inputTextToJSON(view) {
		var text = editor.val();//inputElement.value;
		//console.info('gammar-text: \n'+text);
		try {
			theJSONgrammar = JSON.parse(text);
		} catch (error) {

			console.error('error: ' + error.stack);

			var msg = error.toString();

			//try to get more details for the error using the json-lint parser:
			try {

				var result = jsl.parser.parse(text);

				if (result) {
					msg += '\n\nsuccess:\n' + JSON.stringify(result, null, 2);
				}

			} catch (err) {
				msg = err.toString();
			}

			var selectErrorLine = (function(msg) {
				//msg text -> e.g.:		Error: Parse error on line 5:
				//							...",    "switch"    "turn",    "turned"
				//						---------------------^
				//						Expecting 'EOF', '}', ':', ',', ']', got 'STRING'
				var detectLineNo = /on line (\d+):/igm;
				var match = detectLineNo.exec(msg);

				var lineNo;
				if (match) {
					lineNo = match[1];
				}

				return function() {
					selectLine(inputElement, lineNo);
					setTimeout(function() {
						selectLine(inputElement, lineNo);
					}, 500);
				};

			})(msg);
			selectErrorLine();

			//show error in Error/Warining box
			clearOut(view);
			print(msg.replace(/\^\r?\n/igm, '^ \n'));//<- one "marker" at the line end gets removed -> add a space before linebreak

			setTimeout(function() {
				showError('Error',
						'Error on parsing grammar text into a JSON object.',
						'<pre>' + msg + '</pre>', selectErrorLine,
						selectErrorLine);
			}, 100);
			return false;
		}

		return true;
	}

	function getPosInJson(posJson, path) {

		var prev = posJson;
		var curr = posJson;
		for (var i = 0, size = path.length; i < size; ++i) {
			if (typeof curr[path[i]] !== 'undefined') {
				prev = curr;
				curr = curr[path[i]]
			} else {
				//console.warn('getPosInJson(): could not traverse "'+path[i]+'" ('+i+') from path '+JSON.stringify(path));
				break;
			}
		}

		var pos;
		if (curr === prev) {
			pos = curr._loc._this;
		}

		if ($.isArray(prev)) {
			// array-entry, i.e.: [..., VALUE_i, ...]
			pos = prev._loc['_i' + path[(i - 1)]]
		} else if (typeof prev === 'object') {
			//property, i.e.: "name": VALUE
			pos = prev._loc['_' + path[(i - 1)]];

			if (!pos) {
				pos = prev._loc._this;
			} else if (i === size) {
				//target path points to NAME
				pos = pos[0];
			} else {
				//target path points to VALUE
				pos = pos[1];
			}
		} else {
			pos = prev._loc;
		}
		return pos;
	}

	/**
	 * EITHER:
	 * @param {Number} line
	 			the line number
	 * @param {Number} pos
	 				the column in the line (is ignored)
	 *
	 * OR:
	 *
	 * @param {Postion} line
		    a position object with properties
			{
				first_line: Number,
				first_column: Number,
				last_line: Number,
				last_column: Number
			}
	 		NOTE: there must NOT be second argument in this case
	 */
	function getOffsetFor(line, pos) {

		if (!pos) {
			pos = line;
			if (!pos) {
				return void (0);
			}
			return {
				start : getOffsetFor(pos.first_line, pos.first_column),
				end : getOffsetFor(pos.last_line, pos.last_column)
			};
		}

		//get start offset
		if (line === 1) {
			return pos;
		}

		var offset = editor.getLineStart(line - 1);
		return offset + pos;
	}

	//field for storing the last validated JSON grammar (-> check against this to determine, if re-validation is necessary)
	var thePrevValidatedJSONgrammar;

	function validateJsonGrammar() {

		if (!editor.val()) {
			thePrevValidatedJSONgrammar = null;
			return;////////////////////////// EARLY EXIT //////////////////////////
		}

		//convert content of editor-view to JSON object
		// (do not continue, if it is not a JSON ...)
		var grammarText = editor.val();
		var jsonGrammar;
		try {

			jsonGrammar = JSON.parse(grammarText);
			//force errors for duplicate properties using eval() (normal JSON parsing just takes the 2nd one silently...):
			// NOTE: using JSON.parse first is a "security" measure -> if grammarText would not be a JSON object, then we would not get to the eval()...
			/*jsonGrammar = */eval('function create(){"use strict"\n return '
					+ grammarText + ';};create()');
			if (typeof jsonGrammar !== 'object') {
				return;////////////////////////// EARLY EXIT //////////////////////////
			}

		} catch (exc) {

			thePrevValidatedJSONgrammar = null;
			editor.removeAllErrorMarkers();

			//create marker for errornous JSON:
			//try to get more details for the error using the json-lint parser:
			try {
				jsl.parser.setStrict(true);
				jsl.parser.setLocEnabled(true);

				jsl.parser.parse(grammarText);

				jsl.parser.setStrict(false);
				jsl.parser.setLocEnabled(false);
			} catch (err) {

				var msg = err.toString();

				var start, end, loc;
				if (err._loc) {

					loc = getOffsetFor(err._loc);
					start = loc.start;
					end = loc.end;

				} else {

					//msg text -> e.g.:		Error: Parse error on line 5:...
					var detectLineNo = /on line (\d+):/igm;
					var match = detectLineNo.exec(msg);

					var lineNo;
					if (match) {
						lineNo = match[1];
					}

					start = editor.getLineStart(lineNo - 1);
					end = editor.getModel().getLineEnd(lineNo - 1);

				}

				//remove line information from message (since the marker already points to this position)
				msg = msg.replace(/ on line (\d+):/igm, ':');
				editor.addMarker(ERROR_MARKER, start, end, msg);

				//if there is information about the other / related element that caused the error:
				//  set a warning-marker for that element 
				if (err._locTo) {
					loc = getOffsetFor(err._locTo);
					editor.addMarker(WARNING_MARKER, loc.start, loc.end, msg);
				}
			}

			return;////////////////////////// EARLY EXIT //////////////////////////
		}

		//only re-validate, if the resulting JSON grammar differs from the last validated one
		if (isEqual(thePrevValidatedJSONgrammar, jsonGrammar)) {
			return;////////////////////////// EARLY EXIT //////////////////////////
		}
		//remember current JSON grammar for next validation:
		thePrevValidatedJSONgrammar = $.extend({}, jsonGrammar);

		editor.removeAllErrorMarkers();

		var validator = new GrammarValidator(jsonGrammar);

		var problems = validator.validateStructure();

		var problems2 = validator.validateIdDuplicates();
		var problems3 = validator.validateTokenDuplicates();
		var problems4 = validator.validateUtteranceDuplicates();
		var problems5 = validator.validateStopwords();

		var list = problems.concat(problems2, problems3, problems4, problems5);
		if (list.length) {
			//debug:
			if (false)
				print('Validation errors for JSON grammar:\n--------------\n'
						+ list.map(function(v) {
							return '  ' + v.toString();
						}).join('\n') + '\n--------------\n');

			jsl.parser.setLocEnabled(true);
			var result = jsl.parser.parse(editor.val());
			jsl.parser.setLocEnabled(false);

			var e, pos, otherMatch, otherPath, otherPos, otherStr;
			for (var i = 0, size = list.length; i < size; ++i) {
				e = list[i];
				pos = getPosInJson(result, e.location);
				pos = getOffsetFor(pos);

				if (!pos) {
					console.warn('could not create marker for '
							+ JSON.stringify(e));
					continue;
				}

				//heuristic "at {...}" may signify another location in JSON, to which this error/warning refers to
				// -> try to extract this "target location"
				if (otherMatch = /at \{(.*?)\}/igm.exec(e.message)) {
					otherPath = otherMatch[1].split('.');
					otherPos = getPosInJson(result, otherPath);
					otherStr = ' in line ' + otherPos.first_line;
				} else {
					otherStr = '';
				}

				var type = e.level === 'ERROR' ? ERROR_MARKER : WARNING_MARKER;
				editor
						.addMarker(type, pos.start, pos.end, e.message
								+ otherStr);
			}
		}
	}

	function createLanguageMenu(arrayLang, defaultSelection) {

		var menuElem = [
				'<label for="lang-selector" data-inline="true">Lanuage: </label>',
				'<select name="lang-selector" id="lang-selector">' ];

		if (!defaultSelection) {
			menuElem.push('<option>Lanuage</option>');
		}

		for (var i = 0, size = arrayLang.length; i < size; ++i) {
			var lang = arrayLang[i];

			createLanguageMenuEntry(lang, menuElem, defaultSelection);
		}

		menuElem.push('</select>');

		return menuElem.join('');
	}

	function createLanguageMenuEntry(lang, menuElem, defaultSelection, value) {
		if (!menuElem) {
			menuElem = [];
		}

		menuElem.push('<option value="');
		if (value) {
			menuElem.push(value);
		} else {
			menuElem.push(lang);
		}

		menuElem.push('"');
		//if(defaultSelection === lang){//for defaultSelection -> initial selection
		//menuElem.push(' data-placeholder="true"');
		//}
		menuElem.push('>');
		menuElem.push(lang);
		menuElem.push('</option>');

		return menuElem;
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
		
//		dlg.dialog("open");
		w2popup.open({
			title  : title,
		    body   : dlg
		});
	}
