(function() {

    var _instance = null;

    /**
     * An array containing all states active.
     * 
     * @property statesActive
     * @type Array
     * @private
     */
    var statesActive = new Array();

    var newInstance = function( scion, scionUtil ) {
    	
        var _interpreter = null;

        var load = function(){

            var _url = this.arguments || this.doc
            	, _defer = $.Deferred();
            
            if (typeof _url === 'undefined') {
                console.error('URL is missing!');
                return;
            }


            scion.urlToModel(_url, function(err, model) {

                if (err) {
                    alert('SCXML is not valid!');
                    return;
                }

                // instantiate the interpreter
                _interpreter = new scion.SCXML(model);

                // listener for transitions / state-changes:
                var listener = {
                    onEntry : function(stateName) {
                        statesActive.push(stateName);
                        if (IS_DEBUG_ENABLED) console.debug('SCXML State Entry: "' + stateName + '"');// debug
                    },
                    onExit : function(stateName) {
                        statesActive.pop();

                        if (IS_DEBUG_ENABLED) console.debug('SCXML State Exit: "' + stateName + '"');// debug
                    },
                    onTransition : function(sourceState, targetStatesArray) {
                        
                    	if (IS_DEBUG_ENABLED) console.debug('SCXML State Transition: "' + sourceState + '"->"' + targetStatesArray + '"');// debug

                        if (targetStatesArray && targetStatesArray.length > 1) {
                            console.warn('SCXML State Transition: multiple target states!');
                        }
                    }
                };

                _interpreter.registerListener(listener);
                // _interpreter.start();
                
            });//END: scion.urlToModel(...

            // needed when interpreter.start is executed outside the
            // scion.urlToModel callback!
            // not clear if there is evident need to start the interpreter
            // inside the mmir code
            var isTimeout = false;
            var startTime = new Date();
            var timeout = 10000;

            function isReady() {
                isTimeout = new Date() - startTime > timeout;
                if (!_interpreter && !isTimeout) {
                    setTimeout(function(context) {
                        isReady.call(context);
                    }, 50, this);
                }
                else if (_interpreter) {
                    if (this.onload) {
                    	var scion = scionUtil( _interpreter );
                    	if(!this.evalScript) this.scion.ignoreScript();
                    	this.onload( scion, _defer );
                    }
                }
                else {
                    if (confirm) {
                        var result = confirm('Could not initialize ScxmlEngine (time out).\nContinue to wait another\n ' + (timeout / 1000).toFixed(3) + ' seconds?');
                        if (result) {
                            startTime = new Date();
                            setTimeout(function(context) {
                                isReady.call(context);
                            }, 50, this);
                        }
                        else {
                            console.error('Could not initialize ScxmlEngine (time out).');
                        }
                    }
                    else {
                        console.error('Could not initialize ScxmlEngine (time out).');
                    }
                }
            };//END: isReady(){...

            isReady.call(this);
            
            return _defer.promise();
            
        };//END: load = function(){...

        /** @lends mmir.ScxmlEngine.prototype */
        return {

            getInstance: function () {
            	return this;
            },
            
            load : load,

            onload : null,

            doc : null,

            raise : null            

        };
        
    };//END: newInstance(){...

    define(['scion', 'scionUtil'], function( scion, scionUtil ) {
    	
    	return function ( arg ) {
    		
            _instance = newInstance( scion, scionUtil );
            
            for (key in arg) {
                _instance[key] = arg[key];
            }
            
            return _instance;
                        
    	};
    	
    });

}());
