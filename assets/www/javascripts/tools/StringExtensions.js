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
 * JavaScript extensions for String type
 *
 */

/**
 * Check if the String starts with token
 */
String.prototype.startsWith = function (token, ignoreCase) {
    /// <summary>
    /// Check if the String starts with token
    /// </summary>
    /// <param name="token" type="String">
    ///     the token to check for
    /// </param>
    /// <param name="ignoreCase" type="Boolean">
    ///     (optional) if <code>true</code> checking will ignore case of characters.
	///		Default is <code>false</code>.
    /// </param>
    /// <returns type="Boolean">
    ///     true, if the String starts with token, otherwise false.
    ///     Note, that if token is not of type String, the function returns always false.
    /// </returns>
    var str, isStarting = false;
    var isIgnoreCase = typeof ignoreCase !== 'undefined' && ignoreCase == true;
    if(isIgnoreCase){
    	token = token.toLowerCaser();
    	str = this.toLowerCase();
    }
    else {
    	str = this;
    }
    
    if (typeof token === "string") {
        isStarting = str.lastIndexOf(token, 0) === 0;
    }
    return isStarting;
};

/**
* ReplaceAll by Fagner Brack (MIT License)
*
* Replaces all occurrences of a substring in a string
*/
String.prototype.replaceAll = function (token, newToken, ignoreCase) {
    /// <summary>
    /// Replace all occurances of a String with a new String
    /// </summary>
    /// <param name="token">the String to replace (all its occurances)</param>
    /// <param name="newToken">the new String for the replacement</param>
    /// <param name="ignoreCase">
    ///     if true, the String token is matched/searched for without
    ///     taking case into account
    /// </param>
    /// <returns type="String">
    ///     a new String in which all occurances of token are replaced by newToken.
    ///     If token or newToken are not Strings, the unmodified String will be returned.
    /// </returns>
    var str, i = -1, _token;
    if ((str = this.toString()) && typeof token === "string" && typeof newToken === "string") {
        _token = ignoreCase === true ? token.toLowerCase() : undefined;
        while ((i = (
            _token !== undefined ?
                str.toLowerCase().indexOf(
                            _token,
                            i >= 0 ? i + newToken.length : 0
                ) : str.indexOf(
                            token,
                            i >= 0 ? i + newToken.length : 0
                )
        )) !== -1) {
            str = str.substring(0, i)
                    .concat(newToken)
                    .concat(str.substring(i + token.length));
        }
    }
    return str;
};

/**
 * Escape quotes, i.e. replace single quotes <code>'</code> with <code>\'</code> 
 */
String.prototype.escapeQuotes = function () {
    var str;
    if (str = this.toString()) {
        return str.replaceAll('\'', '\\\'', false);
    } else if(str == ''){
    	return str;
    }
    throw new Error('Error in String.escapeQuotes: This is not a string: '+ (typeof this));
};

/**
 * Escape double quotes, i.e. replace quotes <code>"</code> with <code>\"</code> 
 */
String.prototype.escapeDoubleQuotes = function () {
    var str;
    if (str = this.toString()) {
        return str.replaceAll('"', '\\"', false);
    } else if(str == ''){
    	return str;
    }
    throw new Error('Error in String.escapeDoubleQuotes: This is not a string: '+ (typeof this));
};

/**
 * Un-escape quotes, i.e. replace escaped single quotes <code>\'</code> with <code>'</code> 
 */
String.prototype.unescapeQuotes = function () {
    var str;
    if (str = this.toString()) {
        return str.replaceAll('\\\'', '\'', false);
    } else if(str == ''){
    	return str;
    }
    throw new Error('Error in String.unescapeQuotes: This is not a string: '+ (typeof this));
};

/**
 * Un-escape double quotes, i.e. replace escaped quotes <code>\"</code> with <code>"</code> 
 */
String.prototype.unescapeDoubleQuotes = function () {
    var str;
    if (str = this.toString()) {
        return str.replaceAll('\\"', '"', false);
    } else if(str == ''){
    	return str;
    }
    throw new Error('Error in String.unescapeDoubleQuotes: This is not a string: '+ (typeof this));
};

//TRIM function: only define, if the platform does not provide it already
if (!String.prototype.trim) {
	
   console.info('WARNING: No String.trim() function defined, extending String with custom trim() function...');
   
   String.prototype.trim = function(){
	   return this
	   			.replace(/^\s\s*/, '') //remove whitespace at start...
	   			.replace(/\s\s*$/, '');//... and whitespaces at the end of the String
   };
}


if(String.prototype.htmlEncode == null){
/*
 * HTML Encoding (htmlEncode.js)
 * 
 * Modification:
 * Copyright (c) 2012 Aaron Russ
 * 
 * Based on:
 * HTMLEncode - Encode HTML special characters.
 * Copyright (c) 2006-2010 Thomas Peri, http://www.tumuski.com/
 * MIT License
*/
/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true,
	plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true */
/**
 * HTML-Encode the supplied input
 * 
 * Parameters:
 *
 * this/source {string}    
 *                     The text to be encoded.
 * 
 * @param display {boolean}
 *                     (optional)
 *                     The output is intended for display.
 *
 *                     If true (or undefined):
 *                     * Tabs will be expanded to the number of spaces 
 *                       indicated by the 'tabs' argument.
 *                     * Line breaks will be converted to <br />.
 *
 *                     If false:
 *                     * Tabs and linebreaks get turned into &#____;
 *                       entities just like all other control characters.
 *
 * @param tabs {number}
 *                     (optional)
 *                     The number of spaces to expand tabs to.  
 *                     (Ignored if the 'display' parameter evaluates to false 
 *                      or if tabs is not >= 0.)
 *                      
 *                     Default: undefined (do not replace tabs with spaces)
 *
 * version 2010-11-08 (modified: 2012-12-20)
 */	

	String.prototype.htmlEncode = function (display, tabs) {
		var i, s, ch, peek, line, result,
			next, endline, push,
			spaces, source = this;
		
		//'parse' parameters
		if(typeof display === 'number'){
			//use as tabs-parameter
			tabs = display;
			display = true;
		} else if(typeof display === 'undefined'){
			display = true;
		}
		if(typeof tabs === 'string'){
			tabs = parseInt(tabs,10);
		} else if(typeof tabs === 'number'){
			tabs = Math.floor(tabs);
		} else {
			tabs = -1;
		}
		
		// Stash the next character and advance the pointer
		next = function () {
			peek = source.charAt(i);
			i += 1;
		};
		
		// Start a new "line" of output, to be joined later by <br />
		endline = function () {
			line = line.join('');
			if (display) {
				// If a line starts or ends with a space, it evaporates in html
				// unless it's an nbsp.
				line = line.replace(/(^ )|( $)/g, '&nbsp;');
			}
			result.push(line);
			line = [];
		};
		
		// Push a character or its entity onto the current line
		push = function () {
			if (ch < ' ' || ch > '~') {
				line.push('&#' + ch.charCodeAt(0) + ';');
			} else {
				line.push(ch);
			}
		};
		
		
		result = [];
		line = [];
	
		i = 0;
		next();
		while (i <= source.length) { // less than or equal, because i is always one ahead
			ch = peek;
			next();
			
			// HTML special chars.
			switch (ch) {
			case '<':
				line.push('&lt;');
				break;
			case '>':
				line.push('&gt;');
				break;
			case '&':
				line.push('&amp;');
				break;
			case '"':
				line.push('&quot;');
				break;
			case "'":
				line.push('&#39;');
				break;
			default:
				// If the output is intended for display,
				// then end lines on newlines, and replace tabs with spaces.
				if (display) {
					switch (ch) {
					case '\r':
						// If this \r is the beginning of a \r\n, skip over the \n part.
						if (peek === '\n') {
							next();
						}
						endline();
						break;
					case '\n':
						endline();
						break;
					case '\t':
						// expand tabs?
						if(tabs >= 0){
							spaces = tabs - (line.length % tabs);
							for (s = 0; s < spaces; s += 1) {
								line.push(' ');
							}
						} else{
							//otherwise: preserve tabs
							push('&#9;');
						}
						break;
					default:
						// All other characters can be dealt with generically.
						push();
					}
				} else {
					// If the output is not for display,
					// then none of the characters need special treatment.
					push();
				}
			}
		}
		endline();
		
		// If you can't beat 'em, join 'em.
		result = result.join('<br />');
	
		if (display) {
			// Break up contiguous blocks of spaces with non-breaking spaces
			result = result.replace(/ {2}/g, ' &nbsp;');
		}
		
		// tada!
		return result;
	};

}