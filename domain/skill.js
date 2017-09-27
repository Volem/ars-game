'use strict';
const _ = require('lodash');
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
	if (!character.Skill || !item.Name || character.Inventory.Items.length == 0) {
		return null;
	}

	
	let woodCount = _.countBy(character.Inventory.Items, i => i.Name == Items.Wood.Name);

	switch (item.Name) {
		case 'Hatchet': {
			return createHatchet(character);
		}
		default:
			break;
	}
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
		if(usedOre == 5 && usedStick == 2) {
			inventory.push(new Items.Hatchet(100));
			return clonedCharacter;
		}
		if(currentItem.Name == 'Ore') {
			inventory.splice(i, 1);
			usedOre++;
		} else if(currentItem.Name == 'Stick') {
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