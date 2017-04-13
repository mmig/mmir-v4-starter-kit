
/**
 *
 *
 * @example
 * //use page-transition with effect 'slide' (animated as not reversed motion)
 * mmir.DialogManager.render('theController', 'theView');
 *
 * @class
 * @name ionicViewEngine
 * @static
 *
 * Libraries:
 *  - Ionic2/Angular2
 *
 *  @depends Ionic2/Angular2
 *  @depends jQuery.Deferred
 *
 */
define(['jquery', 'logger', 'module'],function(jquery, Logger, module){

	var log = Logger.create(module);


	var promise = jquery.Deferred();

	require(['languageManager', 'controllerManager'],
	    function(languageManager, controllerManager
	){


		//property names for passing the respected objects from doRenderView() to afterViewLoadHandler()
		var FIELD_NAME_VIEW 		 = '__view';
		var FIELD_NAME_DATA 		 = '__renderData';
		var FIELD_NAME_CONTROLLER 	 = '__ctrl';

		//function for removing "old" content from DOM (-> remove old, un-used page content)
		var afterViewLoadHandler = function(data){

			var ctrl = data[FIELD_NAME_CONTROLLER];
			var view = data[FIELD_NAME_VIEW];
			var renderData = data[FIELD_NAME_DATA];

			var viewName;
			if(view){
				viewName = view.getName();
			}

			if(!ctrl){
				console.error('PresentationManager[ionicViewEngine].__afterViewLoadHandler: missing controller (and view)!',data.options);
				return;
			}

			//trigger "after page loading" hooks on controller:
			// the hook for all views of the controller MUST be present/implemented:
			ctrl.performIfPresent('on_page_load', renderData, viewName);
			//... the hook for single/specific view MAY be present/implemented:
			if(view){
				ctrl.performIfPresent('on_page_load_'+viewName, renderData);
			}

		};

		var isIonInit = false;
		var ionNavCtrl;//<- set when ionWillEnter gets registered (see below)
		var ionWillEnter = function(ionViewCtrl){

			console.log('ionicViewEngine->viewWillEnter: ', arguments);//DEBUG
			console.log('ionicViewEngine->viewWillEnter.history['+ionNavCtrl.length()+']->', ionNavCtrl.getViews().map(function(el){return el.name;}));//DEBUG

			var isRendering = ionViewCtrl.data && ionViewCtrl.data.rendering;
			if(isRendering){
				//page-change was triggered by ionicViewEngine -> reset rendering status
				ionViewCtrl.data.rendering = false;
			} else {
				//page-change was NOT triggered by ionicViewEngine -> try to detect, if it is a BACK transtion
				//  (e.g. by ionic's BACK-button or NavPop or external operation on the NavController)
				// TODO handle case, that it is not a back-transition ... what to do in that case? can that even occur?
				var currIndex = ionNavCtrl.length() - 1;
				var targetIndex = ionViewCtrl.index;
				if(targetIndex === currIndex - 1){
					//-> BACK: need to "update" dialog-engine, since BACK was triggered outside the state-engine
					// WARNING: this also means that BACK must always be triggered via the navCtrl!
					console.info('ionicViewEngine->BACK detected');//DEBUG
					mmir.DialogManager.raise('back', {navRender: false});//<- just update the state-machine, without (re-) rendering the target view
				}//TODO else ...? trigger a listener?
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
			if(isContinue === false || (data && data.defaultPrevented)){
				return;/////////////////////// EARLY EXIT ////////////////////////
			}

			isContinue = ctrl.performIfPresent('before_page_prepare_'+viewName, data);
			if(isContinue === false || (data && data.defaultPrevented)){
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
			if(isContinue === false || pageEvtData.defaultPrevented){
				return;/////////////////////// EARLY EXIT ////////////////////////
			}

			isContinue = ctrl.performIfPresent('before_page_load_'+viewName, data, pageEvtData);
			if(isContinue === false || pageEvtData.defaultPrevented){
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

			var goBack = data && data.navBack;
			if(goBack){

				var history = this._ionicNavCtrl.getViews();
				var lastIndex = history.length - 1;
				var oldIndex = - 1, oldView;
				for(var i= lastIndex; i >= 0; --i){
					oldView = history[i];
					if(oldView.component === view.view){
						oldIndex = i;
						break;
					}
				}

				var navFunc, navArgs;

				if(oldIndex > -1){
					//FIXME set rendering = true
					oldView.data = oldView.data || {};
					oldView.data.rendering = true;
					transitionOpt.direction = 'back';
					if(oldIndex < lastIndex){
						navFunc = 'remove';
						navArgs = [oldIndex + 1, lastIndex - oldIndex, transitionOpt];
					} else {
						navFunc = 'pop';
						navArgs = [transitionOpt];
					}
				}
			}

			if(!navFunc){

				var goRoot = data && data.navGoRoot;
				navFunc = goRoot? 'setRoot' : 'push';
				navArgs = [view.view, {data: data, rendering: true}, transitionOpt];

				if(!goRoot){
					var isReplace = data && data.navReplace;
					if(isReplace){
						navFunc = 'insert';
						var insertIndex = this._ionicNavCtrl.length() - 1;

						//adjust arguments: add insertion-index at beginning, and do not animate for INSERT
						navArgs[2] = {animate: false};
						navArgs.unshift(insertIndex);
					}
				}
			}

			var renderEngine = this;
			this._ionicNavCtrl[navFunc].apply(this._ionicNavCtrl, navArgs).then(function(){
				if(navFunc === 'insert'){
					renderEngine._ionicNavCtrl.pop(transitionOpt).then(function(){
						afterViewLoadHandler.call(renderEngine, changeOptions);
					});
				} else {
					afterViewLoadHandler.call(renderEngine, changeOptions);
				}
			});
		};

		promise.resolve({

			render: doRenderView,
			/**
             * Closes a modal window / dialog.<br>
             * 
             * TODO impl. with Ionic's ModalController(?)
             *
             * @function hideCurrentDialog
             * @public
             */
            hideCurrentDialog : function() {

                console.error('PresentationManager[ionicViewEngine].hideCurrentDialog: not implemented yet');
            },
            /**
             * Opens the requested dialog.<br>
             * 
             * TODO impl. with Ionic's ModalController(?)
             * 
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
//				this.hideCurrentDialog();
//
//				var ctrl = controllerManager.getController(ctrlName);
//
//				if (ctrl != null) {
//
//					//TODO
//
//				} else {
//					console.error("PresentationManager[ionicViewEngine].showDialog: Could not find Controller for '" + ctrlName + "'");
//				}
            	console.error("PresentationManager[ionicViewEngine].showDialog: not implemented yet");
			},

			/**
			 * Shows a "wait" dialog, i.e. "work in progress" notification.
			 * 
			 * TODO impl. with Ionic components
			 *
			 * @function showWaitDialog
			 *
			 * @param {String} [text] OPTIONAL
			 * 				the text that should be displayed.
			 * 				If omitted the language setting for <code>loadingText</code>
			 * 				will be used instead (from dictionary.json)
			 * @param {String} [theme] OPTIONAL
			 * 				set the theme to be used for the wait-dialog
			 * 				(e.g. TODO).
			 * 				NOTE: if this argument is used, then the <code>text</code>
			 * 					  must also be supplied.
			 *
			 * @public
			 *
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
            	console.error("PresentationManager[ionicViewEngine].showWaitDialog: not implemented yet");
			},

			/**
			 * Hides / closes the "wait" dialog.
			 * 
			 * TODO impl. with Ionic components
			 *
			 * @function hideWaitDialog
			 * @public
			 *
			 *
			 * @see #showWaitDialog
			 */
			hideWaitDialog : function() {
//				dlg.hide(_viewEngineWaitId);
				//TODO
            	console.error("PresentationManager[ionicViewEngine].hideWaitDialog: not implemented yet");
			}

//			/////////////////////////////////// Additional non-standard functions & properties /////////////

		});
	});

	return promise;
});
