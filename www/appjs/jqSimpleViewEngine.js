
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
 *  @depends jQuery.append
 *  @depends jQuery#selector
 *
 *  @depends jQuerySimpleModalDialog
 */
define(['jquery', 'mmirf/loadCss', 'mmirf/logger', 'module'],function(jquery, loadCss, Logger, module){

	var log = Logger.create(module);

	//load CSS for jQuery Mobile:
	var JQM_CSS_ID   = 'jqm-css';
	var JQM_CSS_HREF = 'mmirf/vendor/styles/jquery.mobile-1.4.5.min.css';
	loadCss({href: JQM_CSS_HREF, id: JQM_CSS_ID});

	var promise = jquery.Deferred();

	require(['jquery', 'mmirf/commonUtils', 'mmirf/renderUtils', 'mmirf/languageManager', 'mmirf/controllerManager', 'mmirf/waitDialog', 'mmirf/util/forEach'],
	    function(jq, commonUtils, renderUtils, languageManager, controllerManager, dlg, forEach
	){

		//prepare resources for standalone-wait-dialog
		dlg.styleUrl = 'mmirf/vendor/styles/' + dlg.styleUrl;
		dlg._loadStyle();
		var _viewEngineWaitId = 'view-wait-dlg';

		/**
		 * delay in case a Layout that is rendered includes a CSS file:
		 * signal "on_page_load" after this delay so that (hopefully) the CSS has been loaded
		 *
		 * NOTE: the onload listener for LINK-tags does not work in all browsers, so it cannot be used for checking if CSS has been loaded
		 *
		 * TODO make configurable?
		 */
		var CSS_LOAD_DELAY = typeof window.CSS_LOAD_DELAY === 'number'? window.CSS_LOAD_DELAY : 10;//ms

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
		var FIELD_NAME_RESOLVE 		 = '__renderResolve';
		var FIELD_NAME_VIEW 		 = '__view';
		var FIELD_NAME_DATA 		 = '__renderData';
		var FIELD_NAME_CONTROLLER 	 = '__ctrl';

		/**
		 * Reference to the layout that was rendered last.
		 *
		 * This is updated in doRenderView() before the view is actually rendered.
		 *
		 * @type Layout
		 * @private
		 * @memberOf SimpleJqViewEngine#
		 */
		var lastLayout = null;

		//function for removing "old" content from DOM (-> remove old, un-used page content)
		var doRemoveElementsAfterViewLoad = function(event, data){

			var ctrl = data[FIELD_NAME_CONTROLLER];
			var view = data[FIELD_NAME_VIEW];
			var renderData = data[FIELD_NAME_DATA];
			var defer = data[FIELD_NAME_RESOLVE];

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
				console.error('PresentationManager[jqSimpleViewEngine].__doRemoveElementsAfterViewLoad: missing controller (and view)!',data.options);
				return;
			}

			//trigger "after page loading" hooks on controller:
			// the hook for all views of the controller MUST be present/implemented:
			ctrl.perform('on_page_load', renderData, viewName);
			//... the hook for single/specific view MAY be present/implemented:
			if(view){
				ctrl.performIfPresent('on_page_load_'+viewName, renderData);
			}

			defer.resolve();
		};

		/**
		 * HELPER generate a marker for inserted LINK and STYLE elements
		 * 			(so that they can easily removed)
		 *
		 * @function
		 * @private
		 * @memberOf SimpleJqViewEngine#
		 */
		var getLayoutMarkerAttr = function(layout){
			return 'rendered_layout_' + layout.getName();
		};

		/**
		 * HELPER remove layout resources (before loading a new layout).
		 *
		 * @param {Layout} layout
		 * 				the layout which's resources should be removed
		 *
		 * @function
		 * @private
		 * @memberOf SimpleJqViewEngine#
		 */
		var doRemoveLayoutResources = function(layout){
			jquery('head .' + getLayoutMarkerAttr(layout)).remove();
		};

		/**
		 * Prepares the layout, before loading a view:
		 * loads referenced SCRIPTs, LINKs, and STYLEs.
		 *
		 * This function should not be called, if the layout is already loaded,
		 * i.e. SCRIPTs etc. are meant to be load-once (not load-on-every-page-rendering)
		 *
		 * @param {Layout} layout
		 * 				the layout which's resources should be prepared
		 * @returns {Promise}
		 * 				a deferred promise that gets resolved when the resources have been prepared
		 *
		 * @function
		 * @private
		 * @memberOf SimpleJqViewEngine#
		 */
		var doPrepareLayout = function(layout){

			//initialize with layout contents:

			/** @type Array<TagElement> */
			var headerContents = layout.headerElements;

			var scriptList = [];
			var layoutMarker = getLayoutMarkerAttr(layout);
			var isLinkLoading = false;
			var head, htmlStyle;
			forEach(headerContents, function(elem){
				if( elem.isScript()){

					scriptList.push(elem.src);

				} else if(elem.isLink()){

					isLinkLoading = true;
					loadCss({'href': elem.href, 'class': layoutMarker});

				} else if(elem.isStyle()){

					if(!head){
						head = $('head');
					}
					htmlStyle = jquery.parseHTML(['<style class="', layoutMarker, '">', elem.html(), '</style>' ].join(''));
					head.append(htmlStyle);

				} else {

					console.warn('jqSimpleViewEngine.doPrepareLayout: unknown header element type: '+ elem.tagName, elem);
				}
			});

			if(scriptList.length === 0){
				var defer = jquery.Deferred();
				if(isLinkLoading){
					//if css file is loading, resolve with a small delay, so that (most/some of) the CSS is loaded by then
					setTimeout(function(){defer.resolve();}, CSS_LOAD_DELAY);
				} else {
					defer.resolve();
				}
				return defer;/////////////////////////// EARLY EXIT ///////////////////////////////
			} else {

				if(!head){
					head = $('head');
				}


				var defer = jquery.Deferred();
				var resolved = 0;//<- counter for resolved async-executions
				var setResolved = function(){++resolved; checkResolve();}
				var checkResolve = function(){
					if(resolved === 2){//<- expected async-executions: 2
						defer.resolve();
					}
				}

				//wait until all referenced scripts form LAYOUT have been loaded (may be used/required when views get rendered)
				commonUtils.loadImpl(
					scriptList,
					true,//<- load serially, since scripts may depend on each other
					null,//<- use returned promise instead of callback
					function checkIsAlreadyLoadedFunc(fileName){
						//if script is already loaded, do not load again:
						return head.find('script[src="'+fileName+'"]').length > 0;
					}
				).then(setResolved);

				if(isLinkLoading){
					//if css file is loading, resolve with a small delay, so that (most/some of) the CSS is loaded by then
					setTimeout(setResolved, CSS_LOAD_DELAY);
				} else {
					setResolved();
				}

				return defer;/////////////////////////// EARLY EXIT ///////////////////////////////
			}
		};

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
		 * @returns {Promise}
		 * 	        	a Promise that gets resolved when rendering is finished
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

			var renderResolve = jquery.Deferred();
			var presentMgr = this;
			var renderFunc = function(){

				var title = layout.title;
				if(title){
					document.title = title;
				}

				var layoutBody = renderUtils.renderViewContent(layout.bodyContentElement, null, view.contentFors, data);
				var layoutDialogs = renderUtils.renderViewDialogs(layout.getDialogsContents(), layout.getYields(), view.contentFors, data);

				var dialogs = jq("#applications_dialogs");//<- TODO make this ID a CONST & export/collect all CONSTs in one place
				dialogs.empty();

				dialogs.append(layoutDialogs);

				var pg = new RegExp(CONTENT_ID, "ig");
				var oldId = "#" + CONTENT_ID + presentMgr.pageIndex;

				// get old content from page
				var oldContent = jq(oldId);
				if(oldContent.length < 1 && oldId == '#'+CONTENT_ID+'0'){
					//the ID of the first page (pageIndex 0) may have no number postfix
					// -> try without number:
					if(log.isVerbose()) log.debug('PresentationManager[jqViewEngine].doRenderView: removing old content: no old centent found for old ID "'+oldId+'", trying "#'+CONTENT_ID+'" instead...');//debug
					oldId = '#' + CONTENT_ID;
					oldContent = jq(oldId);
				}

				++ presentMgr.pageIndex;
				var newId = CONTENT_ID + presentMgr.pageIndex;

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
				changeOptions[FIELD_NAME_RESOLVE] = renderResolve;
				changeOptions[FIELD_NAME_VIEW] = view;
				changeOptions[FIELD_NAME_DATA] = data;
				changeOptions[FIELD_NAME_CONTROLLER] = ctrl;


				//change visible page from old to new one (using simple jQuery replace function)

				var pageContainer = oldContent;
				pageContainer.replaceWith(newPage);
				doRemoveElementsAfterViewLoad.call(newPage,{},changeOptions);
			};

			if(layout !== lastLayout){
				//if lastLayout is not null: unload its SCRIPTs, LINKs, and STYLEs?
				if(lastLayout){
					doRemoveLayoutResources(lastLayout);
				}
				lastLayout = layout;
				doPrepareLayout(layout).then(renderFunc);
			} else {
				renderFunc();
			}

			return renderResolve;
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
                	console.warn('PresentationManager[jqSimpleViewEngine].hideCurrentDialog: could not find SimpleModal plugin: jQuery.modal is '+(typeof jq.modal));
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
					console.error("PresentationManager[jqSimpleViewEngine].showDialog: Could not find Controller for '" + ctrlName + "'");
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
