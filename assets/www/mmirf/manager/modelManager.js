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
 */
var mobileDS = window.mobileDS ||
{};

/**
 * 
 * A class for managing the models of the application (MVC-Component). <br>
 * It's purpose is to load the models automatically.
 * 
 * This "class" is structured as a singleton - so that only one instance is in use.<br>
 * You can access the instance of the class via 
 * 
 * TODO add example for usage (models as "class" / models as "singleton")
 * 
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
         * @type Dictionary
         * @private
         */
    	var models = new Dictionary();
    	
    	var MODEL_DEFAULT_NAMESPACE_NAME = 'mobileDS';
    	var GLOBAL_NAMESPACE = window;

    	/**
		 * 
		 * This function returns the fully qualified model name (incl. namespace(s)). 
		 * 
		 * @function getFullModelName
		 * @param {String} modelClassName the model's class-name (i.e. without namespace)
		 * @returns {String} fully qualified name for the model
		 * @private
		 */
        function getFullModelName(modelClassName){
        	if( ! MODEL_DEFAULT_NAMESPACE_NAME){
        		return modelClassName;
        	}
        	else {
        		return MODEL_DEFAULT_NAMESPACE_NAME + '.' + modelClassName;
        	}
        }
        
        /**
		 * 
		 * This function returns the fully qualified model name (incl. namespace(s)). 
		 * 
		 * @function getModelByName
		 * @param {String|Array<String>} fullModelName the fully qualified model name (i.e. with namespace(s))
		 * 								Note, if {String} components/namespaces are separated by a <tt>.</tt> (dot)
		 * 								If {Array<String>} the entries correspond to the namespace components (without dots),
		 * 								  where the last entry corresponds to the class/singleton name
		 * @returns {Object} the "raw" model object (may be a constructor or the main-singleton-namespace).
		 * 					 Or <tt>null</tt> if there is no Model with the name.
		 * @private
		 * 
		 * @requires mobileDS.CommonUtils#isArray
		 * 
		 * @see mobileDS.ModelManager#getFullModelName
		 * @see mobileDS.ModelManager#doGetModelInstance
		 */
        function getModelByName(fullModelName){
        	var components;
        	if(mobileDS.CommonUtils.getInstance().isArray(fullModelName)){
        		components = fullModelName;
        	}
        	else {
        		components = fullModelName.split('.');
        	}
        	
        	var currentNameSpace = GLOBAL_NAMESPACE;
        	for(var i=0, size = components.length; i < size; ++i){
        		currentNameSpace = currentNameSpace[components[i]]; 
    			if(typeof currentNameSpace !== 'undefined' ){
            		if(i === size-1){
            			return currentNameSpace;
            		}
    			}
    			else {
    				console.error('ModelManager.getModelByName: could not find model "'
    						+(components.join('.'))
    						+'": invalid namespace/class: '
    						+components[i]
    				);
    				break;
    			}
        	}
        	return null;
        }
        
        /**
         * Returns the instance for a model implementation:
         * 
         * If the model-object is a constructor (i.e. a function),
         * a new instance is created and returned.
         * 
         * Otherwise the model-object itself is returned (e.g. for 
         * singleton pattern models).
         * 
         * @function doGetModelInstance
         * @private
         * 
		 * @see mobileDS.ModelManager#getModelByName
         */
        function doGetModelInstance(modelImplObject){
        	if(typeof modelImplObject === 'function'){
        		return new modelImplObject();
        	}
//        	else if(typeof modelImplObject.getInstance === 'function'){
//        		return modelImplObject.getInstance();
//        	}
//        	else if(typeof modelImplObject.create === 'function'){
//        		return modelImplObject.create();
//        	}
        	else{
        		return modelImplObject;
        	}
        }
        
//    	/**
//         * Index for the array of models
//         * 
//         * @property mod_i
//         * @type Integer
//         * @private
//         */
//    	var mod_i = 0;
        
        /**
		 * 
		 * This function returns all loaded models. 
		 * 
		 * @function getModels
		 * @returns {Array<String>} all loaded model names
		 * @public
		 */
        function getModelNames(){
        	return models.getKeys();
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
    				myCallbackFunction(instance);
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
//    				models[mod_i++] = tmpModel.charAt(0).toUpperCase() + tmpModel.slice(1).replace(/\.[^.]+$/g,"");
    				var modelName = tmpModel.charAt(0).toUpperCase() + tmpModel.slice(1).replace(/\.[^.]+$/g,"");
    				var fullName = getFullModelName(modelName);
    				var modelImpl = getModelByName(fullName);
    				var modelInstance;
    				if(modelImpl){
    					modelInstance = doGetModelInstance(modelImpl);
    				}
    				else {
    					//TODO throw error in this case?
    					console.error('ModelManager.load: Could not find implementation for Model "'+modelName+'" ('+fullName+') for file '+tmpModel);
    					modelInstance = modelName;
    				}
    				//TODO implement mechanism for multiple/configurable model namespaces
    				models.put(fullName, modelInstance);
    				
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
//                $.each(models, function(index, model){
//                    if (model.getName() == modelName) {
//                    	retModel = model;
//                        return false;
//                    }
//                });

				//TODO implement mechanism for multiple/configurable model namespaces
                //		(add optional namespace argument to getModel)
                var fullModelName = getFullModelName(modelName);
                
                retModel = models.get(fullModelName);
                if(!retModel){
                	console.error('Could not find Model "'+modelName+'" at '+fullModelName);
                	return null;
                }
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
         * Get the object containing the instance of the class {@link mobileDS.ModelManager} 
         * 
         * <div class="box important">
		 * <b>Note:</b>
		 * The ModelManager must first be initialized {@link mobileDS.ModelManager#create};
		 * the instance of the singleton ModelManager is available, when the callback (i.e. the argument
		 * for the <tt>create</tt> function) is invoked.
		 * </div>
		 * 
         * @function getInstance
         * @returns {Object} Object containing the instance of the class {@link mobileDS.ModelManager}
         * @public
         */
        getInstance: function(){
            if (instance === null) {
                alert("Error: Models not initialized!\nCall create(CallbackFunction)");
                return null;
            }
            return instance;
        },

        /**
		 * This function must be called before using the {@link mobileDS.ModelManager}. The Initialization process is asynchronous, 
		 * because javascript-files must be loaded (the models), so it forces a synchronous behavior by using
		 * a callback function containing the instructions, which rely on the presence of the loaded models.<br>   
		 * 
		 * It loads the models and then calls the callback functions and returns the instance of this class.
		 * 
		 * <div class="box important">
		 * <b>Note:</b>
		 * The callback function should contain all (!) instructions which require the prior loading of the models.<br> 
		 * The callback mechanism is necessary, because loading the models is asynchronous.<br><br>
		 * If provided, the callback function is invoked with 1 argument, the ModelManager instance:<br>
		 * <code> callbackFunction(modelManagerInstance) </code>
		 * </div>
		 * 
		 * @function create
		 * @param {Function} [callbackFunction] The function which should be called after loading all controllers
		 * @example
		 * 	function afterLoadingModels(modelManagerInstance){
		 * 		var userModel = modelManagerInstance.getModel('User');
		 * 		//do something...
		 * 	} 
		 * 	mobileDS.ModelManager.create(afterLoadingModels);
		 * @public
		 */
        create: function(callbackFunction){
        	if (instance === null) {
                instance = constructor(callbackFunction);
            }
            return instance;
        }
    
    };
    
})();