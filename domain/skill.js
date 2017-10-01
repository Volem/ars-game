'use strict';
const Skill = function (name = '') {
	this.Name = name;
	this.Experience = 0;
};

const Miner = new Skill('Miner');
const Lumberjack = new Skill('Lumberjack');
const Carpenter = new Skill('Carpenter');
const Blacksmith = new Skill('Blacksmith');

module.exports = {
	Skill: Skill,
	Miner: Miner,
	Lumberjack: Lumberjack,
	Carpenter: Carpenter,
	Blacksmith: Blacksmith
};