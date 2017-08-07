
define(
			['mmirf/pegjs', 'mmirf/jison', 'mmirf/jscc', 'appUtil', 'mmirf/checksumUtils' , 'grammarEditor', 'module', 'mainView', 'waitDialog'
//			 , 'esprima'
			]
	, function(
			   PEG,   jison,   jscc,   util,    checksumUtils,    editorModule, module, view, waitDialog
//			, jsParser

){

	//configure PEGjs compiler:
	PEG.printError = view.printError;


	//configure jsion compiler:
	jison.printError = view.printError;

	//configure JS/CC compiler:

	//set print-function of JS/CC so that errors, warnings etc.
	// are outputed into a "text box" on the page
	jscc.set_printError(view.printError);
	jscc.set_printWarning(view.printError);
	jscc.set_printInfo(view.printError);

	//configure Esprima (JavaScript) parser:
//	jsParser.setXXX();



	//initialize checksum-util (for calculating checksums)
	checksumUtils.init();


	//initialize the orion-editor for the grammar
	var _editorClassName = module.config().grammarEditorClass;//'editor';
	editor = editorModule.init(view, _editorClassName);
	 /*annotations
         ERROR_MARKER,
         WARNING_MARKER,
         TASK_MARKER,
         BREAKPOINT_MARKER,
         BOOKMARK_MARKER,
         FOLDING_MARKER,
         CURRENT_BRACKET_MARKER,
         MATCHING_BRACKET_MARKER,
         CURRENT_LINE_MARKER,
         CURRENT_SEARCH_MARKER,
         MATCHING_SEARCH_MARKER,
         READ_OCCURRENCE_MARKER,
         WRITE_OCCURRENCE_MARKER,
         SELECTED_LINKED_GROUP_MARKER,
         CURRENT_LINKED_GROUP_MARKER,
         LINKED_GROUP_MARKER,
         BLAME_MARKER,
         CURRENT_BLAME_MARKER
	 */

	 ERROR_MARKER    = editorModule.ERROR_MARKER;
	 WARNING_MARKER  = editorModule.WARNING_MARKER;
	 BOOKMARK_MARKER = editorModule.BOOKMARK_MARKER;

	 //load CSS style for the WaitDialog
	 waitDialog.styleUrl = module.config().waitDialogCssPath + waitDialog.styleUrl;
	 waitDialog._loadStyle();
	 waitDialog.show(void(0), 'app', {style: 'b'});
	 waitDialog.show('app');
});
