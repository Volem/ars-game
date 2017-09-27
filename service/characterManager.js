'use strict';
const config = require('../config');
const Character = require('../domain/character');
const Brain = require('../domain/brain');
const Skill = require('../domain/skill').Skill;

const createCharacter = (skill = new Skill()) => (name = '') => {
	let character = new Character(name);
	character.Brain = Brain;
	return Object.assign(character, { Skill : skill });
};

const trainCharacter = (char = new Character()) => (input = [0]) => (output = 0) => {
	if (!char.Brain || input.length != config.BrainInputCount) {
		return;
	}
	char.Brain.activate(input);
	char.Brain.propagate(config.LearningRate, output);
};

const updateExperience = (char = new Character()) => (experienceInc = 0) => {
	if(!char.Skill) {
		return;
	}
	let charClone = Object.assign({}, char);
	charClone.Skill.Experience += experienceInc;
	return charClone;
};

module.exports = {
	CreateCharacter: createCharacter,
	TrainCharacter : trainCharacter,
	UpdateExperience : updateExperience
};