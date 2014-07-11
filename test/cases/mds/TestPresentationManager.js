describe("manager/presentationManager", function() {
	// needed global vars
	controllerPath="controller";
	viewPath="views";
	forBrowser = true;
	IS_DEBUG_ENABLED = false;
	
	describe("initialization working", function() {
		it("is singleton instance available", function() {
			mobileDS.ControllerManager.initializeControllers();
				// expect(mobileDS.ControllerManager.getInstance()).toEqual(jasmine.any(Object));
			expect(mobileDS.PresentationManager.getInstance()).toEqual(jasmine.any(Object));

			// expect(mobileDS.PresentationManager.getInstance()).toEqual(jasmine.any(Object));
		});
		
		it("getLayout", function() {
			mobileDS.ControllerManager.initializeControllers();
				// expect(mobileDS.ControllerManager.getInstance()).toEqual(jasmine.any(Object));
			expect(mobileDS.PresentationManager.getInstance().getLayout()).toEqual("iokiojk");

			// expect(mobileDS.PresentationManager.getInstance()).toEqual(jasmine.any(Object));
		});
	});
	
	// describe("initialization needed", function() {
		// beforeEach(function() {
		// //	set global variables
		// });
	
		// it("check for controllers", function() {
			// mobileDS.ControllerManager.initializeControllers();
		// //	after = ["Controller1", "Controller2w"];
			// after = [jasmine.any(Object), jasmine.any(Object)];
			// expect(mobileDS.ControllerManager.getInstance().getControllers()).toEqual(after);
		// });
		
		// it("getController", function() {
			// expect(mobileDS.ControllerManager.getInstance().getController("Controller1")).toEqual(jasmine.any(Object));
		// });
	// });
});