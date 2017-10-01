'use strict';
const Item = require('./item');
const Skills = require('./skill');
const Ore = new Item('Ore', Skills.Miner);
const Wood = new Item('Wood', Skills.Lumberjack);
const Stick = new Item('Stick', Skills.Carpenter);
const Pickaxe = new Item('Pickaxe', Skills.Blacksmith);
const Hatchet = new Item('Hatchet', Skills.Blacksmith);

// Requires 2 wood 
const TwoWoods = Array(2).fill(Wood);
Stick.Components = [...TwoWoods];

// Requires 1 Stick 5 Ore 
const FiveOres = Array(5).fill(Ore);
Pickaxe.Components = [Stick, ...FiveOres];

// Requires 1 Stick 5 Ore 
Hatchet.Components = [Stick, ...FiveOres];

module.exports = {
	Ore: Ore,
	Wood: Wood,
	Stick: Stick,
	Pickaxe: Pickaxe,
	Hatchet: Hatchet
};