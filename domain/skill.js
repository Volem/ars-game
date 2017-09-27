'use strict';

const skill =  function(name = '') {
	this.Name = name;
	this.Experience = 0;
};

const miner = new skill('Miner');

module.exports = {
	Skill : skill,
	Miner : miner
};