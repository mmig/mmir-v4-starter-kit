

var DOMParser = require('./../../nodejs-xmldom').DOMParser,
	fs = require('fs'),
	esprima = require('./../../nodejs-esprima'),
	oncomplete = require('./oncomplete.js');

//range around the (JavaScript) error which should be used for
//the (source code) excerpt that is used in the error description 
var CONTEXT_RANGE = 15;

var nl = '\n';//TODO use env-specific NEWLINE char(s)


function _getJsLoc(offsetLine, offsetCol, err, isAttribute){
	
	var line = err.lineNumber - 1, col = err.column;	
	if(line === 0 && !isAttribute){
		col += offsetCol;
	}
	
	line += offsetLine;
	
	return {l: line, c: col};
}

//ctx.range NUMBER context range around the error location which will be used for indicating/"showing" the error in the error-description
function _getJsLocDesc(err, srcText, ctx){
	
	var contextRange = ctx.range;
	var i = err.index;
	var len = srcText.length;
	var start = Math.max(0, i - contextRange);
	var descIndex = start === 0? i : contextRange;
	var end = Math.min(len, len + contextRange);
	
	var desc = srcText.substring(start, end);
	
	if(/\r|\n/.test(desc)){
		
		var adjustStart = -1, adjustEnd = -1, start = 0, end = desc.length;
		
		desc.replace(/\r?\n|\r/gm, function(match, offset){
			if(offset < descIndex) adjustStart = offset + match.length;//<- adjust, so that desc starts at LAST linebreak BEFORE error
			else if(adjustEnd === -1) adjustEnd = offset;//<- adjust so sthat desc ends at FIRST linebreak AFTER error
			return match;
		});
		
		if(adjustStart !== -1){
			
			start = adjustStart;
			descIndex -= adjustStart;
		}
		
		if(adjustEnd !== -1){
			
			end = adjustEnd;
		}
		
		desc = desc.substring(start, end);

	}
	
	//create description-line (enclosed in quotes) and pointer to error location in next line
	var sb = ['"', desc, '"', nl, ' '];
	for(var j=0; j < descIndex; ++j){
		sb.push(' ');
	}
	sb.push('^');//<- add error-pointer
	
	return sb.join('');
	
}

function _toString(errorList, node, srcText, isAttribute, ctx){
	
	isAttribute = typeof isAttribute === 'undefined'? false : isAttribute;
	
	var srcLine = node.lineNumber;
	var srcCol = node.columnNumber;
	
	var sb = [], err, loc, locDesc;
	
	for(var i=0,size=errorList.length; i < size; ++i){
		err = errorList[i];
		loc = _getJsLoc(srcLine, srcCol, err, isAttribute);
		locDesc = _getJsLocDesc(err, srcText, ctx);
		
		sb.push(err.description);
		if(!isAttribute){
			sb.push(' (line ', loc.l, ', column ', loc.c, ')');
		} else {
			//there is no exact column/position available for the attribute with the node ...
			// -> just output the attribute-name and the column within the value-string of the attribute
			sb.push(' (at position ', loc.c, ' in line ', loc.l, ' in the value string of attribute ', isAttribute, ')');
		}

		sb.push(nl, locDesc, nl);
	}
	
	return sb.join('');
	
}

function _getSyntaxErrors(node, ctx, attrib){
	
	var src = attrib? 
			node.getAttribute(attrib) :
			node.textContent;//TODO consider CDATASection <![CDATA[ ... ]]>, etc
	
	try{
		
		syntax = esprima.parse(src, {
			tolerant: true
		});
		
	} catch(err){
		syntax = {
			errors: [err]
		};
	}
	
	if (syntax.errors.length !== 0) {
		return _toString(syntax.errors, node, src, attrib, ctx);	
	}
	return false;
}

function _getXml(path, callback){
	
	var doc, xml, err;
	fs.readFile(path, 'utf-8', function(e,xml){

		if(e){
			callback(e);
			return;
		}
		
		doc = new DOMParser({
			locator: {},
			errorHandler: function(level, msg) {
				err = new Error(path + "\tnot valid: "+level+", "+msg);
			}
		}).parseFromString(xml, 'text/xml');
		
		callback(err, doc, xml)
	});
}

//TODO add support for src attribute
function _validateScriptTags(doc, ctx){
	var scripts, script, errStr, xmlerror;
	var contextRange = ctx.range, doFail = ctx.fail;
	
	scripts = doc.getElementsByTagName('script');
	if(scripts){
		
		for(var i=0,size=scripts.length; i < size; ++i){
			
			script = scripts[i];
			errStr = _getSyntaxErrors(script, ctx);
			
			if (!errStr) {
//				if (params.verbose) {
//					grunt.log.ok();
//				}
			} else {
				xmlerror = doFail(ctx.file + "\tJavaScript Syntax Error for <script> at line "+script.lineNumber+", column "+script.columnNumber+": "+ errStr);
//				return console.error(xmlerror);
			}
		}
	}
}

function _validateTransitionTags(doc, ctx){
	var nodes, node, errStr, xmlerror;
	var contextRange = ctx.range, doFail = ctx.fail;
	
	nodes = doc.getElementsByTagName('transition');
	if(nodes){
		
		for(var i=0,size=nodes.length; i < size; ++i){
			
			node = nodes[i];
			if(node.hasAttribute('cond')){
				
				errStr = _getSyntaxErrors(node, ctx, 'cond');
				
				if (!errStr) {
//					if (params.verbose) {
//						grunt.log.ok();
//					}
				} else {
					xmlerror = doFail(ctx.file + "\tJavaScript Syntax Error for cond attribute at line "+node.lineNumber+", column "+node.columnNumber+": "+ errStr);
//					return console.error(xmlError);
				}
			}
		}
	}
}

function validateScxmlFiles(listener, filesSrc, options){
	
	var fail = false;
	var errors = [];
	var doFail = function(error){
		fail = true, err = error;
		if(typeof error === 'string'){
			err = new Error(err);
		}
		errors.push(err);
		return err;
	}
	
	var contextRange = options && typeof options.errorContextRange === 'number'? options.errorContextRange : CONTEXT_RANGE;

	var ctx = {
		range: contextRange,
		fail: doFail
	};
	
	var runner = new oncomplete();
	if(listener){
		runner.oncomplete(listener);
	}
	
	var totalFiles = filesSrc.length;
	var processedFiles = 0;
	var processComplete = function(){
		
		if(++processedFiles >= totalFiles){
			runner.setCompleted(fail? errors : void(0));
		}
	}
	
	filesSrc.forEach(function(f) { _getXml(f, function(e, doc){
		var doc, scripts, nodes, xmlerror;
		
		if(e){
			doFail(e)
			processComplete();
			return;
		}
		
		ctx.file = f;
		
	//	console.log(doc);
		
		_validateScriptTags(doc, ctx);
		
		//TODO parse all possible JS errors, e.g. cond-attribute in <transition>, <if>,... etc
		_validateTransitionTags(doc, ctx);
		
		//TODO validate target-attribute: ensure target state exists
		//TODO validate data-model expr id, assign expr location
		
		processComplete();
	});});
}

module.exports.run = function(listener, options){
	
	var fileList = options.files;
	validateScxmlFiles(listener, fileList, options);
};
