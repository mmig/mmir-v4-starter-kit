
define(['jquery', 'viewModel', 'appUtil', 'validationUtil', 'w2ui'], function($, viewModel, util, validationUtil){
	
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var CONSOLE_PANEL = 'bottom';
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var TEST_PANEL = 'right';
	
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var TAB_LABEL_EDITOR			 	= 'Editor';
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var TAB_LABEL_INTERMEDIATE_GRAMMAR 	= 'Intermediate Grammar';
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var TAB_LABEL_COMPILED_GRAMMAR		= 'Compiled Grammar (JS)';
	
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var TAB_ID_EDITOR				= 'tab1';
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var TAB_ID_INTERMEDIATE_GRAMMAR = 'tab2';
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var TAB_ID_COMPILED_GRAMMAR		= 'tab3';
	
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var TAB_ID_TEST_INTERPRETATION 	= 'test-tab1';
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var TAB_ID_TEST_STOPWORD		= 'test-tab2';
	
	
	var pstyle = '';//'border: 1px solid #dfdfdf; padding: 5px;';
	var layoutConfig = {
		layout: {
			/** @lends layoutConfig */
			/** @memberOf layoutConfig */
	        name: 'layout',
	        panels: [
	            { type: 'top', size: 30, title: 'Grammar Tester', style: /*'height: 0.6em;' +*/ pstyle },
	            { type: 'left', size: 200, resizable: true, style: pstyle, content: 'left' },
	            
	            { type: CONSOLE_PANEL,		hidden: true, size: '20%', resizable: true, style: pstyle },
	            { type: TEST_PANEL, 	hidden: true, size: 300, resizable: true, style: pstyle,
	            	tabs: {
		    			/** @lends layoutConfig.TestPanel.tabs */
		    			/** @memberOf layoutConfig.TestPanel.tabs */
	                    active: TAB_ID_TEST_INTERPRETATION,
	                    tabs: [
	                        { id: TAB_ID_TEST_INTERPRETATION,	caption: 'Interpretation'},
	                        { id: TAB_ID_TEST_STOPWORD,		 	caption: 'Stopword Removal'}
	                    ],
	                    onClick: function (event) {
//		                    	console.log('right-tab' + event);
	                    	if(event.tab.id === TAB_ID_TEST_INTERPRETATION){
	                    		
		                        this.owner.content(TEST_PANEL, layoutConfig.interpreterEl);
		                        //HACK in Chrome this seems not to work correctly: nothing is rendered
		                        //     FIX -> trigger resize on the panel and force re-rendering
		                        $(this.box).trigger('resize');
		                        
	                    	}
	                    	else if(event.tab.id === TAB_ID_TEST_STOPWORD){
	                    		
		                        this.owner.content(TEST_PANEL, layoutConfig.stopwordEl);
		                        //HACK in Chrome this seems not to work correctly: nothing is rendered
		                        //     FIX -> trigger resize on the panel and force re-rendering
		                        $(this.box).trigger('resize');
		                        
	                    	} else {
	                    		
	                    		console.error('unknown right-tab' + event);
		                        this.owner.content('right', event);
		                        
	                    	}
	                    }
	            	}
	            },
	            
	            { type: 'main', style: pstyle + 'border-top: 0px;', 
	                tabs: {
		    			/** @lends layoutConfig.main.tabs */
		    			/** @memberOf layoutConfig.main.tabs */
	                    active: TAB_ID_EDITOR,
	                    tabs: [
	                        { id: TAB_ID_EDITOR, 				caption: TAB_LABEL_EDITOR},
	                        { id: TAB_ID_INTERMEDIATE_GRAMMAR, 	caption: TAB_LABEL_INTERMEDIATE_GRAMMAR},
	                        { id: TAB_ID_COMPILED_GRAMMAR, 		caption: TAB_LABEL_COMPILED_GRAMMAR},
	                    ],
	                    onClick: function (event) {
//	                    	console.log('main-tab' + event);
	                    	if(event.tab.id === TAB_ID_EDITOR){
	                    		
		                        this.owner.content('main', layoutConfig.editorEl);
//		                        layoutConfig.editor.toFullSize();
		                        
	                    	}
	                    	else if(event.tab.id === TAB_ID_INTERMEDIATE_GRAMMAR){
	                    		
		                        this.owner.content('main', layoutConfig.grammarDefEl);
		                        
	                    	} else if(event.tab.id === TAB_ID_COMPILED_GRAMMAR){
	                    		
		                        this.owner.content('main', layoutConfig.compiledGrammarEl);
		                        
	                    	} else {
	                    		
	                    		console.error('unknown main-tab' + event);
		                        this.owner.content('main', event);
		                        
	                    	}
	                    },
//	            		onRefresh: function(event){
////	            			console.log('main-tab refresh ', event);
////	            			layoutConfig.editor.refresh();
////	            			var parent = layoutConfig.$editorEl.parent();
////	            			layoutConfig.$editorEl.height( layoutConfig.$editorEl.parent().height() - 31 );
//	            		},
	            		onResize: function(event){
//	            			console.log('main-tab resize ', event);
	            			
	            			_updateEditorSize(true);
	            		}
	                },
	                toolbar: {
		    			/** @lends layoutConfig.main.toolbar */
		    			/** @memberOf layoutConfig.main.toolbar */
	                	name: 'toolbar',
	                    items: []
//	                    , onClick: function (event) {
//	                    	console.log('main-toolbar ',event);
//	                    }
//	                	, onMenuClick: function (event) {
//	                		console.log('main-toolbar ',event);
//		                }
	                }
	            }
	        ]
		},
        sidebar: {
			/** @lends sidebarConfig */
			/** @memberOf sidebarConfig */
            name: 'sidebar',
            nodes: [ 
//	                { id: 'projectList', text: 'Project Grammars', img: 'icon-folder', expanded: true, group: true},
	                { id: 'fileList', text: 'Loaded Grammars', img: 'icon-folder', expanded: true, group: true},
	                { id: 'compiledList', text: 'Recompiled Grammars', img: 'icon-folder', expanded: true, group: true}//,
	                
//	                { id: 'level-2', text: 'Level 2', img: 'icon-folder', expanded: true, group: true,
//	                  nodes: [ { id: 'level-2-1', text: 'Level 2.1', img: 'icon-folder', count: 3,
//	                               nodes: [
//	                               { id: 'level-2-1-1', text: 'Level 2.1.1', icon: 'fa-star-empty' },
//	                               { id: 'level-2-1-2', text: 'Level 2.1.2', icon: 'fa-star-empty', count: 67 },
//	                               { id: 'level-2-1-3', text: 'Level 2.1.3', icon: 'fa-star-empty' }
//	                           ]},
//	                           { id: 'level-2-2', text: 'Level 2.2', icon: 'fa-star-empty' },
//	                           { id: 'level-2-3', text: 'Level 2.3', icon: 'fa-star-empty' }
//	                         ]
//	                }
            ]//,
//            onClick: function(event){
//            	console.log('sidebar clicked ',event.target, ', ', event);
//            }
		
        }
    };//END: w2layout
	 
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function init(editor){
		
		layoutConfig.editor = editor;
		layoutConfig.$editorEl = $('#inputBox');
		layoutConfig.editorEl = layoutConfig.$editorEl[0];
		
		layoutConfig.$consoleEl = $('#console-element');
		layoutConfig.consoleEl = layoutConfig.$consoleEl[0];

		layoutConfig.$interpreterEl = $('#interpreter-element');
		layoutConfig.interpreterEl = layoutConfig.$interpreterEl[0];
		
		layoutConfig.$stopwordEl = $('#stopword-element');
		layoutConfig.stopwordEl = layoutConfig.$stopwordEl[0];
		
		
	 	$('#semantic-test-main').w2layout(layoutConfig.layout);
	 	w2ui.layout.content('main', layoutConfig.editorEl);
	 	w2ui.layout.content('left', $().w2sidebar(layoutConfig.sidebar));
	 	

	 	w2ui.layout.content(CONSOLE_PANEL, layoutConfig.consoleEl);
	 	w2ui.layout.content(TEST_PANEL, layoutConfig.interpreterEl);
	 	

		layoutConfig.$grammarDefEl = $('#intermediate-grammar-element');
		layoutConfig.grammarDefEl = layoutConfig.$grammarDefEl[0];
		

		layoutConfig.$compiledGrammarEl = $('#compiled-grammar-element');
		layoutConfig.compiledGrammarEl = layoutConfig.$compiledGrammarEl[0];
	 	
//	 	w2ui.sidebar.on('*', function (event) {
//	        console.log('Event: ' + event.type + ' Target: ' + event.target);
//	        console.log(event);
//	    });

//	 	w2ui.layout_main_toolbar.on('*', function (event) {
//	        console.log('Event: ' + event.type + ' Target: ' + event.target);
//	        console.log(event);
//	    });
	 	
	 	//w2ui.layout_main_tabs
	 	//w2ui.layout_main_toolbar
	 	
		editor.getTextView().getModel().addEventListener("Changed", function(event){
//			if(event.addedLineCount > 0 || event.removedLineCount > 0){
//
//				if(editor.getModel().getLineCount() > 0){
//					editor.toFullSize();
//				}
//
//			}
			
			_checkDirtyCompiled();
			
		});
		
//		editor.addJsonChangedListener(function(hasChanged){
//			_setDirtyCompiled(hasChanged);
//		});
		
	 	
	}//END init();
	
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _checkDirtyCompiled(viewModel){
		
		if(!viewModel){
			viewModel = w2ui.sidebar.get(w2ui.sidebar.selected).model;
		}
		
		var text = editor.val();
		var itemJsonText = viewModel.getJsonText();
		
		if(typeof itemJsonText !== 'undefined' && itemJsonText !== text){
			//FIXME do checksum comparison?
			_updateDirtySaved(true);	
		}
		
		var json = viewModel.getJson();
		if(!json){
			return; /////////// EARLY EXIT ///////////////////
		}
		
		var textAsJson;
		try{
			textAsJson = JSON.parse(text);
		} catch (exc){
			//do nothing
		}
		
		if(textAsJson){
			_setDirtyCompiled( ! util.isEqual(json, textAsJson) );
		}
	}//END _checkDirtyCompiled
	
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _updateEditorSize(onlyIfVisible){
		
		if(w2ui.layout && (!onlyIfVisible || w2ui.layout_main_tabs.active === TAB_ID_EDITOR)){
			
			var main = $(w2ui.layout.el('main'));
			main.position();
			layoutConfig.$editorEl.height( main.height() - Math.ceil(main.position().top / 2) );
			
		}
		
	}
	
	/**
	 * internal flag: are compiled versions of the grammar "in sync" with text-editor?
	 * @private
	 * @memberOf MainView.private
	 */
	var _isDirtyCompiledFlag = false;
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _setDirtyCompiled (isDirty){
		
		if(_isDirtyCompiledFlag !== isDirty){
			_isDirtyCompiledFlag = isDirty;
			
			w2ui.layout_main_tabs.get(TAB_ID_COMPILED_GRAMMAR).caption = TAB_LABEL_COMPILED_GRAMMAR + (isDirty? ' *':'');
			w2ui.layout_main_tabs.get(TAB_ID_INTERMEDIATE_GRAMMAR).caption = TAB_LABEL_INTERMEDIATE_GRAMMAR + (isDirty? ' *':'');
			w2ui.layout_main_tabs.refresh();
			
		}
	}
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _isDirtyCompiled(){
		return _isDirtyCompiledFlag;
	}
	
	/**
	 * @private
	 * @memberOf MainView.private
	 */
	var _isDirtySavedFlag = false;
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _setDirtySaved(isDirty){
		var item = w2ui.sidebar.get(w2ui.sidebar.selected);
		if(item && item.model){
			item.model.setStored( ! isDirty );
		}
		_updateDirtySaved(isDirty);
	}
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _updateDirtySaved(isDirty){
		
		if(_isDirtySavedFlag !== isDirty){
			_isDirtySavedFlag = isDirty;
			w2ui.layout_main_tabs.get(TAB_ID_EDITOR).caption = TAB_LABEL_EDITOR + (isDirty? ' *':'');
			w2ui.layout_main_tabs.refresh();
		}
		
		layoutConfig.editor.setDirty(isDirty);
	}
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _isDirtySaved(){
		return layoutConfig.editor.isDirty();
	}
	
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _getButtonIcon(buttonId){
		switch(buttonId){
		case 'save-json':
		case 'save-js':
		case 'save-checksum':
		case 'save-grammar-def':
		case 'save-all':
			return 'fa fa-floppy-o';//'fa fa-download';
		case 'save-json-info':
		case 'save-js-info':
		case 'save-checksum-info':
//		case 'save-grammar-def':
//		case 'save-all':
			return 'fa fa-hand-o-right';
		case 'compile-grammar':
			return 'fa fa-share-square-o';
		case 'toggle-console':
			return 'fa fa-desktop';
//		case 'toggle-interpreter':
//			return 'fa fa-terminal';
		case 'load-grammar':
			return 'fa fa-file-code-o';
		case 'load-grammar-url':
			return 'fa fa-download';
		case 'info-mask':
			//fall through to info-upgrade
		case 'info-upgrade':
			return 'fa fa-info-circle';
		case 'app-help':
			return 'fa fa-question-circle';
		case 'auto-validation':
			return 'fa fa-play-circle-o';
//		case 'validate-grammar':
//			return 'fa fa-check-circle-o';
		default:
			return;
		}
	}
	
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _addToolbar(button){
		var icon = _getButtonIcon(button.id);
		if(icon){
			button.icon = icon;
		}
//		else {
//			button.img = 'icon-page';
//		}
		w2ui.layout_main_toolbar.add(button);
	}
	
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _printError(msg) {
		_printConsole("ERROR: " + msg, 'error');
	}

	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _printWarn(msg) {
		_printConsole("WARN: " + msg, 'warn');
	}

	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _printInfo(msg) {
		_printConsole("INFO: " + msg, 'info');
	}
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _getConsoleMessageIcon(level){
		switch(level){
		case 'error':
		case 'warn':
			return '<i class="fa fa-exclamation-triangle"></i>';
		case 'info':
		default:
			return '<i class="fa fa-info-circle"></i>';
		}
	};
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _clearConsole() {
		if (!layoutConfig.$consoleOutEl) {
			return;
		}
		layoutConfig.$consoleOutEl.html('');
		
		w2ui.layout_main_toolbar.get('toggle-console').count = 0;
		w2ui.layout_main_toolbar.refresh();
	}
	/**
	 * @private
	 * @function
	 * @memberOf MainView.private
	 */
	function _printConsole(text, level) {
		
		text = text.replace(/([^\r])\n/g, "$1\r\n");
		
		if (!layoutConfig.$consoleOutEl) {
			layoutConfig.$consoleOutEl = $('#outputBox');
			layoutConfig.consoleOutEl = layoutConfig.$consoleOutEl[0];
		}
		
		var $outputBox = layoutConfig.$consoleOutEl;
		var	outputBox  = layoutConfig.consoleOutEl;
		

		var isScroll = false;
		//autoscroll, if scroll position is at the very bottom:
		var scrollPos = outputBox.scrollHeight - $outputBox.innerHeight()
				+ (outputBox.offsetWidth - outputBox.clientWidth);
		var isScroll = outputBox.scrollTop + 4 >= scrollPos;
		
		var out = $outputBox.html() + '<div class="console ' + level + '">'
					+ _getConsoleMessageIcon(level) + ' &nbsp; '
					+ text + '<div><br>';
		$outputBox.html(out);

		if(isScroll) {
			$outputBox.scrollTop(outputBox.scrollHeight
					- $outputBox.innerHeight() + 20);
		}
		
		w2ui.layout_main_toolbar.get('toggle-console').count = $('div.console', $outputBox).length;
		w2ui.layout_main_toolbar.refresh();
	}
	
	//////////////////////////////////////////// Public Exports //////////////////////////////////
	return {
		/** @lends MainView.prototype */
		/** @memberOf MainView  */
		_breakElCount: 0,//internal counter / ID for toolbar-breaks (i.e. separators)
		init: init,
		addProjectGrammar: function(id, path){
			
			var model = viewModel.create(id, 'project', path);
			
//			//OLD IMPL: id MUST not exist in projectList!
//			w2ui.sidebar.insert('projectList', null, 
//                { id: model.viewId, text: model.getLabel(), icon: model.getIcon(), model: model}
//            );
//			
//			return model;
			
			var entry = w2ui.sidebar.get(model.viewId);
			
			if(entry){
				//update model in existing entry
				entry.model.setJson( model.getJson() );
				entry.model.setUrl( model.getUrl() );
				entry.model.setStored( true );//reset "saved-dirty" flag (since this was just loaded from a file)
				entry.model.setGrammarConverter(void(0), void(0));//reset compiled grammar -> force re-compilation
				
				model = entry.model;
			}
			else {
				entry = { id: model.viewId, text: model.getLabel(), icon: model.getIcon(), model: model };
				w2ui.sidebar.insert('fileList', null, entry);
			}
			
			return model;
			
		},
		addLoadedGrammar: function(id, jsonGrammar, path){
			
			var model = viewModel.create(id, 'file', path, jsonGrammar);
			
			var entry = w2ui.sidebar.get(model.viewId);
			
			if(entry){
				//update model in existing entry
				entry.model.setJson( model.getJson() );
				entry.model.setUrl( model.getUrl() );
				entry.model.setStored( true );//reset "saved-dirty" flag (since this was just loaded from a file)
				entry.model.setGrammarConverter(void(0), void(0));//reset compiled grammar -> force re-compilation
				
				model = entry.model;
			}
			else {
				entry = { id: model.viewId, text: model.getLabel(), icon: model.getIcon(), model: model };
				w2ui.sidebar.insert('fileList', null, entry);
			}
			
			return model;
		},
		addCompiledGrammar: function(id, jsonGrammar){
			
			var model = viewModel.create(id, 'compiled', null, jsonGrammar);
			
			var entry = w2ui.sidebar.get(model.viewId);
			
			if(entry){
				//update model in existing entry
				entry.model.setJson( model.getJson() );
				entry.model.setUrl( model.getUrl() );
				entry.model.setGrammarConverter(void(0), void(0));//reset compiled grammar -> force re-compilation
				
				model = entry.model;
			}
			else {
				entry = { id: model.viewId, text: model.getLabel(), icon: model.getIcon(), model: model };
				w2ui.sidebar.insert('compiledList', null, entry);
			}
			
			return model;
		},
		selectGrammar: function(viewId){
			w2ui.sidebar.click(viewId);
		},
		__setGrammarSelected: function(viewId){
			w2ui.sidebar.select(viewId);
		},
		getGrammarItem: function(viewId){
			return w2ui.sidebar.get(viewId);
		},
		updateGrammarItem: function(viewId){
			var item = w2ui.sidebar.get(viewId);
			if(!item){
				console.error('There is no view-item with ID '+viewId);
				return;
			}
			
			var label = item.model.getLabel();
			var icon  =  item.model.getIcon();
			
			var isChanged = false;
			if(label != item.text){
				isChanged = true;
				item.text = label;
			}
			if(icon != item.icon){
				isChanged = true;
				item.icon = icon;
			}

			if(isChanged){
				w2ui.sidebar.refresh();
			}
			
		},
		getSelectedGrammarItem: function(){
			return w2ui.sidebar.get(w2ui.sidebar.selected);
		},
		getSelectedGrammarId: function(){
			var entry = w2ui.sidebar.get(w2ui.sidebar.selected);
			if(entry){
				return entry.model.id;
			}
		},
		onGrammarSelect: function(handler){
			w2ui.sidebar.on('click', handler);
		},
		
		__addToolbar: function(button, handler){//temporary: will be removed!
			w2ui.layout_main_toolbar.add(button);
			if(handler){
				w2ui.layout_main_toolbar.on(handler.event, handler.func);
			}
		},
		__getToolbarSeparator: function(){
			return {type: 'break',  id: 'break' + (++this._breakElCount), caption: ''/*FIX need empty caption for separators within toolbar-menus!*/};
		},
		__getToolbarButton: function(text, id, handler, isChecked){//temporary: will be removed!
			
			var button = typeof isChecked !== 'undefined'?
							{type: 'check',  id: id, caption: text, onClick: handler, checked: isChecked}
						:	{type: 'button', id: id, caption: text, onClick: handler};
						
			var icon = _getButtonIcon(button.id);
			if(icon){
				button.icon = icon;
			}
//			else {
//				button.img = 'icon-page';
//			}
			return button;
		},
		__getToolbarJqElement: function(domId){
			return $('#'+domId, $(w2ui.layout_main_toolbar.box));
		},
		
		setGrammarEngineSelected: function(engineName){
//			var engineId = engineName + '-engine';
			
			var engineMenu = w2ui.layout_main_toolbar.get('select-grammar-engine');
			engineMenu.caption = 'Compiler: '+engineName;
			w2ui.layout_main_toolbar.refresh();
			
			//HACK: set the menu to "pressed-down" state permanently:
			$('[id$="select-grammar-engine"]>table', $(w2ui.layout_main_toolbar.box)).addClass('menu-button-selected');
		},
		selectGrammarEngine: function(buttonId){
			var engineMenu = w2ui.layout_main_toolbar.get('select-grammar-engine');
			var engineButton = w2ui.layout_main_toolbar.get.call(engineMenu, buttonId);
			//trigger "click" on the menu-entry:
			w2ui.layout_main_toolbar.menuClick({item: engineMenu, subItem: engineButton});
		},
		updateCurrentGrammarText: function(){
			var item = w2ui.sidebar.get(w2ui.sidebar.selected);
			if(item){
				item.model.setJsonText( this.getJsonGrammarText() );
			}
		},
		
		
		addToolbarButton: function(text, id, handler){
			var button = {type: 'button', id: id, caption: text, onClick: handler};
			_addToolbar(button);
		},
		addToolbarStateButton: function(text, id, handler, isChecked){
			var button = {type: 'check',  id: id, caption: text, onClick: handler, checked: isChecked};
			_addToolbar(button);
		},
		addToolbarSeparator: function(){
			_addToolbar({type: 'break',  id: 'break' + (++this._breakElCount)});
		},
		clickToolbarButton: function(buttonId){
			w2ui.layout_main_toolbar.click(buttonId);
		},
		
		disableToolbarButton: function(buttonId){
			w2ui.layout_main_toolbar.disable(buttonId);
		},
		disableSidbarItem: function(elementId){
			w2ui.sidebar.disable(elementId);
		},
		
		triggerDownload: function (strData, filename) {
			var url = "data:text/plain;charset=utf-8;base64,"
			            + w2utils.base64encode( strData );
			var link = window.document.createElement('a');
			link.href = url;
			link.download = filename || 'output.txt';
			//NOTE: FireFox requires a MouseEvent (in Chrome a simple Event would do the trick)
			var click = document.createEvent("MouseEvent");
			click.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			link.dispatchEvent(click);	
		},
		
		toggleConsole: function(){
			w2ui.layout.toggle(CONSOLE_PANEL);
		},
		toggleInterpreter: function(){
			w2ui.layout.toggle(TEST_PANEL);
		},
		
		getJsonGrammarText: function(){
			return layoutConfig.editor.val();
		},
		getCompiledGrammarText: function(){
			return layoutConfig.$compiledGrammarEl.find('#compiledParserOutBox')[0].textContent;
		},
		getIntermediateGrammarText: function(){
			return layoutConfig.$grammarDefEl.find('#compileOutBox')[0].textContent;
		},
		
		clearJsonGrammarText: function(){
			layoutConfig.editor.val('');
		},
		clearCompiledGrammarText: function(){
			layoutConfig.$compiledGrammarEl.find('#compiledParserOutBox')[0].textContent = '';
		},
		clearIntermediateGrammarText: function(){
			layoutConfig.$grammarDefEl.find('#compileOutBox')[0].textContent = '';
		},
		
		setJsonGrammarText: function(text){
			validationUtil.resetGrammarValidation();
//			this.setEditorText(text);
			layoutConfig.editor.val(text);
			layoutConfig.editor.createFolding();
		},
		setCompiledGrammarText: function(text){
			layoutConfig.$compiledGrammarEl.find('#compiledParserOutBox')[0].textContent = text;
		},
		setIntermediateGrammarText: function(text){
			layoutConfig.$grammarDefEl.find('#compileOutBox')[0].textContent = text;
		},
		
		selectJsonGrammarText: function(text){
			//TODO show tab too (if not already visible)?
			var t = layoutConfig.editor.getText();
			layoutConfig.editor.setSelection(0, t.length, true, function() {
				editor.focus();
			});//start, end, isScrollToSelection, callback
		},
		selectCompiledGrammarText: function(text){
			//TODO show tab too (if not already visible)?
			layoutConfig.$compiledGrammarEl.find('#compiledParserOutBox')[0].select();
		},
		selectIntermediateGrammarText: function(text){
			//TODO show tab too (if not already visible)?
			layoutConfig.$grammarDefEl.find('#compileOutBox')[0].select();
		},
		
//		setEditorText: function(text){
//			layoutConfig.editor.val(text);
//		},
//		getEditorText: function(){
//			return layoutConfig.editor.val();
//		},
		
		setTestInterpretationText: function(phrase){
			layoutConfig.$interpreterEl.find('#interpretationInputBox').val(phrase);
		},
		getTestInterpretationText: function(){
			var phrase = layoutConfig.$interpreterEl.find('#interpretationInputBox').val();
			return phrase;
		},
		
		setInterpretationTestResult: function(result, isSetAlternativeResult){
			
			if (typeof result == "object") {
				if (typeof result.semantic === 'string') {
					result.semantic = text.semantic;
				}
				result = util.formatJson(result);
			}
			
			//add line break
			result += '\n';
			
			var id = '#interpretationBox' + (isSetAlternativeResult? 'Alt' : ''); 
			layoutConfig.$interpreterEl.find(id).text(result);
		},
		clearInterpretationTestResult: function(){
			var id = '#interpretationBox'; 
			layoutConfig.$interpreterEl.find(id).text('');
			id += 'Alt';//<- clear result field for alternative-processing method (may be not visible)
			layoutConfig.$interpreterEl.find(id).text('');
		},
		
		
		setTestStopwordText: function(phrase){
			layoutConfig.$stopwordEl.find('#stopwordInputBox').val(phrase);
		},
		getTestStopwordText: function(){
			return layoutConfig.$stopwordEl.find('#stopwordInputBox').val();
		},
		setStopwordTestResult: function(result, isSetAlternativeResult){
			
			//add line break
			result += '\n';
			
			var id = '#stopwordBox' + (isSetAlternativeResult? 'Alt' : ''); 
			layoutConfig.$stopwordEl.find(id).text(result);
		},
		clearStopwordTestResult: function(){
			var id = '#stopwordBox'; 
			layoutConfig.$stopwordEl.find(id).text('');
			id += 'Alt';//<- clear result field for alternative-processing method (may be not visible)
			layoutConfig.$stopwordEl.find(id).text('');
		},
		
		clearView: function(){
			this.clearConsoleOut();
			this.clearIntermediateGrammarText();
			this.clearCompiledGrammarText();
			this.clearInterpretationTestResult();
			this.setTestInterpretationText('');//input for test-interpretatoin
			this.clearStopwordTestResult();
			this.setTestStopwordText('');//input for test-stopwords
		},
		
		validateGrammar: function(){
			layoutConfig.editor.validate();
		},
		setAutoValidationEnabled: function(isEnabled){
			layoutConfig.editor.setAutoValidationEnabled(isEnabled);
			if(isEnabled){
				this.validateGrammar();
			}
		},
		isAutoValidationEnabled: function(){
			return layoutConfig.editor.isAutoValidationEnabled();
		},
		
		
		printError: _printError,
		printInfo:  _printInfo,
		printWarn:  _printWarn,
		printConsole:  _printConsole,
		clearConsoleOut: _clearConsole,
		
		setDirtyCompiled: _isDirtyCompiled,
		verifyDirtyCompiled: _checkDirtyCompiled,
		isDirtyCompiled: _isDirtyCompiled,
		setDirtySaved: _setDirtySaved,
		updateDirtySaved: _updateDirtySaved,
		isDirtySaved: _isDirtySaved
		
	};
});