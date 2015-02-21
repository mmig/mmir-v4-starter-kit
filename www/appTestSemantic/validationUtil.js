
define(['appUtil', 'jsonlint', 'grammarValidator'], function(util, jsonparser, GrammarValidator){
	/**
	 * EITHER:
	 * @param {Number} line
	 *			the line number
	 * @param {Number} pos
	 *				the column in the line (is ignored)
	 *
	 * OR:
	 *
	 * @param {Postion} line
		    a position object with properties
			{
				first_line: Number,
				first_column: Number,
				last_line: Number,
				last_column: Number
			}
	 		NOTE: there must NOT be second argument in this case
	 */
	function getOffsetFor(editor, line, pos) {

		if (!pos) {
			pos = line;
			if (!pos) {
				return void (0);
			}
			return {
				start : getOffsetFor(editor, pos.first_line, pos.first_column),
				end : getOffsetFor(editor, pos.last_line, pos.last_column)
			};
		}

		//get start offset
		if (line === 1) {
			return pos;
		}

		var offset = editor.getLineStart(line - 1);
		return offset + pos;
	}
	
	function getPosInJson(posJson, path) {

		var prev = posJson;
		var curr = posJson;
		for (var i = 0, size = path.length; i < size; ++i) {
			if (typeof curr[path[i]] !== 'undefined') {
				prev = curr;
				curr = curr[path[i]]
			} else {
				//console.warn('getPosInJson(): could not traverse "'+path[i]+'" ('+i+') from path '+JSON.stringify(path));
				break;
			}
		}

		var pos;
		if (curr === prev) {
			pos = curr._loc._this;
		}

		if ($.isArray(prev)) {
			// array-entry, i.e.: [..., VALUE_i, ...]
			pos = prev._loc['_i' + path[(i - 1)]]
		} else if (typeof prev === 'object') {
			//property, i.e.: "name": VALUE
			pos = prev._loc['_' + path[(i - 1)]];

			if (!pos) {
				pos = prev._loc._this;
			} else if (i === size) {
				//target path points to NAME
				pos = pos[0];
			} else {
				//target path points to VALUE
				pos = pos[1];
			}
		} else {
			pos = prev._loc;
		}
		return pos;
	}


	//field for storing the last validated JSON grammar (-> check against this to determine, if re-validation is necessary)
	var _thePrevValidatedJSONgrammar;
	
	function _createValidator(editor, errorMarkerId, warningMarkerId, infoMarkerId){
			
		var ERROR_MARKER = errorMarkerId;
		var WARNING_MARKER = warningMarkerId;
		var BOOKMARK_MARKER = infoMarkerId;
	
		return function validateJsonGrammar() {
	
			if (!editor.val()) {
				_thePrevValidatedJSONgrammar = null;
				return;////////////////////////// EARLY EXIT //////////////////////////
			}
	
			//convert content of editor-view to JSON object
			// (do not continue, if it is not a JSON ...)
			var grammarText = editor.val();
			var jsonGrammar;
			try {
	
				jsonGrammar = JSON.parse(grammarText);
				//force errors for duplicate properties using eval() (normal JSON parsing just takes the 2nd one silently...):
				// NOTE: using JSON.parse first is a "security" measure -> if grammarText would not be a JSON object, then we would not get to the eval()...
				/*jsonGrammar = */eval('function create(){"use strict"\n return '
						+ grammarText + ';};create()');
				if (typeof jsonGrammar !== 'object') {
					return;////////////////////////// EARLY EXIT //////////////////////////
				}
	
			} catch (exc) {
	
				_thePrevValidatedJSONgrammar = null;
				editor.removeAllErrorMarkers();
	
				//create marker for errornous JSON:
				//try to get more details for the error using the json-lint parser:
				try {
					jsonparser.setStrict(true);
					jsonparser.setLocEnabled(true);
	
					jsonparser.parse(grammarText);
	
					jsonparser.setStrict(false);
					jsonparser.setLocEnabled(false);
				} catch (err) {
	
					var msg = err.toString();
	
					var start, end, loc;
					if (err._loc) {
	
						loc = getOffsetFor(editor, err._loc);
						start = loc.start;
						end = loc.end;
	
					} else {
	
						//msg text -> e.g.:		Error: Parse error on line 5:...
						var detectLineNo = /on line (\d+):/igm;
						var match = detectLineNo.exec(msg);
	
						var lineNo;
						if (match) {
							lineNo = match[1];
						}
	
						start = editor.getLineStart(lineNo - 1);
						end = editor.getModel().getLineEnd(lineNo - 1);
	
					}
	
					//remove line information from message (since the marker already points to this position)
					msg = msg.replace(/ on line (\d+):/igm, ':');
					editor.addMarker(ERROR_MARKER, start, end, msg);
	
					//if there is information about the other / related element that caused the error:
					//  set a warning-marker for that element 
					if (err._locTo) {
						loc = getOffsetFor(editor, err._locTo);
						editor.addMarker(WARNING_MARKER, loc.start, loc.end, msg);
					}
				}
	
				return;////////////////////////// EARLY EXIT //////////////////////////
			}
	
			//only re-validate, if the resulting JSON grammar differs from the last validated one
			if (util.isEqual(_thePrevValidatedJSONgrammar, jsonGrammar)) {
//				editor.fireJsonChanged(false);
				return;////////////////////////// EARLY EXIT //////////////////////////
			}
			//remember current JSON grammar for next validation:
			_thePrevValidatedJSONgrammar = $.extend({}, jsonGrammar);

//			editor.fireJsonChanged(true);
	
			editor.removeAllErrorMarkers();
	
			var validator = new GrammarValidator(jsonGrammar);
	
			var problems = validator.validateStructure();
	
			var problems2 = validator.validateIdDuplicates();
			var problems3 = validator.validateTokenDuplicates();
			var problems4 = validator.validateUtteranceDuplicates();
			var problems5 = validator.validateStopwords();
	
			var list = problems.concat(problems2, problems3, problems4, problems5);
			if (list.length) {
				//debug:
				if (false)
					util.printError('Validation errors for JSON grammar:\n--------------\n'
							+ list.map(function(v) {
								return '  ' + v.toString();
							}).join('\n') + '\n--------------\n');
	
				jsonparser.setLocEnabled(true);
				var result = jsonparser.parse(editor.val());
				jsonparser.setLocEnabled(false);
	
				var e, pos, otherMatch, otherPath, otherPos, otherStr;
				for (var i = 0, size = list.length; i < size; ++i) {
					e = list[i];
					pos = getPosInJson(result, e.location);
					pos = getOffsetFor(editor, pos);
	
					if (!pos) {
						console.warn('could not create marker for '
								+ JSON.stringify(e));
						continue;
					}
	
					//heuristic "at {...}" may signify another location in JSON, to which this error/warning refers to
					// -> try to extract this "target location"
					if (otherMatch = /at \{(.*?)\}/igm.exec(e.message)) {
						otherPath = otherMatch[1].split('.');
						otherPos = getPosInJson(result, otherPath);
						otherStr = ' in line ' + otherPos.first_line;
					} else {
						otherStr = '';
					}
	
					var type = e.level === 'ERROR' ? ERROR_MARKER : WARNING_MARKER;
					editor
							.addMarker(type, pos.start, pos.end, e.message
									+ otherStr);
				}
			}
		}
	}
	
	function _validateJson(text, errorHandler){
		
		//console.info('gammar-text: \n'+text);
		
		var jsonObj;
		try {
			jsonObj = JSON.parse(text);
		} catch (error) {

			console.error('error: ' + error.stack);

			var msg = error.toString();

			//try to get more details for the error using the json-lint parser:
			try {

				var result = jsonparser.parse(text);

				if (result) {
					msg += '\n\nsuccess:\n' + JSON.stringify(result, null, 2);
				}

			} catch (err) {
				msg = err.toString();
			}

			
			//msg text -> e.g.:		Error: Parse error on line 5:
			//							...",    "switch"    "turn",    "turned"
			//						---------------------^
			//						Expecting 'EOF', '}', ':', ',', ']', got 'STRING'
			var detectLineNo = /on line (\d+):/igm;
			var match = detectLineNo.exec(msg);

			var lineNo;
			if (match) {
				lineNo = match[1];
			}
			
			if(errorHandler){
				errorHandler( {
					message: msg,
					line: lineNo
				});
			}
			
			return false;
		}
		
		return jsonObj;
	}
	
	/**
	 * 
	 * Verifies the viewModel's compiled JavaScript Grammar:
	 * if invalid JavaScript was generated, errors are printed via
	 * <code>util._error()</code>
	 * 
	 */
	function _validateJsEvalErrors(viewModel) {

		var currentGrammar = viewModel.getGrammarConverter();
		var grammarId = viewModel.id;
		if (currentGrammar.executeGrammar.hasErrors) {
			var jsParser = require('esprima');
			var text = currentGrammar.getJSGrammar();

			try {
				var syntax = jsParser.parse(text, {
					tolerant : true,
					loc : true
				});
				var errors = syntax.errors;

				if (errors.length > 0) {
					util._error('Invalid JavaScript code for grammar "' + grammarId
							+ '". Total issues: ' + errors.length);
					for (var i = 0; i < errors.length; i += 1) {
						util._error('    At ' + _getLocationAsString(errors[i])
								+ ': ' + errors[i].description);
					}
				}
			} catch (err) {
				util._error(err.description + ' in JavaScript code for grammar "'
						+ grammarId + '" at ' + _getLocationAsString(err));
				
				console.error(err);//FIXME debug
			}
		}
	}
	/** HELPER for _validateJsEvalErrors */
	function _getLocationAsString(e) {
		return 'line ' + e.lineNumber + ':' + e.column + '(offset '
				+ e.index + ')';
	};
	
	
	return {
		/**
		 * 
		 * @param {OrionEditor} grammarEditor
		 * 			see grammarEditor.js
		 */
		initGrammarValidator: function(grammarEditor, errorMarkerTypeId, warningMarkerTypeId, infoMarkerTypeId){
			this._grammarValidator = _createValidator(grammarEditor, errorMarkerTypeId, warningMarkerTypeId, infoMarkerTypeId);
			return this._grammarValidator;
		},
		validateGrammar: function(){
			this._grammarValidator();
		},
		resetGrammarValidation: function(){
			_thePrevValidatedJSONgrammar = null;
		},
		validateJson: _validateJson,
		validateCompiledGrammar: _validateJsEvalErrors
	};
});