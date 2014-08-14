
describe("manager/languageManager", function() {
	// needed global vars
	// controllerPath="controller";
	// viewPath="views";
	IS_DEBUG_ENABLED=false;
	forBrowser=true;
	
	// EMULATION of functionality
	// START ============================================================================
	// END   ============================================================================

	describe("commonUtils needed", function() {
		var commonUtils;
		var langManager;
		window = {};
		dirObj={"/config/languages":["aa","de","en","zy"],"/config/languages/aa":["dictionary.json","grammar.json"],"/config/languages/de":["dictionary.json","grammar.json"],"/config/languages/en":["dictionary.json"],"/config/languages/zy":[]}

		beforeEach(function() {
			// set global variables
			basePath = "file:///android_asset/www/";
			pluginsPath = basePath+"mmirf/plugins/";

			window.plugins = {};
			window.plugins.directoryListing = {};
			window.plugins.directoryListing.getDirectoryStructure = jasmine.createSpy('getDirectoryStructure');
			window.plugins.directoryListing.getDirectoryStructure.andCallFake(function(dir, cb){
				if ((cb) && (typeof cb == 'function')){
					cb(dirObj);
				}
			});
			
			navigator = {};
			navigator.network = {};
			navigator.network.connection = {};
			navigator.network.connection.type = jasmine.createSpy('type');
			
			Connection = jasmine.createSpyObj('Connection', ['NONE', 'WIFI']);
			
			commonUtils = mobileDS.CommonUtils.getInstance();
			commonUtils.initialize();
			langManager = mobileDS.LanguageManager.getInstance("de");
		});
		it("Get languages", function() {
			var after = ["aa", "de", "en", "zy"];
			expect(mobileDS.LanguageManager.getInstance().getLanguages()).toEqual(after);
		});
		it("Dictionary - zy", function() {
			expect(langManager.existsDictionaryForLanguage("zy")).toEqual(false);
		});
		it("Grammar - zy", function() {
			expect(langManager.existsGrammarForLanguage("zy")).toEqual(false);
		});
		it("Dictionary - de", function() {
			expect(langManager.existsDictionaryForLanguage("de")).toEqual(true);
		});
		it("Grammar - de", function() {
			expect(langManager.existsGrammarForLanguage("de")).toEqual(true);
		});
		it("Determine language", function() {
			expect(langManager.determineLanguage()).toEqual("aa");
		});
		it("Set language to de", function() {
			expect(langManager.setLanguage("de")).toEqual("de");
		});
		it("Get language", function() {
			expect(langManager.getLanguage()).toEqual("de");
		});
		it("Get default language", function() {
			expect(langManager.getDefaultLanguage()).toEqual(jasmine.any(String));
		});
		it("Cycle language", function() {
			expect(langManager.cycleLanguages()).toEqual("en");
		});
	});
	
});