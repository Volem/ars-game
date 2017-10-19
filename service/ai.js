const Character = require('../domain/character');
const items = require('../domain/itemcomposition');
const _ = require('lodash');
const Item = require('../domain/item');
const arsfn = require('ars-functional');
const trade = require('./trade');
const produce = require('./produce');
const pricing = require('./pricing');

const TrainSetModel = require('../models/trainset.js');

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
	//	char.Brain.activate(input);
	//	char.Brain.propagate(config.LearningRate, output);
	const trainOptions = {
		rate: 0.05,
		iterations: 10000,
		error: 0.01,
		cost: null,
		crossValidate: null,
	};

	char.Brain.trainer.train([{
		input: input,
		output: output
	}], trainOptions);
};


const executeDecidedAction = (actionValue = 0, actionOnItem = 0, item = new Item(), char = new Character()) => {
	if (actionOnItem < 0.5) {
		return char;
	}
	let actionHandler = {
		0: trade.Buy(item),
		1: trade.Sell(item),
		2: produce(item)
	};

	let action = actionHandler[actionValue.toString()];
	let clone = arsfn.clone(char);

	let actionResult = action(char);
	clone.Inventory = actionResult.Inventory;
	return clone;
};

// Buy, Sell or Produce Decision Input 0
// brain output[0] Produce
// brain output[1] Sell
// brain output[2] Buy
// Produce > 0.66
// Action on which item Input 1...n
const act = (char = new Character()) => (brainOutput = [0]) => {
	let updatedChar = arsfn.clone(char);
	let itemIndex = 3;
	let action = GetDecision(_.take(brainOutput, 3));
	for (let item of Object.keys(items)) {
		updatedChar = executeDecidedAction(action, brainOutput[itemIndex], items[item], updatedChar);
		itemIndex++;
	}
	return updatedChar;
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
const reformatOutput = (char, lastOutput) => {
	let expectedOutput = [...lastOutput];
	let haveMissingItems = false;
	let minBalance = 0;
	let inventoryCounts = _.countBy(char.Inventory.Items, 'Name');
	for (let required of char.BuyItems) {
		let existingCount = inventoryCounts[required.Item.Name];
		if (existingCount === undefined || existingCount < required.Count) {
			haveMissingItems = true;
		}
		minBalance += pricing.ItemPrices[required.Item.Name];
	}

	let selectedAction = TradeAction.Produce;

	if (!haveMissingItems) {
		expectedOutput[0] = 1; // Produce
		expectedOutput[1] = 0; // Sell
		expectedOutput[2] = 0; // Buy
	} else {
		if (char.Inventory.Balance < minBalance) {
			expectedOutput[0] = 0; // Produce
			expectedOutput[1] = 1; // Sell
			expectedOutput[2] = 0; // Buy
			selectedAction = TradeAction.Sell;
		} else {
			expectedOutput[0] = 0; // Produce
			expectedOutput[1] = 0; // Sell
			expectedOutput[2] = 1; // Buy
			selectedAction = TradeAction.Buy;
		}
	}

	let itemIndex = 3;
	for (let key of Object.keys(items)) {
		if (selectedAction == TradeAction.Buy) {
			let required = char.BuyItems.find(t => t.Item.Name == items[key].Name);
			if (required) {
				let existingCount = inventoryCounts[required.Item.Name];
				if (existingCount === undefined || existingCount < required.Count) {
					expectedOutput[itemIndex] = 1;
				} else {
					expectedOutput[itemIndex] = 0;
				}
			}
			else {
				expectedOutput[itemIndex] = 0;
			}
		} else if (selectedAction == TradeAction.Sell) {
			let required = char.BuyItems.find(t => t.Item.Name == items[key].Name);
			// Don't sell a required item
			if (required) {
				// Sell more than required item
				let existingCount = inventoryCounts[required.Item.Name];
				if (existingCount && existingCount > required.Count) {
					expectedOutput[itemIndex] = 1;
				} else {
					expectedOutput[itemIndex] = 0;
				}
			} else {
				expectedOutput[itemIndex] = 1;
			}
		} else if (selectedAction == TradeAction.Produce) {
			if (char.ProduceItems.find(t => t.Name == items[key].Name)) {
				expectedOutput[itemIndex] = 1;
			} else {
				expectedOutput[itemIndex] = 0;
			}
		}
		itemIndex++;
	}
	return expectedOutput;
};

const learn = (char = new Character()) => (lastInput = [0], lastOutput = [0]) => {
	// currently we are only learning from our failures :)
	let expectedOutput = reformatOutput(char, lastOutput);
	trainCharacter(char)(lastInput, expectedOutput);
};

const saveDecision = (char = new Character()) => async (input = [0], decision = [0]) => {
	let dbModel = new TrainSetModel();
	dbModel.Skill = char.Skill.Name;
	dbModel.Input = input;
	dbModel.Decision = decision;
	await dbModel.save();
};

const generateTrainsetFromDocument = (doc) => ({Input : doc.Input, Decision : doc.Decision, Datetime : doc.createdAt});

const getTrainset = async () => {
	let data = await TrainSetModel.find();
	let grouped = data.reduce((pre, cur) => {
		let action = GetDecision(_.take(cur.Decision, 3));
		let skillTrainset = pre.find(t => t.Skill == cur.Skill);
		let trainSetItem = generateTrainsetFromDocument(cur);
		if (!skillTrainset) {
			pre.push({
				Skill: cur.Skill,
				Trainset: {
					Produce: [],
					Buy: [],
					Sell: []
				}
			});
			skillTrainset = pre[pre.length - 1];
		}
	
		if (action == TradeAction.Buy) {
			skillTrainset.Trainset.Buy.push(trainSetItem);
		} else if (action == TradeAction.Produce) {
			skillTrainset.Trainset.Produce.push(trainSetItem);
		} else if (action == TradeAction.Sell) {
			skillTrainset.Trainset.Sell.push(trainSetItem);
		}
		return pre;
	}, []);
	return grouped;
};


function GetDecision(decisionInput = [0]) {
	if (decisionInput.length < 3) {
		throw new Error('Decision should be 3 field. Produce, Sell, Buy in order');
	}
	if (decisionInput[0] > 0.5) {
		return TradeAction.Produce;
	}
	if (decisionInput[1] > 0.5) {
		return TradeAction.Sell;
	}

	if (decisionInput[2] > 0.5) {
		return TradeAction.Buy;
	}
	return -1;
}
module.exports = {
	NeuralNetworkInputs: neuralNetworkInputs,
	ReformatInput: reformatInput,
	Think: think,
	Act: act,
	Train: trainCharacter,
	Learn: learn,
	SaveDecision: saveDecision,
	GetTrainset: getTrainset
};