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
 * This JavaScript is expected to run in the Rhino environment 
 * (i.e. with access to Java classes).
 */

importClass(java.io.File);
importClass(java.io.FileReader);
importClass(java.io.FileWriter);
importClass(java.io.LineNumberReader);

function loadLocalFile(path){
	
	var f = new File(path);
	
	console.log('reading: json file exists? '+f.exists());
	
	var r = new LineNumberReader(new FileReader(f));
	
	var line;
	var theJSONgrammarString = '';
	while ((line = r.readLine()) != null) {
		theJSONgrammarString += line;
	}
	r.close();
	
	console.log('read contents from file: '+path);
	
	return JSON.parse(theJSONgrammarString);
}

function saveToFile(str, path){
	
	if(typeof str !== 'string'){
		str = JSON.stringify(str, null, '  ');
	}
	
	var f = new File(path);
	
	console.log('writing: file exists (overwriting)? '+f.exists());
	
	var r = new FileWriter(f, false);
	
	r.write(str);
	
	r.close();
	
	console.log('wrote String (len '+str.length+') to file: '+path);
}