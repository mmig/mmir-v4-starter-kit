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

/**
 * Add implementation for each-function for Array objects.
 * 
 * This each-function emulates the Query each-function for Arrays.
 * 
 * Signature:
 * 
 * <code>arrayObj.each( collection, callback(indexInArray, valueOfElement) )</code>
 */
if (!Array.prototype.each) {
	
	var eachImpl;
	if ($ && $.each) {
		
		eachImpl = function(collection, callback) {
			$.each(collection, callback);
		};
		
	}
	else if (Array.prototype.forEach) {
		eachImpl = function(collection, callback) {

			var eachCallbackWrapper = function(element, index, array){
				callback(index, element);
			};
			
			collection.forEach(eachCallbackWrapper);
		};
	}
	else {
		eachImpl = function(collection, callback ){
			for(var i=0, size = collection.length; i < size; ++i){
				callback(i, collection[i]); 
			}
		};
	}
	
	Array.prototype.each = eachImpl;
}