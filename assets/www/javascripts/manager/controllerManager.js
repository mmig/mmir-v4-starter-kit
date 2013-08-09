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
 */
var mobileDS = window.mobileDS ||
{};

/**
 * A class for managing the controllers of the application. <br>
 * It's purpose is to load the controllers and their views / partials and provide functions to find controllers or
 * perform actions or helper-actions.
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.ControllerManager.getInstance()</code>
 * @class ControllerManager
 * @category core
 * 
 * @see mobileDS.ControllerManager#constructor
 */
mobileDS.ControllerManager = (function(){

	
    /**
     * Object containing the instance of the class {@link mobileDS.ControllerManager} 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance = null;
    
    // private members
    /**
     * Array of controller-instances
     * 
     * @property controllers
     * @type Array
     * @private
     */
    var controllers = new Array();
    
    
    /**
     * Index for the array of controller-instances
     * 
     * @property controller_index
     * @type Integer
     * @private
     */
    var controller_index = 0;
    
    
	/**
	 * This function loads the controllers and their helpers one after another.<br>
	 * The function is first called by {@link mobileDS.ControllerManager-constructor-loadControllers}
	 * 
	 * @function foundControllersCallBack
	 * @param {Array} foundControllersAndViewsAndPartials This parameter contains the controllers, views, partials and their paths
	 * @param {Function} myCallbackFunction A callback function which shall be called after the completion of the controller loading process
	 * @private
	 */
    // --- Callback functions ---
    // must be callback, because loading the external scripts (controller)
    // is asynchronous
    function foundControllersCallBack(foundControllersAndViewsAndPartials, myCallbackFunction){

		if (foundControllersAndViewsAndPartials.length < 1){
			if (typeof myCallbackFunction == 'function'){
				myCallbackFunction();
			} else {
				console.error("[foundViewsCallBack] callback-Parameter is not a function.");
			}
		} else {
			var tmpView = foundControllersAndViewsAndPartials[0];
			
			// Create Controller after (!) the adequate controller-js-file is loaded.
			// or else there is no constructor and the controller-constructor fails.
    		/// ATTENTION: $.getScript --> mobileDS.CommonUtils.getInstance().getLocalScript
    		/// under Android 4.0 getScript is not wokring properly
    		mobileDS.CommonUtils.getInstance().getLocalScript(tmpView["path"],
    				function(data, textStatus, jqxhr){
    					var controller = new Controller(tmpView["name"], tmpView);
    					var helperPath = tmpView["path"].replace(mobileDS.constants.getInstance().getControllerPath().replace(/\/$/,""), mobileDS.constants.getInstance().getHelperPath().replace(/\/$/,""));
    					helperPath = helperPath.replace(".js", mobileDS.constants.getInstance().getHelperSuffix() + ".js");
    					controller.loadHelper(tmpView["name"]+mobileDS.constants.getInstance().getHelperSuffix(),helperPath);
    					controllers[controller_index++] = controller;
    					// create the next controller in list - or better: process the rest of the controller-list
    					foundControllersAndViewsAndPartials = foundControllersAndViewsAndPartials.slice(1);
    					foundControllersCallBack(foundControllersAndViewsAndPartials, myCallbackFunction);
    				},
    				function(jqxhr, settings, exception) {
    					// print out an error message
    					console.error("[" + settings + "] " + tmpView["name"] + ": " + exception); //failure
    				});  
		}

    }
    // --- End Callback functions ---

    
	/**
	 * This function invokes the method {@link mobileDS.ControllerManager-constructor-getControllerViewsAndPartials}, to get all controllers and their views/partials, 
	 * and afterwards calls {@link mobileDS.ControllerManager-constructor-foundControllersCallBack}, to load the controllers one after another. It does not load the views or partials, but
	 * provides the controllers with their names and paths. For the loading functions of views and partials, see the {@link mobileDS.PresentationManager}<br>
	 * 
	 * @function loadControllers
	 * @param {Function} myCallbackFunction The callback function from the constructor which shall be called after the initialization of the {@link mobileDS.ControllerManager}.  
	 * @private
	 */
    function loadControllers(myCallbackFunction){
        // FP: after Loading all Controllers, Views and Partials:
        // call the Callback-Function, to continue with the normal (meaning
        // synchronous) execution of the remaining 'program'

    	jsonControllerViewsAndPartials=getControllerViewsAndPartials();
//    	console.log("[DEBUG - PARTIALS] " + JSON.stringify(jsonControllerViewsAndPartials));
    	
        foundControllersCallBack(jsonControllerViewsAndPartials, myCallbackFunction);
    }
    

    /**
	 * This function gets the controller file names and builds a json object containing the controllers, views and partials and their paths.
	 * 
	 * @function getControllerViewsAndPartials
	 * @returns {Array} Array of JSON-Objects containing controllers, views, partials and paths 
	 * @private
	 */
    function getControllerViewsAndPartials(){
        var tmpController=mobileDS.CommonUtils.getInstance().getDirectoryContentsWithFilter(mobileDS.constants.getInstance(forBrowser).getControllerPath(), "*.js");
        var tmpJsonControllerViews = Array();
        for (var i in tmpController){
        	tmpJsonControllerViews.push(getViewsAndPartialsForController(tmpController[i], mobileDS.constants.getInstance(forBrowser).getControllerPath()));
        }
        return tmpJsonControllerViews;
    }
    

    /**
	 * This function gets the controller file names and builds a json object containing the controllers, views and partials and their paths.
	 * 
	 * @function getViewsAndPartialsForController
	 * @returns {JSON} JSON-Object containing controllers, views, partials and paths 
	 * @private
	 */
    function getViewsAndPartialsForController(controllerName, controllerPath){
    	var tmpJSON = Object();;
    	var tmpViewPath = mobileDS.constants.getInstance(forBrowser).getViewPath() + controllerName.replace(/\.[^.]+$/g,"");
    	controllerPath = controllerPath + controllerName;
    	controllerName=controllerName[0].toUpperCase()+controllerName.substr(1).replace(/\.[^.]+$/g,"");
    	
    	tmpJSON["name"]=controllerName;
    	tmpJSON["path"]=controllerPath;
    	
    	var tmpViewArray = Array();
    	var tmpPartialArray = Array();
    	
    	var tmpPartialJSON = Object();
    	var tmpViewJSON = Object();
    	
//    	tmpViews = mobileDS.CommonUtils.getInstance().getDirectoryContentsWithFilter(tmpViewPath, "[^"+mobileDS.CommonUtils.getInstance().getPartialsPrefix()+"]*.ehtml");
    	tmpViews = mobileDS.CommonUtils.getInstance().getDirectoryContentsWithFilter(tmpViewPath, "(?!"+mobileDS.CommonUtils.getInstance().getPartialsPrefix()+")*.ehtml");
    	
//    	tmpPartials = mobileDS.CommonUtils.getInstance().getDirectoryContentsWithFilter(tmpViewPath, mobileDS.CommonUtils.getInstance().getPartialsPrefix()+"*.ehtml");
    	tmpPartials = mobileDS.CommonUtils.getInstance().getDirectoryContentsWithFilter(tmpViewPath, mobileDS.CommonUtils.getInstance().getPartialsPrefix()+"*.ehtml");
    	
    	for (var i in tmpViews){
    		tmpViewJSON = Object();
    		tmpViewJSON["name"]=tmpViews[i].replace(/\.[^.]+$/g,"");
    		tmpViewJSON["path"]=tmpViewPath+"/"+tmpViews[i];
    		tmpViewArray.push(tmpViewJSON);
    	}
    	tmpJSON["views"]=tmpViewArray;
      
    	for (var i in tmpPartials){
    		tmpPartialJSON = Object();
    		// remove leading "$" indicating it is a partial
    		tmpPartialJSON["name"]=tmpPartials[i].replace(mobileDS.CommonUtils.getInstance().getPartialsPrefix(),"").replace(/\.[^.]+$/g,"");
        	tmpPartialJSON["path"]=tmpViewPath+"/"+tmpPartials[i];
        	tmpPartialArray.push(tmpPartialJSON);
        }
        tmpJSON["partials"]=tmpPartialArray;
        return tmpJSON;
    }
    
	/**
	 * Constructor-Method of Class {@link mobileDS.ControllerManager}<br>
	 * @constructor
	 * @augments mobileDS.ControllerManager
	 * @memberOf mobileDS.ControllerManager.prototype
	 */
    function constructor(callbackFunction){
    	
    	/** @lends mobileDS.ControllerManager.prototype */
        return {
        	// public members
            
        	/**
    		 * This function gets the controller by name. 
    		 * 
    		 * @function getController
    		 * @param {String} ctrlName Name of the controller which should be returned
    		 * @returns {Object} controller if found, null else
    		 * @public
    		 */
            getController: function(ctrlName){
                var ctrl = null;
                $.each(controllers, function(index, controller){
                    if (controller.getName() == ctrlName) {
                        ctrl = controller;
                        // ends the function inside each-statement
                        return false;
                    }
                });
                return ctrl;
            },

            
            /**
    		 * This function returns all loaded controllers. 
    		 * 
    		 * @function getControllers
    		 * @returns {Array} All loaded controllers
    		 * @public
    		 */
            getControllers: function(){
            
                return controllers;
            },
            

            /**
    		 * This function performs an action of a controller. 
    		 * 
    		 * @function performAction
    		 * @param {String} ctrlName Name of the controller to which the action belongs
    		 * @param {String} actionName Name of the action that should be performed
    		 * @param {Object} data optional data that can be submitted to the action
    		 * @returns {Object} the return object of the performed action
    		 * @public
    		 */
            performAction: function(ctrlName, actionName, data){
                var ctrl = mobileDS.ControllerManager.getInstance().getController(ctrlName);
                if (ctrl != null) {
                    return ctrl.performAction(actionName, data);
                }
                else {
                	console.error('ControllerManager.performAction: the controller could not be found "'+ctrlName+'"');
                }
            },
			

            /**
    		 * This function performs an action of a helper-class for a controller. 
    		 * 
    		 * @function performHelperAction
    		 * @param {String} ctrlName Name of the controller to which the helper action belongs
    		 * @param {String} actionName Name of the action that should be performed by the helper
    		 * @param {Object} data optional data that can be submitted to the action
    		 * @returns {Object} the return object of the performed action
    		 * @public
    		 */
			performHelperAction: function(ctrlName, actionName, data){
				ctrlName = ctrlName.toLowerCase();
				actionName = actionName.toLowerCase();

				var ctrl = mobileDS.ControllerManager.getInstance().getController(ctrlName);
                if (ctrl != null) {
                    return ctrl.performHelperAction(actionName, data);
                }
                else {
                	console.error('ControllerManager.performHelperAction: the controller could not be found "'+ctrlName+'"');
                }
			}
        };
    }
    
    return {
        /**
         * Get the object containing the instance of the class {@link mobileDS.ControllerManager} 
         * 
         * <div class="box important">
		 * <b>Note:</b>
		 * The ControllerManager must first be initialized {@link mobileDS.ControllerManager#initializeControllers};
		 * the instance of the singleton ControllerManager is available, when the callback (i.e. the argument
		 * for the <tt>initializeControllers</tt> function) is invoked.
		 * </div>
		 * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.ControllerManager}
         * @public
         */
        getInstance: function(){
            if (instance === null) {
                alert("Error: Controllers not initialized!\nCall initializeControllers(CallbackFunction)");
                return null;
            }
            return instance;
        },

        /**
		 * This function must be called before using the {@link mobileDS.ControllerManager}. The Initialization process is asynchronous, 
		 * because javascript-files must be loaded (the controllers), so it forces a synchronous behaviour by using
		 * a callback function containing the instructions, which rely on the presence of the loaded controllers.<br>   
		 * 
		 * It loads the controllers and then calls the callback functions and returns the instance of this class.
		 * 
		 * <div class="box important">
		 * <b>Note:</b>
		 * The callback function should contain all (!) instructions which require the prior loading of the controllers.<br> 
		 * The callback mechanism is necessary, because loading the controllers is asynchronous.<br><br>
		 * If provided, the callback function is invoked with 1 argument, the ControllerManager instance:<br>
		 * <code> callbackFunction(controllerManagerInstance) </code>
		 * </div>
		 * 
		 * @function initializeControllers
		 * @param {Function} [callbackFunction] The function which should be called after loading all controllers
		 * @example
		 * 	function afterLoadingControllers(controllerManagerInstance){
		 * 		var appCtrl = controllerManagerInstance.getController('application');
		 * 		//do something...
		 * 	} 
		 * 	mobileDS.ControllerManager.initializeControllers(afterLoadingControllers);
		 * @public
		 */
        initializeControllers: function(callbackFunction){
            
        	if (instance === null) {
            	loadControllers(function(){
                	instance = constructor();

                    if(typeof callbackFunction !== 'undefined' && callbackFunction !== null){
                    	callbackFunction(instance);
                   	}
                });
            }
            return instance;
        }
    };
    
})();
