'use strict';
const Item = require('./item');
const Skills = require('./skill');
const Ore = new Item('Ore', Skills.Miner);
const Stone = new Item('Stone', Skills.Miner);
const Wood = new Item('Wood', Skills.Lumberjack);
const Stick = new Item('Stick', Skills.Carpenter);
const Handle = new Item('Handle', Skills.Carpenter);
const Saw = new Item('Saw', Skills.Blacksmith);
const Anvil = new Item('Anvil', Skills.Blacksmith);
const Hammer = new Item('Hammer', Skills.Blacksmith);
const Furnace = new Item('Furnace', Skills.Blacksmith);
const Pickaxe = new Item('Pickaxe', Skills.Blacksmith);
const Hatchet = new Item('Hatchet', Skills.Blacksmith);

Ore.RequiredTools = [Pickaxe];
Wood.RequiredTools = [Hatchet];
Stone.RequiredTools = [Pickaxe];

const getItemArray = (count, item = new Item()) => Array(count).fill(item);

// Requires 2 wood 
Stick.Components = [...getItemArray(2, Wood)];
Stick.RequiredTools = [Saw];

Handle.Components = [...getItemArray(2, Wood)];
Handle.RequiredTools = [Saw];

// Requires 3 Ores 1 Handle
Saw.Components = [...getItemArray(3, Ore), Handle];
Saw.RequiredTools = [Anvil, Hammer, Furnace];

// Requires 20 Ores
Anvil.Components = [...getItemArray(20, Ore)];
Anvil.RequiredTools = [Hammer, Furnace];

// Requires 4 Ores
Hammer.Components = [...getItemArray(4, Ore)];
Hammer.RequiredTools = [Anvil, Furnace];

Furnace.Components = [...getItemArray(20, Ore), ...getItemArray(50, Stone)];

// Requires 1 Stick 5 Ore 
Pickaxe.Components = [Stick, ...getItemArray(5, Ore)];
Pickaxe.RequiredTools = [Anvil, Hammer, Furnace];

// Requires 1 Stick 5 Ore 
Hatchet.Components = [Stick, ...getItemArray(5, Ore)];
Hatchet.RequiredTools = [Anvil, Hammer, Furnace];

// Requires 1 Handle 3 Ore 
Saw.Components = [Handle, ...getItemArray(3, Ore)];

module.exports = {
	Ore: Ore,
	Stone: Stone,
	Wood: Wood,
	Handle: Handle,
	Saw: Saw,
	Hammer: Hammer,
	Stick: Stick,
	Anvil: Anvil,
	Furnace: Furnace,
	Pickaxe: Pickaxe,
	Hatchet: Hatchet
};