describe("tools/commonUtils", function() {
	IS_DEBUG_ENABLED = false;
	
//  beforeEach(function() {
//  });
  
	it("singleton instance is available", function() {
		expect(mobileDS.CommonUtils.getInstance()).toEqual(jasmine.any(Object));
	});
  
	describe("Test public functions", function() {
		describe("- Regexp", function() {
			it("getPartialsPrefix", function() {
				var after = '~';
				expect(mobileDS.CommonUtils.getInstance().getPartialsPrefix()).toEqual(after);
			});
			xit("getViewsPrefix", function() {
				var after = '#';
				expect(mobileDS.CommonUtils.getInstance().getViewsPrefix()).toEqual(after);
			});
			it("getTranslationRegExp", function() {
				var after = /<%t\s*:([^\s]*)\s*%>/gi;
				expect(mobileDS.CommonUtils.getInstance().getTranslationRegExp()).toEqual(after);
			});
		});
		
		describe("- all functions that require initialization of commonUtils", function() {
			var commonUtils;
			window = {};
//			dirObj = {"/android_asset/www/mmirf/plugins":["directoryListing.js","mufinPlugin.js","multitouchPlugin.js","nativeTTS.js","nuance.js","softkeyboard.js","voice2Social.js"],"/android_asset/www/helpers":["applicationHelper.js","googleMapHelper.js","pointOfInterestsHelper.js","pointOfInterestsHelper.js.bak","sonarScannerHelper.js"],"/android_asset/www/views/googleMap":["confirm_audio_tag.ehtml","confirm_voice_tag.ehtml","main_panel.ehtml","poi_details.ehtml","~new_poi_popup.ehtml","~poi_details.ehtml","~poi_info_popup.ehtml","~poi_radio_bar.ehtml","~tag_recording_dialogs.ehtml"],"/android_asset/www/config/statedef":["dialogDescriptionSCXML.xml","dialogDescriptionSCXML.xml.MD5","inputDescriptionSCXML.xml","inputDescriptionSCXML.xml.MD5","readme.txt","scxml2js.bat","scxml2js.sh"],"/android_asset/www/config/languages/ir":["dictionary.json"],"/android_asset/www/views":["application","googleMap","layouts","pointOfInterests","sonarScanner"],"/android_asset/www/views/sonarScanner":["sonar_scanner.ehtml","sonar_scanner_old.ehtml"],"/android_asset/www/config/languages/de":["dictionary.json"],"/android_asset/www/config":["configuration.json","languages","statedef"],"/android_asset/www/views/layouts":["application.ehtml","googlemap.ehtml","pointofinterests.ehtml","sonarscanner.ehtml"],"/android_asset/www/views/application":["login.ehtml","registration.ehtml","welcome.ehtml","~login_footer_button.ehtml"],"/android_asset/www/controllers":["application.js","googleMap.js","pointOfInterests.js","pointOfInterests.js.bak","sonarScanner.js"],"/android_asset/www/config/languages":["de","en","fr","ir"],"/android_asset/www/views/pointOfInterests":["poi_audio_tag_content.ehtml","poi_audio_tags.ehtml","poi_qype_review_content.ehtml","poi_qype_reviews.ehtml","poi_voice_tag_content.ehtml","poi_voice_tags.ehtml","~poi_annotation_content_footer.ehtml","~poi_audio_tag_content.ehtml","~poi_qype_review_content.ehtml","~poi_voice_tag_content.ehtml","~poi_voice_tag_content.ehtml.bak"],"/android_asset/www/models":["poiMetaData.js","user.js"],"/android_asset/www/config/languages/en":["dictionary.json"],"/android_asset/www/config/languages/fr":["dictionary.json"]};
			dirObj = {"/mmirf/plugins":["directoryListing.js","mufinPlugin.js","multitouchPlugin.js","nativeTTS.js","nuance.js","softkeyboard.js","voice2Social.js"],"/helpers":["applicationHelper.js","googleMapHelper.js","pointOfInterestsHelper.js","pointOfInterestsHelper.js.bak","sonarScannerHelper.js"],"/views/googleMap":["confirm_audio_tag.ehtml","confirm_voice_tag.ehtml","main_panel.ehtml","poi_details.ehtml","~new_poi_popup.ehtml","~poi_details.ehtml","~poi_info_popup.ehtml","~poi_radio_bar.ehtml","~tag_recording_dialogs.ehtml"],"/config/statedef":["dialogDescriptionSCXML.xml","dialogDescriptionSCXML.xml.MD5","inputDescriptionSCXML.xml","inputDescriptionSCXML.xml.MD5","readme.txt","scxml2js.bat","scxml2js.sh"],"/config/languages/ir":["dictionary.json"],"/views":["application","googleMap","layouts","pointOfInterests","sonarScanner"],"/views/sonarScanner":["sonar_scanner.ehtml","sonar_scanner_old.ehtml"],"/config/languages/de":["dictionary.json"],"/config":["configuration.json","languages","statedef"],"/views/layouts":["application.ehtml","googlemap.ehtml","pointofinterests.ehtml","sonarscanner.ehtml"],"/views/application":["login.ehtml","registration.ehtml","welcome.ehtml","~login_footer_button.ehtml"],"/controllers":["application.js","googleMap.js","pointOfInterests.js","pointOfInterests.js.bak","sonarScanner.js"],"/config/languages":["de","en","fr","ir"],"/views/pointOfInterests":["poi_audio_tag_content.ehtml","poi_audio_tags.ehtml","poi_qype_review_content.ehtml","poi_qype_reviews.ehtml","poi_voice_tag_content.ehtml","poi_voice_tags.ehtml","~poi_annotation_content_footer.ehtml","~poi_audio_tag_content.ehtml","~poi_qype_review_content.ehtml","~poi_voice_tag_content.ehtml","~poi_voice_tag_content.ehtml.bak"],"/models":["poiMetaData.js","user.js"],"/config/languages/en":["dictionary.json"],"/config/languages/fr":["dictionary.json"]};

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
			});
			
			it("call initialize", function() {
				expect(window.plugins.directoryListing.getDirectoryStructure).toHaveBeenCalled();
			});
			
			it("getDirectoryStructure", function() {
				expect(commonUtils.getDirectoryStructure()).toEqual(dirObj);
			});
			
			it("getDirectoryContentsWithFilter - *.js", function() {
//				var path = '/android_asset/www/mmirf/plugins';
				var path = '/mmirf/plugins';
				var filter = '*.js';
				var after = ["directoryListing.js","mufinPlugin.js","multitouchPlugin.js","nativeTTS.js","nuance.js","softkeyboard.js","voice2Social.js"];
				expect(mobileDS.CommonUtils.getInstance().getDirectoryContentsWithFilter(path, filter)).toEqual(after);
			});
			
			it("getDirectoryContentsWithFilter - n*", function() {
//				var path = '/android_asset/www/mmirf/plugins';
				var path = '/mmirf/plugins';
				var filter = 'n*';
				var after = ["nativeTTS.js","nuance.js"];
				expect(mobileDS.CommonUtils.getInstance().getDirectoryContentsWithFilter(path, filter)).toEqual(after);
			});
			
			it("getDirectoryContentsWithFilter - nuance.js", function() {
//				var path = '/android_asset/www/mmirf/plugins';
				var path = '/mmirf/plugins';
				var filter = 'nuance.js';
				var after = ["nuance.js"];
				expect(mobileDS.CommonUtils.getInstance().getDirectoryContentsWithFilter(path, filter)).toEqual(after);
			});
			
			it("loadAllCordovaPlugins - nuance.js", function() {
//				var path = '/android_asset/www/mmirf/plugins';
				var path = '/mmirf/plugins';
				var filter = 'nuance.js';
				var after = ["nuance.js"];
//				var pluginspath = 'file:///android_asset/www/mmirf/plugins/';
				var pluginspath = '/mmirf/plugins/';

				// create the spies
				spyOn(mobileDS.CommonUtils.getInstance(), "getLocalScript").andCallFake(function(scriptUrl, success, fail){
					success && success();
				});
				
				spyOn(mobileDS.CommonUtils.getInstance(), "loadAllCordovaPlugins").andCallThrough();

				// execute function
				mobileDS.CommonUtils.getInstance().loadAllCordovaPlugins(pluginspath, function(){return true;})
				
				// 7 files, but window.plugins.directoryListing is already "loaded" in beforeEach-function
				expect(mobileDS.CommonUtils.getInstance().getLocalScript.calls.length).toEqual(6);
				expect(mobileDS.CommonUtils.getInstance().loadAllCordovaPlugins.calls.length).toEqual(1);
			});
			
			
		});
		
		describe("- date/duration tests", function() {
			it("get_date_as_string - de", function() {
				var after = "13. Januar 2013";
				expect(mobileDS.CommonUtils.getInstance().get_date_as_string("2013-01-13 12:34:56.7", "de")).toEqual(after);
			});
			it("get_date_as_string - en", function() {
				var after = "13. January 2013";
				expect(mobileDS.CommonUtils.getInstance().get_date_as_string("2013-01-13 12:34:56.7", "en")).toEqual(after);
			});
			it("get_date_as_string - null", function() {
				var after = "13. January 2013";
				expect(mobileDS.CommonUtils.getInstance().get_date_as_string("2013-01-13 12:34:56.7")).toEqual(after);
			});
			it("get_duration_as_string - 45 sek", function() {
				var after = "00:45 min";
				expect(mobileDS.CommonUtils.getInstance().get_duration_as_string(45)).toEqual(after);
			});
			it("get_duration_as_string - 185 sek", function() {
				var after = "03:05 min";
				expect(mobileDS.CommonUtils.getInstance().get_duration_as_string(185)).toEqual(after);
			});
			it("get_duration_as_string - 11133 sek", function() {
				var after = "3:05:33 h";
				expect(mobileDS.CommonUtils.getInstance().get_duration_as_string(11133)).toEqual(after);
			});
		});
		
		describe("- HTML generation functions", function() {
			it("convertJSONStringValueToHTML", function() {
				var before = '<html>\r\n<head>\n"TestString"\r</head>\r\n<body>\n\t"Test String2"\r\n</body>\n</html>';
				var after = '<html><br/><head><br/>\\"TestString\\"<br/></head><br/><body><br/>\t\\"Test String2\\"<br/></body><br/></html>';
				expect(mobileDS.CommonUtils.getInstance().convertJSONStringValueToHTML(before)).toEqual(after);
			});
			
			
		});
	});
});