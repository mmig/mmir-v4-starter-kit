define([
      'mmirf/util/deferredWithState'
	, 'mmirf/configurationManager'
	, 'mmirf/logger', 'module'
],function(
	deferred,
	configurationManager,
	Logger, module
){

	/**
	 * Loads views (layouts and partials):
	 * either compiled views (i.e. JS files), or raw views (i.e. eHTML files).
	 *
	 * The loader checks, if compiled views are up-to-date (using the corresponding
	 * checksum file).
	 * If a compiled view is not up-to-date (or its checksum file is missing), then
	 * the raw view will be loaded and compiled.
	 *
	 * If raw views are loaded, the parsing-module will loaded for compiling the
	 * views (i.e. if only compiled views are loaded, the dependency for the template
	 * parser and renderer is not required).
	 *
	 *
	 * <br>
	 * <strong>Configuration (configuration.json)</strong>
	 * <br>
	 *
	 * The configuration value <code>"usePrecompiledViews"</code> (Boolean) allows
	 * the determine, if views should always be compiled from the eHTML files (even
	 * if up-to-date compiled views are present).
	 *
	 * For example, configuration <code>"usePrecompiledViews": true</code> will use
	 * compiled views, while <code>"usePrecompiledViews": false</code> will always
	 * compile the eHTML files.
	 *
	 *
	 * If the configuration value for {@link mmir.PresentationManager.CONFIG_DEFAULT_LAYOUT_NAME} is
	 * set to <code>NULL</code> no default layout will be loaded.
	 *
	 * If {@link mmir.PresentationManager.CONFIG_DEFAULT_LAYOUT_NAME} is a non-empty string, then
	 * the corresponding layout will be used as default layout, instead of
	 * {@link mmir.PresentationManager.DEFAULT_LAYOUT_NAME}.
	 *
	 *
	 * @param  {PresentationManager} _instance
	 *          the instance of the PresentationManager
	 * @param  {Dictionary<Layout>} _layouts
	 *          the layout collection of the PresentationManager for adding loaded layouts
	 * @param  {Dictionary<View>} _views
	 *          the view collection of the PresentationManager for adding loaded views
	 * @param  {Dictionary<Partial>} _partials
	 *          the partials collection of the PresentationManager for adding loaded partials
	 * @param  {Function} createViewKey
	 *          the PresentationManager's helper function for creating keys to be used when
	 *          adding views to <code>_views</code>:<br>
	 *          <code>createViewKey(ctrl: {Controller|String}, view: {View|String}) : {String}</code>
	 * @param  {Function} createPartialKey
	 *          the PresentationManager's helper function for creating keys to be used when
	 *          adding partials to <code>_partials</code>:<br>
	 *          <code>createPartialKey(partial: {Partial|String}, view: {View|String}) : {String}</code>
	 * @return {Promise}
	 *          a deferred promise that gets resolved when the views (layouts, and partials) are loaded
	 *
	 * @memberOf ViewLoader
	 */
	function loadViews (
			_instance, _layouts, _views, _partials, createViewKey, createPartialKey
	) {

		///////////// start intialization: ////////////////

		/**
		 * Deferred / promise for loading views.
		 *
		 * @type Promise
		 * @private
		 * @memberOf ViewLoader.init
		 */
		var defer = deferred();
		defer.resolve();

		return defer;

	};//END: loadViews(){

	return loadViews;
});
