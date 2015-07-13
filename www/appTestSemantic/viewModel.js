
define(['dictionary', 'appUtil'], function(Dictionary, util){
	
	var UNINITIALIZED_ENGINE_VALUE = '&lt;uncompiled&gt;';
	
	function GrammarModel(grammarId, type, url, jsonStr, json){
		
		this.engine = UNINITIALIZED_ENGINE_VALUE;
		
		if(typeof grammarId === 'object'){
			type 		= grammarId.type;
			url 		= grammarId.url;
			jsonStr 	= grammarId.jsonStr;
			json		= grammarId.json;
			grammarId 	= grammarId.id;
		}
		
		if(!grammarId){
			console.error('GrammarModel.create: no grammarId!');
		}
		if(!grammarId){
			console.error('GrammarModel.create: no type!');
		}
		
		this.id = grammarId;
		this.type = type;
		
		//"saved-dirty" dirty flag: FALSE if loaded from file/project-json
		this.isDirty = this.isCompiled();
		
		var viewId = grammarId;
		if(type === 'compiled'){
			viewId = 'compiled_' + viewId;
		} else if(type === 'file'){
			viewId = 'file_' + url;
		}
		
		this.viewId = viewId;
		
		if(jsonStr){
			//if we only got a JSON object -> "generate" a JSON string
			if(typeof jsonStr === 'object'){
				json = jsonStr;
				jsonStr = util.formatJson(jsonStr);
			}
			
			this.jsonText = jsonStr;
		}
		
		if(json){
			this.json = json;
		}
		
		
		if(url){
			this.url = url;
		}
	}
	
	GrammarModel.prototype.isProject = function(){
		return this.type === 'project';
	};
	GrammarModel.prototype.isFile = function(){
		return this.type === 'file';
	};
	GrammarModel.prototype.isCompiled = function(){
		return this.type === 'compiled';
	};
	
	GrammarModel.prototype.setUrl = function(url){
		this.url = url;
	};
	GrammarModel.prototype.setJson = function(json){
		this.json = json;
	};
	GrammarModel.prototype.setJsonText = function(json){
		this.jsonText = json;
	};
//	GrammarModel.prototype.setJs = function(js){
//		this.js = js;
//	};
//	GrammarModel.prototype.setDef = function(def){
//		this.def = def;
//	};
	GrammarModel.prototype.setGrammarConverter = function(grammarConverter, engine){
		this.gc = grammarConverter;
		this.engine = engine;
	};
	
	
	GrammarModel.prototype.getUrl = function(){
		return this.url;
	};
	GrammarModel.prototype.getJson = function(){
		return this.json;
	};
	GrammarModel.prototype.getJsonText = function(){
		return this.jsonText;
	};
	GrammarModel.prototype.getCompiledGrammar = function(){
//		return this.js;
		if(this.gc){
			return this.gc.getJSGrammar();
		}
	};
	GrammarModel.prototype.getIntermediateGrammar = function(){
//		return this.def;
		if(this.gc){
			return this.gc.getJSCCGrammar();
		}
	};
	GrammarModel.prototype.getGrammarConverter = function(){
		return this.gc;
	};
	GrammarModel.prototype.getEngine = function(){
		return this.engine;
	};
	
	
	GrammarModel.prototype.getLabel = function(){
		return '<strong><pre>'+ this.id + '</pre></strong> <em class="text small hint">'+this.engine+'</em>';
	};
	
	GrammarModel.prototype.getIcon = function(){
		switch(this.type){
		case 'project':
			return 'fa fa-file-text-o';
		case 'file':
			return 'fa fa-file-code-o';
		case 'compiled':
			return 'fa fa-file';
		default:
			return;
		}
	};
	
	//isStored: is the (text of) the JSON grammar stored?
	GrammarModel.prototype.isStored = function(){
		return this.isDirty === false;
	};
	GrammarModel.prototype.setStored = function(isSaved){
		this.isDirty = !isSaved;
	};
	
	/** 
	 * @private
	 * @type Dictionary
	 * @memberOf ViewModel.private
	 */
	var _map = new Dictionary();
	/** 
	 * @private
	 * @type Dictionary
	 * @memberOf ViewModel.private
	 */
	var _grammarMap = new Dictionary();
	
	/** 
	 * @private
	 * @function
	 * @memberOf ViewModel.private
	 */
	function _create(grammarId, type, url, jsonStr, json){
		var gm = new GrammarModel(grammarId, type, url, jsonStr, json);
		_map.put(gm.id, gm);
		_grammarMap.put(gm.viewId);
		
		return gm;
	}
	
	/** 
	 * @private
	 * @function
	 * @memberOf ViewModel.private
	 */
	function _remove(id){
		var gm = _get(id);
		_map.remove(gm.viewId);
		_grammarMap.remove(gm.id);
		return gm;
	}
	
	/** 
	 * @private
	 * @function
	 * @memberOf ViewModel.private
	 */
	function _get(id){
		return _map.get(id);
	}
	
	/** 
	 * @private
	 * @function
	 * @memberOf ViewModel.private
	 */
	function _getc(id){
		var gm = _get(id);
		if(!gm){
			gm = _create.apply(null, arguments);
		}
		return gm;
	}
	
	/** 
	 * @private
	 * @function
	 * @memberOf ViewModel.private
	 */
	function _getGrammarId(grammarId){
		return _grammarMap.get(grammarId);
	}
	
	return {
		/** @memberOf ViewModel */
		create: _create,
		get: _get,
//		getc: _getc,
		getByViewId: _get,
		getByGrammarId: _getGrammarId,
		remove: _remove,
		
		setJson: function(id, json){
			_get(id).setJson(json);
		}
	};
});