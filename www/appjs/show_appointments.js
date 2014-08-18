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


"use strict";

function Parametered() {
    this.name = '';
    this.parameters = [];
    this.reParseCallback = function(){};
    this.parsed = false;

    Parametered.prototype.ParameteredInit = function () {
	this.init();

	this.paramMap = {};

	var i = 0, pLen = this.parameters.length, regString, params;
	for (i = 0; i < pLen; i += 1) {
	    regString = this.parameters[i].getRegExpString();
	    params = this.paramMap[regString];
	    if (params == null) {
		params = [];
		this.paramMap[regString] = params;
	    }
	    params.push(this.parameters[i]);
	}
    };

    Parametered.prototype.init = function () {
    };

    Parametered.prototype.getRegExpString = function () {
	return "^" + this.name + "[0-9]*$";
    };

    Parametered.prototype.afterParseCallback = function () {
    };

    Parametered.prototype.resetParsedFlags = function () {
	var param;
	for (param in this.parameters) {
	    param.parsed = false;
	}
    };

    Parametered.prototype.setCallback = function (cb) {
	this.reParseCallback = cb;
    };

    function findParameter(key, data, paramMap) {
	var paramKey, reg, param, s, sout;
	for (paramKey in paramMap) {
	    reg = new RegExp(paramKey);
	    if (reg.test(key)) {
		param = paramMap[paramKey].shift();
		if (param != null) {
		    param.parse(data[key]);
		    return param;
		}
	    }
	}
	
	return null;
    }

    Parametered.prototype.parse = function (data) {
	var key;
	this.ParameteredInit();

	if (typeof(data) !== 'undefined' && typeof(data[this.name]) !== 'undefined') {
	    this.parse(data[this.name]);
	} else {
	    for (key in data) {
		findParameter(key, data, this.paramMap);
	    }
	    this.parsed = true;
	    this.afterParseCallback();
	    this.reParseCallback(this);
	}
	// alert(dump(this));
	// alert(">>> " + dump(this.paramMap));
    };

    // this.ParameteredInit();
}

function TimeParam() {
    this.name = 'time';
    this.hour = 0;
    this.minute = 0;

    TimeParam.prototype.getRegExpString = function () {
	return "^" + this.name + "(?:[A-Z]?[a-zA-Z0-9]*)?$";
    };

    TimeParam.prototype.parse = function (data) {
	var time;
	if (data != 'undefined' && data.time != 'undefined') {
	    time = data.time.split(':');
	    this.hour = parseInt(time[0], 10);
	    this.minute = parseInt(time[1], 10);
	}
    };
}

function DateParam() {
    var today = new Date();
    this.name = 'date';
    this.day = today.getDate();
    this.month = today.getMonth() + 1;
    this.year = today.getFullYear(); 
    
    DateParam.prototype.getRegExpString = function () {
	return "^" + this.name + "[0-9]*$";
    };

    DateParam.prototype.parse = function (data) {
	var date, parsed;
	if (data !== 'undefined') {
	    data = data.date;
	    if (data.dateString != 'undefined') {
		if (data.dateString.day !== 'undefined') {
		    this.day = parseInt(data.dateString.day, 10);
		}
		if (data.dateString.month !== 'undefined') {
		    this.month = data.dateString.month;
		    parsed = parseInt(this.month, 10);
		    if (parsed != this.month) {
			this.month = mobileDS.LanguageManager.getInstance().getText(this.month);
			parsed = parseInt(this.month, 10);
			if (parsed != this.month) {
			    this.month = data.dateString.month;
			}
		    }
		}
		if (data.dateString.year !== 'undefined') {
		    this.year = parseInt(data.dateString.year, 10);
		}
	    }
	    if (data.date != 'undefined') {
		date = data.date.split('.');
		// TODO: what's with date input of different languages ?
		this.day = parseInt(date[0], 10);
		this.month = parseInt(date[1], 10);
		this.year = parseInt(date[2], 10);
	    }
	    if (data.variable != 'undefined') {
		var dateVariable = mobileDS.LanguageManager.getInstance().getText(data.variable);
		    dateGoal = new Date(today.getTime());
		if (dateVariable === 'today') {
		    // do nothin', as it is already set
		} else if (dateVariable === 'tomorrow') {
		    dateGoal.setDate(dateGoal.getDate() + 1);
		} else if (dateVariable === 'yesterday') {
		    dateGoal.setDate(dateGoal.getDate() - 1);
		} else if (dateVariable === 'beforeYesterday') {
		    dateGoal.setDate(dateGoal.getDate() - 2);
		} else if (dateVariable === 'afterTomorrow') {
		    dateGoal.setDate(dateGoal.getDate() + 2);
		}

		this.day = dateGoal.getDate();
		this.month = dateGoal.getMonth() + 1;
		this.year = dateGoal.getFullYear();
	    }
	}
    };
}

function DateTimeParam() {
    this.name = 'datetime';

    DateTimeParam.prototype.initDateTimeParam = function () {
	this.time = new TimeParam();
	this.date = new DateParam();
	this.parameters = [this.time, this.date];
    };
    
    this.initDateTimeParam();
}
DateTimeParam.prototype = new Parametered();

function ShowAppointmentsCommand() {
    this.name = 'ShowAppointments';
   
    ShowAppointmentsCommand.prototype.initShowAppointmentsCommand = function () {
	this.dateTimeFrom = new DateTimeParam();
	this.dateTimeTo = new DateTimeParam();
	this.timerange = new TimerangeParam();
	this.dateTimeTo.time.hour = 23;
	this.dateTimeTo.time.minute = 59;
	this.parameters = [this.dateTimeFrom, this.dateTimeTo, this.timerange];
    };

    ShowAppointmentsCommand.prototype.afterParseCallback = function () {
	if (this.timerange.parsed) {
	    if (!this.dateTimeFrom.parsed) {
		this.dateTimeFrom.time.hour = this.timerange.timeFrom.hour;
		this.dateTimeFrom.time.minute = this.timerange.timeFrom.minute;
	    }
	    if (!this.dateTimeTo.parsed) {
		this.dateTimeTo.time.hour = this.timerange.timeTo.hour;
		this.dateTimeTo.time.minute = this.timerange.timeTo.minute;
	    }	
	}

	// alert(this.timerange.parsed+"-"+this.dateTimeFrom.parsed+"-"+this.dateTimeTo.parsed);
	// alert(this.dateTimeFrom.time.hour+":"+this.dateTimeFrom.time.minute+"  " + this.dateTimeTo.time.hour+":"+this.dateTimeTo.time.minute);

	this.timerange.parsed = false;
	this.dateTimeFrom.parsed = false;
	this.dateTimeTo.parsed = false;
	this.resetParsedFlags();
    };

    this.initShowAppointmentsCommand();
}
ShowAppointmentsCommand.prototype = new Parametered();

// ==========================================================
function NumberParam() {
    this.name = 'number';
    this.value = 'undefined';

    NumberParam.prototype.getRegExpString = function () {
	return "^" + this.name + "[0-9]*$";
    };

    NumberParam.prototype.parse = function (data) {
	var parsed,
	    translator = mobileDS.LanguageManager.getInstance();
	if (data != 'undefined') {
	    this.value = data;
	    parsed = parseInt(this.value, 10);
	    if (parsed != this.value) {
		this.value = translator.getText(this.value);
		parsed = parseInt(this.value, 10);
		if (parsed != this.value) {
		    this.value = 'undefined';
		}
	    }
	}
    };
}

function TimeOrNumberParam() {
    this.name = 'time';

    TimeOrNumberParam.prototype.initTimeOrNumberParam = function () {
	this.time = new TimeParam();
	this.number = new NumberParam();
	this.parameters = [this.time, this.number];
    };
    
    this.initTimeOrNumberParam();
}
TimeOrNumberParam.prototype = new Parametered();

function TimerangeParam() {
    this.name = 'timerange';

    TimerangeParam.prototype.initTimerangeParam = function () {
	this.init();
    };

    TimerangeParam.prototype.init = function () {
	this.timeFrom = new TimeParam();
	this.timeOrNumber = new TimeOrNumberParam();
	this.timeTo = new TimeParam();
	this.parameters = [this.timeOrNumber, this.timeTo];
    };

    TimerangeParam.prototype.afterParseCallback = function () {
	if (this.timeOrNumber.number.value !== 'undefined') {
	    this.timeTo = this.timeOrNumber.time;
	    this.timeFrom.hour = this.timeOrNumber.number.value;
	} else {
	    this.timeFrom = this.timeOrNumber.time;
	}
    };
    
    this.initTimerangeParam();
}
TimerangeParam.prototype = new Parametered();

function TitleParam() {
    this.name = 'title';
    this.value = '';

    TitleParam.prototype.getRegExpString = function () {
	return "^" + this.name + "[0-9]*$";
    };

    TitleParam.prototype.parse = function (data) {
	this.value = "";
	var curData = data;
	while (curData != 'undefined') {
	    this.value += curData.value;
	    curData = curData.title;
	    if (curData != 'undefined') {
		this.value += " ";
	    }
	}
    };
}

function FullTitleParam() {
    this.name = 'full_title';

    FullTitleParam.prototype.initFullTitleParam = function () {
	this.init();
    };

    FullTitleParam.prototype.init = function () {
	this.phrase = new TitleParam();
	this.parameters = [this.phrase];
    };
    
    this.initFullTitleParam();
}
FullTitleParam.prototype = new Parametered();

function CreateAppointmentCommand() {
    this.name = 'CreateAppointment';
   
    CreateAppointmentCommand.prototype.initCreateAppointmentCommand = function () {
	this.date = new DateParam();
	this.time = new TimeParam();
	this.timerange = new TimerangeParam();
	this.timeFrom = new TimeParam();
	this.timeTo = new TimeParam();
	this.timeTo.hour = 23;
	this.timeTo.minute = 59;
	this.title = new FullTitleParam();
	this.parameters = [this.date, this.time, this.timerange, this.title];
    };

    CreateAppointmentCommand.prototype.afterParseCallback = function () {
	if (this.time.hour != 0 || this.time.minute != 0) {
	    this.timeFrom = this.time;
	    this.timeTo = this.time;
	} else {
	    this.timeFrom = this.timerange.timeFrom;
	    this.timeTo = this.timerange.timeTo;
	}
    };

    this.initCreateAppointmentCommand();
}
CreateAppointmentCommand.prototype = new Parametered();