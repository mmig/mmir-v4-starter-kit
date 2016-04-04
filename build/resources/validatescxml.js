


var DOMParser = require('xmldom').DOMParser,
	fs = require('fs'),
	esprima = require('esprima');


var filesSrc = [ 'www/config/statedef/inputDescriptionSCXML.xml', 'www/config/statedef/dialogDescriptionSCXML.xml' ];
//var filesSrc = [ 'www/config/statedef/test.xml'];
var fail = false;


var _getJsLoc = function(offsetLine, offsetCol, err){
	
	var line = err.lineNumber - 1, col = err.column;
	if(line === 0){
		col += offsetCol;
	}
	
	line += offsetLine;
	
	return {l: line, c: col};
};

var _toString = function(errorList, node, isContent){
	
	isContent = typeof isContent === 'undefined'? true : isContent;
	
	var srcLine = node.lineNumber;
	var srcCol = node.columnNumber;
	
	var sb = [], err, loc;
	
	for(var i=0,size=errorList.length; i < size; ++i){
		err = errorList[i];
		loc = _getJsLoc(srcLine, srcCol, err);
		
		sb.push('\tSyntaxError: ', err.description, ' (line ', loc.l, ', column ', loc.c, ')\n');
	}
	
	return sb.join('');
	
};

var _getSyntaxErrors = function(node, attrib){
	
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
		return _toString(syntax.errors, node);	
	}
	return false;
};

filesSrc.forEach(function(f) {
	var doc, xml, scripts, nodes;
	xml = fs.readFileSync(f, 'utf-8');
	doc = new DOMParser({
		locator: {},
		errorHandler: function(level, msg) {
			fail = true;
			return console.error(f + "\tnot valid: "+level+", "+msg);
		}
	}).parseFromString(xml, 'text/xml');
	
//	console.log(doc);
	
	scripts = doc.getElementsByTagName('script');
	if(scripts){
		
		for(var i=0,size=scripts.length; i < size; ++i){
			var script, errStr; 
			
			script = scripts[i];
			errStr = _getSyntaxErrors(script);
			
			
			if (!errStr) {
//				if (params.verbose) {
//					grunt.log.ok();
//				}
			} else {
				fail = true;
				return console.error("\tSyntax Error for <script> at line "+script.lineNumber+", column "+script.columnNumber+": "+ errStr);	
			}
		}
	}
	
	//TODO parse JS in cond-attribute
	if(nodes){
		
		for(var i=0,size=nodes.length; i < size; ++i){
			var node = nodes[i];
			if(node.hasAttribute('cond')){
				
				var errStr = _getSyntaxErrors(scripts[i], 'cond');
				
				if (!errStr) {
//					if (params.verbose) {
//						grunt.log.ok();
//					}
				} else {
					fail = true;
					return console.error("\tSyntax Error for cond attribute at line "+node.lineNumber+", column "+node.columnNumber+": "+ errStr);	
				}
			}
		}
	}
	
	//TODO validate target-attribute: ensure target state exists
	//TODO validate data-model expr id, assign expr location
	
});

process.exit(fail? 1 : 0);
