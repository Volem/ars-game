'use strict';
const config = require('../config');
const _ = require('lodash');
const Character = require('../domain/character');
const Skill = require('../domain/skill').Skill;
const Items = require('../domain/itemcomposition');

const StartItems = {
	Miner: [Items.Pickaxe],
	Lumberjack: [Items.Hatchet],
	Carpenter: [Items.Saw],
	Blacksmith: [Items.Anvil, Items.Furnace, Items.Hammer]
};

const createCharacter = (skill = new Skill()) => (name = '') => {
	let character = Object.assign(new Character(name), { Skill: skill });
	character.Inventory.Balance = config.StartBalance;
	character.Inventory.Items.push(...StartItems[skill.Name]);
	character.ProduceItems = Object.keys(Items).reduce((pre, cur) => {
		if (!pre.find(t => t.Name == cur) && character.Skill == Items[cur].RequiredSkill) {
			pre.push(Items[cur]);
		}
		return pre;
	}, []);

	character.BuyItems = character.ProduceItems.reduce((pre, cur) => {
		for (let i = 0; i < cur.RequiredTools.length; i++) {
			let tool = cur.RequiredTools[i];
			if (tool.RequiredSkill.Name != character.Skill.Name) {
				if (!pre.find(t => t.Item.Name == tool.Name)) {
					pre.push({
						Item: tool,
						Count: 1
					});
				}
			}
		}
		for (let i = 0; i < cur.Components.length; i++) {
			let component = cur.Components[i];
			if (component.RequiredSkill.Name != character.Skill.Name) {
				let neededItem = pre.find(t => t.Item.Name == component.Name);
				if (!neededItem) {
					pre.push({
						Item: component,
						Count: 1
					});
				} else {
					neededItem.Count++;
				}
			}
		}
		return pre;
	}, []);

	return character;
};


const updateExperience = (char = new Character()) => (experienceInc = 0) => {
	if (!char.Skill) {
		return;
	}
	let charClone = Object.assign({}, char);
	charClone.Skill.Experience += experienceInc;
	return charClone;
};

module.exports = {
	CreateCharacter: createCharacter,
	UpdateExperience: updateExperience
};