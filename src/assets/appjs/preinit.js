
//configuration for the mmir framework that needs to be pre-loaded
// (i.e. before the framework is actually initialized)

(function(core){//<- the core-framework object (global variable: mmir)


	//determine (ionic) basePath, i.e. to directory where index.html is located
	var basePath = (typeof navigator !== 'undefined' && navigator && /Android/i.test(navigator.userAgent))? 'file:///android_asset/www/' : './';

	core.config({

		paths:{

			//overwrite / replace MMIR config values:

			'mmirf/controllerManager': 'appjs/ionicControllerManager',

			//register a custom rendering module
			// NOTE: the framework also needs to be configured to actually use it (see below for an example)
			'ionicViewEngine': 'appjs/ionicViewEngine',

			'emma': 'appjs/emma',

//			//overwrite framework's jQuery library with another version:
//			'jquery': '../content/js/jquery-x.y.z',

//			//overwrite the framework's Layout implementation with an app-specific class:
//			'layout': '../appjs/remoteLayout',

			'apprenderer': 'appjs/micrenderer',

			//register a 3rd party library
			'jbox': 'content/js/jBox-v0.3.2',

			'lengthUtil': 'lib/length.min',
			'caretPosition': 'lib/caretPosition.min'

		},
		shim : {

			//add a shim for one of the additional modules
			'jbox': {

				deps: ['mmirf/loadCss', 'jquery'],
				init: function(loadCss){

					//load stylesheets (async & non-blocking)
					loadCss({href: 'assets/content/stylesheets/jbox-themes/TooltipDark.css', id: 'jbox-theme-css'});
					loadCss({href: 'assets/content/stylesheets/jBox.css', id: 'jbox-css'});

					return jBox;
				}
			}
		}//,
//		waitSeconds: 200	//DISABLED: increase timeout for requirejs start-up

		//configure the mmir framework
		, config: {
				//set specific debug levels
			    'mmirf/inputManager': {
			        scxmlDoc: 'assets/config/statedef/inputDescriptionSCXML.xml',
				    logLevel: 'warn'
			    }
			    , 'mmirf/dialogManager': {
			        scxmlDoc: 'assets/config/statedef/dialogDescriptionSCXML.xml',
				    logLevel: 'warn'
			    }
			    , 'mmirf/mediaManager': {
				    logLevel: 'debug'
			    }
			    , 'mmirf/constants': {
			    	basePath: basePath + 'assets/'
			    }

			}
	});

	//this would set a "custom" rendering engine/implementation
	// (the module "jqViewEngine" is registered above)
	core.viewEngine = 'ionicViewEngine';

	core.logLevel = 'info';

	core._mmirLibPath= basePath + 'assets';

	//add a listener for Cordova initialization, in order to do something
	// as soon as "Cordova becomes available"
	document.addEventListener("deviceready", function(){
		//NOTE this will only be triggered, if running in a Cordova environment
		console.info('app.deviceready: registering handler-functions that need to be able to handle a "cold-start" of the app...');

		//... do something

	}, false);


})(window.mmir);//<- the global mmir variable is defined/exported in /mmirf/core.js
