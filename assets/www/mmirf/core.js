(function initMmir() {
    
	if(window.mmir){
		if(typeof define === 'function'){
			define(function(){ return window.mmir; });
		}
		return window.mmir;
	}
	
    
    //STATE: state var for indicating "doc is already loaded" (this needs to be set/reset manually)
	var _isReady = false;
	var list = [];
	function dequeue () { return list.shift(); };
	function isEmpty () { return list.length === 0; };
	//param func OPTIONAL
	//			if func is present, func will be used instead of dequeueing a callback from the queue
	function deqExex (func) {
		if(!func){
			func = dequeue();
		}

		//run function in context of the document (whith jQuery as argument)
		func.call(mmir);
	};
	
	window.mmir = {
			
			setInitialized : function() {
				
				_isReady = true;

				//execute all callbacks in queue
				while(!isEmpty()){
					deqExex();
				}
			},
			
			ready : function(func) {
		
				//SPECIAL MODE: if already active, execute the callback 
				//				(if queue is not empty yet: queue function call in order to preserve the execution ordering)
				if(_isReady && ! isEmpty()){
					deqExec(func);
				}
				else {
					list.push(func);
				}
			}
	};
	
	if(typeof define === 'function'){
		define(function(){ return mmir; });
	}
	return mmir;
}());
