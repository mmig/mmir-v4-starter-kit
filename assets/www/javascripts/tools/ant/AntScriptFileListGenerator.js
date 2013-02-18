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
 * Script for generating a JSON formatted String
 * of a file-list.
 * 
 * This script required to run in the context of an ANT build script.
 * 
 * The generated JSON String is stored into the ANT property JSONDirString.
 * 
 * TODO separate ANT accessing code from re-usable code
 */

function echo(text){
	var echo = project.createTask("echo");
	echo.setMessage(text);
	echo.perform();
}


/**
 * Generates JSON-Object from fileString
 *  (e.g. "application/login.ehtml;application/registration.ehtml") 
 * by splitting the string at ";" and creating a JSON string.
 */
function getJSONFromFileList(dir, fileString){
	// split fileString to array
	var fileArray = fileString.split(";");
	//get rid of the 'www' prefix
	var dirString = dir+'';
	if (dirString.substring(0,3)=="www")
		dirString = dir.slice(3);
	else dirString = "/../"+dir;
	// create JSON-Element/Property with dir as name and an array as value
	// var jsonString = '"'+project.getProperty("pathPrefix")+dir+'":[';
	var jsonString = '"'+dirString+'":[';
	
	var boolFirst = true;
	for (var i=0; i<fileArray.length;i++){
		if (boolFirst == false){
			jsonString = jsonString + ',';
		}
		jsonString = jsonString + '"' + fileArray[i] + '"';
		boolFirst = false;
	}
	jsonString = jsonString+']';
	
	return jsonString;
}

function getFileListForDir(dir, filter){
	if (dir == null){
		return null
	}
	
	// create task with macro getFilelist
	var fileListTask = project.createTask("getFilelist");
	fileListTask.setDynamicAttribute("srcdir", dir);
	fileListTask.setDynamicAttribute("returnproperty", dir);
	
	// set Filter if not null
	if ((filter != null) && (filter != undefined)){
		fileListTask.setDynamicAttribute("filter", filter);
	}
	
	fileListTask.execute();
	return project.getProperty(dir);
}

/**
 * Generates a List of directories for a given directory
 */
function getDirListForDir(dir, filter){
	var dirprop = "dir_"+dir;
	
	if (dir == null){
		return null
	}
	
	// create task with macro getFilelist
	var fileListTask = project.createTask("getDirlist");
	fileListTask.setDynamicAttribute("srcdir", dir);
	fileListTask.setDynamicAttribute("returnproperty", dirprop);
	
	// set Filter if not null
	if ((filter != null) && (filter != undefined)){
		fileListTask.setDynamicAttribute("filter", filter);
	}
	
	fileListTask.execute();
	return project.getProperty(dirprop);
}

function parseDirectoriesRecursively(basedir,dir){
	var filelist = getFileListForDir(basedir+dir, "*");
	filelist = filelist.replace("\\", "/");
	var jsonFileContents = getJSONFromFileList(dir, filelist);

	var dirlist = getDirListForDir(basedir+dir, "*");
	var dirlistArray = dirlist.split(";");
	for (var j=0; j<dirlistArray.length;j++){
		if (dirlistArray[j] != ""){
			jsonFileContents = jsonFileContents + ",";
			jsonFileContents = jsonFileContents + parseDirectoriesRecursively(basedir, dir+"/"+dirlistArray[j]);
		}
	}
	return jsonFileContents; 
}

// read the property directoriesToParse, which contains a comma-separated list with directories to parse
var directoriesToParse = new String(project.getProperty("directoriesToParse"));
var directoriesToParseArray = directoriesToParse.split(",");

// get the base dir property
var basedir = new String(project.getProperty("baseDir"));

var JSONDirString = "{";

// For the correct generation of commas (",") 
var boolFirst = true;
echo('Creating JSON String: scanning directories...');
for (var i in directoriesToParseArray){
	echo('\t'+directoriesToParseArray[i]);
	if (boolFirst == false){
		JSONDirString = JSONDirString + ',';
	}
	JSONDirString = JSONDirString + parseDirectoriesRecursively(basedir, directoriesToParseArray[i]);
	boolFirst = false;
}
JSONDirString = JSONDirString + "}";
project.setProperty("JSONDirString", JSONDirString);
echo("done.");