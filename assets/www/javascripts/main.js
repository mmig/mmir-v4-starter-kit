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


var mobileDS = window.mobileDS ||
{};

//basePath = "";
var basePath = "";
var assetPath = "/../";
if (!forBrowser){
	basePath = "file:///android_asset/www/";
	assetPath = "file:///android_asset/";
}

//several used paths
var controllerPath = basePath+"controllers/";
var languagePath = basePath+"config/languages/";
var grammarPath = basePath+"config/grammars/";
var modelPath = basePath+"models/";
var layoutPath = basePath+"views/layouts/";
var viewPath = basePath+"views/";
var pluginsPath = basePath+"javascripts/plugins/";

var commonUtils;
var pm;
var viewFactory;
var motionDetector;
var dialogManager;
var inputManager;
var controllerManager;
var semanticInterpreter;
var modelManager;
var initialized = false;
var audioInput;
var applicationLanguage;
var langManager;
var appConfiguration;

var fileSys = '';
var content = '';

var IS_DEBUG_ENABLED = true;

jQuery(document).ready(function(){
	if (forBrowser) onDeviceReady();
	else document.addEventListener("deviceready", onDeviceReady, false);
});


function fail(error) {
	console.log("Error! " + error.code);
}
//LOGGING end

function onDeviceReady(){
    console.log("device is ready");

    document.addEventListener("backbutton", backKeyDown, true);
    commonUtils = mobileDS.CommonUtils.getInstance().initialize(initializeApplication);
}


function initializeApplication(){
	console.log("initialize Application.");
	
    commonUtils = mobileDS.CommonUtils.getInstance();
    if (!forBrowser){

    	// Check if a network connection is established.
    	if (mobileDS.CommonUtils.getInstance().checkNetworkConnection() == false){
    		alert("No network connection enabled.\nPlease enable network access.");
//    		return false;
    	} else {
    		if(IS_DEBUG_ENABLED) console.log("Network access is available.");
    	}
    	
		mobileDS.CommonUtils.getInstance().loadAllPhonegapPlugins(pluginsPath, function(){
		        try {
		            for (var prop in window.plugins) {
		                console.log("Loaded plugin '" + prop + "'");
		            }
		        } 
		        catch (e) {
		            console.log("Exception: " + e);
		        }
		        loadManagers();
		});
    }
    else {
    	loadManagers();
    }

}

function loadManagers(){
//  applicationLanguage = "de";
    mobileDS.ConfigurationManager.getInstance();
    
    langManager = mobileDS.LanguageManager.getInstance(mobileDS.ConfigurationManager.getInstance().getLanguage());//applicationLanguage);
    controllerManager = mobileDS.ControllerManager.initializeControllers(afterLoadingControllers);
    semanticInterpreter = mobileDS.SemanticInterpreter.getInstance();
    if (forBrowser){
    	mobileDS.AudioInput.loadFile('javascripts/mediators/html5AudioInput.js', function(){
    		audioInput = mobileDS.AudioInput.getInstance;
    		console.log('AudioInput loaded');
    		});
    	mobileDS.AudioOutput.loadFile('javascripts/mediators/html5AudioOutput.js', function(){
        	audioOutput = mobileDS.AudioOutput.getInstance;
        	console.log('AudioOutput loaded');
        	});
    }
    else {
    	mobileDS.AudioInput.loadFile(basePath+'javascripts/mediators/nuanceAudioInput.js', function(){
    		audioInput = mobileDS.AudioInput.getInstance;
    		console.log('AudioInput loaded');
    		});
    	mobileDS.AudioOutput.loadFile(basePath+'javascripts/mediators/nuanceAudioOutput.js', function(){
        	audioOutput = mobileDS.AudioOutput.getInstance;
        	console.log('AudioOutput loaded');
        	});
    }
    inputManager = mobileDS.InputManager.getInstance();
	inputManager.initializeDialog();

    console.log("initialization finished");
    /// callback end
   
    var cm = mobileDS.CompassHandler.getInstance();
   // cm.startWatch();
}

function backKeyDown(){
    mobileDS.DialogEngine.getInstance().raiseEvent('back');
}

function showLoader(){
	mobileDS.DialogEngine.getInstance().show_wait_dialog();
//    $('.ui-loader').css('display', 'block');
}


function hideLoader(){
	mobileDS.DialogEngine.getInstance().hide_wait_dialog();
//    $('.ui-loader').css('display', 'none');
}


function afterLoadingControllers(){
    //$.mobile.page.prototype.options.backBtnText = "zur&uuml;ck";
    //$.mobile.page.prototype.options.backBtnTheme = "a";
    // $.mobile.page.prototype.options.addBackBtn = true;
    //$.mobile.useFastClick = false;
	$.mobile.defaultPageTransition = 'slide';
	
    pm = mobileDS.PresentationManager.getInstance();
    dialogManager = mobileDS.DialogEngine.getInstance();
    dialogManager.set_on_page_loaded(exectueAfterEachPageIsLoaded);
    dialogManager.initializeDialog();
    var appLayout = pm.getLayout("application");
    var headerContents = appLayout.getHeaderContents();
    var header = $("head");
    header.append(headerContents);
    $('#applications_dialogs').appendTo($.mobile.pageContainer).css({});
    modelManager = mobileDS.ModelManager.getInstance(null);
    
}

function exectueAfterEachPageIsLoaded(ctrlName,viewName,data){
	//register "automatic" event handlers for buttons
	$("button").each(function(index, el){
	  var tis = $(this);
	  var eventName;
	  tis.bind('vmousedown', function(event){
	      tis.parent().addClass('ui-focus ui-btn-active ui-btn-down-a');
	      eventName = "touch_start_on_" + tis.attr("name");
	      mobileDS.InputManager.getInstance().raiseEvent("touch_input_event");
	      mobileDS.InputManager.getInstance().raiseEvent(eventName);
	  });
	  tis.bind('click', function(event){
	      eventName = "click_on_" + tis.attr("name");
	      mobileDS.InputManager.getInstance().raiseEvent("touch_input_event");
	      mobileDS.InputManager.getInstance().raiseEvent(eventName);
	  });
	  tis.bind('vmouseup', function(event){
		  	tis.parent().removeClass('ui-focus ui-btn-active ui-btn-down-a');
	      	eventName = "touch_end_on_" + tis.attr("name");
	      	mobileDS.InputManager.getInstance().raiseEvent("touch_input_event");
	      	mobileDS.InputManager.getInstance().raiseEvent(eventName);
	  });
	});
}

function micClick(){
	var notification = mobileDS.Notification.getInstance();
	if (!forBrowser) notification.vibrate(500);
	
	if ($('#mic_button').hasClass('footer_button_clicked')){
		$('#mic_button').removeClass('footer_button_clicked');
		mobileDS.AudioInput.getInstance().stopGetRecord(function (e){});
	}
	else {
		$('#mic_button').addClass('footer_button_clicked');
		mobileDS.AudioInput.getInstance().startRecord(function printResult(res){
			console.log("[AudioInput] "  + res);
			mobileDS.AudioOutput.getInstance().textToSpeach(res, function(){}, function(){});	
			var asr_result = res;
	
			var result = mobileDS.SemanticInterpreter.getInstance().get_asr_semantic(asr_result);
			var semantic;
			$('#mic_button').removeClass('footer_button_clicked');
			mobileDS.AudioInput.getInstance().stopGetRecord(function (e){});
			if (result.semantic != null) {
			    semantic = JSON.parse(result.semantic);
			    semantic.phrase = res;
			    console.log("semantic : " + result.semantic);
			}
			else {
			    semantic = JSON.parse('{ "NoMatch": { "phrase": "'+asr_result+'" }}');
			}
			inputManager.raiseEvent("speech_input_event",  semantic);
  		 }, function(e){
			alert('tts failed');
  		 });
	}
}

function show_phrase (event) {
   var phrase_view = jQuery('div.phrase-view'),
	pDiv = jQuery('<div>'),
	phrase;

   try {
	if (typeof(event) !== 'string') {
	    phrase = event.phrase;
	} else {
	    phrase = event;
	}
	if (typeof(phrase) === 'undefined') {
	    phrase = event.NoMatch.phrase;
	}
   } catch (e) {
	console.log("Failed to read phrase: " + e);
   }
   
   phrase_view.append(pDiv);
   pDiv.text(phrase);
   pDiv.hide().slideDown(800);
   pDiv.delay(2500).slideUp(400);
}

jQuery(document).bind("mobileinit", function(){
    jQuery.mobile.ajaxEnabled = true;
    
});


