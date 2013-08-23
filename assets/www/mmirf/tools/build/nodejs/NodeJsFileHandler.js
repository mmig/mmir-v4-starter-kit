/*
 * 	Copyright (C) 2012-2013 DFKI GmbH
 * 	Deutsches Forschungszentrum fuer Kuenstliche Intelligenz
 * 	German Research Center for Artificial Intelligence
 * 	http://www.dfki.de
 * 
 * 	Permission is hereby granted, free of charge, to any person obtaining a 
 * 	copy of this software and associated documentation files (the 
 * 	"Software"), to deal in the Software without restriction, including 
 * 	without limitation the rights to use, copy, modify, merge, publish, 
 * 	distribute, sublicense, and/or sell copies of the Software, and to 
 * 	permit persons to whom the Software is furnished to do so, subject to 
 * 	the following conditions:
 * 
 * 	The above copyright notice and this permission notice shall be included 
 * 	in all copies or substantial portions of the Software.
 * 
 * 	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * 	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 * 	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * 	IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
 * 	CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * 	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * 	SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


/*
 * This JavaScript is expected to run in the node.js environment
 * 
 * SETTINGS:
 *  - isDebugOutput: disable debugging output (console) by setting global variable isDebugOutput to FALSE
 *  
 * EXPORTS:
 * 	- creates global variable FILE_SYSTEM that hold the NodeJS file-system module reference (module js).
 */

var FILE_SYSTEM = require('fs');

var isDebugOutput = typeof isDebugOutput !== 'undefined'? isDebugOutput : true; 

/*
 * see loadLocalFile in IFileHandler.js
 */
function loadLocalFile(path, type){
	
	if(FILE_SYSTEM.existsSync(path) === false){
		throw new Error('error reading file '+path+': file does not exist!');
	}
	
	var fileContent = FILE_SYSTEM.readFileSync(path, 'utf8');

	if(isDebugOutput) console.log('read contents from file: '+path);
	
	if(type && type === 'text'){
		return fileContent;
	}
	
	return JSON.parse(fileContent);
}

/*
 * see saveToFile in IFileHandler.js
 * 
 */
function saveToFile(str, path, doNotOverWrite){
	
	if(typeof str !== 'string'){
		str = JSON.stringify(str, null, '  ');
	}
//	
	if(isDebugOutput) console.log('writing: file exists (overwriting)? '+FILE_SYSTEM.existsSync(path));
	
	if(doNotOverWrite && FILE_SYSTEM.existsSync(path)){
		return;//////////////////////// EARLY EXIT ///////////////////////
	}
	
	var r = FILE_SYSTEM.createWriteStream(path
			//default options:
//			,{	flags: 'w',
//				encoding: null,
//				mode: 0666
//			}
	);
	
	r.write(str);
	r.end();
	r.destroySoon();
	
	console.log('wrote String (len '+str.length+') to file: '+path);
}