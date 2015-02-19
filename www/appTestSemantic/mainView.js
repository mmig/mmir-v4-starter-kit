
define(['jquery', 'w2ui'], function($){
	
	var CONSOLE_PANEL = 'bottom';
	var INTERPERTER_PANEL = 'right';
	
	var pstyle = '';//'border: 1px solid #dfdfdf; padding: 5px;';
	var layoutConfig = {
		layout: {
	        name: 'layout',
	        panels: [
	            { type: 'top', size: 30, title: 'Grammar Tester', style: /*'height: 0.6em;' +*/ pstyle },
	            { type: 'left', size: 200, resizable: true, style: pstyle, content: 'left' },
	            
	            { type: CONSOLE_PANEL,		hidden: true, size: '20%', resizable: true, style: pstyle },
	            { type: INTERPERTER_PANEL, 	hidden: true, size: 300, resizable: true, style: pstyle },
	            
	            { type: 'main', style: pstyle + 'border-top: 0px;', 
	                tabs: {
	                    active: 'tab1',
	                    tabs: [
	                        { id: 'tab1', caption: 'Editor' },
	                        { id: 'tab2', caption: 'Intermediate Grammar' },
	                        { id: 'tab3', caption: 'Compiled Grammar (JS)' },
	                    ],
	                    onClick: function (event) {
//	                    	console.log('main-tab' + event);
	                    	if(event.tab.id === 'tab1'){
	                    		
		                        this.owner.content('main', layoutConfig.editorEl);
//		                        layoutConfig.editor.toFullSize();
		                        
	                    	}
	                    	else if(event.tab.id === 'tab2'){
	                    		
		                        this.owner.content('main', layoutConfig.grammarDefEl);
		                        
	                    	} else if(event.tab.id === 'tab3'){
	                    		
		                        this.owner.content('main', layoutConfig.compiledGrammarEl);
		                        
	                    	} else {
	                    		
	                    		console.error('unknown main-tab' + event);
		                        this.owner.content('main', event);
		                        
	                    	}
	                    },
	            		onRefresh: function(event){
	            			console.log('main-tab refresh ', event);
//	            			layoutConfig.editor.refresh();
//	            			var parent = layoutConfig.$editorEl.parent();
//	            			layoutConfig.$editorEl.height( layoutConfig.$editorEl.parent().height() - 31 );
	            		},
	            		onResize: function(event){
	            			console.log('main-tab resize ', event);
	            			
	            			_updateEditorSize(true);
	            		}
	                },
	                toolbar: {
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
            name: 'sidebar',
            nodes: [ 
	                { id: 'projectList', text: 'Project Grammars', img: 'icon-folder', expanded: true, group: true},
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
            ]
        }
    };//END: w2layout
	 
	function init(editor){
		
		layoutConfig.editor = editor;
		layoutConfig.$editorEl = $('#inputBox');
		layoutConfig.editorEl = layoutConfig.$editorEl[0];
		
		layoutConfig.$consoleEl = $('#console-element');
		layoutConfig.consoleEl = layoutConfig.$consoleEl[0];

		layoutConfig.$interpreterEl = $('#interpreter-element');
		layoutConfig.interpreterEl = layoutConfig.$interpreterEl[0];
		
	 	$('#semantic-test-main').w2layout(layoutConfig.layout);
	 	w2ui.layout.content('main', layoutConfig.editorEl);
	 	w2ui.layout.content('left', $().w2sidebar(layoutConfig.sidebar));
	 	

	 	w2ui.layout.content(CONSOLE_PANEL, layoutConfig.consoleEl);
	 	w2ui.layout.content(INTERPERTER_PANEL, layoutConfig.interpreterEl);
	 	

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
	 	
	 	
	}//END init();
	
	function _updateEditorSize(onlyIfVisible){
		
		if(w2ui.layout && (!onlyIfVisible || w2ui.layout_main_tabs.active === 'tab1')){
			
			var main = $(w2ui.layout.el('main'));
			main.position();
			layoutConfig.$editorEl.height( main.height() - Math.ceil(main.position().top / 2) );
			
		}
		
	}
	
	function _getButtonIcon(buttonId){
		switch(buttonId){
		case 'save-json':
		case 'save-js':
		case 'save-checksum':
		case 'save-grammar-def':
		case 'save-all':
			return 'fa fa-floppy-o';//'fa fa-download';
		case 'compile-grammar':
			return 'fa fa-share-square-o';
		case 'toggle-console':
			return 'fa fa-desktop';
		case 'toggle-interpreter':
			return 'fa fa-terminal';
		case 'load-grammar':
			return 'fa fa-file-code-o';
		default:
			return;
		}
	}
	
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
	
	return {
		_breakElCount: 0,
		init: init,
		addProjectGrammar: function(id, path){
			w2ui.sidebar.insert('projectList', null, 
                { id: id, text: 'Grammar '+id, icon: 'fa fa-file-text-o', model: { id: id, type: 'project', uri: path}}
            );
		},
		addLoadedGrammar: function(id, jsonGrammar, path){
			
			var entry = { id: id, text: 'Grammar '+id, icon: 'fa fa-file-code-o', model: { id: id, type: 'file', json: jsonGrammar, uri: path } };
			
			if(w2ui.sidebar.get(id)){
				w2ui.sidebar.set('fileList', id, entry);
			}
			else {
				w2ui.sidebar.insert('fileList', null, entry);
			}
		},
		addCompiledGrammar: function(id, jsonGrammar){
			
			var entryId = 'compiled_' + id;
			var entry = { id: entryId, text: 'Grammar '+id, icon: 'fa fa-file', model: { id: id, type: 'compiled', json: jsonGrammar } };
			
			if(w2ui.sidebar.get(entryId)){
				w2ui.sidebar.set('compiledList', entryId, entry);
			}
			else {
				w2ui.sidebar.insert('compiledList', null, entry);
			}
		},
		selectGrammar: function(id){
			w2ui.sidebar.select(id);
			w2ui.sidebar.click(id);
		},
		selectCompiledGrammar: function(id){
			this.selectGrammar('compiled_'+id);
		},
		getGrammar: function(id){
			return w2ui.sidebar.get(id);
		},
		getSelectedGrammarId: function(){
			var entry = w2ui.sidebar.get(w2ui.sidebar.selected);
			return entry.model.id;
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
			w2ui.layout.toggle(INTERPERTER_PANEL);
		},
		
		getCompiledGrammarText: function(){
			return layoutConfig.$compiledGrammarEl.find('#compiledParserOutBox')[0].textContent;
		},
		getIntermediateGrammarText: function(){
			return layoutConfig.$grammarDefEl.find('#compileOutBox')[0].textContent;
		},
		clearCompiledGrammarText: function(){
			layoutConfig.$compiledGrammarEl.find('#compiledParserOutBox')[0].textContent = '';
		},
		clearIntermediateGrammarText: function(){
			layoutConfig.$grammarDefEl.find('#compileOutBox')[0].textContent = '';
		},
		setCompiledGrammarText: function(text){
			layoutConfig.$compiledGrammarEl.find('#compiledParserOutBox')[0].textContent = text;
		},
		setIntermediateGrammarText: function(text){
			layoutConfig.$grammarDefEl.find('#compileOutBox')[0].textContent = text;
		},
		
		setExamplePhrase: function(phrase){
			console.info('TODO impl. setExamplePhrase -> '+phrase);
//			this._examplePhrase = phrase;
			
			$('#interpretationInputBox', layoutConfig.$interpreterEl).val(phrase);
			
			
		},
		getExamplePhrase: function(){
			var phrase = $('#interpretationInputBox', layoutConfig.$interpreterEl).val();
			console.info('TODO impl. getExamplePhrase -> '+phrase);
			return phrase;
		}
		
	};
});