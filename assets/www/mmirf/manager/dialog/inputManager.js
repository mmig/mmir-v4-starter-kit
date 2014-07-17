define(['commonUtils', 'module', 'engineConfig' ], function(commonUtils,module, engineConfig) {

	var _instance = {

		getInstance : function() {
			return this;
		},

	};

	return $.extend(true, _instance, {

		init : function() {
			delete this.init;
			var url = module.config().scxmlDoc;
			var mode = module.config().mode;
			var engine = engineConfig(url, mode);

			var _self = this;

			return $.Deferred(function(dfd) {
				
				engine.load().done(function(_engine) {

					//DEPRECATED loadAddons!
//					if (module.config().addons) {
//						
//						commonUtils.loadAddons(
//								module.config().addons, function() {
//									mmir.InputEngine = _engine;
//									delete _engine.gen;
//									dfd.resolve(_engine);
//								});
//					}
//					else {
						
						mmir.InputEngine = _engine;
						delete _engine.gen;
						dfd.resolve(_engine);
//					}
					
				});
				
			}).promise();
		}
	});

});
