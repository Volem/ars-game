'use strict';
const config = require('../config');
const Items = require('./item');
const Item = Items.Item;
const Ore = new Items.Ore();
const Wood = new Items.Wood();

// Requires 2 wood
const Stick = new Items.Stick();
const TwoWoods = Array(2).fill(Wood);
Stick.Components = [...TwoWoods];

// Requires 1 Stick 5 Ore 
const Pickaxe = new Items.Pickaxe();
const FiveOres = Array(5).fill(Ore);
Pickaxe.Components = [...TwoWoods, ...FiveOres];

// Requires 1 Stick 5 Ore 
const Hatchet = new Items.Hatchet();
Hatchet.Components = [...TwoWoods, ...FiveOres];

const CalculatePrice = (item = new Item()) => {
	if (item.Name == new Items.Wood().Name) {
		return config.WoodPrice;
	} else if(item.Name == new Items.Ore().Name){
		return config.OrePrice;
	}
	return item.Components.reduce((pre, cur) => {
		return pre + CalculatePrice(cur);
	}, 0);
};

module.exports = {
	CalculatePrice : CalculatePrice,
	Ore: Ore,
	Wood: Wood,
	Stick: Stick,
	Pickaxe: Pickaxe,
	Hatchet: Hatchet
};