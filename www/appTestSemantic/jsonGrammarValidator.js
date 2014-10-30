
/**
 * Validation tools for JSON grammar files.
 * 
 */
define(['commonUtils'], function(utils){
	
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
	
	var isArray = utils.isArray;
	
	var isUpperCase = function(str){//ignore underscores
		for(var i=0, len = str.length; i < len; ++i){
			if( /[a-z]/.test(str.charAt(i)) ){
				return false;
			}
		}
		return true;
	};
	
	var hasIdStart = function(str){//allow ASCII letters only
		return /^[a-zA-Z].*/i.test(str);
	};
	var isId = function(str){//allow ASCII letters and digits
		return /^[a-zA-Z0-9_]+/i.test(str);
	};

	//some "keywords" that are used in grammars
	var STOPWORDS = 'stop_word'; 
	var TOKEN = 'tokens';
	var UTTERANCE = 'utterances';
	var PHRASES = 'phrases';
	var SEMANTIC = 'semantic';
	
	var GrammarValidator = function(grammar){
		this.grammar = grammar;
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
					 'Unknown specification for STOPWORDS: using type "'+(typeof this.grammar[STOPWORDS])+'" (expected Array)'
					:'No STOPWORDS specified';
					
			problems.push(new Problem([STOPWORDS], msg, 'ERROR'));
		}

		if(typeof this.grammar[TOKEN] !== 'object'){
			
			var msg = this.grammar[TOKEN]? 
					 'Unknown specification for TOKENS: using type "'+(typeof this.grammar[TOKEN])+'" (expected JSON object)'
					:'No TOKENS specified';
					
			problems.push(new Problem([TOKEN], msg, 'ERROR'));
		}
		
		if(typeof this.grammar[UTTERANCE] !== 'object'){
			
			var msg = this.grammar[UTTERANCE]? 
					 'Unknown specification for UTTERANCES: using type "'+(typeof this.grammar[UTTERANCE])+'" (expected JSON object)'
					:'No UTTERANCES specified';
					
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
							'TOKEN name is not upper case',
							'WARN'
					));
				}
				// 2. verify token name has only valid characters
				if( ! hasIdStart(t)){
					problems.push(new Problem(
							[TOKEN, t],
							'TOKEN name starts with invalid CHAR (only ASCII is allowed)',
							'ERROR'
					));
				}
				if( ! isId(t)){
					problems.push(new Problem(
							[TOKEN, t],
							'TOKEN name has invalid CHAR(s) (only ASCII is allowed)',
							'ERROR'
					));
				}
				
				var tlist = this.grammar[TOKEN][t];
				// 3. verify token-field is an array
				if( ! isArray(tlist) ){
					problems.push(new Problem(
							[TOKEN, t],
							'TOKEN field is not an array, but instead has type: '+(typeof tlist),
							'ERROR'
					));
				}
				else {
					
					// 4. verify that the token list is not empty
					var size = tlist.length;
					if(size < 1){
						problems.push(new Problem(
								[TOKEN, t],
								'TOKEN has no values (i.e. has empty array)',
								'WARN'
						));
					}
					
					var v;
					// 5. for each token-entry: verify it is a STRING
					for(var i=0; i < size; ++i){
						v = tlist[i];
						if(typeof v !== 'string'){
							problems.push(new Problem(
									[TOKEN, t, i, v],
									'TOKEN value is not a STRING, but has type'+(typeof v),
									'WARN'
							));
						}
					}
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
	GrammarValidator.prototype._validateUtteranceStructure = function(){
		var problems = [];
			
		for(var u in this.grammar[UTTERANCE]){
			
			if(this.grammar[UTTERANCE].hasOwnProperty(u)){
				
				// 1. verify utterance name is upper case:
				if( ! isUpperCase(u)){
					problems.push(new Problem(
							[UTTERANCE, u],
							'UTTERANCE name is not upper case',
							'WARN'
					));
				}
				// 2. verify utterance name has only valid characters
				if( ! hasIdStart(u)){
					problems.push(new Problem(
							[UTTERANCE, u],
							'UTTERANCE name starts with invalid CHAR (only ASCII is allowed)',
							'ERROR'
					));
				}
				if( ! isId(u)){
					problems.push(new Problem(
							[UTTERANCE, u],
							'UTTERANCE name has invalid CHAR(s) (only ASCII is allowed)',
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
				
				
				var plist = this.grammar[UTTERANCE][u][PHRASES];
				// 4. verify phrase-field is an array
				if( ! isArray(plist)){
					problems.push(new Problem(
							[UTTERANCE, u, PHRASES],
							'PHRASES field is not an array, but instead has type: '+(typeof plist),
							'ERROR'
					));
				}
				else {
					
					// 5. verify that the phrase list is not empty
					var size = plist.length;
					if(size < 1){
						problems.push(new Problem(
								[UTTERANCE, u, PHRASES],
								'UTTERANCE has no values (i.e. has empty array)',
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
									'PHRASE value is not a STRING, but has type'+(typeof v),
									'WARN'
							));
						}
//						else {
//							//TODO tokenize phrase and verify that only existing TOKEN- and UTTERANCE-IDs are used
//							var phraseWords = v.split(/\s/);
//							for(...){
//						}
					}
				}
				
			}
		}
		
		
		return problems;
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
							'TOKEN name already exists at ' + getLoc( map[t].location ),
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
							'UTTERANCE name already exists at ' + getLoc( map[u].location ),
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
				var v;
				// for each token-entry: verify it does not already exist (using the map)
				for(var i=0, size = tlist.length; i < size; ++i){
					
					v = tlist[i];
					
					if(map[v] && map[v].state === full){
						problems.push(new Problem(
								[TOKEN, t, i, v],
								'TOKEN value already exists at ' + getLoc( map[v].location ),
								'ERROR'
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
				var size = plist.length;
				
				var v;
				// for each phrase-entry: verify it does not already exist (using the map)
				for(var i=0; i < size; ++i){
					
					v = plist[i];
					
					// for each phrase-entry: verify it does not already exist (using the map)
					if(map[v] && map[v].state === full){
						problems.push(new Problem(
								[UTTERANCE, u, PHRASES, i, v],
								'PHRASE value already exists at ' + getLoc( map[v].location ),
								'ERROR'
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
	
	return GrammarValidator;
});