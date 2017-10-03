'use strict';
const Event = function (name = '', handler = Function()) {
	this.Name = name;
	this.Timestamp = 0;
	this.Parameters = [];
	this.Handler = handler;
};

module.exports = Event;
