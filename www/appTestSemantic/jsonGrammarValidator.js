
/**
 * Validation tools for JSON grammar files.
 *
 */
define(['mmirf/commonUtils', 'mmirf/grammarConverter'], function(utils, GrammarConverter){

	var PATH_SEP = '.';
	var getLoc = function(location){
		return '{'+location.join(PATH_SEP)+'}';
	};

	/**
	 *	Represents a validation problem:
	 *
	 *	location: Array / path within the JSON file, where the problem occurs
	 *	message: String description of the problem
	 *	level: String severity level of the problem (WARNING | ERROR)
	 */
	var Problem = function(location, message, level){
		this.location = location;
		this.message = message;
		this.level = level;
	};
	Problem.prototype.toString = function(){
		return this.level+' at '+this._locationStr(this.location)+': '+this.message+'.';
	};
	Problem.prototype._locationStr = getLoc;

	/** @memberOf GrammarValidator */
	var isArray = utils.isArray;

	/** @memberOf GrammarValidator */
	var isPlainObject = function(obj){
		return typeof obj === 'object' && obj !== null && ! isArray(obj);
	};

	/** @memberOf GrammarValidator */
	var toTypeString = function(obj){
		return isArray(obj)? 'Array' : obj===null? 'NULL' : typeof obj;
	};

	/** @memberOf GrammarValidator */
	var isUpperCase = function(str){//ignore underscores
		for(var i=0, len = str.length; i < len; ++i){
			if( /[a-z]/.test(str.charAt(i)) ){
				return false;
			}
		}
		return true;
	};

	/** @memberOf GrammarValidator */
	var hasIdStart = function(str){//allow ASCII letters only
		return /^[a-zA-Z].*/i.test(str);
	};
	/** @memberOf GrammarValidator */
	var isId = function(str){//allow ASCII letters and digits
		return /^[a-zA-Z0-9_]+/i.test(str);
	};

	/** @memberOf GrammarValidator */
	var processJSON = function(obj, validateFunc, location, data){

		var loc;

		//different treatments for: STRING, ARRAY, OBJECT types (and 'REST' type, i.e. all ohters)
		if(typeof obj === 'string'){
			//STRING: encode the string
			return validateFunc(obj, location, data);
		}
		else if( isArray(obj) ) {
			//ARRAY: process all entries:
			for(var i=0, size = obj.length; i < size; ++i){
				loc = location.slice(0);
				loc.push(i);
				obj[i] = processJSON(obj[i], validateFunc, loc, data);
			}

			return obj;
		}
		else if(obj === null) {//NOTE null is typeof object!
			return null;
		}
		else if(typeof obj === 'object') {
			//OBJECT: process all the object's properties (but only, if they are not inherited)
			for(var p in obj){
				if(obj.hasOwnProperty(p)){
					loc = location.slice(0);
					loc.push(p);
					obj[p] = processJSON(obj[p], validateFunc, loc, data);
				}
			}
			return obj;
		}
		else {
			return obj;
		}
	};

	/**
	 * Creates a RegExp for checking, if a stopword occurs in a TOKEN string
	 *
	 * @param  {Array<string>} stopwords the grammar's stopword list (may be empty)
	 * @return {RegExp}           a RegExp that captures 3 groups (the matched token in 2nd group, i.e. match[2])
	 */
	var createStopwordInTokRegExp = function(stopwords){

		if(!stopwords || stopwords.length < 1){
			return null;
		}

		//create ReExp that matches if a stopword is found that
		// 1. is preceeded by STRING_START or a whitespace
		// 2. is succeeded by a whitespace or STRING_END
		var sb = ['(^|\\s)('];
		for(var i=0, size = stopwords.length; i < size; ++i){
			sb.push(stopwords[i], '|');
		}
		sb.pop();//remove last separator '|'
		sb.push(')(\\s|$)');

		return new RegExp(sb.join(''), 'im');
	};

	//some "keywords" that are used in grammars
	/** @memberOf GrammarValidator */
	var STOPWORDS = 'stop_word';
	/** @memberOf GrammarValidator */
	var TOKEN = 'tokens';
	/** @memberOf GrammarValidator */
	var UTTERANCE = 'utterances';
	/** @memberOf GrammarValidator */
	var PHRASES = 'phrases';
	/** @memberOf GrammarValidator */
	var SEMANTIC = 'semantic';

	//GrammarConverter instance for accessing converter-values TODO make these static in GrammarConverter?
	/** @memberOf GrammarValidator */
	var GC = new GrammarConverter();

	var GrammarValidator = function(grammar){
		this.grammar = grammar;

		this.varPrefix = GC.variable_prefix;
		this.reVars = GC.variable_regexp;

		//FIXME should get these from grammar-converter and/or generator!?!
		this.reVarIndex = /\[(\d+)\]/;
		this.reVarNames = new RegExp('_\\$([a-zA-Z_][a-zA-Z0-9_\\-]*)');

		this._checkIfNotRegExpr = function(token){

			//test for character-group
			if( ! /([^\\]\[)|(^\[).*?[^\\]\]/.test(token)){

				//test for grouping
				if( ! /([^\\]\()|(^\().*?[^\\]\)/.test(token) ){

					//try for single-characters that occur in reg-expr FIXME this may produce false-positives!!!
					return ! /[\?|\*|\+|\^|\|\\]/.test(token); //excluded since these may be more common in natural text: . $
				}
			}

			return false;
		};

		this.reStopwords = createStopwordInTokRegExp(grammar[STOPWORDS]);
		/**
		 * @param {String} text
		 * @returns {String} the (first) matched stopword or null
		 */
		this._matchStopword = function(text){

			this.reStopwords.lastIndex = 0;
			found = this.reStopwords.exec(text);

			if(found){
				return found[2];
			}

			return null;
		};

	};

	/**
	 * Check the general structure of a grammar:
	 *
	 * <ul>
	 * 	<li>existence / type of field <code>stop_words</code></li>
	 * 	<li>existence / type of field <code>tokens</code></li>
	 * 	<li>existence / type of field <code>utterances</code></li>
	 * 	<li>check tokens-structure using {@link #_validateTokenStructure}</code></li>
	 * 	<li>check utterances-structure using {@link #_validateUtteranceStructure}</code></li>
	 * </ul>
	 *
	 * @returns {Array}
	 */
	GrammarValidator.prototype.validateStructure = function(){

		var problems = [];

		if( ! isArray( this.grammar[STOPWORDS] )){

			var msg = this.grammar[STOPWORDS]?
					'Unknown specification for STOPWORDS: using type "'+ toTypeString(this.grammar[STOPWORDS])+'" (expected Array)'
					:'No STOPWORDS specified: must have property "'+STOPWORDS+'" (with type array)';

					problems.push(new Problem([STOPWORDS], msg, 'ERROR'));
		}

		if( ! isPlainObject(this.grammar[TOKEN] )){

			var msg = this.grammar[TOKEN]?
					'Unknown specification for TOKENS: using type "'+ toTypeString(this.grammar[TOKEN])+'" (expected JSON object)'
					:'No TOKENS specified: must have property "'+TOKEN+'" (with type object)';

					problems.push(new Problem([TOKEN], msg, 'ERROR'));
		}

		if( ! isPlainObject(this.grammar[UTTERANCE] )){

			var msg = this.grammar[UTTERANCE]?
					'Unknown specification for UTTERANCES: using type "'+toTypeString(this.grammar[UTTERANCE])+'" (expected JSON object)'
					:'No UTTERANCES specified: must have property "'+UTTERANCE+'" (with type object)';

					problems.push(new Problem([UTTERANCE], msg, 'ERROR'));
		}

		var p2 = this._validateTokenStructure();
		if(p2.length > 0){
			problems = problems.concat(p2);
		}

		p2 = this._validateUtteranceStructure();
		if(p2.length > 0){
			problems = problems.concat(p2);
		}

		return problems;
	};

	/**
	 * HELPER verifies that the structure of the token-entries are valid:
	 *
	 * i.e. each token has a valid name as ID, and a list of STRINGS as value.
	 *
	 * @returns {Array}
	 */
	GrammarValidator.prototype._validateTokenStructure = function(){
		var problems = [];

		for(var t in this.grammar[TOKEN]){

			if(this.grammar[TOKEN].hasOwnProperty(t)){

				// 1. verify token name is upper case:
				if( ! isUpperCase(t)){
					problems.push(new Problem(
							[TOKEN, t],
							'TOKEN name "'+t+'" is not upper case',
							'WARN'
					));
				}
				// 2. verify token name has only valid characters
				if( ! hasIdStart(t)){
					problems.push(new Problem(
							[TOKEN, t],
							'TOKEN name "'+t+'" starts with invalid CHAR (only ASCII is allowed)',
							'ERROR'
					));
				}
				if( ! isId(t)){
					problems.push(new Problem(
							[TOKEN, t],
							'TOKEN name "'+t+'" has invalid CHAR(s) (only ASCII is allowed)',
							'ERROR'
					));
				}

				var tlist = this.grammar[TOKEN][t];
				// 3. verify token-field is an array
				if( ! isArray(tlist) ){
					problems.push(new Problem(
							[TOKEN, t],
							'TOKEN field "'+t+'" is not an array, but instead has type: '+ toTypeString(tlist),
							'ERROR'
					));
				}
				else {

					// 4. verify that the token list is not empty
					var size = tlist.length;
					if(size < 1){
						problems.push(new Problem(
								[TOKEN, t],
								'TOKEN field "'+t+'" has no values (i.e. is empty array)',
								'WARN'
						));
					}

					var v, v2, sw;
					// 5. for each token-entry: verify it is a STRING
					for(var i=0; i < size; ++i){
						v = tlist[i];
						if(typeof v !== 'string'){
							problems.push(new Problem(
									[TOKEN, t, i, v],
									'TOKEN value is not a STRING, but has type '+ toTypeString(v),
									'WARN'
							));
						} else if(v === ''){
							// 6. for each token-entry: verify it is not the empty string
							problems.push(new Problem(
									[TOKEN, t, i, v],
									'TOKEN STRING is empty, i.e. has value "" (TOKEN will match anything)',
									'ERROR'
							));
						} else if((sw = this._matchStopword(v))){
							// 7. for each token-entry: verify it does not contain a stopword
							problems.push(new Problem(
									[TOKEN, t, i, v],
									'TOKEN STRING contains the stopword "'+sw+'" (TOKEN will never match, if stopword removal is used)',
									'WARN'
							));
						} else {
							// 8. for each token-entry: verify it is lower case
							v2 = v.toLowerCase();
							if(v !== v2 && this._checkIfNotRegExpr(v)){
								problems.push(new Problem(
										[TOKEN, t, i, v],
										'TOKEN value "'+v+'" should be all lower case ',
										'WARN'
								));
							}
						}
					}

					// 7. TODO check for *simplified* RegExpr & validate that they can be created
					//         (e.g. see env/grammar/jisonGenerator.js -> _convertRegExpr(), _checkIfNotRegExpr())
				}


			}
		}


		return problems;
	};

	/**
	 * HELPER verifies that the structure of the utterance-entries are valid:
	 *
	 * i.e. each utterance has a valid name as ID, and a list of PHRASES (i.e. STRINGS) as value.
	 *
	 * TODO verify that each phrase is valid (i.e. uses other phrases and/or tokens)
	 *
	 * @returns {Array}
	 */
	GrammarValidator.prototype._validateUtteranceStructure = function(idMap){
		var problems = [];
		var full = '$$';

		if(!idMap){
			idMap = this.validateIdDuplicates(true);
		}

		for(var u in this.grammar[UTTERANCE]){

			if(this.grammar[UTTERANCE].hasOwnProperty(u)){

				// 1. verify utterance name is upper case:
				if( ! isUpperCase(u)){
					problems.push(new Problem(
							[UTTERANCE, u],
							'UTTERANCE name "'+u+'" is not upper case',
							'WARN'
					));
				}
				// 2. verify utterance name has only valid characters
				if( ! hasIdStart(u)){
					problems.push(new Problem(
							[UTTERANCE, u],
							'UTTERANCE name "'+u+'" starts with invalid CHAR (only ASCII is allowed)',
							'ERROR'
					));
				}
				if( ! isId(u)){
					problems.push(new Problem(
							[UTTERANCE, u],
							'UTTERANCE name "'+u+'" has invalid CHAR(s) (only ASCII is allowed)',
							'ERROR'
					));
				}


				// 3. verify semantic field exists
				if(typeof this.grammar[UTTERANCE][u][SEMANTIC] === 'undefined'){
					problems.push(new Problem(
							[UTTERANCE, u, SEMANTIC],
							'SEMANTIC field does not exists.',
							'ERROR'
					));
				}


				// TODO check for variable-entries in SEMANTIC field (see SEMANTIC creation in env/grammar/...Generator.js)

				var plist = this.grammar[UTTERANCE][u][PHRASES];
				// 4. verify phrase-field is an array
				if( ! isArray(plist)){
					var msg = typeof plist !== 'undefined'?
							'PHRASES field is not an array, but instead has type: '+ toTypeString(plist) :
								'PHRASES field is missing';

							problems.push(new Problem(
									[UTTERANCE, u, PHRASES],
									msg,
									'ERROR'
							));
				}
				else {

					// 5. verify that the phrase list is not empty
					var size = plist.length;
					if(size < 1){
						problems.push(new Problem(
								[UTTERANCE, u, PHRASES],
								'UTTERANCE\'s PHRASES has no values (i.e. is empty array)',
								'WARN'
						));
					}

					var v;
					// 6. for each phrase-entry: verify it is a STRING
					for(var i=0; i < size; ++i){
						v = plist[i];
						if(typeof v !== 'string'){
							problems.push(new Problem(
									[UTTERANCE, u, PHRASES, i, v],
									'PHRASE value is not a STRING, but has type '+ toTypeString(v),
									'WARN'
							));
						}
						else {

							// 7. verify that the words within phrases reference either TOKENs or UTTERANCE
							//    i.e. "split" phrase and verify that only existing TOKEN- and UTTERANCE-IDs are used
							var phraseWords = v.split(/\s+/);
							var pwi = 0, pwlen = phraseWords.length;
							var pword;
							for(; pwi < pwlen; ++pwi){
								pword = phraseWords[pwi];
								if( ! (idMap[pword] && idMap[pword].state === full)){
									problems.push(new Problem(
											[UTTERANCE, u, PHRASES, i, v, pwi, pword],
											'PHRASE reference "'+pword+'" is not defined (i.e. not TOKEN nor UTTERANCE)',
											'ERROR'
									));
								}
							}
						}
					}

				}

			}
		}


		return problems;
	};

	/**
	 * Validate Stopwords:
	 * 	* the same stopword should not be defined multiple times
	 *  * stopwords should have type STRING
	 *  * TODO stopwords may be RegExp (only "simplified" version allowed?)
	 *
	 * @see Problem
	 *
	 * @param {Boolean} [isReturnIdMap]
	 * 				if present and <code>true</code>, then the created
	 * 				Map object is returned, containing all IDs
	 *
	 * @returns {Array<Problems> | Map<String,Location>}
	 * 			either a list of all found Problems (may be empty),
	 * 			or the created Map that
	 * 			contains the "location" for all IDs:
	 * 			MAP = {
	 * 				//location for ID "id":
	 * 				"id": {
	 * 					"state": "$$", // internally used marker
	 * 					"location": ["path", "to", "id"] // list of nested properties / objects to the ID
	 * 				},
	 * 				//location for ID "someOtherId":
	 * 				"someOtherId": {
	 * 					...
	 * 			}
	 *
	 * 			in the example result above, the ID "id" would be located at:
	 *
	 * 			{
	 * 				"path": {
	 * 					"to": "id"
	 * 				}
	 * 			}
	 *
	 * 			in the JSON grammar.
	 */
	GrammarValidator.prototype.validateStopwords = function(isReturnIdMap){

		var problems = [];

		var map = {};
		var full = '$$';

		var i,size,sw;

		// 1. stopwords should only occur / be defined once
		// 2. stopword entries should have type STRING
		// 3. stopwords should not be empty STRING
		// 4. TODO check for RegExpr & validate that they can be compile / created


		if( isArray(this.grammar[STOPWORDS]) ){
			for(i=0, size = this.grammar[STOPWORDS].length; i < size; ++i){

				sw = this.grammar[STOPWORDS][i];

				// 1. for each stopword name: verify it does not already exist (using the map)
				if(map[sw] && map[sw].state === full){
					problems.push(new Problem(
							[STOPWORDS, i, sw],
							'STOPWORD "'+sw+'" was already defined at ' + getLoc( map[sw].location ),
							'WARN'
					));
				}
				else {
					map[sw] = {
							state: full,
							location: [STOPWORDS, i, sw]
					};
				}

				// 2. stopword entry should have type STRING
				if(typeof sw !== 'string'){
					problems.push(new Problem(
							[STOPWORDS, i, sw],
							'STOPWORD value is not a STRING, but has type '+ toTypeString(sw),
							'WARN'
					));
				} else if(sw === ''){
					// 3. stopwords should not be empty STRING
					problems.push(new Problem(
							[STOPWORDS, i, sw],
							'STOPWORD STRING is empty, i.e. has value ""',
							'WARN'
					));
				}

			}
		} else {
			var msg = typeof this.grammar[STOPWORDS] === 'undefined'? 'Missing' : 'Wrong type ('+(typeof this.grammar[STOPWORDS])+') for';
			problems.push(new Problem(
					[STOPWORDS],
					msg+' STOPWORD list: must have property "'+STOPWORDS+'" with Array-value, e.g.: "'+STOPWORDS+'": []',
					'ERROR'
			));
		}

		return isReturnIdMap? map : problems;

	};

	/**
	 * Validate IDs: the name (ID) of TOKENs and UTTERANCEs must be unique
	 * 				(over all tokens AND all utterances).
	 *
	 * @see Problem
	 *
	 * @param {Boolean} [isReturnIdMap]
	 * 				if present and <code>true</code>, then the created
	 * 				Map object is returned, containing all IDs
	 *
	 * @returns {Array<Problems> | Map<String,Location>}
	 * 			either a list of all found Problems (may be empty),
	 * 			or the created Map that
	 * 			contains the "location" for all IDs:
	 * 			MAP = {
	 * 				//location for ID "id":
	 * 				"id": {
	 * 					"state": "$$", // internally used marker
	 * 					"location": ["path", "to", "id"] // list of nested properties / objects to the ID
	 * 				},
	 * 				//location for ID "someOtherId":
	 * 				"someOtherId": {
	 * 					...
	 * 			}
	 *
	 * 			in the example result above, the ID "id" would be located at:
	 *
	 * 			{
	 * 				"path": {
	 * 					"to": "id"
	 * 				}
	 * 			}
	 *
	 * 			in the JSON grammar.
	 */
	GrammarValidator.prototype.validateIdDuplicates = function(isReturnIdMap){

		var problems = [];

		var map = {};
		var full = '$$';

		// token names and utterance names must be unique

		// for each token name: verify it does not already exist (using the map)
		for(var t in this.grammar[TOKEN]){

			if(this.grammar[TOKEN].hasOwnProperty(t)){

				if(map[t] && map[t].state === full){
					//NOTE this should never happen, since here, we only have TOKEN names...
					problems.push(new Problem(
							[TOKEN, t],
							'TOKEN name "'+t+'" already exists at ' + getLoc( map[t].location ),
							'ERROR'
					));
				}
				else {
					map[t] = {
							state: full,
							location: [TOKEN, t]
					};
				}
			}
		}


		// for each utterance name: verify it does not already exist (using the map)
		for(var u in this.grammar[UTTERANCE]){

			if(this.grammar[UTTERANCE].hasOwnProperty(u)){

				if(map[u] && map[u].state === full){
					//UTTERANCE name may collide with a TOKEN name...
					problems.push(new Problem(
							[UTTERANCE, u],
							'UTTERANCE name "'+u+'" already exists at ' + getLoc( map[u].location ),
							'ERROR'
					));
				}
				else {
					map[u] = {
							state: full,
							location: [UTTERANCE, u]
					};
				}
			}
		}


		return isReturnIdMap? map : problems;

	};

	/**
	 * Validate, that token values are not used in multiple times (in multiple token definitions).
	 *
	 * @example
	 *
	 * 	"UNDEF": ["ein", "eine"...
	 *  ...
	 *  "NUMBER": ["ein", "eins", "zwei", ...
	 *
	 *  The token value "ein" is used multiple times (should be avoided).
	 *
	 * WARNING: Regular Expressions are only checked by matching their String representation
	 * 			(i.e. if differently formulated RegExpr match the same patterns, this is not detected!)
	 *
	 * @param {Boolean} [isReturnTokenMap]
	 * 			whether to return a list of Problems, or the created Map object for IDs
	 * 			(see doc for #validateIdDuplicates)
	 * @returns {Array<Problems> | Map<String, Location>}
	 * 			(see doc for #validateIdDuplicates)
	 */
	GrammarValidator.prototype.validateTokenDuplicates = function(isReturnTokenMap){

		var problems = [];

		var map = {};
		var full = '$$';

		for(var t in this.grammar[TOKEN]){

			if(this.grammar[TOKEN].hasOwnProperty(t)){

				var tlist = this.grammar[TOKEN][t];
				if(!isArray(tlist)){
					//validation error for this is created in _validateTokenStructure
					continue;
				}

				var v;
				// for each token-entry: verify it does not already exist (using the map)
				for(var i=0, size = tlist.length; i < size; ++i){

					v = tlist[i];

					if(map[v] && map[v].state === full){
						problems.push(new Problem(
								[TOKEN, t, i, v],
								'TOKEN value "'+v+'" already exists at ' + getLoc( map[v].location ),
								'WARN'
						));
					}
					else {
						map[v] = {
								state: full,
								location: [TOKEN, t, i, v]
						};
					}
				}

			}
		}

		return isReturnTokenMap? map : problems;
	};

	/**
	 * Verify that a PHRASE does not occur multiple times (e.g. with in the same or different UTTERANCEs).
	 *
	 * @see #validateIdDuplicates
	 * @see #validateTokenDuplicates
	 */
	GrammarValidator.prototype.validateUtteranceDuplicates = function(isReturnUtteranceMap){

		var problems = [];

		var map = {};
		var full = '$$';

		for(var u in this.grammar[UTTERANCE]){

			if(this.grammar[UTTERANCE].hasOwnProperty(u)){

				var plist = this.grammar[UTTERANCE][u][PHRASES];
				if(!plist){
					break;
				}
				var size = plist.length;

				var v;
				// for each phrase-entry: verify it does not already exist (using the map)
				for(var i=0; i < size; ++i){

					v = plist[i];

					// for each phrase-entry: verify it does not already exist (using the map)
					if(map[v] && map[v].state === full){
						problems.push(new Problem(
								[UTTERANCE, u, PHRASES, i, v],
								'PHRASE "'+v+'" already exists at ' + getLoc( map[v].location ),
								'WARN'
						));
					}
					else {
						map[v] = {
								state: full,
								location: [UTTERANCE, u, PHRASES, i, v]
						};
					}
				}

			}
		}

		return isReturnUtteranceMap? map : problems;
	};

	/**
	 * Verify syntax for accessing variables, i.e. content/text of token/utterance matches in PHRASES
	 * (within the "semantic" definition for an utterance)
	 */
	GrammarValidator.prototype.validateUtteranceVarRefs = function(){

		var problems = [];

		var exists = '$$';
		var reWs = /\s+/;

		for(var u in this.grammar[UTTERANCE]){

			if(this.grammar[UTTERANCE].hasOwnProperty(u)){

				var utt = this.grammar[UTTERANCE][u];
				var plist = utt[PHRASES];
				if(!plist){
					break;
				}
				var size = plist.length;

				var v, words, w;
				//map for all tokens & utterances that occur in on of the phrases in utt:
				var map = {};

				//gather all token/utterance references that occur in the phrases of utt
				for(var i=0; i < size; ++i){

					v = plist[i];

					//remember all tokens/utterances that occur the phrase
					reWs.lastIndex = 0;
					words = v.split(reWs);
					for(var i2=0,size2=words.length; i2 < size2; ++i2){
						w = words[i2];
						w = w.toLowerCase();//<- variable-names are all-lower-case
						if(!map[w] || map[w].state !== exists){
							map[w] = {
									state: exists
									//TODO store type (token or utterance)
							};
						}
//						else if(map[w].state !== exists)TODO? add multiple locations?

					}

				}//END for(phrases)


				if(utt[SEMANTIC]){

					var _reVarNames = this.reVarNames;
					var _reVars = this.reVars;


					// for each semantic-entry: verify that variable-reference
					// 1. are syntactically correct
					// 2. refer to a TOKEN or UTTERENCE in one of the utt's PHRASES
					var validateVars = function(val, location){

						var vname, loc, vmatch, semVal;
						_reVars.lastIndex = 0;
						semVal = '"' + val +'"';//<- "simulate" stringified value, as is currently use in GrammarConverter/Generator

						while(vmatch = _reVars.exec(semVal)){//FIXME change parsing in GrammarConverter/Generator: do not parse stringified SEMANTIC object!

							va = vmatch[1];

							//has access-index?
//							this.reVarIndex.lastIndex = 0;//TODO check/verify index-access

							//is variable name valid?
							vname = _reVarNames.exec(va);
							if(!vname){

								loc = location.slice(0);
								loc.push(va);
								problems.push(new Problem(
										loc,
										'Variable "'+va+'" in SEMANTIC contains invalid characters',
										'ERROR'
								));


							} else {

								//refers the variable to a token or utterance in utt's phrases?
								if(!map[vname[1]] || map[vname[1]].state !== exists){

									loc = location.slice(0);
									loc.push(va);
									problems.push(new Problem(
											loc,
											'Variable "'+va+'" in SEMANTIC does not reference a TOKEN or UTTERANCE in one of the PHRASES',
											'ERROR'
									));


									//TODO check/verify access to semantic attributes of utterance-references
								}
							}
						}

					};//END: validateVars()

					processJSON(utt[SEMANTIC], validateVars, [UTTERANCE, u, SEMANTIC]);

				}//END: if(utt[SEMANTIC])

			}
		}

		return problems;
	};


	return GrammarValidator;
});
