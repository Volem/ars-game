'use strict';
const CharManager = require('./characterManager');
const Skills = require('../domain/skill');
const Items = require('../domain/itemcomposition');
const Event = require('../domain/event.js');
const EventModel = require('../models/event.js');
const produce = require('./produce');

const UTCNow = () => new Date().getTime();

const eventHandler = function (eventName = '', eventFunc = Function()) {
	return async (...args) => {
		let event = new Event(eventName, eventFunc);
		event.Timestamp = UTCNow();
		event.Parameters = [...args];
		let returnVal = event.Handler(...args);
		let dbModel = new EventModel();
		dbModel.Name = event.Name;
		dbModel.Timestamp = event.Timestamp;
		dbModel.Parameters = JSON.stringify(event.Parameters);
		await dbModel.save();
		return returnVal;
	};
};

const MinerCreated = eventHandler('MinerCreated', CharManager.CreateCharacter(Skills.Miner));
const LumberjackCreated = eventHandler('LumberjackCreated ', CharManager.CreateCharacter(Skills.Lumberjack));
const CarpenterCreated = eventHandler('CarpenterCreated ', CharManager.CreateCharacter(Skills.Carpenter));
const BlacksmithCreated = eventHandler('BlacksmithCreated ', CharManager.CreateCharacter(Skills.Blacksmith));

const OreProduced = eventHandler('OreProduced', produce(Items.Ore));
const WoodProduced = eventHandler('WoodProduced', produce(Items.Wood));
const StickProduced = eventHandler('StickProduced', produce(Items.Stick));
const PickaxeProduced = eventHandler('PickaxeProduced', produce(Items.Pickaxe));
const HatchetProduced = eventHandler('HatchetProduced', produce(Items.Hatchet));

module.exports = {
	EventHandler : eventHandler,
	MinerCreated : MinerCreated,
	LumberjackCreated : LumberjackCreated,
	CarpenterCreated : CarpenterCreated,
	BlacksmithCreated : BlacksmithCreated,
	OreProduced : OreProduced,
	WoodProduced : WoodProduced,
	StickProduced : StickProduced,
	PickaxeProduced : PickaxeProduced,
	HatchetProduced : HatchetProduced
};

