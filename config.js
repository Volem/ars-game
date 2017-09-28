'use strict';
const itemPrices = require('./domain/price');
// Number of items 
// Item durabilities
// Character balance 
// Skill Experience
const brainInputCount = itemPrices.length * 2 + 2;
const learningRate = 0.2;

module.exports = {
	BrainInputCount : brainInputCount,
	LearningRate : learningRate
};