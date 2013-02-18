/*
 *  base on http://www.joelpeterson.com/blog/2010/12/quick-and-easy-windowless-popup-overlay-in-jquery/
 *
 *
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


function loadPopup(prefix){  
    //loads popup only if it is disabled  

    var dataPrefix = '', popupBgDiv;
    if (prefix != null) {
	dataPrefix = '[data-prefix="'+prefix+'"]';
    }

    if (typeof($("div.popupBg" + dataPrefix).data("state")) === 'undefined') {
	$("div.popupBg" + dataPrefix).last().data("state", 0);
    }

    popupBgDiv = $("div.popupBg" + dataPrefix).last();
    console.log(">>>> " + typeof(popupBgDiv.data('state')));

    if(popupBgDiv.data("state")==0 || typeof(popupBgDiv.data('state')) === 'undefined'){
	popupBgDiv.data('state', 0);
	centerPopup(prefix); 
        $("div.popupBg" + dataPrefix).last().fadeIn("medium"); 
        $("div.Popup" + dataPrefix).last().fadeIn("medium");  
        $("div.popupBg" + dataPrefix).last().data("state",1);  
	$("div.Popup"+ dataPrefix + " .close").last().unbind("click");
	$("div.Popup" + dataPrefix + " .close").last().click(function(){  
            disablePopup(prefix);  
	});
	$("div.popupBg" + dataPrefix).unbind('click');
	$("div.popupBg" + dataPrefix).click(function(){  
            disablePopup(prefix);  
	});
    }  
}  

function disablePopup(prefix){  
    var dataPrefix = '';
    if (prefix != null) {
	dataPrefix = '[data-prefix='+prefix+']';
    }

    if ($("div.popupBg" + dataPrefix).last().data("state")==1){  
        $("div.popupBg" + dataPrefix).last().fadeOut("medium");  
        $("div.Popup" + dataPrefix).last().fadeOut("medium");  
        $("div.popupBg" + dataPrefix).last().data("state",0);  
    }  
}  

function centerPopup(prefix){
    var dataPrefix = '';
    if (prefix != null) {
	dataPrefix = '[data-prefix='+prefix+']';
    }
  
    var winw = $(window).width();  
    var winh = $(window).height();  
    var popw = $('div.Popup' + dataPrefix).last().width();  
    var poph = $('div.Popup' + dataPrefix).last().height();  
    $("div.Popup" + dataPrefix).last().css({  
        "position" : "absolute",  
        "top" : 55,  
        "left" : 15  
    });  
    //IE6  
    $("div.popupBg" + dataPrefix).last().css({  
        "height": winh    
    });  
}