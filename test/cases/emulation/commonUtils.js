// emulate CommonUtils
// Create needed Spies
var mobileDS = window.mobileDS || {};
mobileDS.CommonUtils = {};
mobileDS.CommonUtils.getInstance = jasmine.createSpy('getInstance');
mobileDS.CommonUtils.getInstance.andCallFake(function(){
	return {
		getDirectoryContentsWithFilter: function() {
			retFiles = Array();
			retFiles.push("Controller1.js");
			retFiles.push("Controller2.js");
			return retFiles;
		},
		getPartialsPrefix: function() {
			return "~";
		},
		getLocalScript: function(script_src, func_success, func_error) {
			func_success && func_success();
		},
		isRunningOnSmartphone: function(){
			return true;
		}
	}
});
