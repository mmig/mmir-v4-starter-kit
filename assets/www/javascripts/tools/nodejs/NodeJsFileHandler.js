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
 */

var FILE_SYSTEM = require('fs');

function loadLocalFile(path){
	
	console.log('reading: json file exists? '+FILE_SYSTEM.existsSync(path));
	
	var theJSONgrammarString = FILE_SYSTEM.readFileSync(path, 'utf8');

	console.log('read contents from file: '+path);
	
	return JSON.parse(theJSONgrammarString);
}

function saveToFile(str, path){
	
	if(typeof str !== 'string'){
		str = JSON.stringify(str, null, '  ');
	}
//	
	console.log('writing: file exists (overwriting)? '+FILE_SYSTEM.existsSync(path));
	
//	var r = new FileWriter(f, false);
	
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