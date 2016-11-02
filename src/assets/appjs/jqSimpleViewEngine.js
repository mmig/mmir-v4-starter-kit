
/**
 * Example for a simplified view/rendering engine:
 * 
 * uses the jQuery Mobile styles, but instead of jQM page transitions,
 * page-contents are simply replaced upon page-changes. 
 * 
 * <h3>Side Effects</h3>
 * <ul>
 * 	<li>loads the jQuery Mobile CSS file</li>
 * </ul>
 * 
 * @example
 * //use page-transition with effect 'slide' (animated as not reversed motion)
 * mmir.DialogManager.render('theController', 'theView');
 * 
 * @class
 * @name jqmSimpleViewEngine
 * @static 
 *  
 * Libraries:
 *  - jQuery (>= v1.6.2)
 *  
 *  @depends document (DOM object)
 *  
 *  @depends jQuery.Deferred
 *  
 *  @depends jQuery.parseHTML
 *  @depends jQuery.appendTo
 *  @depends jQuery#selector
 *  
 *  @depends jQuerySimpleModalDialog
 */
define(['constants', 'jquery', 'loadCss', 'logger', 'module'],function(consts, jquery, loadCss, Logger, module){

	var log = Logger.create(module);
	
	var basePath = consts.getBasePath();
	
	//load CSS for jQuery Mobile:
	var JQM_CSS_ID   = 'jqm-css';
	var JQM_CSS_HREF = basePath+'mmirf/vendor/styles/jquery.mobile-1.4.5.min.css';
	loadCss({href: JQM_CSS_HREF, id: JQM_CSS_ID});
	
	var promise = jquery.Deferred();
	
	require(['jquery', 'renderUtils', 'languageManager', 'controllerManager', 'waitDialog'],
	    function(jq, renderUtils, languageManager, controllerManager, dlg
	){

		//prepare resources for standalone-wait-dialog
		dlg.styleUrl = 'mmirf/vendor/styles/' + dlg.styleUrl;
		dlg._loadStyle();
		var _viewEngineWaitId = 'view-wait-dlg';
		
		/**
		 * The ID attribute for the content / page-elements.
		 * 
		 * <p>
		 * This is jQuery Mobile specific:
		 * pages are contained in an element with <code>data-role="page"</code>.
		 * 
		 * These elements must have an ID attribute with the value of this constant
		 * (the actual value will be created and set on rendering the view / layout).
		 * 
		 * @property CONTENT_ID
		 * @type String
		 * @public
		 * @constant
		 */
		var CONTENT_ID = "pageContainer";

		//property names for passing the respected objects from doRenderView() to doRemoveElementsAfterViewLoad()
		var FIELD_NAME_VIEW 		 = '__view';
		var FIELD_NAME_DATA 		 = '__renderData';
		var FIELD_NAME_CONTROLLER 	 = '__ctrl';

		//function for removing "old" content from DOM (-> remove old, un-used page content)
		var doRemoveElementsAfterViewLoad = function(event, data){

			var ctrl = data[FIELD_NAME_CONTROLLER];
			var view = data[FIELD_NAME_VIEW];
			var renderData = data[FIELD_NAME_DATA];

			//FIX handle missing ctrl/view parameter gracefully 
			//     this may occur when doRemoveElementsAfterViewLoad is 
			//     triggered NOT through doRenderView but by some automatic
			//	   mechanism, e.g. BACK history event that was not handled
			//	   by the framework (which ideally should not happen ...)
			var viewName;
			if(view){
				viewName = view.getName();
			}

			if(!ctrl){
				console.error('PresentationManager[jqmViewEngine].__doRemoveElementsAfterViewLoad: missing controller (and view)!',data.options);
				return;
			}

			//trigger "after page loading" hooks on controller:
			// the hook for all views of the controller MUST be present/implemented:
			ctrl.perform('on_page_load', renderData, viewName);
			//... the hook for single/specific view MAY be present/implemented:
			if(view){
				ctrl.performIfPresent('on_page_load_'+viewName, renderData);
			}

		};

		//FIXME wik: remove jQm
//		// set jQuery Mobile's default transition to "none":
//		// TODO make this configurable (through mmir.ConfigurationManager)?
//		jq.mobile.defaultPageTransition = 'none';

		/**
		 * Actually renders the View.<br>
		 * Fetches the layout for the controller, then fills the
		 * layout-template with the view content, while incorporating
		 * partials and contents that helper methods have provided. Then
		 * Dialogs are created and the pageContainer id is updated. At last
		 * all the content is localized using
		 * {@link mmir.LanguageManager#translateHTML}, and appended to
		 * the HTML document of the application, while the old one is
		 * removed.<br>
		 * At the end the <b>on_page_load</b> action is performed.
		 * 
		 * @function doRenderView
		 * 
		 * @param {String}
		 *            ctrlName Name of the controller
		 * @param {String}
		 *            viewName Name of the view to render
		 * @param {Object}
		 *            view View object that is to be rendered
		 * @param {Object}
		 *            ctrl Controller object of the view to render
		 * @param {Object}
		 *            [data] optional data for the view.
		 *            
		 */
		var doRenderView = function(ctrlName, viewName, view, ctrl, data){

			//if set to FALSE by one of the hooks (ie. before_page_prepare / before_page_load)
			//   will prevent rendering of the view! 
			var isContinue;

			//trigger "before page preparing" hooks on controller, if present/implemented: 
			isContinue = ctrl.performIfPresent('before_page_prepare', data, viewName);
			if(isContinue === false){
				return;/////////////////////// EARLY EXIT ////////////////////////
			}

			isContinue = ctrl.performIfPresent('before_page_prepare_'+viewName, data);
			if(isContinue === false){
				return;/////////////////////// EARLY EXIT ////////////////////////
			}

			var layout = this.getLayout(ctrlName, true);

			var layoutBody = layout.getBodyContents();
			var layoutDialogs = layout.getDialogsContents();
			//TODO var layoutHeader = layout.getHeaderContents();
			
			//NOTE title requires remoteLayout.js (i.e. overwritten layout.js):
			var title = layout.title;
			if(title){
				document.title = title;
			}

			layoutBody = renderUtils.renderViewContent(layoutBody, layout.getYields(), view.contentFors, data );
			layoutDialogs = renderUtils.renderViewDialogs(layoutDialogs, layout.getYields(), view.contentFors, data );

			//TODO handle additional template syntax e.g. for BLOCK, STATEMENT (previously: partials)
			var dialogs = jq("#applications_dialogs");//<- TODO make this ID a CONST & export/collect all CONSTs in one place 
			dialogs.empty();

			dialogs.append(layoutDialogs);
			
			var pg = new RegExp(CONTENT_ID, "ig");
			var oldId = "#" + CONTENT_ID + this.pageIndex;

			// get old content from page
			var oldContent = jq(oldId);
			if(oldContent.length < 1 && oldId == '#'+CONTENT_ID+'0'){
				//the ID of the first page (pageIndex 0) may have no number postfix
				// -> try without number:
				if(log.isVerbose()) log.debug('PresentationManager[jqViewEngine].doRenderView: removing old content: no old centent found for old ID "'+oldId+'", trying "#'+CONTENT_ID+'" instead...');//debug
				oldId = '#' + CONTENT_ID;
				oldContent = jq(oldId);
			}

			++ this.pageIndex;
			var newId = CONTENT_ID + this.pageIndex;

			//TODO detect ID-attribute of content-TAG when layout is initialized instead of here
			layoutBody = layoutBody.replace(pg, newId);

			if(typeof jq.parseHTML !== 'undefined'){
				layoutBody = jq.parseHTML(layoutBody);
			}
			var newPage = jq(layoutBody);

			//provide "change" data for before_page_load calls:
			var pageEvtData = {
				name: viewName,
				id: newId,
				oldSel: oldId,
				content: newPage
			};

			//trigger "before page loading" hooks on controller, if present/implemented: 
			isContinue = ctrl.performIfPresent('before_page_load', data, pageEvtData);//<- this is triggered for every view in the corresponding controller
			if(isContinue === false){
				return;/////////////////////// EARLY EXIT ////////////////////////
			}

			isContinue = ctrl.performIfPresent('before_page_load_'+viewName, data, pageEvtData);
			if(isContinue === false){
				return;/////////////////////// EARLY EXIT ////////////////////////
			}

			//pass controller- and view-instance to "after page change" handler
			var changeOptions = {};
			changeOptions[FIELD_NAME_VIEW] = view;
			changeOptions[FIELD_NAME_DATA] = data;
			changeOptions[FIELD_NAME_CONTROLLER] = ctrl;


			//change visible page from old to new one (using simple jQuery replace function)

			var pageContainer = oldContent;
			pageContainer.replaceWith(newPage);
			doRemoveElementsAfterViewLoad.call(newPage,{},changeOptions);
		};
		
		promise.resolve({
			
			render: doRenderView,
			/**
             * Closes a modal window / dialog.<br>
             * 
             * @depends jQuery Mobile SimpleModal
             * 
             * @function hideCurrentDialog
             * @public
             */
            hideCurrentDialog : function() {
                
                if (jq.modal != null) {
                	//TODO implement this!
//                    jq.modal.close();
                }
                else {
                	console.warn('PresentationManager[jqmViewEngine].hideCurrentDialog: could not find SimpleModal plugin: jQuery.modal is '+(typeof jq.modal));
                }
            },
            /**
             * Opens the requested dialog.<br>
             * 
             * @depends jQuery Mobile SimpleModal
             * @depends mmir.ControllerManager
             * 
             * 
             * @function showDialog
             * @param {String}
             *            ctrlName Name of the controller
             * @param {String}
             *            dialogId Id of the dialog
             * @param {Object}
             *            data Optionally data - not used
             *            
             * @returns {Object} the instance of the current dialog that was opened
             * 
             * @public
             */
            showDialog : function(ctrlName, dialogId, data) {

            	//TODO implement!!
            	
				this.hideCurrentDialog();

				var ctrl = controllerManager.getController(ctrlName);
				
				if (ctrl != null) {

//					return jq("#" + dialogId).modal({
//						
//						overlayId : 'recorder-overlay',
//						containerId : 'recorder-container',
//						//$("#"+dialogId).modal({overlayId: dialogId+"overlay",containerId: dialogId+"container",  
//          					  
//          				//closeHTML: null,opacity: 65, position: ['0',],overlayClose: true,onOpen: this.open,onClose: this.close
//						closeHTML : null,
//						opacity : 65,
//						position : [ '0' ],
//						overlayClose : false//,
////						onOpen: current_dialog.open,
////						onClose: current_dialog.close
//
//					}); /////////////////////////////////// EARLY EXIT ////////////////////////
//
//
//					//DISABLED: this would require jqtransform.js / jqtransform.css
////					jq('.transformed-checkbox').jqTransform({
////						imgPath : 'jqtransformplugin/img/'
////					});
					
				} else {
					console.error("PresentationManager[jqmViewEngine].showDialog: Could not find Controller for '" + ctrlName + "'");
				}
			},
			
			/**
			 * Shows a "wait" dialog, i.e. "work in progress" notification.
			 * 
			 * @function showWaitDialog
			 * 
			 * @param {String} [text] OPTIONAL
			 * 				the text that should be displayed.
			 * 				If omitted the language setting for <code>loadingText</code>
			 * 				will be used instead (from dictionary.json)
			 * @param {String} [theme] OPTIONAL
			 * 				set the jQuery Mobile theme to be used for the wait-dialog
			 * 				(e.g. "a" or "b").
			 * 				NOTE: if this argument is used, then the <code>text</code>
			 * 					  must also be supplied.
			 * 
			 * @public
			 * 
			 * @depends stdlne-wait-dlg (Standalone Wait Dialog)
			 * @depends mmir.LanguageManager
			 * 
			 * @see #hideWaitDialog
			 */
			showWaitDialog : function(text, theme) {

				var loadingText = typeof text === 'undefined'? languageManager.getText('loadingText') : text;
				
				if(typeof theme !== 'undefined'){
					dlg.defaultStyle = theme;
					//TODO
				}
				
				dlg.show(loadingText, _viewEngineWaitId);
			},

			/**
			 * Hides / closes the "wait" dialog.
			 * 
			 * @function hideWaitDialog
			 * @public
			 * 
			 * @depends stdlne-wait-dlg (Standalone Wait Dialog)
			 * 
			 * @see #showWaitDialog
			 */
			hideWaitDialog : function() {
				dlg.hide(_viewEngineWaitId);
			},
			
			/////////////////////////////////// Additional non-standard functions & properties /////////////
			styleTagId: JQM_CSS_ID,
			styleTagHref: JQM_CSS_HREF,
			isStylePresent: function(){
				return document.getElementById(this.styleTagId);
			},
			loadStyle: function(){
				if(!this.isStylePresent()){
					loadCss({href: this.styleTagHref, id: this.styleTagId});
				}
			}
		});
	});
	
	return promise;
});
