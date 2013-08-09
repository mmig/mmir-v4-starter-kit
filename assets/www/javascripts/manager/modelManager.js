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
 * <div class="box important">
 * <b>Note:</b>
 * This class is unused at the moment.
 * </div>
 * A class for managing the models of the application (MVC-Component). <br>
 * It's purpose is to load the models automatically.
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * @example <code>mobileDS.ModelManager.getInstance()</code>
 * @class ModelManager
 * @category core
 * 
 * @see mobileDS.ModelManager#constructor
 */
mobileDS.ModelManager = (function(){
	

    /**
     * Object containing the instance of the class {@link mobileDS.ModelManager} 
     * 
     * @property instance
     * @type Object
     * @private
     */
    var instance = null;

	/**
	 * Constructor-Method of Class {@link mobileDS.ModelManager}.<br>
	 * This class is similar to the class {@link mobileDS.ControllerManager}.
	 * 
	 * <div class="box important">
	 * <b>Note:</b>
	 * The callback function should contain all (!) instructions which require the prior loading of the models.<br> 
	 * A callback function is used, because the loading process is asynchronous.
	 * </div>
	 * 
	 * @param {Function} callbackFunction A callback function
	 * @constructor
	 * @augments mobileDS.ModelManager
	 * @memberOf mobileDS.ModelManager.prototype
	 */
    function constructor(callbackFunction){
        // private members
        /**
         * Array of models
         * 
         * @property models
         * @type Array
         * @private
         */
    	// // if anyone wants to gain access to the model-names,
    	// // well... here you can.
    	var models = new Array();
    	

    	/**
         * Index for the array of models
         * 
         * @property mod_i
         * @type Integer
         * @private
         */
    	var mod_i = 0;
    	// // I don't know if you really need model-instances, but 
    	// // you'll never know.
        // var modelsIntances = new Array();
        
        /**
		 * 
		 * This function returns all loaded models. 
		 * 
		 * @function getModels
		 * @returns {Array} all loaded models
		 * @public
		 */
        function getModels(){
        	return models;
        }
        
        
		/**
		 * This function loads the models one after another.<br>
		 * The function is first called by {@link mobileDS.ControllerManager-constructor-loadControllers}
		 * 
		 * @function foundModelsCallBack
		 * @param {Array} foundModels This parameter contains all model-filenames
		 * @param {Function} myCallbackFunction A callback function which shall be called after the completion of the model loading process
		 * @private
		 */
        function foundModelsCallBack(foundModels, myCallbackFunction, isRecursiveCall){
    		if (foundModels.length < 1){
    			if(!isRecursiveCall){
    				console.warn("Load Model: no models found in "+mobileDS.constants.getInstance(forBrowser).getModelPath()+"/");
    			}
    			if (typeof myCallbackFunction == 'function'){
    				myCallbackFunction();
    			} 
    		} else {
    			var tmpModel = foundModels[0];
    			
    			if(IS_DEBUG_ENABLED) console.debug("Load Model: "+mobileDS.constants.getInstance(forBrowser).getModelPath() + "/" + tmpModel);//debug
    			
    			// Create Controller after (!!!!) the adequate controller-js-file is loaded.
    			// or else there is no constructor and the controller-contructor fails.
    			
        		mobileDS.CommonUtils.getInstance().getLocalScript(mobileDS.constants.getInstance(forBrowser).getModelPath() + tmpModel,
        			function(){
    				// save Modelname in models-array - starting with an upper-case character and 
    				// cutting of the extension of the file containing the model.
    				models[mod_i++] = tmpModel.charAt(0).toUpperCase() + tmpModel.slice(1).replace(/\.[^.]+$/g,"");
    				foundModels = foundModels.slice(1);
    				foundModelsCallBack(foundModels, myCallbackFunction, true);
    			},
    			function(exception) {
					// print out an error message
    				console.error("[ERROR] " + exception); //failure
    			}); 
    			
    		}
    		return 0;
        }
        
		/**
		 * This function invokes the method {@link mobileDS.ModelManager-constructor-foundModelsCallBack} to load all models in the path specified by *modelPath*.
		 * 
		 * @function loadModels
		 * @param {Function} myCallbackFunction The callback function from the constructor which shall be called after the initialization of the {@link mobileDS.ModelManager}.  
		 * @private
		 */
        function loadModels(myCallbackFunction){
            // Load application's models.
//        	var mod_i = 0;
//        	console.log("[MODELS] " + mobileDS.constants.getInstance(forBrowser).getModelPath());
        	var foundModels = mobileDS.CommonUtils.getInstance().getDirectoryContentsWithFilter(mobileDS.constants.getInstance(forBrowser).getModelPath(), "*.js");
            foundModelsCallBack(foundModels, myCallbackFunction);
        }
        
        loadModels(callbackFunction);

    	/** @lends mobileDS.ModelManager.prototype */
        return { // public members
            /**
    		 * This function gets the model by name. 
    		 * 
    		 * @function getModel
    		 * @param {String} modelName Name of the model which should be returned
    		 * @returns {Object} The model if found, null else
    		 * @public
    		 */
            getModel: function(modelName){
                var retModel = null;
                $.each(models, function(index, model){
                    if (model.getName() == modelName) {
                    	retModel = model;
                        return false;
                    }
                });
                return retModel;
            },

            
            /**
    		 * This function returns all loaded models. 
    		 * 
    		 * @function getModels
    		 * @returns {Array} All loaded models
    		 * @public
    		 */
            getModels: function(){
                return models;
            }
        };
    }
    
    return {
        /**
         * Object containing the instance of the class {@link mobileDS.ModelManager} 
         * 
         * @function getInstance
		 * @param {Function} callbackFunction The function which should be called after loading all models
         * @returns {Object} Object containing the instance of the class {@link mobileDS.ModelManager}
         * @public
         */
    	getInstance: function(callbackFunction){
            if (instance===null) {
                instance = constructor(callbackFunction);
            }
    		return instance;
    	}
    };
    
})();