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


var mmir = window.mmir ||
{};

mmir.CalendarModel = (function(){
    var instance = null;

    function constructor(){

        var calendar_server_url = 'http//...';

        return {

            save_appointment: function(data, cb_func){
            	//We assume that the appointment should be created at a
                //server running on 'THE-CALENDAR-SERVER-URL' and send
                //the information via POST request to that server.
                var user_name = mmir.model.get('User').getInstance().getName();

                var calendar_server_url = 'calendar_server_url';//mmir.ConfigurationManager.get('calendar_server_url');

                var options = {
                    type: 'POST',
                    url: calendar_server_url + '?user_name=' + user_name,
                    data: data,
                    success: cb_func
                };

                //MOCK AJAX function:
                var send = function(options){
                	console.info('MOCK AJAX request with options: '+JSON.stringify(options));
                	if(options.success){
                		options.success();
                	}
                };

                //MOCK AJAX request:
                send(options);

//              $.ajax(options);
            }

        };
    }

    return {
        getInstance: function(){
            if (instance === null) {
                instance = constructor();
            }
            return instance;
        }
    };

})();
