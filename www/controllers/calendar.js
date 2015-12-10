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
    
    //for "pseudo modal" function:
    this.isProcessingFinished = false;
    this.maxProcessingFinishedWaitTime = 350;// wait 350 milliseconds at the most, until isProcessingFinished is reset to true (this is to ensure that even if an error occurred, some functionality will return ...)
    this.CSS_STYLE_CLICK_DISABLER_ID = 'pseudo-modal-click-disabler';
 };

 //This method will be called before rendering the views of this controller.
 Calendar.prototype.on_page_load = function(){
	 
	//set-up render for microphone-levels
	mmir.app.renderer.initPage();
	 
//	 //prevent "click trough" of vclicks/taps from previous view
//	 this.setToPseudoModalState();
	 
//	 var lang = mmir.LanguageManager.getLanguage();
//	 
//	 $(document).find('[data-role=datebox]').each(function () {
//		 $(this).data('mobileDatebox').options.useLang = lang;
//	 });
	 
 };
 
 /*
  * NOTE: if you use page-transitions (animations), this may not be necessary
  *       since the delay due to the animation already prevents the "click through"
  * 
  * "pseudo modal" state:
  * 
  * this adds a full-screen layer "in front" of the
  * current view, which catches all tap/click events.
  * 
  * -> effectively this disables all touch/click input events.
  * 
  * This can help preventing jQuery Mobile's problem with vclick
  * events (and tap-events!), that "click through", i.e. when the corresponding
  * click-event (for the vclick) is triggered on an element
  * at the same position after a page-change
  * (for more see warning-boxes "Warning: Use vclick with caution" and 
  *  "Canceling an element's default click behavior"
  *  on http://api.jquerymobile.com/vclick/)
  * 
  * 
  * After calling the function, the added DISABLEING-layer will be
  * removed again after 
  * {@link #maxProcessingFinishedWaitTime} milliseconds, by 
  * calling {@link #resetPseudoModalState}
  * 
  * You can remove the layer before this timeout, by
  * calling {@link #resetPseudoModalState} directly
  * (which automatically cancels the timeout).
  * 
  * 
  */
 Calendar.prototype.setToPseudoModalState = function(){
	 
	 var self = this;
	 self.isProcessingFinished = false;
	 
	 jQuery('body').prepend(//<- prepend in order to allow quick-selection on removal-call (in reset-function below)
		  '<style id="'+this.CSS_STYLE_CLICK_DISABLER_ID+'">'
//		+ '	a,button,div,span,input {'
		+ '	* {'
		+ '	   pointer-events: none;'
		+ '	   cursor: default;'
		+ '	}</style>'
	 );

//	 jQuery('body').prepend(
//			 '<div id="'+this.CSS_STYLE_CLICK_DISABLER_ID
//			   +'" style="height: 100%; width: 100%;'
//			   +' background-color: #DDDDDD; opacity: 0;'//NOTE on Android, this may not be invisible (in spite of opacity 0), when the page contains a canvas-element!
//			   +'position: absolute; top: 0; left: 0;'
//			   +'z-index: 999999;display: block;"></div>'
//	 );
	 
	 self.reEnableEventProcessingTimer = setTimeout(function(){
		 self.resetPseudoModalState();
		 
	 }, self.maxProcessingFinishedWaitTime);
 };
 Calendar.prototype.resetPseudoModalState = function(){
	 
	 jQuery('#'+this.CSS_STYLE_CLICK_DISABLER_ID).remove();
	 
	 this.isProcessingFinished = true;
	 if(this.reEnableEventProcessingTimer){
		 clearTimeout(this.reEnableEventProcessingTimer);
		 this.reEnableEventProcessingTimer = null;
	 }
	 
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
  mmir.ModelManager.getModel('CalendarModel').getInstance().save_appointment(jData, cb_func);
};
