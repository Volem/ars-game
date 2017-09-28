'use strict';
const itemPrices = require('./domain/price');
// Number of items 
// Item durabilities
// Character balance 
// Skill Experience
const brainInputCount = itemPrices.length * 2 + 2;

module.exports = {
	BrainInputCount : brainInputCount,
	LearningRate : 0.2,
	Workmanship : 5,
	InitialExperience : 0.1
};