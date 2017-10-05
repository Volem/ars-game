'use strict';
const config = require('../config');
const Character = require('../domain/character');
const s = require('../domain/skill');
const Skill = s.Skill;
const Items = require('../domain/itemcomposition');

const StartItems = {
	Miner : [Items.Pickaxe],
	Lumberjack : [Items.Hatchet],
	Carpenter : [Items.Saw],
	Blacksmith : [Items.Anvil, Items.Furnace, Items.Hammer]
};

const createCharacter = (skill = new Skill()) => (name = '') => {
	let character = new Character(name);
	character.Inventory.Balance = config.StartBalance;
	character.Inventory.Items.push(...StartItems[skill.Name]);

	return Object.assign(character, { Skill: skill });
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