const Character = require('../domain/character');
const items = require('../domain/itemcomposition');

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
	let itemCountsAndDurability = char.Inventory.Items.reduce(
		(cur, item) => {
			let existingItem = cur.find(t => t.Name == item.Name);
			if (!existingItem) {
				cur.push({
					Name: item.Name,
					Count: 1,
					Durability: item.Durability
				});
			} else {
				existingItem.Count++;
				existingItem.Durability += item.Durability;
			}
			return cur;
		}, []);
	for (let prop of Object.keys(items)) {
		let inventoryItem = itemCountsAndDurability.find(t => t.Name == prop);
		input.push(inventoryItem ? inventoryItem.Count : 0);
		input.push(inventoryItem ? inventoryItem.Durability : 0);
	}
	input.push(char.Inventory.Balance);
	input.push(char.Skill.Experience);
	return input;
};

module.exports = {
	NeuralNetworkInputs : neuralNetworkInputs	
};