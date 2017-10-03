'use strict';
const Skill = require('./skill').Skill;
module.exports = function (name = '', requiredSkill = new Skill()) {
	this.RequiredTools = [];
	this.Components = [];
	this.Name = name;
	this.RequiredSkill = requiredSkill;
	this.Durability = 100;
};