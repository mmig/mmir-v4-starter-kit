﻿/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/**
 * @module mmir.manager
 * 
 * Dependencies:
 *  TODO add entries for used JS files
 *  
 * Libraries:
 *  - jQuery (>= v1.6.2); ajax, each, bind
 *  - jQuery Mobile (jQuery plugin, >= 1.2.0); $.mobile
 *  - SimpleModal (jQuery plugin, >= v1.4.2); $.modal
 *  TODO check for other dependencies on 3rd party libraries (& add missing entries)
 *  
 *  @depends document (DOM object)
 */
define([ 'controllerManager', 'constants', 'commonUtils', 'configurationManager', 'renderUtils'
         , 'layout', 'view', 'partial', 'dictionary', 'checksumUtils'
         , 'jquery'//, 'module'
         , 'antlr3', 'jqm','stringExtension', 'languageManager', 'parserModule'
        
    ], function ( controllerManager, constants, commonUtils, configurationManager, renderUtils
    		, Layout, View, Partial, Dictionary, checksumUtils
            , $//, module
) {
	
	var pageIndex = 0;

	 /**
	  * Name of the default controller.
	  * 
	  * <p>
	  * Note, that there must be (1) a controller and (2) a layout definition for
	  * this name, otherwise the framework will not be able to start.
	  * 
	  * @property DEFAULT_CONTROLLER_NAME
	  * @type String
	  * @private
	  * @constant
	  */
	 var DEFAULT_CONTROLLER_NAME = 'Application';
	 
	 
	 var CONFIG_PRECOMPILED_VIEWS_MODE = 'usePrecompiledViews';//TODO move this to somewhere else (collected config-vars?)? this should be a public CONSTANT...
	 
	 // private members
	 /**
	  * Array of layouts of the application
	  * 
	  * @property layouts
	  * @type Dictionary
	  * @private
	  */
	 var layouts = new Dictionary();

	 /**
	  * Array of all the views of the application
	  * 
	  * @property views
	  * @type Dictionary
	  * @private
	  */
	 var views = new Dictionary();

	 /**
	  * Array of all the partials of the application
	  * 
	  * @property partials
	  * @type Dictionary
	  * @private
	  */
	 var partials = new Dictionary();

	 /**
	  * List of elements (jQuery objects) that should be remove from DOM
	  * after a page has loaded (loaded: after all contents inserted into the
	  * DOM and after all page transitions have been executed).
	  */
	 var afterViewLoadRemoveList = [];
     
     //function for removing "old" content from DOM (-> remove old, un-used page content)
     var doRemoveElementsAfterViewLoad = function(event, data){
     	//data.toPage: {String|Object} page to which view was changed
     	//data.options: the configuration for the page change
     	
     	//do remove previous/old content from page:
     	var size = afterViewLoadRemoveList.length;
     	for(var i=size-1; i >= 0; --i){
     		//remove element from DOM via jQuery method:
     		afterViewLoadRemoveList[i].remove();
     	}
     	if(size > 0){
     		//remove all elements from array
     		afterViewLoadRemoveList.splice(0, size);
     	}
     };
     //may run in window-/DOM-less environment (e.g. nodejs) 
     //  -> only add listener, if document object is present:
     if(typeof document !== 'undefined'){
     	$( document ).bind( "pagechange", doRemoveElementsAfterViewLoad);
     }

	 // set jQuery Mobile's default transition to "none":
	 $.mobile.defaultPageTransition = 'none';

	 /**
	  * An object containing data for the currently displayed view.<br>
	  * It contains: name of the corresponding controller, name of the view
	  * and optionally data for the view
	  * 
	  * @property currentView
	  * @type Object
	  * @private
	  */
	 var currentView = new Object();

	 /**
	  * An object containing data for the previously displayed view - the one
	  * displayed before the current view.<br>
	  * It contains: name of the corresponding controller, name of the view
	  * and optionally data for the view
	  * 
	  * @property previousView
	  * @type Object
	  * @private
	  */
	 var previousView = new Object();

	 /**
	  * The currently displayed dialog object, if a dialog is displayed. Used
	  * mainly to close the dialog.
	  * 
	  * @property current_dialog
	  * @type Object
	  * @private
	  */
	 var current_dialog = null;

	 var viewSeparator 		= '#';
     var partialSeparator 	= commonUtils.getPartialsPrefix();
     function createLookupKey(ctrl, viewObj, separator){
     	if(typeof ctrl.getName !== 'undefined'){
     		ctrl = ctrl.getName();
     	}
     	if(typeof viewObj.getName !== 'undefined'){
     		viewObj = viewObj.getName();
     	}
     	//TODO remove all >partialSeparator< from partial-string beginning
     	return ctrl+separator+viewObj;
     }
     function createViewKey(ctrl, view){
     	return createLookupKey(ctrl, view, viewSeparator);
     }
     function createPartialKey(ctrl, partial){
     	return createLookupKey(ctrl, partial, partialSeparator);
     }
	 
	 /**
	  * Actually renders the View.<br>
	  * Fetches the layout for the controller, then fills the
	  * layout-template with the view content, while incorporating
	  * partials and contents that helper methods have provided. Then
	  * Dialogs are created and the pageContainer id is updated. At last
	  * all the content is localized using
	  * {@link mmir.LanguageManager#translateHTML}, and appended to
	  * the HTML document of the application, while the old one is
	  * removed - is probably not a good idea to use '<b>$("div[data-role='page']").first().remove()</b>'
	  * to remove the old page content: it's not robust.<br>
	  * At the end the <b>on_page_load</b> action is performed.
	  * 
	  * @function doRenderView
	  * @param {String}
	  *            ctrlName Name of the controller
	  * @param {String}
	  *            viewName Name of the view to render
	  * @param {Object}
	  *            view View object that is to be rendered
	  * @param {Object}
	  *            ctrl Controller object of the view to render
	  * @param {Object}
	  *            [data] optional data for the view
	  * @public
	  */
	 var doRenderView = function(ctrlName, viewName, view, ctrl, data){
		 
		 var layout = _instance.getLayout(ctrlName, true);

		 var layoutBody = layout.getBodyContents();
		 var layoutDialogs = layout.getDialogsContents();
		 //TODO var layoutHeader = layout.getHeaderContents();

		 layoutBody = renderUtils.renderViewContent(layoutBody, layout.getYields(), view.contentFors, data );
		 layoutDialogs = renderUtils.renderViewDialogs(layoutDialogs, layout.getYields(), view.contentFors, data );

		 //TODO handle additional template syntax e.g. for BLOCK, STATEMENT (previously: partials)
		 var dialogs = $("#applications_dialogs");//<- TODO make this a CONST & export/collect all CONSTs in one place 
		 dialogs.empty();

		 // Translate the Keywords or better: localize it... 
//		 NOTE: this is now done during rendering of dialogs-content                if(typeof layoutDialogs  != "undefined"){
//		 layoutDialogs = mmir.LanguageManager.translateHTML(layoutDialogs);
//		 }
		 dialogs.append( layoutDialogs);

//		 // Translate the Keywords or better: localize it... 
//		 NOTE: this is now done during rendering of body-content                  	layoutBody = mmir.LanguageManager.translateHTML(layoutBody);
		 //TODO do localization rendering for layout (i.e. none-body- or dialogs-content)

		 var pg = new RegExp("pageContainer", "ig");
		 var oldId = "#pageContainer" + pageIndex;

		 // get old content from page
		 var oldContent = $(oldId);
		 if(oldContent.length < 1 && oldId == '#pageContainer0'){
			 //the ID of the first page (pageIndex 0) may have no number postfix
			 // -> try without numer:
			 if(IS_DEBUG_ENABLED) console.debug('PresentationManager.doRenderView: removing old content: no old centent found for old ID "'+oldId+'", trying "#pageContainer" instead...');//debug
			 oldContent = $('#pageContainer');
		 }

		 //mark old content for removal
		 afterViewLoadRemoveList.push(oldContent);

		 ++pageIndex;
		 var newId = "pageContainer" + pageIndex;

		 //TODO detect ID-attribute of content-TAG when layout is initialized instead of here
		 layoutBody = layoutBody.replace(pg, newId);

		 if(typeof $.parseHTML !== 'undefined'){
			 layoutBody = $.parseHTML(layoutBody);
		 }
		 var newPage = $(layoutBody);

		 ctrl.performIfPresent('before_page_load', data);//MODIFICATION for lever: added before_page_load hook!
//		 ctrl.performIfPresent('before_page_load_'+viewName, data);

		 //'load' new content into the page (using jQuery mobile)
		 newPage.appendTo($.mobile.pageContainer);

		 //set transition options, if present:
		 var changeOptions;
		 if(data && typeof data.transition !== 'undefined'){
			 changeOptions = {
					 transition: data.transition
			 };
		 }
		 if(data && typeof data.reverse !== 'undefined'){
			 if(!changeOptions){
				 changeOptions = {
						 reverse: data.reverse
				 };
			 }
			 else {
				 changeOptions.reverse = data.reverse; 
			 }
		 }

		 //change visible page from old to new one (using jQuery mobile)
		 $.mobile.changePage("#" + newId, changeOptions);

		 //remove old content:
//		 oldContent.remove();

		 ctrl.perform('on_page_load', data);

		 ctrl.performIfPresent('on_page_load_'+viewName, data);

		 // =====================================================================
//		 var debug = 0;//debug: set >= 1 for debugging
//		 if (debug > 0){
//			 var body_html_array = document.body.innerHTML.split("\n");
//			 var head_html_array = document.head.innerHTML.split("\n");
////			 var all = '<html>\n<head>\n'+document.head.innerHTML+'<body>\n'+document.body.innerHTML+'</body>\n</html>\n';
//			 console.log("=== ===================== html start ===================== ===");
//			 console.log("<html>\n<head>\n");
//			 for (var a in head_html_array){
//				 console.log(head_html_array[a]+"\n");
//			 }
//			 console.log("</head>\n");
//			 console.log("<!-- =====================    body   ===================== -->");
//			 console.log("<body>\n");
//			 for (var a in body_html_array){
//				 console.log(body_html_array[a]+"\n");
//			 }
//			 console.log("</body>\n</html>\n");
//			 console.log("<!-- ===================== html end  ===================== -->");
//		 }
	 };

	 
	var _instance = {
			
			/**
			 * @deprecated instead: use mmir.PresentationManager directly
			 */
			getInstance: function () {
				return this;
			},

           // public members

            addLayout : function(layout) {
                layouts.put(layout.getName(), layout);
            },
            /**
             * This function returns a layout object by name.<br>
             * 
             * @function getLayout
             * @param {String}
             *            layoutName Name of the layout which should be returned
             * @param {Boolean}
             *            [doUseDefaultIfMissing] if supplied and
             *            <code>true</code>, the default controller's layout
             *            will be used as a fallback, in case no corresponding
             *            layout could be found
             * @returns {Object} The requested layout, "false" if not found
             * @public
             */
            getLayout : function(layoutName, doUseDefaultIfMissing) {
                var layout = false;
                layout = layouts.get(layoutName);
                if (!layout) {
                    if (doUseDefaultIfMissing) {
                        layout = _instance.getLayout(DEFAULT_CONTROLLER_NAME, false);
                    }
                    else {
                        console.error('[PresentationManager.getLayout]: could not find layout "' + layoutName +'"')
                        return false;
                    }
                }
                return layout;
            },

            addView : function(ctrlName, view) {
                views.put(createViewKey(ctrlName, view), view);
            },
            /**
             * This function returns a view object by name.<br>
             * 
             * @function getView
             * @param {String}
             *            controllerName Name of the controller for the view
             * @param {String}
             *            viewName Name of the view which should be returned
             * @returns {Object} The requested view, <tt>false</tt> if not
             *          found
             * @public
             */
            getView : function(controllerName, viewName) {
                viewName = createViewKey(controllerName, viewName);
                var view = false;
                view = views.get(viewName);

                if (!view) {
                    console.error('[PresentationManager.getView]: could not find view "' + viewName + '"');
                    return false;
                }
                return view;
            },
            
            addPartial: function(ctrlName, partial){
            	partials.put(createPartialKey(ctrlName, partial), partial);
            },

            /**
             * This function returns a partial object by name.<br>
             * 
             * @function getPartial
             * @param {String}
             *            controllerName Name of the controller for the view
             * @param {String}
             *            viewName Name of the partial which should be returned
             * @returns {Object} The requested partial, "false" if not found
             * @public
             */
            getPartial : function(controllerName, partialName) {
                var partial = false;

                var partialKey = null;
                if (controllerName) {
                    partialKey = createPartialKey(controllerName, partialName);
                }
                else {
                    console.error('[PresentationManager.getPartial]: requested partial "' + partialName + '" for unknown controller: "' + (controllerName ? (controllerName.getName? controllerName.getName(): controllerName) : 'undefined')
                            + '"');
                    return false;
                }

                partial = partials.get(partialKey);
                if (!partial) {
                    console.error('[PresentationManager.getPartial]: could not find partial "' + partialName + '" for controller "' + (controllerName ? (controllerName.getName? controllerName.getName(): controllerName) : 'undefined') + '"!');
                    return false;
                }
                return partial;
            },

            /**
             * Closes a modal window - in this case a dialog.<br>
             * 
             * <br>
             * TODO needs to be "settable", depending on the currently used
             * (modal) dialog library
             * 
             * @requires jQuery Mobile SimpleModal
             * 
             * @function hideCurrentDialog
             * @public
             */
            hideCurrentDialog : function() {
                
//                if (current_dialog != null){
//                	current_dialog.close();
//                	current_dialog = null;
//                }
            	
                if ($.modal != null) {
                    $.modal.close();
                }
            },

            /**
             * Function opens requested dialog.<br>
             * 
             * <br>
             * TODO needs to be "settable", depending on the currently used
             * (modal) dialog library
             * 
             * @requires jQuery Mobile SimpleModal
             * 
             * @function showDialog
             * @param {String}
             *            ctrlName Name of the controller
             * @param {String}
             *            dialogId Id of the dialog
             * @param {Object}
             *            data Optionally data - not used
             * @public
             */
            showDialog : function(ctrlName, dialogId, data) {

				this.hideCurrentDialog();

				var ctrl = controllerManager.getController(ctrlName);
				
				if (ctrl != null) {

					current_dialog = $("#" + dialogId).modal({
						
						overlayId : 'recorder-overlay',
						containerId : 'recorder-container',
						//$("#"+dialogId).modal({overlayId: dialogId+"overlay",containerId: dialogId+"container",  
          					  
          				//closeHTML: null,opacity: 65, position: ['0',],overlayClose: true,onOpen: this.open,onClose: this.close
						closeHTML : null,
						opacity : 65,
						position : [ '0' ],
						overlayClose : false//,
//						onOpen: current_dialog.open,
//						onClose: current_dialog.close

					});

				} else {
					alert("Could not find: Controller for " + ctrlName);
				}

				$('.transformed-checkbox').jqTransform({
					imgPath : 'jqtransformplugin/img/'
				});
			},

            /**
             * Gets the view for a controller, then executes helper methods on
             * the view data. The Rendering of the view is done by the
             * {@link mmir.PresentationManager#doRenderView} method. Also
             * stores the previous and current view with parameters.<br>
             * 
             * @function renderView
             * @param {String}
             *            ctrlName Name of the controller
             * @param {String}
             *            viewName Name of the view to render
             * @param {Object}
             *            data Optionally data for the view
             * @public
             */
            renderView : function(ctrlName, viewName, data) {
            	
                var ctrl = controllerManager.getController(ctrlName);

                if (ctrl != null) {
                    // var view = mmir.PresentationManager.getInstance().getView(ctrlName, viewName);
                    var view = this.getView(ctrlName, viewName);


					//DISABLED helper methods are now handled differently -> invoked during rendering where they are specified in the template/view definition
//					//execute the helper-scripts that were referenced in the view:
//					view.executeHelperMethods(data);

                    doRenderView(ctrlName, viewName, view, ctrl, data);

                    // Only overwrite previous state if and only if the view is not rerendered!
					if (ctrlName != currentView["ctrlName"] || viewName != currentView["viewName"] || data != currentView["data"]){
						previousView["ctrlName"]=currentView["ctrlName"];
						previousView["viewName"]=currentView["viewName"];
						previousView["data"]=currentView["data"];
					}
					
					currentView["ctrlName"]=ctrlName; 
					currentView["viewName"]=viewName; 
					currentView["data"]=data;
                }
            },

            /**
             * Renders the current view again, using the
             * {@link mmir.PresentationManager#render} method.
             * 
             * @function reRenderView
             * @public
             */
            reRenderView : function() {
                if (currentView) {
                    if (currentView["ctrlName"] && currentView["viewName"]) {
                        dialogManager.render(currentView["ctrlName"], currentView["viewName"], currentView["data"]);
                    }
                }
            },

            /**
             * Renders the previous view again, using the
             * {@link mmir.DialogEngine#render} method.
             * 
             * @function renderPreviousView
             * @public
             */
            renderPreviousView : function() {
                if (previousView) {
                    if (previousView["ctrlName"] && previousView["viewName"]) {
                        dialogManager.render(previousView["ctrlName"], previousView["viewName"], previousView["data"]);
                    }
                }
            },        
	
            init: init
	};
	
		
	return _instance;
	
	function init () {
		
		checksumUtils = require('checksumUtils');//FIXME why is this undefined on loading? dependency cycle? really, this should already be available, since it is mentioned in the deps of define()....

		delete _instance.init;//FIXME should init be deleted?

		//DEPRECATED loadAddons!
//		if (module.config().addons){
//			commonUtils.loadAddons(module.config().addons);
//		}

        /**
         * Checks if a pre-compiled view is up-to-date:
         * loads the view, if it is current.
         * 
         * If the pre-compiled view is not current, or loading-errors
         * occur, the fail-callback will be triggered 
         * (the callback argument may contain information about the cause).
         * 
         * @async
         * 
         * @param {String} rawViewData
         * 					the text content of the view template (i.e. content of a eHTML file "as is")
         * @param {String} targetPath
         * 					the path to the pre-compiled view file
         * @param {Function} success
         * 					callback that will be triggered, if pre-compiled view file was loaded
         * 					NOTE: the JS code of the loaded file may not have been fully executed yet!
         * @param {Function} fail
         * 					callback that will be triggered, if pre-compiled view is not up-to-date or
         * 					an error occurs while loading the file
         */
        function loadPrecompiledView(rawViewData, targetpath, success, fail){
        	
        	if(! isUpToDate(rawViewData, targetpath)){
        		if(fail) fail('Precompiled view file is outdated!');
        		else console.warn('Outdated pre-compiled view at: '+targetpath);
        	}
        	
//        	console.warn('Loading pre-compiled view: '+targetpath);//FIXM DEBUG
        	
        	commonUtils.getLocalScript( //scriptUrl, success, fail)
        			targetpath, success, fail
        	);
        }
        
        //determine if pre-compiled views should be used
        //DEFAULT: use templates files and compile them (freshly) on-the-fly
        var isUsePreCompiledViews = configurationManager.get(CONFIG_PRECOMPILED_VIEWS_MODE);
        isUsePreCompiledViews = typeof isUsePreCompiledViews === 'undefined' ? false : isUsePreCompiledViews === 'false'? false : isUsePreCompiledViews? true : false;

        //util for checking if pre-compiled views are up-to-date
        // (i.e.: can we use the pre-compiled view, or do we need to use the template file and compile it on-the-fly)
        //TODO should this also be configurable -> up-to-date check (e.g. use pre-compiled views without checking for changes)
        var checksumUtils = checksumUtils.init();
        
        /**
         * Read the checksum file that was created when the pre-compiled view was created:
         * 
         * it contains the view's template size (the length of its String representation) and MD5 hash.
         * 
         * -> by calculating the viewContent's size and MD5 hash, we can determine, if it has changed
         *    by comparing it with the data of the checksum file.
         *    
         * @sync the checksum file is loaded in synchronous mode
         * 
         * @param {String} viewContent
         * 						the content of the view template (i.e. loaded eHTML file)
         * @param {String} preCompiledViewPath
         * 						the path to the corresponding pre-compiled view file
         * 
         */
        function isUpToDate(viewContent, preCompiledViewPath){
        	//replace file extension with the checksum-file's one: '.js' -> '.checksum.txt'
        	var  viewVerificationInfoPath = 
        				preCompiledViewPath.substring(0, preCompiledViewPath.length - 3) 
        				+ checksumUtils.getFileExt();
        	

//			console.warn('verifying that pre-compiled view is up-to-date at '+preCompiledViewPath);//FIXM DEBUG
        	
			var isCompiledViewUpToDate = false;
			
        	$.ajax({
				async: false,//<-- use "SYNC" modus here (NOTE: we win nothing with async here, because the following step (loading/not loading the pre-compiled view) strictly depends on the result of this)
				dataType: "text",
				url: viewVerificationInfoPath,
				success: function(data){
					
					//compare raw String to checksum-data from file
					isCompiledViewUpToDate = checksumUtils.isSame(viewContent, data);
				}
			}).fail(function(jqxhr, status, err){
				// print out an error message
				var errMsg = err && err.stack? err.stack : err;
				console.error("[" + status + "] Could not load '" + viewVerificationInfoPath + "': "+errMsg); //failure
			});
        	
//        	var func = isCompiledViewUpToDate? 'warn' : 'error';//FIXM DEBUG
//			console[func]((isCompiledViewUpToDate? '+++++++++':'--------')+'pre-compiled view is '+(isCompiledViewUpToDate?'':'NOT ')+'up-to-date! -> '+preCompiledViewPath);//FIXM DEBUG
        	return isCompiledViewUpToDate;
        }
		 
		 /**
		  * This function loads the layouts for every controller and puts the
		  * name of the layouts into the <b>layouts</b> array.
		  * 
		  * @function loadLayouts
		  * @private
		  * 
		  * @returns {Promise} a Deferred.promise that gets resolved upon loading all layouts; fails/is rejected, if not at least 1 layout was loaded
		  */
        function loadLayouts() {
        	// Load application's layouts. 
        	
        	var defer = $.Deferred();
        	
        	var loadedLayoutsCount = 0;
			 
			 var ctrlNameList = controllerManager.getControllerNames();
			 var remainingCtrlCount = ctrlNameList.length;
			 var currentLoadCount = 0;
			 var checkCompletion = function(){
				 if(defer.state() === 'pending' && remainingCtrlCount === 0 && currentLoadCount === 0){
					 if(loadedLayoutsCount < 1){
							
							//there must be at least on layout-file for the default-controller:
							defer.reject(
								'Could not load any layout! At least one layout must be present at '
								+ constants.getLayoutPath() 
								+ DEFAULT_CONTROLLER_NAME[0].toLowerCase() + DEFAULT_CONTROLLER_NAME.substring(1) 
								+ '.ehtml'
							);
						}
						else {
							defer.resolve();
						}
					 
					}
			 };
			 var updateLoadStatus = function(isLoadFailed){
				 
				 --currentLoadCount;
				 
				 if(isLoadFailed === true){//NOTE: need to do exact comparison here, since script-loading callback may pass its event into here, too
					 //do nothing
				 }
				 else {
					 ++loadedLayoutsCount;
				 }
				 
				 checkCompletion();
			 };
			 

        	$.each(ctrlNameList, function(index, ctrlName){
        		
        		var ctrl = controllerManager.getController( ctrlName );
        		var layoutInfo = ctrl.getLayout();

        		if(layoutInfo){//FIXME warn if no layout is present? create/load default APPLICATION layout?

        			var layoutPath = constants.getLayoutPath() + layoutInfo.fileName + '.ehtml';
        			
        			var genPath = constants.getCompiledLayoutPath()//TODO add compiled-path to view-info object (and read it from file-structure/JSON) 
        							+ layoutInfo.fileName + '.js';

        			++currentLoadCount;
        			
        			$.ajax({
        				async: true,
        				dataType: "text",
        				url: layoutPath,
        				success: function(data){

        					if(isUsePreCompiledViews){

        						loadPrecompiledView(data, genPath, updateLoadStatus, function(err){

        							console.warn('Could not load precompiled layout from "'
        									+genPath+'", because: '+err
        									+', compiling template instead: '
											+layoutPath
									);

        							var layout = new Layout(ctrl.getName(), data);
        							layouts.put(layout.getName(), layout);
        							
        							updateLoadStatus();
        						});

        					}
        					else {
        						var layout = new Layout(ctrl.getName(), data);
        						layouts.put(layout.getName(), layout);
        						
        						updateLoadStatus();
        					}
        				}
        			}).fail(function(jqxhr, status, err){
        				
        				// print out an error message
        				var errMsg = err && err.stack? err.stack : err;
        				console.error("[" + status + "] Could not load '" + layoutPath + "': "+errMsg); //failure
        				
        				updateLoadStatus(true);
        			});
        			
        			checkCompletion();

        		}//END: if(layoutInfo)
        		
        		--remainingCtrlCount;
        		checkCompletion();
        		
        	});//END: each(i; ctrlNames)

        	checkCompletion();
        	return defer.promise();
        	
        }

		 /**
		  * This function actually loads the views for every controller, creates
		  * an instance of a view class and puts the view instance in the
		  * <b>views</b> array.<br>
		  * It uses a asynchronous way of loading the view-files one after
		  * another.<br>
		  * <b>If you want to make sure, that all views are indeed loaded, before
		  * proceeding with the subsequent instructions, you could look at the
		  * function {@link mmir.ControllerManager#foundControllersCallBack}
		  * for reference of a function which loads the files one after another -
		  * not asynchronous.</b>
		  * 
		  * @function loadViews
		  * @private
		  * @async
		  * 
		  * @returns {Promise} a Deferred.promise that gets resolved upon loading all views
		  */
        function loadViews() {
        	
        	var defer = $.Deferred();
			 
			 var ctrlNameList = controllerManager.getControllerNames();
			 var remainingCtrlCount = ctrlNameList.length;
			 var currentLoadCount = 0;
			 var checkCompletion = function(){
				 if(defer.state() === 'pending' && remainingCtrlCount === 0 && currentLoadCount === 0){
						defer.resolve();
					}
			 };
			 var updateLoadStatus = function(){
				 
				--currentLoadCount;
				
				checkCompletion();
			 };
			
        	$.each(ctrlNameList, function(ctrlIndex, controllerName){
        		
        		var controller = controllerManager.getController(controllerName); 
        		
        		$.each(controller.getViews(), function(index, view){

        			var genPath = constants.getCompiledViewPath()//TODO add compiled-path to view-info object (and read it from file-structure/JSON)
        							+ controllerName.toLowerCase() + '/' + view.name + '.js';

        			++currentLoadCount;
        			
        			$.ajax({
        				async: true,
        				dataType: "text",
        				url: view.path,
        				success: function(data){

        					if(isUsePreCompiledViews){

        						loadPrecompiledView(data, genPath, updateLoadStatus, function(err){
        							
        							console.warn('Could not load precompiled view from '
        									+genPath+'", because: '+err
        									+', compiling template instead: '
											+view.path
									);

        							var ctrlView = new View(controller, view.name , data);
        							views.put( createViewKey( controller.getName(), view.name), ctrlView);
        							
        							updateLoadStatus();

        						});

        					}
        					else {

        						var ctrlView = new View(controller, view.name , data);
        						views.put( createViewKey( controller.getName(), view.name), ctrlView);

        						updateLoadStatus();
        					}
        				}
        			}).fail(function(jqxhr, status, err){
        				
        				// print out an error message
        				var errMsg = err && err.stack? err.stack : err;
        				console.error("[" + status + "] Could not load '" + view.path + "': "+errMsg); //failure
        				
        				updateLoadStatus();
        			});
        			
        			checkCompletion();

        		});//END: each(view)
        		
        		--remainingCtrlCount;
        		checkCompletion();

        	});//END: each(ctrlName)
        	
        	checkCompletion();
        	return defer.promise();
        	
        }//END: loadViews()

		 /**
		  * This function actually loads the partials for every controller,
		  * creates an instance of a partial class and puts the partial instance
		  * in the <b>partials</b> array.<br>
		  * It uses a asynchronous way of loading the partials-files one after
		  * another.<br>
		  * <b>If you want to make sure, that all partials are indeed loaded,
		  * before proceeding with the subsequent instructions, you could look at
		  * the function
		  * {@link mmir.ControllerManager#foundControllersCallBack} for
		  * reference of a function which loads the files one after another - not
		  * asynchronous.</b>
		  * 
		  * @function loadPartials
		  * @private
		  * @async
		  * 
		  * @returns {Promise} a Deferred.promise, that resolves after all partials have been loaded
		  * 					NOTE: loading failures will generate a warning message (on the console)
		  * 						  but will not cause the Promise to fail.
		  */
		 function loadPartials() {
			 
			 var defer = $.Deferred();
			 
			 var ctrlNameList = controllerManager.getControllerNames();
			 var remainingCtrlCount = ctrlNameList.length;
			 var currentLoadCount = 0;
			 var checkCompletion = function(){
				 if(defer.state() === 'pending' && remainingCtrlCount === 0 && currentLoadCount === 0){
						defer.resolve();
					}
			 };
			 var updateLoadStatus = function(){

				 --currentLoadCount;

				 checkCompletion();
			 };

			 $.each(ctrlNameList, function(ctrlIndex, controllerName){
				 
				 var controller = controllerManager.getController(controllerName); 
				 
				 $.each(controller.getPartials(), function(index, partial){

					 var prefix = commonUtils.getPartialsPrefix();
					 var genPath = constants.getCompiledViewPath()//TODO add compiled-path to view-info object (and read it from file-structure/JSON) 
					 				+ controllerName.toLowerCase() + '/' +prefix+ partial.name + '.js';

					 ++ currentLoadCount;
					 
					 $.ajax({
						 async: true,
						 dataType: "text",
						 url: partial.path,
						 success: function(data){

							 if(isUsePreCompiledViews){

								 loadPrecompiledView(data, genPath, updateLoadStatus, function(err){
									 
									 console.warn('Could not load precompiled partial from '
											 +genPath+'", because: '+err
											 +', compiling template instead: '
											 +partial.path
									 );

									 var ctrlPartial = new Partial(controller, partial.name, data);
									 partials.put(createPartialKey( controller.getName(), partial.name), ctrlPartial);
									 
									 updateLoadStatus();
								 });

							 }
							 else {
								 var ctrlPartial = new Partial(controller, partial.name, data);
								 partials.put(createPartialKey( controller.getName(), partial.name), ctrlPartial);
								 
								 updateLoadStatus();
							 }
						 }
					 }).fail(function(jqxhr, status, err){
						 // print out an error message
						 var errMsg = err && err.stack? err.stack : err;
						 console.error("[" + status + "] " + JSON.stringify(jqxhr) + " -- " + partial.path + ": "+errMsg); //failure

						 updateLoadStatus();
					 });
					 
					 checkCompletion();

				 });//END: each(partial)
				 
				 --remainingCtrlCount;
				 checkCompletion();
				 
			 });//END: each(ctrlName)
			 
			 checkCompletion();
			 return defer.promise();
			 
		 }//END: loadPartials()

		 var defer = $.Deferred();
		 
		 var isLayoutsLoaded = false;
		 var isViewsLoaded = false;
		 var isPartialsLoaded = false;
		 var checkResolved = function(){
			 if(isLayoutsLoaded && isViewsLoaded && isPartialsLoaded){
				 defer.resolve();
			 }
		 };
		 var failPromise = function(msg){ defer.reject(msg); };
		 
		 loadLayouts().then(
				 function(){ isLayoutsLoaded = true; checkResolved(); },
				 failPromise
		 );
		 loadViews().then(
				 function(){ isViewsLoaded = true; checkResolved(); },
				 failPromise
		 );
		 loadPartials().then(
				 function(){ isPartialsLoaded = true; checkResolved(); },
				 failPromise
		 );


		 return defer.promise(_instance);

	};

	
});

