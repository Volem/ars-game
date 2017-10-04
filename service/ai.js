const Character = require('../domain/character');
const items = require('../domain/itemcomposition');
const config = require('../config');
const _ = require('lodash');
const Skills = require('../domain/skill');
const Item = require('../domain/item');
const arsfn = require('ars-functional');
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
	let inputs = reformatInput(char);
	console.log(`Inputs : ${inputs.length}`);
	console.log(`Brain Inputs : ${char.Brain.inputs()}`);
	return char.Brain.activate(inputs);
};

const trainCharacter = (char = new Character()) => (output = 0) => {
	think(char);
	char.Brain.propagate(config.LearningRate, output);
};

const trainMiner = (char = new Character()) => {
	if (char.Skill.Name != Skills.Miner.Name) {
		return;
	}
	let outputs = [];
	let inputs = neuralNetworkInputs(char);
	// No item at all. Needs to buy pickaxe
	let noItem = _.filter(inputs, t => t.ItemName).every(t => t.Count == 0);

	if (noItem) {
		outputs.push(0); // Buy item.
		const isPickaxe = (item = new Item()) => item.Name == items.Pickaxe.Name;
		// Buy pickaxe.
		for (let prop of Object.keys(items)) {
			outputs.push(isPickaxe(items[prop]) ? 1 : 0);
		}
		console.log(`Output : ${outputs.length}`);
		console.log(`Brain Output count : ${char.Brain.outputs()}`);
	}
	trainCharacter(char)(outputs);
};


module.exports = {
	NeuralNetworkInputs: neuralNetworkInputs,
	Think: think,
	Train: trainCharacter,
	TrainMiner: trainMiner
};