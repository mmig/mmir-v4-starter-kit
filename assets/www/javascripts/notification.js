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

mobileDS.Notification = (function(){
    //private members
    var instance;
    
    
    
  //private methods
    function constructor(){
    
    	// The watch id references the current `watchHeading`
        var watchID = null;
        var options = {
            frequency: 500
        };
        
        // onSuccess: Get the current heading
        //
        function onSuccess(heading) {
            
        	if(IS_DEBUG_ENABLED) console.debug('Heading: ' + heading.magneticHeading);//debug
        }

        // onError: Failed to get the heading
        //
        function onError(compassError) {
            alert('Compass error: ' + compassError.code);
        }
        
        return { //public members and methods
            
            vibrate: function(milliseconds){
            	navigator.notification.vibrate(milliseconds);
            },
            alert: function(message, alertCallback, title, buttonName){
            	navigator.notification.alert(message, alertCallback, title, buttonName);
            },
            
            confirm: function(message, confirmCallback, title, buttonLabels){
            	navigator.notification.confirm(message, confirmCallback, title, buttonLabels);
            },
            
            beep: function(times){
            	navigator.notification.beep(times);
            }
        }
    }
        return {
        getInstance: function(){
            if (!instance) {
                instance = constructor();
            }
            return instance;
        }
    }
})();