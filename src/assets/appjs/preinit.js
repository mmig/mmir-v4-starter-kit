
//configuration for the mmir framework that needs to be pre-loaded
// (i.e. before the framework is actually initialized)

(function(core){//<- the core-framework object (global variable: mmir)

	
	core.config({
		
		paths:{
			//overwrite / replace MMIR config values:
			
			//register a custom rendering module
			// NOTE: the framework also needs to be configured to actually use it (see below for an example)
			'jqViewEngine': '../appjs/jqSimpleViewEngine',
			
//			//overwrite framework's jQuery library with another version:
//			'jquery': '../content/js/jquery-x.y.z',
			
//			//overwrite the framework's Layout implementation with an app-specific class:
//			'layout': '../appjs/remoteLayout',
			
			'apprenderer': '../appjs/micrenderer',
			
			//register a 3rd party library
			'jbox': '../content/js/jBox-v0.3.2'
			
		},
		shim : {
			
			//add a shim for one of the additional modules
			'jbox': {
				
				deps: ['loadCss', 'jquery'],
				init: function(loadCss){
					
					//load stylesheets (async & non-blocking)
					loadCss({href: 'content/stylesheets/jbox-themes/TooltipDark.css', id: 'jbox-theme-css'});
					loadCss({href: 'content/stylesheets/jBox.css', id: 'jbox-css'});
					
					return jBox;
				}
			}
		}//,
//		waitSeconds: 200	//DISABLED: increase timeout for requirejs start-up
	
		//configure the mmir framework
		, config: {
				//set specific debug levels
			    'inputManager': {
				    logLevel: 'warn'
			    }
			    , 'dialogManager': {
				    logLevel: 'warn'
			    }
			    , 'mediaManager': {
				    logLevel: 'debug'
			    }
			    
			}
	});
	
	//this would set a "custom" rendering engine/implementation
	// (the module "jqViewEngine" is registered above)
//	core.viewEngine = 'jqViewEngine';
	
	core.logLevel = 'info';
	
	//add a listener for Cordova initialization, in order to do something 
	// as soon as "Cordova becomes available"
	document.addEventListener("deviceready", function(){
		//NOTE this will only be triggered, if running in a Cordova environment
		console.info('app.deviceready: registering handler-functions that need to be able to handle a "cold-start" of the app...');
		
		//... do something
				
	}, false);
	

})(window.mmir);//<- the global mmir variable is defined/exported in /mmirf/core.js
