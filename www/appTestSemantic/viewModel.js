
define(['dictionary'], function(Dictionary){
	
	
	function GrammarModel(viewId, grammarId, type, url){
		
		if(typeof viewId === 'object'){
			grammarId = viewId.id;
			type = viewId.type;
			url = viewId.url;
			viewId = viewId.viewId;
		}
		
		if(!viewId){
			console.error('GrammarModel.create: no viewId!');
		}
		if(!grammarId){
			console.error('GrammarModel.create: no grammarId!');
		}
		if(!grammarId){
			console.error('GrammarModel.create: no type!');
		}
		
		this.viewId = viewId;
		this.id = grammarId;
		this.type = type;
		
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
	
	
	var _map = new Dictionary();
	var _grammarMap = new Dictionary();
	
	function _create(viewId, grammarId, type, url){
		return new GrammarModel(viewId, grammarId, type, url);
	}
	
	function _get(id){
		return _map.get(id);
	}
	
	function _getc(id){
		var gm = _get(id);
		if(!gm){
			gm = _create.apply(null, arguments);
			
			_map.put(id, gm);
			_grammarMap.put(gm.viewId);
		}
		return gm;
	}
	
	function _getGrammarId(grammarId){
		return _grammarMap.get(grammarId);
	}
	
	return {
		create: _create,
		get: _get,
		getc: _getc,
		getByViewId: _get,
		getByGrammarId: _getGrammarId
	};
});