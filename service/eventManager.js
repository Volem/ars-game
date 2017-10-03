'use strict';
const eventHandler = require('./eventHandler');
const CharManager = require('./characterManager');
const Skills = require('../domain/skill');

const MinerCreated = eventHandler('MinerCreated', CharManager.CreateCharacter(Skills.Miner));
const LumberjackCreated = eventHandler('LumberjackCreated ', CharManager.CreateCharacter(Skills.Lumberjack));
const CarpenterCreated = eventHandler('CarpenterCreated ', CharManager.CreateCharacter(Skills.Carpenter));
const BlacksmithCreated = eventHandler('BlacksmithCreated ', CharManager.CreateCharacter(Skills.Blacksmith));

module.exports = {
	EventHandler : eventHandler,
	MinerCreated : MinerCreated,
	LumberjackCreated : LumberjackCreated,
	CarpenterCreated : CarpenterCreated,
	BlacksmithCreated : BlacksmithCreated
};

