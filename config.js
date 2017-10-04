'use strict';
const Items = require('./domain/itemcomposition');
// Number of items 
// Item durabilities
// Character balance 
// Skill Experience
const itemCount = Object.keys(Items).filter(t => t != '').length; 
const brainInputCount = itemCount * 2 + 2;
// Buy, Sell or Produce Decision
// Action on which item
// Buy 0
// Sell 0.5
// Produce 1
const brainOutputCount = itemCount + 1;

module.exports = {
	BrainInputCount: brainInputCount,
	BrainOutputCount: brainOutputCount,
	ItemCount: itemCount, 
	LearningRate: 0.2,
	Workmanship: 5,
	InitialExperience: 0.1,
	WoodPrice: 1,
	OrePrice: 3,
	StonePrice: 2,
	StartBalance : 1000
};