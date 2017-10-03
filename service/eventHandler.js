'use strict';
const Event = require('../domain/event.js');
const EventModel = require('../models/event.js').Model;

const UTCNow = () => new Date().getTime();

const EventHandler = function (eventName = '', eventFunc = Function) {
	return async (...args) => {
		let event = new Event(eventName, eventFunc);
		event.Timestamp = UTCNow();
		event.Parameters = [...args];
		let returnVal = event.Handler(...args);
		event.CompletedOn = UTCNow();
		let dbModel = new EventModel();
		dbModel.Name = event.Name;
		dbModel.Timestamp = event.Timestamp;
		dbModel.Parameters = event.Parameters;
		dbModel.CompletedOn = event.CompletedOn;
		console.log(dbModel);
		await dbModel.save();
		return returnVal;
	};
};

module.exports = EventHandler;