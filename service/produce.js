'use strict';
const _ = require('lodash');
const arsfn = require('ars-functional');
const Character = require('../domain/character');
const Item = require('../domain/item');
const produce = (item = new Item()) => (character = new Character()) => {
	if (!character.Skill ||
		!item.Name ||
		item.RequiredSkill.Name != character.Skill.Name ||
		_.difference(item.RequiredTools, character.Inventory.Items).length > 0 ||
		character.Inventory.Items.length < item.Components.length) {
		return [...character.Inventory.Items];
	}

	let inventory = arsfn.clone(character.Inventory);
	let inventoryItemCounts = _.countBy(inventory.Items, t => t.Name);
	let itemComponentCounts = _.countBy(item.Components, t => t.Name);

	for (let itemName in itemComponentCounts) {
		let getItemCount = arsfn.getPropVal(itemName);
		let componentCount = getItemCount(itemComponentCounts);
		let inventoryCount = getItemCount(inventoryItemCounts);
		if (!inventoryCount || !componentCount || inventoryCount < componentCount) {
			return [...character.Inventory.Items];
		}

		let removeUsedItems = arsfn.removeBy(t => t.Name == itemName)(componentCount);
		inventory.Items = removeUsedItems(inventory.Items);
	}

	inventory.Items.push(item);
	return inventory;
};

module.exports = produce;