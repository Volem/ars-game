'use strict';
const _ = require('lodash');
const arsfn = require('ars-functional');
const Character = require('./character');
const Items = require('./item');
const Item = Items.Item;

const Skill = function (name = '') {
	this.Name = name;
	this.Experience = 0;
};

const Miner = new Skill('Miner');
const Lumberjack = new Skill('Lumberjack');
const Carpenter = new Skill('Carpenter');
const Blacksmith = new Skill('Blacksmith');

const Produce = (item = new Item()) => (character = new Character()) => {
	if (!character.Skill || !item.Name || character.Inventory.Items.length < item.Components.length) {
		return [...character.Inventory.Items];
	}

	let inventory = [...character.Inventory.Items];
	let inventoryItemCounts = _.countBy(inventory, t => t.Name);
	let itemComponentCounts = _.countBy(item.Components, t => t.Name);

	for (let itemName in itemComponentCounts) {
		let getItemCount = arsfn.getPropVal(itemName);
		let componentCount = getItemCount(itemComponentCounts);
		let inventoryCount = getItemCount(inventoryItemCounts);
		if (!inventoryCount || !componentCount || inventoryCount < componentCount) {
			return [...character.Inventory.Items];
		}

		let removeUsedItems = arsfn.removeBy(t => t.Name == itemName)(componentCount);
		inventory = removeUsedItems(inventory);
	}

	inventory.push(item);
	return inventory;
};



module.exports = {
	Skill: Skill,
	Produce: Produce,
	Miner: Miner,
	Lumberjack: Lumberjack,
	Carpenter: Carpenter,
	Blacksmith: Blacksmith
};