const Character = require('../domain/character');
const items = require('../domain/itemcomposition');
const config = require('../config');
const _ = require('lodash');
const Item = require('../domain/item');
const arsfn = require('ars-functional');
const trade = require('./trade');
const produce = require('./produce');

const TradeAction = {
	Buy: 0,
	Sell: 1,
	Produce: 2
};


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

const trainCharacter = (char = new Character()) => (input = [0], output = [0]) => {
	char.Brain.activate(input);
	char.Brain.propagate(config.LearningRate, output);
};


const roundToTradeAction = (action = 0) => {
	const TradeActionValues = {
		Buy: 0.33,
		Sell: 0.66,
		Produce: 1.0
	};
	if (action <= TradeActionValues.Buy) {
		return TradeAction.Buy;
	} else if (action <= TradeActionValues.Sell && action > TradeActionValues.Buy) {
		return TradeAction.Sell;
	} else {
		return TradeAction.Produce;
	}
};

const executeDecidedAction = (actionValue = 0, actionOnItem = 0, item = new Item(), char = new Character()) => {
	if (actionOnItem < 0.5) {
		return { Character: char, Success: true };
	}
	let actionEnum = roundToTradeAction(actionValue);
	let actionHandler = {
		0: trade.Buy(item),
		1: trade.Sell(item),
		2: produce(item)
	};

	let action = actionHandler[actionEnum.toString()];
	let clone = arsfn.clone(char);

	let actionResult = action(char);
	clone.Inventory = actionResult.Inventory;
	return { Character: clone, Success: actionResult.Success };
};

// Buy, Sell or Produce Decision Input 0
// Buy <= 0.33
// 0.33 < Sell <= 0.66
// Produce > 0.66
// Action on which item Input 1...n
const act = (char = new Character()) => (brainOutput = [0]) => {
	let updatedChar = arsfn.clone(char);
	let itemIndex = 1;
	let outputSuccess = [];
	for (let item of Object.keys(items)) {
		let actionResult = executeDecidedAction(brainOutput[0], brainOutput[itemIndex], items[item], updatedChar);
		updatedChar = actionResult.Character;
		outputSuccess.push(actionResult.Success);
		itemIndex++;
	}
	return { Character: updatedChar, OutputSuccess: outputSuccess };
};

// @param lastInput : Characters last neural network (brain) input
// Last Output : Result of neural network (brain) output
// 
/**
 *  Train the character concerning on the last input, output and its success 
 *	@param lastInput Last input of neural network (aka Brain)
 *	@param lastOutput Last output of neural network (aka Brain) 
 *	@param actionSuccess Success of output on items (length is 1 less than neural network output)
 *	@param resultSuccess End result of the last act. At current implementation the successful result is increase on character wealth. 
 */
const learn = (char = new Character()) => (lastInput = [0], lastOutput = [0], actionSuccess = [0], resultSuccess = true) => {
	// currently we are only learning from our failures :)
	if (resultSuccess) {
		return;
	}

	let expectedOutput = [...lastOutput];

	// If character has no item, he needs to buy. Let's train this first.
	if (char.Inventory.Items.length == 0 && roundToTradeAction(lastOutput[0]) != TradeAction.Buy) {
		expectedOutput[0] = 0; // Less than 0.33 is buy
		trainCharacter(char)(lastInput, expectedOutput);
		return;
	}

	// If character has no money, he cannot buy. Secondary life lesson :)
	if (char.Inventory.Balance < 5 && roundToTradeAction(lastOutput[0]) == TradeAction.Buy) {
		expectedOutput[0] = Math.floor((Math.random() * 66) + 33) / 100; // Some random greater than 0.33
		trainCharacter(char)(lastInput, expectedOutput);
		return;
	}


	expectedOutput = [lastOutput[0]];
	let itemOutputs = [...lastOutput];
	itemOutputs.splice(0, 1);
	// If you don't want to do anything with any item. Do some other action :)
	if(_.every(itemOutputs, t => t < 0.5)) {
		expectedOutput[0] = Math.random(); // Some random 
	}
	for (let i = 0; i < actionSuccess.length; i++) {
		expectedOutput.push(actionSuccess[i] ? Math.round(itemOutputs[i]) : 0);
	}

	trainCharacter(char)(lastInput, expectedOutput);
};

module.exports = {
	NeuralNetworkInputs: neuralNetworkInputs,
	ReformatInput: reformatInput,
	Think: think,
	Act: act,
	Train: trainCharacter,
	Learn: learn
};