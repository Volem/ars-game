'use strict';
const config = require('../config');
const Character = require('../domain/character');
const Skill = require('../domain/skill').Skill;

const createCharacter = (skill = new Skill()) => (name = '') => {
	let character = new Character(name);
	character.Inventory.Balance = config.StartBalance;
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