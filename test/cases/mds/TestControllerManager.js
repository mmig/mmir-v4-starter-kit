describe("manager/controllerManager", function() {
	// needed global vars
	controllerPath="controller";
	viewPath="views";
	forBrowser=false;
	
	// EMULATION of functionality
	// START ============================================================================
	// END   ============================================================================

	describe("initialization working", function() {
		it("is singleton instance available", function() {
			mobileDS.ControllerManager.initializeControllers(function(){
				expect(mobileDS.ControllerManager.getInstance()).toEqual(jasmine.any(Object));
			});
		});
	});
	
	describe("initialization needed", function() {
		beforeEach(function() {
			// set global variables
		});
	
		it("check for controllers", function() {
			mobileDS.ControllerManager.initializeControllers();
			// after = ["Controller1", "Controller2w"];
			after = [jasmine.any(Object), jasmine.any(Object)];
			expect(mobileDS.ControllerManager.getInstance().getControllers()).toEqual(after);
		});
		
		it("getController", function() {
			expect(mobileDS.ControllerManager.getInstance().getController("Controller1")).toEqual(jasmine.any(Object));
		});
	});
});