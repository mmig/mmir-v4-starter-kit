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


/*jslint bitwise: false */
/*global $, window */
"use strict";
// TODO: add timezone for calendar events

/**
 * Function : dump()
 * Arguments: The data - array,hash(associative array),object
 *    The level - OPTIONAL
 * Returns  : The textual representation of the array.
 * This function was inspired by the print_r function of PHP.
 * This will accept some data as the argument and return a
 * text that will be a more readable version of the
 * array/hash/object that is given.
 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
 */
function dump(arr,level) {
    var dumped_text = "";
    if(!level) level = 0;
    
    //The padding given at the beginning of the line.
    var level_padding = "";
    for(var j=0;j<level+1;j++) level_padding += "    ";
    
    if(typeof(arr) == 'object') { //Array/Hashes/Objects 
	for(var item in arr) {
	    var value = arr[item];
	    
	    if(typeof(value) == 'object') { //If it is an array,
		dumped_text += level_padding + "'" + item + "' ...\n";
		dumped_text += dump(value,level+1);
	    } else {
		dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
	    }
	}
    } else { //Strings/Chars/Numbers etc.
	dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
    }
    return dumped_text;
}

// implement a trim method for Strings (copied from http://blog.stevenlevithan.com/archives/faster-trim-javascript)
String.prototype.trim = function () {
    var str = this.replace(/^\s\s*/, ''),
	ws = /\s/,
	i = str.length;
    while (ws.test(str.charAt(i - 1))) { i -= 1; }
    return str.slice(0, i);
};

// from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
function createUUID() {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	var r = Math.random() * 16|0, v = c === 'x' ? r : (r&0x3|0x8);
	return v.toString(16);
    });
}

function twoDigits(number) {
    return (number > 9 ? '' + number : '0' + number);
}

function SendRequestException(responseText, responseXML, msg, fail) {
    this.responseText = responseText;
    this.responseXML = responseXML;
    this.msg = msg;
    this.fail = fail;

    SendRequestException.prototype.toString = function () {
	return 'Failed: ' + this.responseText + "\n" + this.responseXML + "\n" + this.msg + "\n" + this.fail;
    };
}

function sendRequest(url, credentials, body, method, headers) {
	var response;
	var options = {
		type: method,
		contentType: 'text/calendar; charset=UTF-8',
		dataType: 'html',
		data: body,
		processData: false,
		async: false,
		crossDomain: true,
		headers: $.extend({'Authorization': 'BASIC ' + credentials }, headers),
		timeout: 5000
		// xhrFields: { withCredentials: true }
	};
	
	console.info('Sending AJAX request with options: '+JSON.stringify(options));
	
	$.ajax(url, options).done(function (res) {
		// alert(res);
		response = res;
	}).error(function (xhr, msg, fail) {
		// window.alert();
		if (typeof(xhr) !== 'undefined') {
			throw new SendRequestException(xhr.responseText, xhr.responseXML, msg, fail);
		} else {
			throw "send request failed " + msg + "  " + fail;
		}
	});

	return response;
}

// =========== Base64 encoder
// TODO: some strings are improperly encoded...
/*jslint nomen: false */
var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "",
	chr1, chr2, chr3, enc1, enc2, enc3, enc4,
	i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i);
	i += 1;
        chr2 = input.charCodeAt(i);
	i += 1;
        chr3 = input.charCodeAt(i);
	i += 1;

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "",
	chr1, chr2, chr3,
	enc1, enc2, enc3, enc4,
	i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i));
	i += 1;
        enc2 = this._keyStr.indexOf(input.charAt(i));
	i += 1;
        enc3 = this._keyStr.indexOf(input.charAt(i));
        i += 1;
	enc4 = this._keyStr.indexOf(input.charAt(i));
	i += 1;

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "",
	n, c;

    for (n = 0; n < string.length; n += 1) {

        c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "",
	i = 0,
	c = 0,
	c1 = 0,
	c2 = 0,
	c3;

    while (i < utftext.length) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i += 1;
        }
        else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

};

// ======= Helper for development ====

function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
    return 'AssertException: ' + this.message;
};

function assert(exp, message) {
    if (!exp) {
	throw new AssertException(message);
    }
}

// Helper for Reminder
function Interval(years, months, days, hours, minutes, seconds) {
    Interval.prototype.initInterval = function (years, months, days, hours, minutes, seconds) {
	// data has to be date conform, i.e. there are no more than 23 hours, etc.
	this.years = parseInt("0" + years, 10);
	this.months = parseInt("0" + months, 10);
	this.days = parseInt("0" + days, 10);
	this.hours = parseInt("0" + hours, 10);
	this.minutes = parseInt("0" + minutes, 10);
	this.seconds = parseInt("0" + seconds, 10);
    };

    Interval.prototype.getYears = function () { return this.years; };
    Interval.prototype.getMonths = function () { return this.months; };
    Interval.prototype.getDays = function () { return this.days; };
    Interval.prototype.getHours = function () { return this.hours; };
    Interval.prototype.getMinutes = function () { return this.minutes; };
    Interval.prototype.getSeconds = function () { return this.seconds; };

    Interval.prototype.toString = function () {
	return this.getYears() + "Y" + this.getMonths() + "M" + this.getDays() + "D" + this.getHours() + "h" + this.getMinutes() + "m" + this.getSeconds() + "s";
    };

    Interval.prototype.subtractFromTime = function (fromTime) {
	assert(fromTime instanceof Date, 'fromTime has to be instance of Date');
	var s, m, h, d, mnth, y, mnthDays, checkDate;
	s = fromTime.getSeconds();
	m = fromTime.getMinutes();
	h = fromTime.getHours();
	d = fromTime.getDate();
	mnth = fromTime.getMonth();
	y = fromTime.getFullYear();

	s -= this.seconds;
	if (s < 0) { m -= 1; s += 60; }
	m -= this.minutes;
	if (m < 0) { h -= 1; m += 60; }
	h -= this.hours;
	if (h < 0) { d -= 1; h += 24; }
	d -= this.days;
	if (d < 1) { mnth -= 1; }
	mnth -= this.months;
	if (mnth < 0) { y -= 1; mnth += 12; }
	y -= this.years;
	if (d < 1) {
	    if (mnth != 1) { // when not in february
		mnthDays = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		d += mnthDays[mnth];
	    } else {
		// check for leapYear
		checkDate = new Date(y, 1, 29);
		if (checkDate.getMonth() == 1) {
		    d += 29;
		} else {
		    d += 28;
		}
	    }
	}

	return new Date(y, mnth, d, h, m, s);
    };
  
    // initialize instance
    this.initInterval(years, months, days, hours, minutes, seconds);
}

// =========== start of calendar tools ===================
// reminders
function Reminder(time, event) {
    /*global CalendarEvent */
    Reminder.prototype.initReminder = function (time, event) {
	if (time != null) {
	    assert(time instanceof Interval, 'time has to be instance of Interval');
	}
	if (event != null) {
	    assert(event instanceof CalendarEvent, 'event has to be instance of CalendarEvent');
	}
	if (event != null && time != null) {
	    this.start = this.time.subtractFromTime(event.start.getTime());
	} else {
	    this.start = null;
	}
	this.time = time || new Date(0);
	this.event = event || null;
    };

    Reminder.prototype.getTime = function () {
	return this.time;
    };

    Reminder.prototype.toString = function () {
	return this.time.toString();
    };

    Reminder.prototype.getId = function () {
	if (this.event != null) {
	    return this.event.getId() + this.toString();
	} else {
	    return this.toString();
	}
    };
    
    Reminder.prototype.setEvent = function (event) {
	assert(event instanceof CalendarEvent, 'event has to be instance of CalendarEvent');
	this.event = event;
	this.start = this.time.subtractFromTime(event.start);
    };

    // initialize
    this.initReminder(time, event);
}

function EmailReminder(email, time) {
    EmailReminder.prototype.initEmailReminder = function (email, time) {
	this.initReminder(time);
	this.email = email;
    };

    // initialize
    this.initEmailReminder(email, time);
}
EmailReminder.prototype = new Reminder();

/*
  The base calendar event, that contains the needed data.
  summary - name of the event
  description - description of its contents
  links - resources linked to this event
  start - Date the event starts
  end - Date it ends
*/
function CalendarEvent(summary, description, links, start, end) {
    CalendarEvent.prototype.initCalendarEvent = function (summary, description, links, start, end) {
	if (start != null && end != null) {
	    assert(start instanceof Date, 'start must be instance of Date');
	    assert(end instanceof Date, 'end must be instance of Date');
	}

        // initialize and define the properties for this class
        this.summary = summary || "";
	this.description = description || "";
	this.links = links || [];
	this.start = start || new Date();
	this.end = end || new Date();
	this.reminders = [];
    };
    
    // make String from data
    CalendarEvent.prototype.toString = function () {
	return "SUMMARY:" + this.summary + "; Description: " + this.description + "; links: " + this.links.toString() + "; Start: " + this.start + "; End: " + this.end + "  reminders:" + this.reminders;
    };

    // add reminder
    CalendarEvent.prototype.addReminder = function (reminder) {
	assert(reminder instanceof Reminder, 'cannot insert non reminder objects as reminder');
	this.reminders.push(reminder);
	reminder.setEvent(this);
    };

    // get Id
    CalendarEvent.prototype.getId = function () {
	return this.toString();
    };

    // initialize instance
    this.initCalendarEvent(summary, description, links, start, end);
}

/*
  specialized CalDav Email Reminder
*/
function CalDavEmailReminder(email, time) {
    CalDavEmailReminder.prototype.initCalDavEmailReminder = function (email, time) {
	this.initEmailReminder(email, time);
	// this.email = email;
	// this.time = time;
    };
    
    // helper to convert time to calDav compatible interval
    function getTimeString(time) {
	var tString;
	tString = "-P";
	if (time.getDays() > 0) { tString += time.getDays() + "D"; }
	tString += "T";
	if (time.getHours() > 0) { tString += time.getHours() + "H"; }
	if (time.getMinutes() > 0) { tString += time.getMinutes() + "M"; }
	if (time.getSeconds() > 0) { tString += time.getSeconds() + "S"; }
	return tString;
    }

    // make protocol compatible String from data
    CalDavEmailReminder.prototype.toString = function () {
	return "BEGIN:VALARM\r\nACTION:EMAIL\r\nATTENDEE:" + this.email + "\r\nTRIGGER:" + getTimeString(this.time) + "\r\nEND:VALARM";
    };
    
    // initialize
    this.initCalDavEmailReminder(email, time);
}
CalDavEmailReminder.prototype = new EmailReminder();

/*
  specialized calendar event for calDav calendars.
  contains also an id to identify it within the remote calDav calendar
*/
function CalDavCalendarEvent(id, summary, description, links, start, end) {
    CalDavCalendarEvent.prototype.initCalDavCalendarEvent = function (id, summary, description, links, start, end) {
	this.initCalendarEvent(summary, description, links, start, end);
	this.id = id || -1;
    };
    
    function parseDate(date) {
	var dateParts = date.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
	// document.writeln("<br />------"+date+"     "+dateParts);
	return new Date(dateParts[1], dateParts[2] - 1, dateParts[3], dateParts[4], dateParts[5], dateParts[6]);
    }

    // set Data from calDav line
    var dtstart = /DTSTART/,
	dtend = /DTEND/; 
    CalDavCalendarEvent.prototype.setData = function (field, line) {
	var SPLITTER, splitIndex, linkPart, LINKSPLITTER;
	switch (field.toUpperCase()) {
	case 'SUMMARY': this.summary = line; break;
	case 'DESCRIPTION':
	    SPLITTER = '&lt;br /&gt;&lt;br /&gt;';
	    splitIndex = line.lastIndexOf(SPLITTER);
	    if (splitIndex > -1) {
		this.description = line.substring(0, splitIndex);
		linkPart = line.substring(splitIndex + SPLITTER.length);
		LINKSPLITTER = '&lt;br /&gt;';
		if (linkPart.indexOf(LINKSPLITTER) > -1) {
		    this.links = linkPart.split(LINKSPLITTER);
		} else {
		    this.links = [linkPart];
		}
	    } else {
		this.description = line;
	    }
	    break;
	case 'UID': this.id = line.trim(); break;
	}
	if (dtstart.test(field.toUpperCase())) { this.start = parseDate(line); }
	if (dtend.test(field.toUpperCase())) { this.end = parseDate(line); }
    };
    
    // 
    CalDavCalendarEvent.prototype.toString = function () {
	return "Id: " + this.id + "; SUMMARY:" + this.summary + "; Description: " + this.description + "; links: " + this.links.toString() + "; Start: " + this.start + "; End: " + this.end + "  \n\n " + this.reminders.toString();
    };

    //
    CalDavCalendarEvent.prototype.getId = function () {
	return this.id;
    };
    
    // initialize
    this.initCalDavCalendarEvent(id, summary, description, links, start, end);
}
CalDavCalendarEvent.prototype = new CalendarEvent();

/*
  interface: CalendarClient<EventType>
*/
/**
 * Adds an Event to the connected calendar and then returns an Event Object to identify the added one.
 * @param event	CalendarEvent to add
 * @return	an Event, that may be used to refer to the added in the Calendar.
 */
// public EventType addEvent (CalendarEvent event) throws IOException;

/**
 * Retrieve all Events from the connected calendar within start and end bounds.
 * @param start	lower bound date to search for events
 * @param end upper bound date to search for events
 * @return a List of Events, that refer to the calendar's and occur between start and end
 */
// public List<EventType> findEvents (Date start, Date end) throws IOException;

/**
 * Retrieve all Events from the connected calendar with Reminders within start and end bounds.
 * @param start	lower bound date to search for reminders
 * @param end upper bound date to search for reminders
 * @return a List of Events, that refer to the calendar's and that have Reminders occurring between start and end
 */
// public List<EventType> findEventsByReminders (Date start, Date end) throws IOException;

/**
 * Remove the given Event from the connected calendar. It has no effect, if the given Event does not exist.
 * @param event Event to delete
 */
// public void deleteEvent (EventType event) throws IOException;



function CalDavTimezone() {
    CalDavTimezone.prototype.getVTimezone = function () {
	return "X-WR-TIMEZONE:Europe/Berlin\r\nBEGIN:VTIMEZONE\r\nTZID:Europe/Berlin\r\nBEGIN:DAYLIGHT\r\nTZOFFSETFROM:+0100\r\nTZOFFSETTO:+0200\r\nTZNAME:CEST\r\n" + 
	    "DTSTART:19700329T020000\r\nRRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU\r\nEND:DAYLIGHT\r\n" +
	    "BEGIN:STANDARD\r\nTZOFFSETFROM:+0200\r\nTZOFFSETTO:+0100\r\nTZNAME:CET\r\nDTSTART:19701025T030000\r\n" + 
	    "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU\r\nEND:STANDARD\r\nEND:VTIMEZONE";
    };
}

/*
  special calendar client for calDav calendars implementing CalendarClient
*/
function CalDavCalendarClient(uri, user, password) {
    CalDavCalendarClient.prototype.initCalDavCalendarClient = function (uri, user, password) {
        // initialize and define the properties for this class
        this.uri = uri || "";
	this.user = user || "";
	this.password = password || "";
        this.credentials = Base64.encode(this.user + ':' + this.password);
    };
        
    //
    function formatDate(date) {
	return date.getFullYear() + twoDigits(date.getMonth() + 1) + twoDigits(date.getDate()) + 'T' + twoDigits(date.getHours()) + twoDigits(date.getMinutes()) + twoDigits(date.getSeconds()) + 'Z';
    }
    
    //
    function buildVEvent(uuid, summary, description, start, end, reminders) {
	var now, msg, rLen, r, tz;
	now = new Date();
	tz = new CalDavTimezone();
	msg = tz.getVTimezone() + "\r\nBEGIN:VEVENT\r\nUID:" + uuid + "\r\nDTSTAMP:" + formatDate(now) + "\r\nDTSTART:" + formatDate(start) + "\r\nDTEND:" + formatDate(end) + "\r\nSUMMARY:" + summary + "\r\nDESCRIPTION:" + description;
	rLen = reminders.length;
	for (r = 0; r < rLen; r += 1) {
	    msg += "\r\n" + reminders[r].toString();
	}
	msg += "\r\nEND:VEVENT";
	return msg;
    }
    
    // add Event ========================================================
    CalDavCalendarClient.prototype.addEvent = function (event) {
	assert(event instanceof CalendarEvent, 'May only add CalendarEvents.');
	var uuid = createUUID(),
	    eventMsg = buildVEvent(uuid, event.summary, event.description + "<br /><br />" + event.links.join('<br />'), event.start, event.end, event.reminders),
	
	    headers = {'If-None-Match': '*'},
	    body = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//DFKI//javascript CalDav Client//EN\r\nCALSCALE:GREGORIAN\r\n" + eventMsg + "\r\nEND:VCALENDAR",
	    response;
	// alert(body);

	// send request
	response = sendRequest(this.uri + uuid + '.ics', this.credentials, body, 'PUT', headers);
	//document.writeln(response);
	// alert(response);
	// build and return CalDavCalendarEvent
	return new CalDavCalendarEvent(uuid, event.summary, event.description, event.links, event.start, event.end);
    };

    function parseInterval(intervalString) {
	var dateParts = intervalString.match(/-P(\d*)D?(?:T(\d*)H?(\d*)M?(\d*)S?)?/),
	    interval = new Interval(0, 0, dateParts[1], dateParts[2], dateParts[3], dateParts[4]);
	return interval;
    }

    // parse data object
    function parseData(data) {
	var event, field;

	if (data.BEGIN === "VALARM") {
	    if (data.ACTION === "EMAIL") {
		// alert(dump(data));
		return new CalDavEmailReminder(data.ATTENDEE, parseInterval(data.TRIGGER));
	    }
	}
	if (data.BEGIN === "VEVENT") {
	    event = new CalDavCalendarEvent();
	    for (field in data) {
		event.setData(field, data[field]);
	    }
	    return event;
	}
	return null;
    }

    function removeNewLines(line) {
	var ns = /[\n\r]/,
	    i = line.length - 1;
	while (ns.test(line.charAt(i))) { i -= 1; }
	return line.slice(0, i + 1);
    }

    function parseEvents(response) {
	var events = [],
	    xmlParseStart, xmlParseEnd, calendarContent, found, start, end,
	    lines, line, level, beginRegExp, endRegExp, reminders, curDataStack, curData, i, r, splitter, parsed,
	    calDavLine = /^[A-Za-z\-;=\/]+:.*?\r\n/,
	    calDavNewLine = /^\s.*?\r\n/;

	// parse out calendar from xml data
	xmlParseStart = new RegExp('<[^/<]*?calendar-data.*?>', 'i');
	xmlParseEnd = new RegExp('<\/.*?calendar-data.*?>', 'i');

	calendarContent = "";

	// TODO: fully parse XML
	found = xmlParseStart.exec(response);
	while (found != null) {
	    start = response.indexOf(found) + found[0].length;
	    found = xmlParseEnd.exec(response);
	    end = response.indexOf(found);
	    calendarContent += response.substring(start, end) + "\r\n";
	    response = response.substring(end + found[0].length);
	    found = xmlParseStart.exec(response);
	}

	// parse Event data
	lines = [];
	found = calDavLine.exec(calendarContent);
	while (found != null) {
	    line = found[0];
	    calendarContent = calendarContent.substring(found[0].length);
	    while (!calDavLine.test(calendarContent)) {
		found = calDavNewLine.exec(calendarContent);
		if (found == null) {
		    break;
		}
		line = removeNewLines(line) + found[0].substring(1);
		calendarContent = calendarContent.substring(found[0].length);
	    }
	    found = calDavLine.exec(calendarContent);
	    lines.push(line);
	}

	line = '';
	level = 0;
	beginRegExp = /^BEGIN:/;
	endRegExp = /^END:/;

	reminders = [];

	curDataStack = [];
	curData = {};
	i = 0;

	for (i in lines) {
	    if (typeof(lines[i]) === 'string') {
		line = lines[i];
		if (beginRegExp.test(line)) {
		    level += 1;
		    curDataStack.push(curData);
		    curData = {};
		}

		// add read data to curData
		splitter = line.indexOf(":");
		curData[line.substring(0, splitter).trim()] = line.substring(splitter + 1).trim();

		if (endRegExp.test(line)) {
		    level -= 1;
		    parsed = parseData(curData);
		    if (parsed instanceof Reminder) {
			reminders.push(parsed);
		    }
		    if (parsed instanceof CalendarEvent) {
			for (r in reminders) {
			    if (reminders[r] instanceof Reminder) { parsed.addReminder(reminders[r]); }
			}
			reminders = [];
			events.push(parsed);
		    }
		    curData = curDataStack.pop();
		}
	    }
	}

	return events;
    }

    // find Events ========================================================
    CalDavCalendarClient.prototype.findEvents = function (start, end) {
	assert(start instanceof Date, 'May only use Date as start.');
	assert(end instanceof Date, 'May only use Date as end.');

	var fStart, fEnd, request, response;

	fStart = formatDate(start);
	fEnd = formatDate(end);
	request = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><C:calendar-query xmlns:C="urn:ietf:params:xml:ns:caldav" xmlns:D="DAV:"><D:prop><C:calendar-data>';
	request += '<C:expand start="' + fStart + '" end="' + fEnd + '" /></C:calendar-data>';
	request += '</D:prop><C:filter><C:comp-filter name="VCALENDAR"><C:comp-filter name="VEVENT"><C:time-range';
	request += ' start="' + fStart + '"';
	request += ' end="' + fEnd + '" ';
	request += '/></C:comp-filter></C:comp-filter></C:filter></C:calendar-query>';

	response = sendRequest(this.uri, this.credentials, request, 'REPORT', null);
	// alert(response);
	// document.writeln(response);
	return parseEvents(response);
    };
    
    // find Events by Alarm ================================================
    CalDavCalendarClient.prototype.findEventsByAlarm = function (start, end) {
	assert(start instanceof Date, 'May only use Date as start.');
	assert(end instanceof Date, 'May only use Date as end.');
	var request, fStart, fEnd, response, events, filteredEvents, e, r, checkDate;
	fStart = formatDate(start);
	fEnd = formatDate(end);
	request = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><C:calendar-query xmlns:C="urn:ietf:params:xml:ns:caldav" xmlns:D="DAV:"><D:prop><C:calendar-data>';
	request += '<C:expand start="' + fStart + '" end="' + fEnd + '" /></C:calendar-data>';
	request += '</D:prop><C:filter><C:comp-filter name="VCALENDAR"><C:comp-filter name="VEVENT"><C:comp-filter name="VALARM"><C:time-range';
	request += ' start="' + fStart + '"';
	request += ' end="' + fEnd + '" ';
	request += '/></C:comp-filter></C:comp-filter></C:comp-filter></C:filter></C:calendar-query>';
	// alert(request);
	response = sendRequest(this.uri, this.credentials, request, 'REPORT', null);
	// document.writeln(response);

	events = parseEvents(response);

	// filter out events, that have no alarm within [start, end]
	filteredEvents = [];
	for (e in events) {
	    if (events[e] instanceof CalendarEvent) {
		for (r in events[e].reminders) {
		    if (events[e].reminders[r] instanceof Reminder) {
			checkDate = events[e].reminders[r].getTime().subtractFromTime(events[e].start);
			if (checkDate.getTime() >= start.getTime() && checkDate.getTime() <= end.getTime()) {
			    filteredEvents.push(events[e]);
			    break;
			}
		    }
		}
	    }
	}

	return filteredEvents;
    };
    

    // delete Event ========================================================
    CalDavCalendarClient.prototype.deleteEvent = function (event) {
	assert(event instanceof CalDavCalendarEvent, 'May only delete CalDavCalendarEvents.');
	var headers, body, eventRequest, response;

	headers = {'If-None-Match': '*'};
	body = '';
	eventRequest = this.uri + event.id + '.ics';
	
	// send request
	response = sendRequest(eventRequest, this.credentials, body, 'DELETE', headers);
	//document.writeln(response);
	// alert(response);
    };
    
    // initialize
    this.initCalDavCalendarClient(uri, user, password);
}
