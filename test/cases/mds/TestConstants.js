describe("tools/constants", function() {
	
	describe("initialization needed", function() {
		beforeEach(function() {
			// set global variables
		});
	
		it("check for constants - getDictionaryFilename", function() {
			// after = "grammar.json";
			expect(mobileDS.constants.getInstance().getDictionaryFilename()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getGrammarFilename", function() {
			// after = "grammar.json";
			expect(mobileDS.constants.getInstance().getGrammarFilename()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getBasePath - forBrowser: true", function() {
			// after = "";
			expect(mobileDS.constants.getInstance(true).getBasePath()).toEqual(jasmine.any(String));
		});

		it("check for constants - getBasePath - forBrowser: false", function() {
			// after = "file:///android_asset/www/";
			expect(mobileDS.constants.getInstance(false).getBasePath()).toEqual(jasmine.any(String));
		});

		it("check for constants - getBasePath - forBrowser: null", function() {
			// after = "file:///android_asset/www/";
			expect(mobileDS.constants.getInstance(null).getBasePath()).toEqual(jasmine.any(String));
		});

		it("check for constants - getViewPath", function() {
			// after = "views/";
			expect(mobileDS.constants.getInstance().getViewPath()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getPluginsPath", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getPluginsPath()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getLayoutPath", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getLayoutPath()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getModelPath", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getModelPath()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getViewPath", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getViewPath()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getControllerPath", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getControllerPath()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getLanguagePath", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getLanguagePath()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getHelperPath", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getHelperPath()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getConfigurationFileUrl", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getConfigurationFileUrl()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getDictionaryFilename", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getDictionaryFilename()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getGrammarFilename", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getGrammarFilename()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getPartialsPrefix", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getPartialsPrefix()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getHelperSuffix", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getHelperSuffix()).toEqual(jasmine.any(String));
		});
		
		it("check for constants - getLanguage", function() {
			// after = "file:///android_asset/www/views/";
			expect(mobileDS.constants.getInstance(false).getLanguage()).toEqual(jasmine.any(String));
		});
		
	});
});