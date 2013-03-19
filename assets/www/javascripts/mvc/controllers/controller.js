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
 * @module mobileDS.javascripts.mvc.controllers
 * 
 */
var mobileDS = window.mobileDS ||
{};

/**
 * The Controller Class is a kind of interface-class which gives access to the methods of a controller and its helper. <br>
 * Also holds information about views and partials associated with the controller.
 * 
 * @class Controller
 * @constructor
 * @param {String} name Name of the Controller
 * @param {Object} jsonDef Information about the controllers views and partials 
 * @category core
 */
function Controller(name, jsonDef){
//    console.log("controller name " + name);
    /**
     * The definition of the controller object, containing all properties and functions of the controller.<br>
     * A method of the controller can be called via:

	this.script.methodController(parameter);

     * 
     * @property script
     * @type Object
     * @public
     */
	// this can only be invoked, if a function with the name "name" exists
    this.script = new window[name]();

    /**
     * The json definition of the views and partials associated with the controller. Also contains paths to controller and its views/partials. 
     * 
     * @property def
     * @type Object
     * @public
     */
    this.def = new JPath(jsonDef);

    /**
     * The name of the controller. 
     * 
     * @property name
     * @type String
     * @public
     */
    this.name = name.toLowerCase();
    
    var viewDefs = this.def.query('views');

    /**
     * An array holding the names of all views associated with the controller.  
     * 
     * @property views
     * @type Array
     * @public
     */
    this.views = new Array();
    this.parseViews(viewDefs);

    // parsing the partials and saving the names in an array
    var partialDefs = this.def.query('partials');
    

    /**
     * An array holding the names of all partials associated with the controller.  
     * 
     * @property partials
     * @type Array
     * @public
     */
    this.partials = new Array();
    this.parsePartials(partialDefs);


    /**
     * The instance of the with the controller associated helper.  
     * 
     * @property helper
     * @type Object
     * @public
     */
    this.helper;
//	this.loadHelper(this.name+"Helper", "helpers/googleMapHelper.js");
}


/**
 * This function loads the helper of the controller - if it exists.
 * 
 * @function loadHelper
 * @param {String} name Name of the Helper to be loaded
 * @param {String} helperPath Path to the helper file to load  
 * @public
 */
Controller.prototype.loadHelper = function(name, helperPath){
	var self = this;
	/// ATTENTION: $.getScript --> mobileDS.CommonUtils.getInstance().getLocalScript
	/// under version 4.0 of Android getScript is not working properly
	
	//TODO move check of helper existance to Controller.foundControllersCallBack ?

	//determine if there is a helper for the controller:
	var path = helperPath;
	var fileName = path;
	var lastPathSeparatorIndex = path.lastIndexOf('/');
	if(lastPathSeparatorIndex !== -1){
		path = path.substring(0,lastPathSeparatorIndex);
		fileName = fileName.substring( lastPathSeparatorIndex + 1 );
	}
	//get contents of the helper directory:
	var dirContents = mobileDS.CommonUtils.getInstance().getDirectoryContents(path);
	if(!dirContents){
		console.warn('Could not determine contents for directory "'+path+'"');
		return; ////////////////////// EARLY EXIT //////////////////////////////
	}
	else if(! $.isArray(dirContents) || dirContents.length < 1){
		console.warn('Invalid information for contents of directory "'+path+'": '+dirContents);
		return; ////////////////////// EARLY EXIT //////////////////////////////
	}
	
	//check, if there is an implementation file for this helper:
	var helperIsSpecified = false;
	for(var i=0, size= dirContents.length; i < size; ++i){
		if(dirContents[i] === fileName){
			helperIsSpecified = true;
			break;
		}
	}
	
	if( ! helperIsSpecified){
		if(IS_DEBUG_ENABLED) console.debug("[HELPER] no helper available (not implemented) at '"+ helperPath+"'");//debug
		return; ////////////////////// EARLY EXIT //////////////////////////////
	}
	
	//if there is a file: load the helper
	mobileDS.CommonUtils.getInstance().getLocalScript(helperPath, function(data, textStatus, jqxhr){
		
		if(IS_DEBUG_ENABLED) console.debug("[HELPER] load "+ helperPath);//debug
		
		self.helper =   new Helper(self, name);//new window["GoogleMapHelper"]();
	},
	function(exception) {
		// print out an error message
			console.warn("[WARN] Could not load helper -> " + exception + ": '" + helperPath + "'"); //failure
		}
	);
};


/**
 * This function performs an action of a controller - which is represented by this instance of the Controller <br>
 * class - by calling the method from the corresponding controller, e.g. assets/www/controllers/application.js   
 * 
 * @function performAction
 * @param {String} actionName Name of the method to be executed
 * @param {Object} data Data to pass to the method of the controller as argument
 * @returns {Object} The return value of the executed method 
 * @public
 */
Controller.prototype.performAction = function(actionName, data){
	
	if(IS_DEBUG_ENABLED) console.debug("should perform '" + actionName + "' of '" + this.name + "'"+ ((typeof data !== 'undefined' && data !== null)? " with data: "+JSON.stringify(data): ""));//debug
	
    return this.script[actionName](data);
};

/**
 * 
 * This function performs an action of a controller, but only if an action with this name exists; otherwise nothing is done.
 * 
 * In difference to performAction(..), the method does not trigger an ERROR, if the action does not exist / is not implemented.
 * As a consequence, this method refers to "optionally" implemented functions, whereas performAction(..) refers to mandatory functions.
 * 
 * @function performAction
 * @param {String} actionName Name of the method to be executed
 * @param {Object} data Data to pass to the method of the controller as argument
 * @returns {Object} The return value of the executed method 
 * @public
 */
Controller.prototype.performActionIfPresent = function(actionName, data){
	if(typeof this.script[actionName] === 'function'){
	    
		if(IS_DEBUG_ENABLED) console.debug("performing '" + actionName + "' of '" + this.name + "'"+ ((typeof data !== 'undefined' && data !== null)? " with data: "+JSON.stringify(data): ""));//debug
	    
	    return this.script[actionName](data);
	} else if(typeof this.script[actionName] !== 'undefined'){
		if(IS_DEBUG_ENABLED) console.info("could not perform '" + actionName + "' of '" + this.name + "'"+ ((typeof data !== 'undefined' && data !== null)? " with data: "+JSON.stringify(data): "")+": no function ("+typeof this.script[actionName]+")");//debug
	} else {
		if(IS_DEBUG_ENABLED) console.debug("could not perform '" + actionName + "' of '" + this.name + "'"+ ((typeof data !== 'undefined' && data !== null)? " with data: "+JSON.stringify(data): "")+": not implemented (undefined)");//debug
	}
};


/**
 * This function performs a helper action of a controller by calling the appropriate method<br>
 * {@link Helper#performAction} of the instance of the helper class associated with the controller.
 * 
 * @function performHelperAction
 * @param {String} actionName Name of the helper method to be executed
 * @param {Object} data Data to pass to the helper method as argument
 * @returns {Object} The return value of the executed method 
 * @public
 */
Controller.prototype.performHelperAction = function(actionName, data){

	return  this.helper.performAction(actionName, data);
};


/**
 * Returns the helper of the controller instance.
 * 
 * @function getHelper
 * @returns {Object} The helper instance 
 * @public
 */
Controller.prototype.getHelper = function(){
	return this.helper;
};


/**
 * Stores all names of the views of the controller by iterating over the array of the views definition.<br>
 * This function is called by the constructor of the {@link mobileDS.Controller} class.
 * 
 * @function parseViews
 * @param {Array} viewDefs Array of the json-definition of the controllers views - containing name of the views and their corresponding path to the js-files
 * @public
 */
Controller.prototype.parseViews = function(viewDefs){
	var self = this;
	
	var i = 0;
	$.each(viewDefs, function(index, view){
		var viewName = view['name'];
		self.views[i] = viewName;
		i++;
	});
	
};


/**
 * Stores all names of the partials of the controller by iterating over the array of the partials definition.<br>
 * This function is called by the constructor of the {@link mobileDS.Controller} class.
 * 
 * @function parseViews
 * @param {Array} partialDefs Array of the json-definition of the controllers partials - containing name of the partials and their corresponding path to the js-files
 * @public
 */
Controller.prototype.parsePartials = function(partialDefs){
    var self = this;
    
    var i = 0;
    $.each(partialDefs, function(index, partial){
        var partialName = partial['name'];
        self.partials[i] = partialName;
        i++;
    });
    
};


/**
 * Returns the views of the controller instance.
 * 
 * @function getViews
 * @returns {Array} An array of the controllers views 
 * @public
 */
Controller.prototype.getViews = function(){
	return this.views;
};


/**
 * Returns the partials of the controller instance.
 * 
 * @function getPartials
 * @returns {Array} An array of the controllers partials 
 * @public
 */
Controller.prototype.getPartials = function(){
    return this.partials;
};


/**
 * Returns the name of the controller instance.
 * 
 * @function getName
 * @returns {String} The name of the controller 
 * @public
 */
Controller.prototype.getName = function(){
    return this.name;
};
