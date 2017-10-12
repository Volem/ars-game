'use strict';
require('../service/initMongo');

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;

const TrainSet = new Schema({
	Timestamp : Schema.Types.Long,
	Input : [Number],
	Decision : [Number]
});

module.exports = mongoose.model('TrainSet', TrainSet);