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
	Skill: Object.freeze(Skill),
	Miner: Object.freeze(Miner),
	Lumberjack: Object.freeze(Lumberjack),
	Carpenter: Object.freeze(Carpenter),
	Blacksmith: Object.freeze(Blacksmith)
};