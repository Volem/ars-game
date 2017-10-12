'use strict';
const Items = require('./domain/itemcomposition');
// Number of items 
// Item durabilities
// Character balance 
// Skill Experience
const itemCount = Object.keys(Items).filter(t => t != '').length; 
const brainInputCount = itemCount * 2 + 2;
// Buy, Sell or Produce Decision Input 0
// Buy 0
// Sell 0.5
// Produce 1
// Action on which item Input 1...n
const brainOutputCount = itemCount + 1;

module.exports = {
	BrainInputCount: brainInputCount,
	BrainOutputCount: brainOutputCount,
	ItemCount: itemCount, 
	LearningRate: 0.5,
	Workmanship: 5,
	InitialExperience: 0.1,
	WoodPrice: 1,
	OrePrice: 3,
	StonePrice: 2,
	StartBalance : 35
};