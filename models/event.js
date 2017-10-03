'use strict';
require('../service/initMongo');

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;

const EventSchema = new Schema({
	Timestamp : Schema.Types.Long,
	Name : String,
	CompletedOn : Schema.Types.Long,	
	Parameters : Schema.Types.Mixed
});

module.exports = mongoose.model('Event', EventSchema);