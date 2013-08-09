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


var mobileDS = window.mobileDS ||
{};

/**
 * A Logger factory.<br>
 * 
 * @example <code>mobileDS.Logging.getInstance('SomeClass')</code>
 * @class Logging
 * @category core
 * 
 * @see mobileDS.Logging#constructor
 */
mobileDS.Logging = (function(){
	
	//private class members
    
    //TODO use real HashMap? (e.g. goog.structs.Map?)
    var loggers = new Object();
    var defaultLogger = null;

	/**
	 * the (global) logging level
	 * 
	 * 0: verbose
	 * 1: debug
	 * 2: info
	 * 3: warn
	 * 4: error
	 * 5: critical
	 */
	var level = 1;
	
	var csvHeader = [
	    'User name', 'Time', 'Modality', 'Recognized speech', 'Event name', 'Event data', 'Dialog state'
	];
	
	function getAsLevel(strLogLevel){
		if(typeof strLogLevel === 'string'){
    		var str = strLogLevel.toLowerCase();
    		if(str === 'verbose'){
    			return 0;
    		} else if(str === 'debug'){
    			return 1;
    		} else if(str === 'info'){
    			return 2;
    		} else if(str === 'warn'){
    			return 3;
    		} else if(str === 'error'){
    			return 4;
    		} else if(str === 'critical'){
    			return 5;
    		} else
    			throw new Error('Logger.getAsLevel: unknown parameter value "'+strLogLevel+'"');
    	}
		
		throw new TypeError('Logger.getAsLevel: parameter must be number or string, but "'+strLogLevel+'" is '+typeof strLogLevel);
	}
	
	/**
	 * Constructor-Method of Class {@link mobileDS.Logging}<br>
	 * @constructor
	 * @augments mobileDS.Logging
	 * @memberOf mobileDS.Logging.prototype
	 */
    function constructor(theName){
    	

    	//private instance members
    	
    	//the name (/key) for the logger instance
    	var loggerName = '';
    	if(typeof theName !== 'undefined'){
    		loggerName = '{'+theName+'} ';
    	}
    	
    	//
    	/**
    	 *	creates the message text.
    	 * @returns {string} the message text 
    	 */
    	function createMsg(className, funcName, msg){
    		
    		var out;
    		
    		if(className){
    			if(funcName){
    				if(msg){
    					out = className+'.'+funcName+': '+msg;
    				} else {
    					
//    					if(arguments.callee !== 'undefined'){
//    						out('callee: '+arguments.callee());
//    					}
    					
    					out = className+': '+funcName;
    				}
    			} else {
    				
//    				if(arguments.callee !== 'undefined'){
//						out('callee: '+arguments.callee());
//					}
    				
    				out = className;
    			}
    		} else {

//				if(arguments.callee !== 'undefined'){
//					out('callee: '+arguments.callee());
//				}
				
    			if(typeof className === 'undefined'){
					out = 'UNDEFINED';
				} else {
					out = 'NULL';
				}
    		}
    		
    		return out;
    	}
    	
    	/**
    	 * Creates error message (with stack trace, if possible).
    	 * 
    	 * @returns {string} the error message
    	 */
    	function createErr(msg, error){
    		
    		var err ='';
    		var errMsg = '';
    		if(error){
    			
    			if(error.name){
    				err = '.'+error.name+' ';
    			}
    			
    			if(error.number){
    				err += '#'+error.number+' ';
    			}
    			
    			if(error.stack){
    				
    				errMsg = error.stack;
    				
    			} else {

	    			if(error.message){
	    				errMsg = ' - ' + error.message;
	    			}
	    			
	    			if(error.description){
	    				errMsg = ' - ' + error.description;
	    			}
	    			
	    			if(error.fileName){
	    				
	    				var lineNo = '';
	    				
	    				if(error.lineNumber){
	    					lineNo = ', line ' + error.lineNumber;
	    				}
	    				
	    				errorMsg += ' ('+error.fileName+lineNo+')'; 
	    			}
    			}
    			
    		}
    		
    		return err+msg+errMsg;
    	}
    	
    	function out(msg, logLevel){
    		var prefix = '';
    		switch(logLevel){
    		case 0:
    			prefix = '[VERBOSE] ';
        		console.log(prefix+loggerName+msg);
    			break;
    		case 1:
    			prefix = '[DEBUG] ';
        		console.debug(prefix+loggerName+msg);
    			break;
    		case 2:
    			prefix = '[INFO] ';
        		console.info(prefix+loggerName+msg);
    			break;
    		case 3:
    			prefix = '[WARN] ';
        		console.warn(prefix+loggerName+msg);
    			break;
    		case 4:
    			prefix = '[ERROR] ';
        		console.error(prefix+loggerName+msg);
    			break;
    		case 5:
    			prefix = '[CRITICAL] ';
        		console.error(prefix+loggerName+msg);
    			break;
    		default:
    			prefix = '[UNDEF_LOG_LEVEL_'+logLevel+'] ';
    			console.log(prefix+loggerName+msg);
    			break;
    		
    		}
    	}
    	
    	function getCsvLine(){
    		return new Array(csvHeader.length);
    	}
    	
    	/** @lends mobileDS.Logging.prototype */
        return {//public instance members
        	/**
        	 * 
			 * 0: verbose
			 * 1: debug
			 * 2: info
			 * 3: warn
			 * 4: error
			 * 5: critical
			 * 
        	 * @returns {number} the logging level
        	 */
            getLevel : function(){
                return level;
            },
            /**
             * Set the logging level.
             * 
             * @param loggingLevel if {number} the logging level as a number
             *                     is {string} the logging level as a string (see #getLevel())
             */
            setLevel : function(loggingLevel){
            	if(typeof loggingLevel === 'number'){
            		level = loggingLevel;
            	} else {
            		level = getAsLevel(loggingLevel);
            	}
            },
            /**
             * Log to file
             */
            log: function(msg){
            	out(createMsg(msg),0);//TODO implement/refactor file-logging
            },
            debug : function(className, funcName, msg){
            	if(this.isDebug()){
            		out(createMsg(className, funcName, msg), getAsLevel('debug'));
            	}
            },
            info : function(className, funcName, msg){
            	if(this.isInfo()){
            		out(createMsg(className, funcName, msg),getAsLevel('info'));
            	}
            },
            warn : function(className, funcName, msg){
            	if(this.isWarn()){
            		out(createMsg(className, funcName, msg),getAsLevel('warn'));
            	}
            },
            error : function(msg,error){
            	if(this.isError()){
	            	if(msg instanceof Error){
	            		out(createErr('',error),4);
	            	} else {
	            		
	            		out(createErr(createMsg(msg), error),getAsLevel('error'));
	            	}
            	}
            },
            isDebug : function(){
            	return mobileDS.Logging.isDebug();
            },
            isInfo : function(){
            	return mobileDS.Logging.isInfo();
            },
            isWarn : function(){
            	return mobileDS.Logging.isWarn();
            },
            isError : function(){
            	return mobileDS.Logging.isError();
            }
        };
    }
    return {//public class members
        getInstance: function(loggerName){
           
            //no logger specified: return default logger
            if(! loggerName){
            	
            	//create default logger, if it does not exist
            	if (defaultLogger == null) {
                	defaultLogger = constructor();
                }
            	
            	return defaultLogger;
            }
            
            if(typeof loggerName !== 'string'){
            	loggerName = loggerName.toString();
            }
            
            //return specified logger
            var theLogger = loggers[loggerName];
            if(typeof theLogger === 'undefined'){
            	//create, if not existing
            	var theNewLogger = cunstructor(loggerName);
            	loggers[loggerName] = theNewLogger;
            	
            	return theNewLogger; 
            	
            } 

            return theLogger;
        },
        isDebug : function(){
        	return level <= getAsLevel('debug');
        },
        isInfo : function(){
        	return level <= getAsLevel('info');
        },
        isWarn : function(){
        	return level <= getAsLevel('warn');
        },
        isError : function(){
        	return level <= getAsLevel('error');
        }
    };
    
})();
