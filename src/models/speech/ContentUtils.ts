
const processTextCamelCase = (function(): (text: string, processor?: (buffer: Array<string>, currentSubString: string, index: number) => string) => string {

	var isLowerCase = function(char: string): boolean {//NOTE this function is rather inefficient (but JavaScript
		return char === char.toLowerCase() && char !== char.toUpperCase();
	};
	var isUpperCase = function(char: string): boolean {//NOTE this function is rather inefficient (but JavaScript
		return char === char.toUpperCase() && char !== char.toLowerCase();
	};
	var isCase = function(char: string): boolean {//NOTE this function is rather inefficient (but JavaScript
		return isLowerCase(char) || isUpperCase(char);
	};


	var detectCamelCase = function(str: string, camelCaseProcessor: (buffer: Array<string>, currentSubString: string, index: number) => string): string {

		var LOW = 'low', UP = 'up', NONE = 'none';
		var prev = NONE, current, char;
		var s = str, s2;
		var buffer: Array<string> = [];

		for(var i=0, size = s.length; i < size; ++i){
			char = s.charAt(i);
			if(isLowerCase(char)){
				current = isCase(char) ? LOW : NONE;
			}
			else {
				current = isCase(char) ? UP : NONE;
			}

			if( current === UP  && prev == LOW ){
				//camel-case?
				if(current !== prev){
					s2 = camelCaseProcessor(buffer, s, i);
					if(s !== s2){
						i = -1;
						size = s2.length;
						s = s2;
						current = NONE;
					}
				}
			}

			prev = current;
		}
		buffer.push(s);

		return buffer.join('');
	};

	//buffer: an array-buffer that contains all previously processed (sub-) strings
	//currentSubString: the (sub-) string that is currently processed for CamelCase
	//index: the index within param currentSubString, where a CamelCase was detected
	//
	//returns: a String of the (sub-) string that needs to be further processed
	//		--> generally: if buffer was not modified, currentSubString itself should be returned
	//					   if a prefix of currentSubString was pushed into buffer, the remaining sub-string should be returned
	var handleCamelCase = function(buffer: Array<string>, currentSubString: string, index: number): string {
		buffer.push( currentSubString.substring(0,index) + '. ');
		return currentSubString.substring(index);
	};

	return function(text: string, processor?: (buffer: Array<string>, currentSubString: string, index: number) => string): string {
		return detectCamelCase(text, processor? processor : handleCamelCase);
	};
})();

const processTextNumbers = (function(): (text: string) => string {

	//remove number formatter for GERMAN text, i.e. the non-functional dot:
	// example:     "1.700-2.000  234 2343 234. 1.2 .22 234.798\t 2344.2342.234.234. \n34.242.234.234. "
	// processed -> "1700-2000  234 2343 234. 1.2 .22 234798\t 2344.2342.234.234. \n34242234234. "
	// IGNORE e.g.: 234 .22 2343 234. 23423.242
	var numberDector = /([^\d\.]|^)(\d{1,3}\.(\d{3}\.)*(\d{3}))/igm;

	var rangeDector = /(\d-\d)/igm;

	return function(text: string): string {
		var match: RegExpMatchArray;
		var buffer: Array<string> = [];
		var pos: number = 0;
		while(match = numberDector.exec(text)){
			var strNum = match[2];
			var start = match[1].length;
			var end = match.index + start + strNum.length;

			//append previous text
			buffer.push( text.substring(pos, match.index + start) );

			//append modified number string (removed dots)
			buffer.push( strNum.replace(/\./igm, '') );

			pos = end;
		}

		buffer.push( text.substring(pos) );

		var result1 = buffer.join('');
		buffer = [];
		pos = 0;
		while(match = rangeDector.exec(result1)){
			var strNum = match[1];
			var end = match.index + strNum.length;

			//append previous text
			buffer.push( result1.substring(pos, match.index) );

			//append modified number string (removed dots)
			buffer.push( strNum.replace(/-/igm, ' bis ') );

			pos = end;
		}


		buffer.push( result1.substring(pos) );

		return buffer.join('');
	};

})();

/**
 * text: the text for processing
 * separatorSymbol: a separator symbol (used to replace dot in day-part of the date)
 * languageCode: the language code (used for month-name)
 */
const processTextDates = (function(): (text: string, separatorSymbol: string, languageCode: string, forBrowser?: boolean) => string {

	//remove number formatter for GERMAN text, i.e. the non-functional dot:
	// example:     "08.01.1955  3.3.1234  3.09.2344  31.12.2009 "
	// processed (for language 'de' and separator '__DOT__' ->
	//				"8__DOT__ Januar 1955  3__DOT__ März 1234  3__DOT__ September 2344  31__DOT__ Dezember 2009 "

	var dateDetector = /([^\d]|^)((\d|[0-2]\d|3[01])\.(\d|[0]\d|1[0-2])\.([12]\d\d\d))/igm;

	//special separator that allows Nuance to correctly detect & read dates:
	var nuanceDateSeparator = '/';
	//unified mode: use same processing for BROWSER and for ANDROID (if false: use NUANCE processing in case of ANDROID)
	var UNIFIED_MODE = true;

	var removeLeadingZero = function(text: string): string {
		return text.replace(/^0/igm, '');
	};

	var monthNameTable = {
    en: [
    	'January',
    	'February',
    	'March',
    	'April',
    	'May',
    	'June',
    	'July',
    	'August',
    	'September',
    	'October',
    	'November',
    	'December'
    ],
	  de: [
    	'Januar',
    	'Februar',
    	'M\u00E4rz',//FIX encode umlaut as escaped unicode (in case script is not saved in unicode encoding)
    	'April',
    	'Mai',
    	'Juni',
    	'Juli',
    	'August',
    	'September',
    	'Oktober',
    	'November',
    	'Dezember'
	]};

	var getMonthName = function(num: string|number, lang: string): string {
		if(lang !== 'en'){
			if( ! monthNameTable[lang] ){
				console.warn('requested language not available, using "en" instead...');
				lang = 'en';
			}
		}

		if(typeof num === 'string'){
			num = parseInt(num, 10);
		}

		return monthNameTable[lang][num-1];
	};

	return function(text: string, separatorSymbol: string, languageCode: string, forBrowser?: boolean): string {
		var match: RegExpMatchArray;
		var buffer: Array<string> = [];
		var pos: number = 0;
		while(match = dateDetector.exec(text)){
			var strNum = match[2];
			var start = match[1].length;
			var end = match.index + start + strNum.length;

			//append previous text
			buffer.push( text.substring(pos, match.index + start) );

			//append modified number string (removed dots)
			if(UNIFIED_MODE || (! UNIFIED_MODE && forBrowser)){

				var day = removeLeadingZero(match[3]);
				var month = getMonthName(match[4],  languageCode);
				var year = match[5];

				buffer.push( day + separatorSymbol + ' ' + month + ' ' + year );
			}
			else {
				//actually this is only valid for Nuance TTS (if other TTS is used, this may have to be changed!)

				var day = match[3];
				var month = match[4];
				var year = match[5];

				buffer.push( day + nuanceDateSeparator + month + nuanceDateSeparator + year );
			}

			pos = end;
		}

		buffer.push( text.substring(pos) );
		return buffer.join('');
	};

})();

const preprocessTTSText = (function(): (text: string, options?: {forBrowser?: boolean, noDates?: boolean, noNumbers?: boolean, noCamelCase: boolean}) => Array<string> | string{

	var langCode = 'de';

	//"preservation token" for dots in dates
	var dotEnc = '__DOT__';
  var reDotEnc = new RegExp(dotEnc, 'gm');

	//Nuance TTS cannot detect/read numbering (i.e. "4." -> "fourth")
	//  -> in case of ANDROID, add actual text for reading
	var daySeparator = /*forBrowser? dotEnc :*/ 'ten';

	//"preservation token" for question-marks
	var qenc = '__Q__';
  var reQenc = new RegExp(qenc, 'gm');

	var reSentenceSplitter = /[\.\?!\t\r\n]/igm;

	var reWordTester = /[\w\d]/img;

	return function preprocessTTSText(text: string, options?: {forBrowser?: boolean, noDates?: boolean, noNumbers?: boolean, noCamelCase: boolean}): Array<string> | string {

    options = options || {forBrowser: false, noDates: false, noNumbers: false, noCamelCase: false};
    const forBrowser = options.forBrowser;
		var s = text;

//			console.log('TTS.preprocessing: '+s);

		//process dates
    if(!options.noDates){
		  s = processTextDates(s, daySeparator, langCode, forBrowser);
    }

		//process numbers (i.e. remove separators in numbers)
    if(!options.noNumbers){
		  s = processTextNumbers(s);
    }

		//QUICK FIX: really, we should evalute the HTML/DOM subtree
		//			... for now we use the text extracted via jQuery().text()
		//			-> if sentences / DOM-sublements are not terminated by a period,
		//				the sub-string get concatenated without spacing
		//			... if the next TEXT element is a Sentence, hopefully it starts with
		//			    upper case letter -> use "CamelCase" heuristic for inserting periods

    if(!options.noCamelCase){
		  s = processTextCamelCase(s);
    }

		//preserve question-marks (but also include original one, for sentence splitting)
		s = s.replace(/\?/gm,qenc+'?');


		s = s.replace(/%/gm,' Prozent ');

		// s = s.replace(/%/gm,' bis ');//FIXME typo? should it be: s.replaceAll(' - ',' bis ') ?

		var list = s.split(reSentenceSplitter);

		var result: Array<string> = [];
		var temp: string;
		for(var i=0,size=list.length; i < size; ++i){
			if(list[i].length > 0){
				temp = list[i].trim();
				if(temp.length === 0){
					continue;
				}

				temp = temp.replace(reDotEnc,'.');
        reDotEnc.lastIndex = 0;

				if(temp.endsWith(qenc)){
					temp = temp.replace(reQenc,'?');
          reQenc.lastIndex = 0;
				}
				else {
					//some speech synthesiser need puctuation at the end for better pronounciation
					temp += '.';
				}

				//FIX do also omit "sentences" that do not contain any "word character" or digit
				if( ! reWordTester.test(temp)){
					continue;
				}

				result.push( temp );
			}
		}

		//reset regular-expr.
		reSentenceSplitter.lastIndex = 0;
		reWordTester.lastIndex = 0;

		if(!forBrowser){
			//FIX need 2 newlines here -- otherwise the Nuance TTS does not make pauses in some special cases...
			return result.join('\n\n');
		}
		return result;
	};
})();

export {
  preprocessTTSText,
  processTextDates,
  processTextNumbers,
  processTextCamelCase,
}
