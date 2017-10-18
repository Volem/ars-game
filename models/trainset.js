'use strict';
require('../service/initMongo');

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;

const TrainSet = new Schema({
	Skill: String,
	Input : [Number],
	Decision : [Number]
}, {
	timestamps : true
});

module.exports = mongoose.model('TrainSet', TrainSet);