'use strict';
const _ = require('lodash');
const arsfn = require('ars-functional');
const Character = require('../domain/character');
const Item = require('../domain/item');
const produce = (item = new Item()) => (char = new Character()) => {
	if (!char.Skill ||
		!item.Name ||
		item.RequiredSkill.Name != char.Skill.Name ||
		_.difference(item.RequiredTools, char.Inventory.Items).length > 0 ||
		char.Inventory.Items.length < item.Components.length) {
		return { Inventory: char.Inventory, Success: false };
	}

	let inventory = arsfn.clone(char.Inventory);
	let inventoryItemCounts = _.countBy(inventory.Items, t => t.Name);
	let itemComponentCounts = _.countBy(item.Components, t => t.Name);

	for (let itemName in itemComponentCounts) {
		let getItemCount = arsfn.getPropVal(itemName);
		let componentCount = getItemCount(itemComponentCounts);
		let inventoryCount = getItemCount(inventoryItemCounts);
		if (!inventoryCount || !componentCount || inventoryCount < componentCount) {
			return { Inventory: char.Inventory, Success: false };
		}

		let removeUsedItems = arsfn.removeBy(t => t.Name == itemName)(componentCount);
		inventory.Items = removeUsedItems(inventory.Items);
	}

	let usedTools = [];
	for (let i = 0; i < item.RequiredTools.length; i++) {
		usedTools.push(inventory.Items.find(t => t.Name == item.RequiredTools[i].Name));
	}

	usedTools.forEach(t => t.Durability--);
	inventory.Items.push(item);
	_.remove(inventory.Items, t => t.Durability <= 0);
	return { Inventory: inventory, Success: true };
};

module.exports = produce;