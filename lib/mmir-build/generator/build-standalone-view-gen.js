
var gen = require('./generator.js');
var properties = require('../../nodejs-properties');

var templateFile = 'generate-views.template';
var renderedTemplateFile = 'generate-views-script.js';

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
	renderedTemplateFile = config.buildDirTempJS + config.tempCompileTemplateParserGeneratorJSExecFile;

	config.isAntTarget = !!isAntTarget;
	config.isAntTargetStr = '' + config.isAntTarget;
	
	if(isAntTarget){
		
		config.isAntTarget = true;
		
		renderedTemplateFile = config.antScriptViewsTemplate;
		
		var fs = require('fs');
		var prefixFile = config.jsBuildDirBase + 'templates/ant-script-view-prefix.template';
		var suffixFile = config.jsBuildDirBase + 'templates/ant-script-view-suffix.template';
		config._prependAnt = fs.readFileSync(prefixFile, 'utf8');
		config._appendAnt  = fs.readFileSync(suffixFile, 'utf8');
	}

	var includeFiles = {
		
		'InitNodeJsEnv.js': 				'${jsBuildDirBase}'+ (!isAntTarget? 'nodejs/InitNodeJsEnv.js' 					: 'rhino/InitRhinoEnv.js'),
		'InitTemplateParserNodeJsEnv.js': 	'${jsBuildDirBase}'+ (!isAntTarget? 'nodejs/InitTemplateParserNodeJsEnv.js' 	: 'rhino/InitTemplateParserRhinoEnv.js'),
		'NodeJsFileHandler.js': 			'${jsBuildDirBase}'+ (!isAntTarget? 'nodejs/NodeJsFileHandler.js' 				: 'ant/AntFileHandler.js'),
				
		'mainConfig.js': 					'${jsSrcDirBase}mainConfig.js',
		'antlr3-all.js': 					'${jsSrcDirBase}vendor/libs/antlr3-all.js',
		'ES3Lexer.js': 						'${jsSrcDirBase}gen/parser/ES3Lexer.js',
		'ES3Parser.js': 					'${jsSrcDirBase}gen/parser/ES3Parser.js',
		'MmirES3Walker.js': 				'${jsSrcDirBase}gen/parser/MmirES3Walker.js',
		'MmirScriptContentLexer.js': 		'${jsSrcDirBase}gen/parser/MmirScriptContentLexer.js',
		'MmirScriptContentParser.js': 		'${jsSrcDirBase}gen/parser/MmirScriptContentParser.js',
		'MmirScriptLexer.js': 				'${jsSrcDirBase}gen/parser/MmirScriptLexer.js',
		'MmirScriptParser.js': 				'${jsSrcDirBase}gen/parser/MmirScriptParser.js',
		'MmirTemplateLexer.js': 			'${jsSrcDirBase}gen/parser/MmirTemplateLexer.js',
		'MmirTemplateParser.js': 			'${jsSrcDirBase}gen/parser/MmirTemplateParser.js',
		'parsingResult.js': 				'${jsSrcDirBase}mvc/parser/parsingResult.js',
		'md5.js': 							'${jsSrcDirBase}vendor/libs/md5.js',
		'jsonlint.parser.js': 				'${buildDirLib}jsonlint.parser.js',
		'StandaloneTemplateParserExec.js': 	'${jsBuildDirBase}ant/StandaloneTemplateParserExec.js'
	};

	//process(templateFile, targetFile, includeFiles, context)
	gen.process(templateFile, renderedTemplateFile, includeFiles, config);
	
});
