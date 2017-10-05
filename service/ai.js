const Character = require('../domain/character');
const items = require('../domain/itemcomposition');
const config = require('../config');
const _ = require('lodash');
const Skills = require('../domain/skill');
const Item = require('../domain/item');
const arsfn = require('ars-functional');
const trade = require('./trade');
const produce = require('./produce');
// == NEURAL Network Input Structure ==
// 
// First Item Count 
// First Item Durability Sum
// Second Item Count
// Second Item Durability Sum
// ...
// ...
// Character balance
// Character skill experience
// 
// Note : The order of items is determined by itemcomposition 
const neuralNetworkInputs = (char = new Character()) => {
	let input = [];
	let itemCountsAndDurability = [];
	for (let i = 0; i < char.Inventory.Items.length; i++) {
		let item = char.Inventory.Items[i];
		let existingItem = itemCountsAndDurability.find(t => t.Name == item.Name);
		if (!existingItem) {
			itemCountsAndDurability.push({
				Name: item.Name,
				Count: 1,
				Durability: item.Durability
			});
		} else {
			existingItem.Count++;
			existingItem.Durability += item.Durability;
		}
	}
	for (let prop of Object.keys(items)) {
		let inventoryItem = itemCountsAndDurability.find(t => t.Name == prop);
		input.push({
			ItemName: prop,
			Count: (inventoryItem ? inventoryItem.Count : 0),
			Durability: (inventoryItem ? inventoryItem.Durability : 0)
		});
	}
	input.push({ Balance: char.Inventory.Balance });
	input.push({ Skill: char.Skill.Name, Experience: char.Skill.Experience });
	return input;
};

const neuralFormatInputs = (arr = []) => {
	return _.flatten(arr.map(t => {
		if (t.ItemName) {
			return [t.Count, t.Durability];
		} else if (t.hasOwnProperty('Balance')) {
			return t.Balance;
		} else if (t.hasOwnProperty('Experience')) {
			return t.Experience;
		}
	}));
};

const reformatInput = arsfn.compose(neuralFormatInputs, neuralNetworkInputs);

const think = (char = new Character()) => {
	return char.Brain.activate(reformatInput(char));
};

const trainCharacter = (char = new Character()) => (output = 0) => {
	think(char);
	char.Brain.propagate(config.LearningRate, output);
};

const roundToTradeAction = (action = 0) => {
	const TradeAction = {
		Buy: 0.33,
		Sell: 0.66,
		Produce: 1.0
	};
	const TradeActionEnum = {
		Buy: 0,
		Sell: 1,
		Produce: 2
	};
	if (action <= TradeAction.Buy) {
		return TradeActionEnum.Buy;
	} else if (action <= TradeAction.Sell && action > TradeAction.Buy) {
		return TradeActionEnum.Sell;
	} else {
		return TradeActionEnum.Produce;
	}
};

const executeDecidedAction = (actionValue = 0, actionOnItem = 0, item = new Item(), char = new Character()) => {
	if (actionOnItem < 0.5) {
		return char;
	}
	let actionEnum = roundToTradeAction(actionValue);
	const actionHandler = {
		0: trade.Buy(item),
		1: trade.Sell(item),
		2: produce(item)
	};

	let action = actionHandler[actionEnum.toString()];
	let clone = arsfn.clone(char);

	char.Inventory = action(char);
	return clone;
};

// Buy, Sell or Produce Decision Input 0
// Buy <= 0.33
// 0.33 < Sell <= 0.66
// Produce > 0.66
// Action on which item Input 1...n
const act = (char = new Character()) => (brainOutput = [0]) => {
	let updatedChar = arsfn.clone(char);
	let itemIndex = 1;
	for (let item of Object.keys(items)) {
		updatedChar = executeDecidedAction(brainOutput[0], brainOutput[itemIndex], items[item], updatedChar);
		itemIndex++;
	}
	return updatedChar;
};

module.exports = {
	NeuralNetworkInputs: neuralNetworkInputs,
	Think: think,
	Act: act,
	Train: trainCharacter,
};