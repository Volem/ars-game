'use strict';
require('../service/initMongo');

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;

const EventSchema = new Schema({
	Timestamp : Schema.Types.Long,
	Name : String,
	Parameters : String
});

module.exports = mongoose.model('Event', EventSchema);