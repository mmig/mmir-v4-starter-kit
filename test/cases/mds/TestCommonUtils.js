describe("commonUtils", function() {

//  beforeEach(function() {
//  });
  
  it("singleton instance is available", function() {
	  expect(mobileDS.CommonUtils.getInstance()).toEqual(jasmine.any(Object));
  });
  
});