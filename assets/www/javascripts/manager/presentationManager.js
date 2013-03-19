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
 * @module mobileDS.javascripts.manager
 * 
 * Dependencies:
 *  TODO add entries for used JS files
 *  
 * Libraries:
 *  - jQuery (>= v1.6.2)
 *  - SimpleModal (jQuery plugin, >= v1.4.2)
 *  TODO check for other dependencies on 3rd party libraries (& add missing entries)
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
	 * Constructor-Method of Class {@link mobileDS.PresentationManager}<br>
	 * It invokes the loading of layouts, views and partials. 
	 * 
	 * @param {Function} main A completely useless parameter
	 * @constructor
	 */
    function constructor(main){
        //private members
        /**
         * Array of layouts of the application
         * 
         * @property layouts
         * @type Array
         * @private
         */
        var layouts = new Array();

        
        /**
         * Array of all the views of the application
         * 
         * @property views
         * @type Array
         * @private
         */
        var views = new Array();

        
        /**
         * Array of all the partials of the application
         * 
         * @property partials
         * @type Array
         * @private
         */
        var partials = new Array();
        
        
        /**
         * JQuery object of the 'body' element
         * 
         * @property body
         * @type Object
         * @private
         * @deprecated unused
         */
        var body = $('body');

        
        /**
         * Unused variable.
         * 
         * @property lastPage
         * @type String
         * @private
         * @deprecated unused
         */
        var lastPage = null;

        
        /**
         * Index for the array of layouts
         * 
         * @property layoutIndex
         * @type Integer
         * @private
         */
        var layoutIndex = 0;

        
        /**
         * Index for the array of views
         * 
         * @property viewIndex
         * @type Integer
         * @private
         */
        var viewIndex = 0;

        
        /**
         * Index for the array of partials
         * 
         * @property partialIndex
         * @type Integer
         * @private
         */
        var partialIndex = 0;

        
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
     
        //helper for loading/parsing the template-files
        var renderer = mobileDS.parser.ParserUtils.getInstance();
        
		/**
		 * This function loads the layouts for every controller and puts the name of the layouts into the <b>layouts</b> array.
		 * 
		 * @function loadLayouts
		 * @private
		 */
        function loadLayouts(){
            // Load application's layouts. 
            
            // get all controllers in an array
            var tmpControllers = mobileDS.ControllerManager.getInstance().getControllers();
            for (var prop in tmpControllers) {
                ctrlFileName = tmpControllers[prop].def.json.name.toLowerCase();
                $.ajax({
                    async: false,
                    dataType: "text",
                    url: layoutPath + ctrlFileName + '.ehtml',
                    success: function(data){
					    var layout = new Layout(ctrlFileName, data);
                        layouts[layoutIndex++] = layout;
                    }
                });
            }
        }
        

        /**
		 * This function actually loads the views for every controller, creates an instance of a view class and puts the view instance in the <b>views</b> array.<br>
		 * It uses a asynchronous way of loading the view-files one after another.<br>
		 * <b>If you want to make sure, that all views are indeed loaded, before proceeding with the subsequent instructions, you could look at the function 
		 * {@link mobileDS.ControllerManager-constructor.foundControllersCallBack} for reference of a function which loads the files one after another - not asynchronous.</b> 
		 * 
		 * @function loadViews
		 * @private
		 * @async
		 */
        function loadViews(){
        	function getViewPath(name, controller){
        		var returnpath = "";
        		$.each(controller.def.query("views"), function(index, view){
        			if (name.toLowerCase() === view["name"].toLowerCase()) {
        				returnpath = view["path"];
        				return false;
        			}
        		});
        		return returnpath;
        	}
        	
        	$.each(mobileDS.ControllerManager.getInstance().getControllers(), function(ctrlIndex, controller){
        		
        		$.each(controller.getViews(), function(index, view){
        			
        			$.ajax({
        				async: false,
        				dataType: "text",
        				url: getViewPath(view, controller),
        				success: function(data){
        					var ctrlView = new View(controller, controller.getName() + "#" + view, data);
        					views[viewIndex++] = ctrlView;
        				}
        			}).fail(function(jqxhr, settings, err){
        				// print out an error message
						var errMsg = err && err.stack? err.stack : err;
        				console.error("[" + settings + "] Could not load '" + getViewPath(view, controller) + "': "+errMsg); //failure
        				
        				if(IS_DEBUG_ENABLED) console.debug("[" + settings + "] " + JSON.stringify(jqxhr)); //debug failure
        			});
        			
        		});
        		
        	});
        }
        
        
        /**
		 * This function actually loads the partials for every controller, creates an instance of a partial class and puts the partial instance in the <b>partials</b> array.<br>
		 * It uses a asynchronous way of loading the partials-files one after another.<br>
		 * <b>If you want to make sure, that all partials are indeed loaded, before proceeding with the subsequent instructions, you could look at the function 
		 * {@link mobileDS.ControllerManager-constructor.foundControllersCallBack} for reference of a function which loads the files one after another - not asynchronous.</b> 
		 * 
		 * @function loadPartials
		 * @private
		 * @async
		 */
        function loadPartials(){
            function getPartialPath(name, controller){
                var returnpath = "";
                $.each(controller.def.query("partials"), function(index, partial){
                    if (name.toLowerCase() === partial["name"].toLowerCase()) {
                        returnpath = partial["path"];
                        return false;
                    }
                });
                return returnpath;
            }
            
            $.each(mobileDS.ControllerManager.getInstance().getControllers(), function(ctrlIndex, controller){
            	$.each(controller.getPartials(), function(index, partial){
                    $.ajax({
                        async: false,
                        dataType: "text",
                        url: getPartialPath(partial, controller),
                        success: function(data){
					        var ctrlPartial = new Partial(controller, controller.getName() + mobileDS.CommonUtils.getInstance().getPartialsPrefix() + partial, data);
					        partials[partialIndex++] = ctrlPartial;
                        }
                    }).fail(function(jqxhr, settings, err){
                        // print out an error message
						var errMsg = err && err.stack? err.stack : err;
                        console.error("[" + settings + "] " + JSON.stringify(jqxhr) + " -- " + getPartialPath(partial, controller) + ": "+errMsg); //failure
                    });
                });
            });
            
        }
        
        loadLayouts();
        loadViews();
        loadPartials();
        return { //public members
            /**
    		 * This function returns a visualComponent by id.<br>
    		 * Only Problem is: there is no such thing as a visualComponent. 
    		 * 
    		 * @function getVisualComponent
    		 * @param {String} compId Id of the visual component
    		 * @returns {Object} visualComponents
    		 * @public
    		 * @deprecated unused and wrong
    		 */
            getVisualComponent: function(compId){
                return visualComponents[compId];
            },
            
            
            /**
    		 * This function returns a layout object by name.<br>
    		 * 
    		 * @function getLayout
    		 * @param {String} layoutName Name of the layout which should be returned
    		 * @returns {Object} The requested layout, "false" if not found 
    		 * @public
    		 */
            getLayout: function(layoutName){
                var layout;
                $.each(layouts, function(index, l){
                	if (l.getName() == layoutName) {
                		layout = l;
                        return false;
                    }
                });
                return layout;
            },

            
            /**
    		 * This function returns a view object by name.<br>
    		 * 
    		 * @function getView
    		 * @param {String} viewName Name of the view which should be returned
    		 * @returns {Object} The requested view, "false" if not found 
    		 * @public
    		 */
            getView: function(viewName){
            	var view;
//				console.log("[PresentationManager] looking for " + viewName);
            	$.each(views, function(index, v){
//					console.log("ViewName: " + v.getName());
            		if (v.getName() == viewName) {
//						console.log("found " + v.getName());
            			view = v;
            			return false;
            		}
            	});
            	return view;
            },

            
            /**
    		 * This function returns a partial object by name.<br>
    		 * 
    		 * @function getPartial
    		 * @param {String} viewName Name of the partial which should be returned
    		 * @returns {Object} The requested partial, "false" if not found 
    		 * @public
    		 */
            getPartial: function(partialName){
              var partial;
              partialName = partialName.toLowerCase();
//				console.log("[PresentationManager] looking for " + partialName);
              $.each(partials, function(index, p){
//					console.log("partialName: " + p.getName());
            	  if (p.getName() == partialName.toLowerCase()) {
//						console.log("found " + p.getName());
                        partial = p;
                        return false;
                  }
              });
            	return partial;
            },

            
            /**
    		 * Closes a modal window - in this case a dialog.<br>
    		 * 
    		 * @function close_current_dialog
    		 * @public
    		 */
            close_current_dialog: function (){
            	/*if (current_dialog != null){
            		current_dialog.close();
            		current_dialog = nulll;
            	}*/
            	if($.modal != null){
            	 $.modal.close();
            	}
            },

            
            /**
    		 * Function opens requested dialog.<br>
    		 * 
    		 * @function show_dialog
    		 * @param {String} ctrlName Name of the controller 
    		 * @param {String} dialogId Id of the dialog
    		 * @param {Object} data Optionally data - not used 
    		 * @public
    		 */
			 show_dialog : function(ctrlName, dialogId, data) {

				this.close_current_dialog();

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
			 * The Rendering of the view is done by the {@link mobileDS.PresentationManager-constructor.render_view_successor} method.
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
					var view = mobileDS.PresentationManager.getInstance().getView(ctrlName + "#" + viewName);
					
					//execute the helper-scripts that were referenced in the view:
					view.executeHelperMethods(data);
					
					mobileDS.PresentationManager.getInstance().render_view_successor(ctrlName, viewName, view, ctrl, data);
					
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
			 * Renders the current view again, using the {@link mobileDS.PresentationManager-constructor.render} method.
    		 * 
    		 * @function rerenderView
    		 * @public
    		 */
            rerenderView: function(){
            	if (currentView){
            		if (currentView["ctrlName"] && currentView["viewName"]){
            			dialogManager.render(currentView["ctrlName"], currentView["viewName"], currentView["data"]);
            		}
            	}
            },

            
            /**
			 * Renders the previous view again, using the {@link mobileDS.DialogEngine-constructor.render} method.
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
			 * At last all the content is localized using {@link mobileDS.LanguageManager-constructor.translateHTML}, and appended to the
			 * HTML document of the application, while the old one is removed - is probably not a good idea to use '<b>$("div[data-role='page']").first().remove()</b>' to
			 * remove the old page content: it's not robust.<br>
			 * At the end the <b>on_page_load</b> action is performed.
    		 * 
    		 * @function render_view_successor
    		 * @param {String} ctrlName Name of the controller 
    		 * @param {String} viewName Name of the view to render
    		 * @param {Object} view View object that is to be rendered
    		 * @param {Object} ctrl Controller object of the view to render
    		 * @param {Object} data Optionally data for the view
    		 * @public
    		 */
			render_view_successor: function(ctrlName, viewName, view, ctrl, data){
			    var layout = mobileDS.PresentationManager.getInstance().getLayout(ctrlName);
                    
                if (typeof layout === "undefined") {
                	console.warn("could not find layout-defintion for '"+ctrlName+"'");
                    layout = mobileDS.PresentationManager.getInstance().getLayout('application');
                }
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
                
                pageIndex++;
                var newId = "pageContainer" + pageIndex;
                
                layoutBody = layoutBody.replace(pg, newId);
              
                var newPage = $(layoutBody);
                
                //'load' new content into the page (using jQuery mobile)
                newPage.appendTo($.mobile.pageContainer);

                //change visible page from old to new one (using jQuery mobile)
                $.mobile.changePage("#" + newId, {
                    transition: "none"
                });
                
                // remove old content from page
                var oldContent = $(oldId);
                if(oldContent.length < 1 && oldId == '#pageContainer0'){
                	//the ID of the first page (pageIndex 0) may have no number postfix
                	// -> try without numer:
                	if(IS_DEBUG_ENABLED) console.debug('PresentationManager.render_view_successor: removing old content: no old centent found for old ID "'+oldId+'", trying "#pageContainer" instead...');//debug
                	oldContent = $('#pageContainer');
                }
                
                oldContent.remove();
                
                ctrl.performAction('on_page_load', data);
                
                ctrl.performActionIfPresent('on_page_load_'+viewName, data);
                
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
