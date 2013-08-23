/*
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
 * @module mobileDS.manager
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
var mobileDS = window.mobileDS ||
{};

var pageIndex = 0;


/**
 * A class to manage the displayed content by using views and partials. <br>
 * 
 * Also contains methods to render views and load the actual files for layouts, views and partials.
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.PresentationManager.getInstance()</code>
 * @class PresentationManager
 * @category core
 * 
 * @see mobileDS.PresentationManager#constructor
 */
mobileDS.PresentationManager = (function(){

    /**
     * Object containing the instance of the class {@link mobileDS.PresentationManager} 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance = null;
    
    /**
     * Name of the default controller.
     * 
     * <p>Note, that there must be (1) a controller and (2) a layout definition for this name,
     *  otherwise the framework will not be able to start.
     * 
     * @property DEFAULT_CONTROLLER_NAME
     * @type String
     * @private
     * @constant
     */
    var DEFAULT_CONTROLLER_NAME = 'Application';
    
	/**
	 * Constructor-Method of Class {@link mobileDS.PresentationManager}<br>
	 * It invokes the loading of layouts, views and partials. 
	 * 
	 * @param {Function} main A completely useless parameter
	 * @constructor
	 * @augments mobileDS.PresentationManager
	 * @memberOf mobileDS.PresentationManager.prototype
	 */
    function constructor(main){
        //private members
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
        
        
//        /**
//         * JQuery object of the 'body' element
//         * 
//         * @property body
//         * @type Object
//         * @private
//         * @deprecated unused
//         */
//        var body = $('body');

//        /**
//         * Unused variable.
//         * 
//         * @property lastPage
//         * @type String
//         * @private
//         * @deprecated unused
//         */
//        var lastPage = null;

        
//        /**
//         * Index for the array of layouts
//         * 
//         * @property layoutIndex
//         * @type Integer
//         * @private
//         */
//        var layoutIndex = 0;

        
//        /**
//         * Index for the array of views
//         * 
//         * @property viewIndex
//         * @type Integer
//         * @private
//         */
//        var viewIndex = 0;

        
//        /**
//         * Index for the array of partials
//         * 
//         * @property partialIndex
//         * @type Integer
//         * @private
//         */
//        var partialIndex = 0;
        
        /**
         * List of elements (jQuery objects)
         * that should be remove from DOM after
         * a page has loaded (loaded: after all contents
         *  inserted into the DOM and after all page
         *  transitions have been executed).
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
        
        //set jQuery Mobile's default transition to "none":
    	$.mobile.defaultPageTransition = 'none';
        
        
        /**
         * An object containing data for the currently displayed view.<br>
         * It contains: name of the corresponding controller, name of the view and optionally data for the view 
         * 
         * @property currentView
         * @type Object
         * @private
         */
        var currentView = new Object();

        
        /**
         * An object containing data for the previously displayed view - the one displayed before the current view.<br>
         * It contains: name of the corresponding controller, name of the view and optionally data for the view 
         * 
         * @property previousView
         * @type Object
         * @private
         */
        var previousView = new Object();

        
        /**
         * The currently displayed dialog object, if a dialog is displayed. Used mainly to close the dialog.
         * 
         * @property current_dialog
         * @type Object
         * @private
         */
        var current_dialog = null;
     
        //helper for rendering the HTML templates (i.e. the parsed template files)
        var renderer = mobileDS.parser.RenderUtils.getInstance();
        
        var viewSeparator 		= '#';
        var partialSeparator 	= mobileDS.CommonUtils.getInstance().getPartialsPrefix();
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
		 * This function loads the layouts for every controller and puts the name of the layouts into the <b>layouts</b> array.
		 * 
		 * @function loadLayouts
		 * @private
		 */
        function loadLayouts(){
            // Load application's layouts. 
            
            // get all controllers in an array
            var ctrlNames = mobileDS.ControllerManager.getInstance().getControllerNames();
            for(var i=0, size = ctrlNames.length; i < size; ++i){
                var ctrl = mobileDS.ControllerManager.getInstance().getController( ctrlNames[i] );
                var layoutDef = ctrl.getLayout();
                if(layoutDef){
	                $.ajax({
	                    async: false,
	                    dataType: "text",
	                    url: mobileDS.constants.getInstance(forBrowser).getLayoutPath() + layoutDef["fileName"] + '.ehtml',
	                    success: function(data){
						    var layout = new Layout(ctrl.getName(), data);
	                        layouts.put(layout.getName(), layout);//[layoutIndex++] = layout;
	                    }
	                });
                }
            }
        }
        

        /**
		 * This function actually loads the views for every controller, creates an instance of a view class and puts the view instance in the <b>views</b> array.<br>
		 * It uses a asynchronous way of loading the view-files one after another.<br>
		 * <b>If you want to make sure, that all views are indeed loaded, before proceeding with the subsequent instructions, you could look at the function 
		 * {@link mobileDS.ControllerManager#foundControllersCallBack} for reference of a function which loads the files one after another - not asynchronous.</b> 
		 * 
		 * @function loadViews
		 * @private
		 * @async
		 */
        function loadViews(){
//        	function getViewPath(name, controller){
//        		var returnpath = "";
//        		$.each(controller.getViews(), function(index, view){
//        			if (name === view["name"]) {
//        				returnpath = view["path"];
//        				return false;
//        			}
//        		});
//        		return returnpath;
//        	}
        	
        	$.each(mobileDS.ControllerManager.getInstance().getControllerNames(), function(ctrlIndex, controllerName){
        		var controller = mobileDS.ControllerManager.getInstance().getController(controllerName);  
        		$.each(controller.getViews(), function(index, view){
        			
        			$.ajax({
        				async: true,
        				dataType: "text",
        				url: view.path,//getViewPath(view, controller),
        				success: function(data){
        					var ctrlView = new View(controller, view.name , data);
        					views.put( createViewKey( controller.getName(), view.name), ctrlView);//[viewIndex++] = ctrlView;
        				}
        			}).fail(function(jqxhr, settings, err){
        				// print out an error message
						var errMsg = err && err.stack? err.stack : err;
        				console.error("[" + settings + "] Could not load '" + view.path + "': "+errMsg); //failure
        				
        				if(IS_DEBUG_ENABLED) console.debug("[" + settings + "] " + JSON.stringify(jqxhr)); //debug failure
        			});
        			
        		});
        		
        	});
        }
        
        
        /**
		 * This function actually loads the partials for every controller, creates an instance of a partial class and puts the partial instance in the <b>partials</b> array.<br>
		 * It uses a asynchronous way of loading the partials-files one after another.<br>
		 * <b>If you want to make sure, that all partials are indeed loaded, before proceeding with the subsequent instructions, you could look at the function 
		 * {@link mobileDS.ControllerManager#foundControllersCallBack} for reference of a function which loads the files one after another - not asynchronous.</b> 
		 * 
		 * @function loadPartials
		 * @private
		 * @async
		 */
        function loadPartials(){
//            function getPartialPath(name, controller){
//                var returnpath = "";
//                $.each(controller.getPartials(), function(index, partial){
//                    if (name === partial["name"]) {
//                        returnpath = partial["path"];
//                        return false;
//                    }
//                });
//                return returnpath;
//            }
            
        	$.each(mobileDS.ControllerManager.getInstance().getControllerNames(), function(ctrlIndex, controllerName){
        		var controller = mobileDS.ControllerManager.getInstance().getController(controllerName); 
            	$.each(controller.getPartials(), function(index, partial){
                    $.ajax({
                        async: true,
                        dataType: "text",
                        url: partial.path,//getPartialPath(partial, controller),
                        success: function(data){
					        var ctrlPartial = new Partial(controller, partial.name, data);
					        partials.put(createPartialKey( controller.getName(), partial.name), ctrlPartial);//[partialIndex++] = ctrlPartial;
                        }
                    }).fail(function(jqxhr, settings, err){
                        // print out an error message
						var errMsg = err && err.stack? err.stack : err;
                        console.error("[" + settings + "] " + JSON.stringify(jqxhr) + " -- " + partial.path + ": "+errMsg); //failure
                    });
                });
            });
            
        }
        
        loadLayouts();
        loadViews();
        loadPartials();
        

    	/** @lends mobileDS.PresentationManager.prototype */
        return { 
        	//public members
            
            addLayout: function(layout){
//            	var layout_replaced = false;
//            	$.each(layouts, function(index, l){
//                	if (layouts[index].getName() == layout.getName()) {
//                		layouts[index] = layout;
//                        layout_replaced = true;
//                        return false;
//                    }
//                });
//            	if (layout_replaced == false){
//                    layouts.push(layout);
//            	}
            	layouts.put(layout.getName(), layout);
            },
            /**
    		 * This function returns a layout object by name.<br>
    		 * 
    		 * @function getLayout
    		 * @param {String} layoutName Name of the layout which should be returned
    		 * @param {Boolean} [doUseDefaultIfMissing] if supplied and <code>true</code>, the default controller's layout will be used as a fallback, in case no corresponding layout could be found
    		 * @returns {Object} The requested layout, "false" if not found 
    		 * @public
    		 */
            getLayout: function(layoutName, doUseDefaultIfMissing){
                var layout = false;
//                $.each(layouts, function(index, l){
//                	if (l.getName() == layoutName) {
//                		layout = l;
//                        return false;
//                    }
//                });
                layout = layouts.get(layoutName);
            	if(!layout){
            		if(doUseDefaultIfMissing){
            			layout = instance.getLayout(DEFAULT_CONTROLLER_NAME, false);
            		}
            		else {
            			console.error('[PresentationManager.getLayout]: could not find layout "'+layoutName);//+'" for controller "'+ (controller?controller.name:'undefined') +'"!');
            			return false;
            		}
            	}
                return layout;
            },

            addView: function(ctrlName, view){
//            	var view_replaced = false;
//            	$.each(views, function(index, v){
//                	if (views[index].getName() == view.getName()) {
//                		views[index] = view;
//                		view_replaced = true;
//                        return false;
//                    }
//                });
//            	if (view_replaced == false){
//            		views.push(view);
//            	}
            	views.put(createViewKey(ctrlName, view), view);
            },
            /**
    		 * This function returns a view object by name.<br>
    		 * 
    		 * @function getView
    		 * @param {String} controllerName Name of the controller for the view
    		 * @param {String} viewName Name of the view which should be returned
    		 * @returns {Object} The requested view, <tt>false</tt> if not found 
    		 * @public
    		 */
            getView: function(controllerName, viewName){
            	viewName = createViewKey(controllerName, viewName);
            	var view = false;
//            	$.each(views, function(index, v){
//            		if (v.getName() == viewName) {
//            			view = v;
//            			return false;
//            		}
//            	});
            	view = views.get(viewName);
            	
            	if(!view){
            		console.error('[PresentationManager.getView]: could not find view "'+viewName);//+'" for controller "'+ (controller?controller.name:'undefined') +'"!');
            		return false;
            	}
            	return view;
            },

            
            /**
    		 * This function returns a partial object by name.<br>
    		 * 
    		 * @function getPartial
    		 * @param {String} controllerName Name of the controller for the view
    		 * @param {String} viewName Name of the partial which should be returned
    		 * @returns {Object} The requested partial, "false" if not found 
    		 * @public
    		 */
            getPartial: function(controllerName, partialName){
            	var partial = false;
            	
            	var partialKey = null;
            	if(controllerName){
            		partialKey = createPartialKey(controllerName, partialName);
            	}
            	else {
            		console.error('[PresentationManager.getPartial]: requested partial "'+partialName+'" for unknown controller: "'+ (controllerName?controllerName.getName():'undefined') +'"');
            		return false;
            	}
            	
//				console.log("[PresentationManager] looking for " + partialName);
//            	for(var i=0, size = partials.length; i < size; ++i){
////					console.log("partialName: " + p.getName());
//            		if (partials[i].getName() == partialName) {
////						console.log("found " + partials[i].getName());
//            			partial = partials[i];
//                        break;
//                    }
//            	}
            	partial = partials.get(partialKey);
            	if(!partial){
            		console.error('[PresentationManager.getPartial]: could not find partial "'+partialName+'" for controller "'+ (controllerName?controllerName.getName():'undefined') +'"!');
            		return false;
            	}
            	return partial;
            },

            
            /**
    		 * Closes a modal window - in this case a dialog.<br>
    		 * 
    		 * <br>
    		 * TODO needs to be "settable", depending on the currently used (modal) dialog library
    		 * 
    		 * @requires jQuery Mobile SimpleModal
    		 * 
    		 * @function hideCurrentDialog
    		 * @public
    		 */
            hideCurrentDialog: function (){
            	/*if (current_dialog != null){
            		current_dialog.close();
            		current_dialog = null;
            	}*/
            	if($.modal != null){
            	 $.modal.close();
            	}
            },

            
            /**
    		 * Function opens requested dialog.<br>
    		 * 
    		 * <br> 
    		 * TODO needs to be "settable", depending on the currently used (modal) dialog library
    		 * 
    		 * @requires jQuery Mobile SimpleModal
    		 * 
    		 * @function showDialog
    		 * @param {String} ctrlName Name of the controller 
    		 * @param {String} dialogId Id of the dialog
    		 * @param {Object} data Optionally data - not used 
    		 * @public
    		 */
			 showDialog : function(ctrlName, dialogId, data) {

				this.hideCurrentDialog();

				var ctrl = mobileDS.ControllerManager.getInstance().getController(ctrlName);
				
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
			 * Gets the view for a controller, then executes helper methods on the view data.
			 * The Rendering of the view is done by the {@link mobileDS.PresentationManager#doRenderView} method.
    		 * Also stores the previous and current view with parameters.<br>
    		 * 
    		 * @function renderView
    		 * @param {String} ctrlName Name of the controller 
    		 * @param {String} viewName Name of the view to render
    		 * @param {Object} data Optionally data for the view
    		 * @public
    		 */
            renderView: function(ctrlName, viewName, data){
                var ctrl = mobileDS.ControllerManager.getInstance().getController(ctrlName);

                if (ctrl != null) {
					var view = mobileDS.PresentationManager.getInstance().getView(ctrlName, viewName);
					
					//DISABLED helper methods are now handled differently -> invoked during rendering where they are specified in the template/view definition
//					//execute the helper-scripts that were referenced in the view:
//					view.executeHelperMethods(data);
					
					mobileDS.PresentationManager.getInstance().doRenderView(ctrlName, viewName, view, ctrl, data);
					
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
			 * Renders the current view again, using the {@link mobileDS.PresentationManager#render} method.
    		 * 
    		 * @function reRenderView
    		 * @public
    		 */
            reRenderView: function(){
            	if (currentView){
            		if (currentView["ctrlName"] && currentView["viewName"]){
            			dialogManager.render(currentView["ctrlName"], currentView["viewName"], currentView["data"]);
            		}
            	}
            },

            
            /**
			 * Renders the previous view again, using the {@link mobileDS.DialogEngine#render} method.
			 * 
    		 * @function renderPreviousView
    		 * @public
    		 */
            renderPreviousView: function(){
            	if (previousView){
                	if (previousView["ctrlName"] && previousView["viewName"]){
                		dialogManager.render(previousView["ctrlName"], previousView["viewName"], previousView["data"]);
                	}
            	}
            },
           
            
            /**
			 * Actually renders the View.<br>
			 * Fetches the layout for the controller, then fills the layout-template with the view content, while incorporating 
			 * partials and contents that helper methods have provided. Then Dialogs are created and the pageContainer id is updated.
			 * At last all the content is localized using {@link mobileDS.LanguageManager#translateHTML}, and appended to the
			 * HTML document of the application, while the old one is removed - is probably not a good idea to use '<b>$("div[data-role='page']").first().remove()</b>' to
			 * remove the old page content: it's not robust.<br>
			 * At the end the <b>on_page_load</b> action is performed.
    		 * 
    		 * @function doRenderView
    		 * @param {String} ctrlName Name of the controller 
    		 * @param {String} viewName Name of the view to render
    		 * @param {Object} view View object that is to be rendered
    		 * @param {Object} ctrl Controller object of the view to render
    		 * @param {Object} [data] optional data for the view
    		 * @public
    		 */
			doRenderView: function(ctrlName, viewName, view, ctrl, data){
			    var layout = instance.getLayout(ctrlName, true);
                
                var layoutBody = layout.getBodyContents();
                var layoutDialogs = layout.getDialogsContents();

                layoutBody = renderer.renderViewContent(layoutBody, layout.getYields(), view.contentFors, data );
                layoutDialogs = renderer.renderViewDialogs(layoutDialogs, layout.getYields(), view.contentFors, data );
                
                //TODO handle additional template syntax e.g. for BLOCK, STATEMENT (previously: partials)
                var dialogs = $("#applications_dialogs");
                dialogs.empty();
                
                // Translate the Keywords or better: localize it... 
//NOTE: this is now done during rendering of dialogs-content                if(typeof layoutDialogs  != "undefined"){
//                	layoutDialogs = mobileDS.LanguageManager.getInstance().translateHTML(layoutDialogs);
//                }
                dialogs.append( layoutDialogs);
                
//                // Translate the Keywords or better: localize it... 
//NOTE: this is now done during rendering of body-content                  	layoutBody = mobileDS.LanguageManager.getInstance().translateHTML(layoutBody);
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
//                oldContent.remove();
                
                ctrl.perform('on_page_load', data);
                
                ctrl.performIfPresent('on_page_load_'+viewName, data);
                
                // =====================================================================
                var debug = 0;//debug: set >= 1 for debugging
                if (debug > 0){
	                var body_html_array = document.body.innerHTML.split("\n");
	                var head_html_array = document.head.innerHTML.split("\n");
//	                var all = '<html>\n<head>\n'+document.head.innerHTML+'<body>\n'+document.body.innerHTML+'</body>\n</html>\n';
	                console.log("=== ===================== html start ===================== ===");
	                console.log("<html>\n<head>\n");
	                for (var a in head_html_array){
	                	console.log(head_html_array[a]+"\n");
	                }
	                console.log("</head>\n");
	                console.log("<!-- =====================    body   ===================== -->");
	                console.log("<body>\n");
	                for (var a in body_html_array){
	                	console.log(body_html_array[a]+"\n");
	                }
	                console.log("</body>\n</html>\n");
	                console.log("<!-- ===================== html end  ===================== -->");
                }
            }
        };
    }
    return {
        /**
         * Object containing the instance of the class {@link mobileDS.PresentationManager} 
         * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.PresentationManager}
         * @public
         */
        getInstance: function(){
            if (instance === null) {
                instance = constructor();
            }
            return instance;
        }
    };
    
})();
