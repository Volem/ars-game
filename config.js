'use strict';
const itemPrices = require('../domain/price');
// Number of items and their durabilities + character balance + skill
const brainInputCount = itemPrices.length * 2 + 2;
const learningRate = 0.2;

module.exports = {
	BrainInputCount : brainInputCount,
	LearningRate : learningRate
};