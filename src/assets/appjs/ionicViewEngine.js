
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
define(['jquery', 'logger', 'module'],function(jquery, Logger, module){

	var log = Logger.create(module);


	var promise = jquery.Deferred();

	require(['jquery', 'languageManager', 'controllerManager'],
	    function(jq, languageManager, controllerManager
	){


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

		var isIonInit = false;
		var ionNavCtrl;//<- set when ionWillEnter gets registered (see below)
		var ionWillEnter = function(ionViewCtrl){
			console.log('ionicViewEngine->viewWillEnter: ', arguments);
			var currIndex = ionNavCtrl.length() - 1;
			var targetIndex = ionViewCtrl.index;
			if(targetIndex === currIndex - 1){
				//-> BACK: need to "update" dialog-engine, since BACK was triggered outside the state-engine
				// WARNING: this also means that BACK must always be triggered via the navCtrl!
				console.info('ionicViewEngine->BACK detected');//DEBUG
				mmir.DialogManager.raise('back', {navRender: false});//<- just update the state-machine, without (re-) rendering the target view
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

			//HACK (for BACK detection) do not continue if data.navRender === false
			if(data && data.navRender === false){
				return;/////////////////////// EARLY EXIT ////////////////////////
			}

			//trigger "before page preparing" hooks on controller, if present/implemented:
			isContinue = ctrl.performIfPresent('before_page_prepare', data, viewName);
			if(isContinue === false){
				return;/////////////////////// EARLY EXIT ////////////////////////
			}

			isContinue = ctrl.performIfPresent('before_page_prepare_'+viewName, data);
			if(isContinue === false){
				return;/////////////////////// EARLY EXIT ////////////////////////
			}

			//provide "change" data for before_page_load calls:
			var pageEvtData = {
				name: viewName//,
//				id: newId,
//				oldSel: oldId,
//				content: newPage
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

			//HACK add listener for viewWillEnter events for detecting BACK naviation (i.e. navCtrl.pop())
			if(!isIonInit){
				isIonInit = true;
				ionNavCtrl = this._ionicNavCtrl;
				this._ionicNavCtrl.viewWillEnter.subscribe(ionWillEnter);
			}

			var transitionOpt = {
				// animate 	boolean 	Whether or not the transition should animate.
				animate: data && data.navAnimate === true
			};
			if(transitionOpt.navAnimate){
				// direction 	string 	The conceptual direction the user is navigating. For example, is the user navigating forward, or back?
				transitionOpt.direction = data && data.navDirection? data.navDirection : 'forward';

				//TODO evaluate ionic's other animation-options!
					// animation 	string 	What kind of animation should be used: 'md-transition' | 'ios-transition' | 'wp-transition'.
					// duration 	number 	The length in milliseconds the animation should take.
					// easing 	string 	The easing for the animation.
			}

			this._ionicNavCtrl.push(view.view, {data: data}, transitionOpt).then(function(){
				doRemoveElementsAfterViewLoad.call(this, /*newPage,*/{},changeOptions);
			});
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

					//TODO

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

//				var loadingText = typeof text === 'undefined'? languageManager.getText('loadingText') : text;
//
//				if(typeof theme !== 'undefined'){
//					dlg.defaultStyle = theme;
//					//TOD
//				}
//
//				dlg.show(loadingText, _viewEngineWaitId);
				//TODO
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
//				dlg.hide(_viewEngineWaitId);
				//TODO
			}

//			/////////////////////////////////// Additional non-standard functions & properties /////////////

		});
	});

	return promise;
});
