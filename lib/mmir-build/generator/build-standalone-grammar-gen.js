
var gen = require('./generator.js');
var properties = require('../../nodejs-properties');


var templateFile = 'generate-grammars.template';
var renderedTemplateFile = 'generate-grammars-script.js';

var isAntTarget = false;

//command line param 1: STRING 'true': if present and true, ANT build-script will be generated instead of Node.js build script
if(process.argv.length > 1){
	isAntTarget = /true/.test(process.argv[2]);
}

properties.parse('mmir-build.properties', {path: true, variables: true}, function(error, config){

	if(error){
		return console.error(error);
	}
	
	templateFile = config.jsBuildDirBase + 'templates/' + templateFile;
	renderedTemplateFile = config.buildDirTempJS + config.tempCompileGrammarParserGeneratorJSFile;
	
	config.isAntTarget = !!isAntTarget;
	config.isAntTargetStr = '' + config.isAntTarget;
	
	if(isAntTarget){
		
		config.isAntTarget = true;
		
		renderedTemplateFile = config.antScriptGrammarsTemplate;

		var fs = require('fs');
		var prefixFile = config.jsBuildDirBase + 'templates/ant-script-grammar-prefix.template';
		var suffixFile = config.jsBuildDirBase + 'templates/ant-script-grammar-suffix.template';
		config._prependAnt = fs.readFileSync(prefixFile, 'utf8');
		config._appendAnt  = fs.readFileSync(suffixFile, 'utf8');
		
	}

	var includeFiles = {
	
		'InitNodeJsEnv.js': 						'${jsBuildDirBase}'+ (!isAntTarget? 'nodejs/InitNodeJsEnv.js' 					: 'rhino/InitRhinoEnv.js'),
		'InitGrammarGeneratorNodeJsEnv.js': 		'${jsBuildDirBase}'+ (!isAntTarget? 'nodejs/InitGrammarGeneratorNodeJsEnv.js' 	: 'rhino/InitGrammarGeneratorRhinoEnv.js'),
		'NodeJsFileHandler.js': 					'${jsBuildDirBase}'+ (!isAntTarget? 'nodejs/NodeJsFileHandler.js' 				: 'ant/AntFileHandler.js'),
		
		'mainConfig.js': 							'${jsSrcDirBase}mainConfig.js',
		'peg-0.8.0.js': 							'${jsSrcDirBase}vendor/libs/peg-0.8.0.js',
		'jison.js': 								'${jsSrcDirBase}vendor/libs/jison.js',
		'md5.js': 									'${jsSrcDirBase}vendor/libs/md5.js',
		'jsonlint.parser.js': 						'${buildDirLib}jsonlint.parser.js',
		'StandaloneSemanticParserCompileExec.js': 	'${jsBuildDirBase}ant/StandaloneSemanticParserCompileExec.js'
	};
	
	//process(templateFile, targetFile, includeFiles, context)
	gen.process(templateFile, renderedTemplateFile, includeFiles, config);

});
