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
		return { ProducedItem: null, Character: character };
	}

	let characterClone = arsfn.clone(character);

	let inventory = characterClone.Inventory.Items;
	let inventoryItemCounts = _.countBy(inventory, t => t.Name);
	let itemComponentCounts = _.countBy(item.Components, t => t.Name);

	for (let itemName in itemComponentCounts) {
		let getItemCount = arsfn.getPropVal(itemName);
		let componentCount = getItemCount(itemComponentCounts);
		let inventoryCount = getItemCount(inventoryItemCounts);
		if (!inventoryCount || !componentCount || inventoryCount < componentCount) {
			return { ProducedItem: null, Character: character };
		}

		for (let i = 0; i < componentCount; i++) {
			let itemIndex = inventory.findIndex(t => t.Name == itemName);
			inventory.splice(itemIndex, 1);
		}
	}

	inventory.push(item);
	return { ProducedItem: item, Character: characterClone };
};


const createHatchet = (character = new Character()) => {
	if (character.Skill.Name != Blacksmith.Name) {
		return character;
	}
	let clonedCharacter = _.clone(character);
	let inventory = clonedCharacter.Inventory.Items;
	let oreCount = _.countBy(inventory, i => i.Name == Items.Ore.Name);
	let stickCount = _.countBy(inventory, i => i.Name == Items.Stick.Name);
	if (stickCount < 2 && oreCount < 5) {
		return character;
	}
	let usedOre = 0, usedStick = 0;
	for (let i = 0; i < inventory.length; i++) {
		let currentItem = inventory[i];
		if (usedOre == 5 && usedStick == 2) {
			inventory.push(new Items.Hatchet(100));
			return clonedCharacter;
		}
		if (currentItem.Name == 'Ore') {
			inventory.splice(i, 1);
			usedOre++;
		} else if (currentItem.Name == 'Stick') {
			inventory.splice(i, 1);
			usedStick++;
		}
	}
};


module.exports = {
	Skill: Skill,
	Produce: Produce,
	Miner: Miner,
	Lumberjack: Lumberjack,
	Carpenter: Carpenter,
	Blacksmith: Blacksmith
};