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


 //application namespace 
 var mmir = window.mmir || {};

 //controller's constructor  
 var Calendar = function(){
    this.name = "Calendar";
 };

 //This method will be called before rendering the views of this controller.
 Calendar.prototype.on_page_load = function(){
	 
 };

 //This method will be called only for view create_appointment, after on_page_load was called
 Calendar.prototype.on_page_load_create_appointment = function(){
//	 $('#create_appointment input').each(function(index, el) {
//		var tis = $(this);
//		if ('datebox' == tis.attr('data-role')) {
//			
//			tis.on('focus vclick', function(event) {
//				$('a', tis.parent()).trigger('click');
//			});
//			
//		}
//	});
 };

 Calendar.prototype.create_appointment = function (data){
  var container_id = data.container_id;
  var container = $("#" + container_id);
  var subject = $("#subject", container).val();
  
  var enteredDate = $("#app-date", container).datebox('getTheDate');
  var year = enteredDate.getFullYear();
  var month = enteredDate.getMonth() + 1;
  var day = enteredDate.getDate();
  
  var startTime = $("#start-time", container).datebox('getTheDate');
  var start_h = startTime.getHours();
  var start_m = startTime.getMinutes();
  
  var endTime = $("#end-time", container).datebox('getTheDate');
  var end_h = endTime.getHours();
  var end_m = endTime.getMinutes();
  

  var note = $("#note", container).val();
  if(typeof note !== 'string'){
	  note = '';
  }
  else {
	  note = note.escapeDoubleQuotes()
  				.replaceAll('\r\n','\\r\\n').replaceAll('\n','\\n');
  }
  
  var eventData = '{"subject":"' + subject + '","year":"' + year + 
                  '","month":"' + month+'","day":"' + day + 
                  '","start_hours":"' + start_h+'","start_minutes":"' + start_m +
                  '","end_hours":"' + end_h+'","end_minutes":"' + end_m+
                  '","note":"' + note + '"}';
					 
  var jData = jQuery.parseJSON(eventData);
  var cb_func = function(){
    alert("STUB: appointment successfully created!\n\n"+JSON.stringify(jData, null, 2));
  };
  mmir.CalendarModel.getInstance().save_appointment(jData, cb_func);
};
