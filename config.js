'use strict';
const Items = require('./domain/item');
// Number of items 
// Item durabilities
// Character balance 
// Skill Experience
const brainInputCount = Object.keys(Items).filter(t => t != '').length * 2 + 2;
console.log(`Brain input ${brainInputCount}`);

module.exports = {
	BrainInputCount : brainInputCount,
	LearningRate : 0.2,
	Workmanship : 5,
	InitialExperience : 0.1,
	WoodPrice : 1,
	OrePrice : 2
};