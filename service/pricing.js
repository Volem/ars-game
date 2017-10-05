'use strict';
const _ = require('lodash');
const config = require('../config');
const Item = require('../domain/item');
const Items = require('../domain/itemcomposition');
const Character = require('../domain/character');

const componentPrice = (item = new Item()) => {
	if (item.Name == Items.Wood.Name) {
		return config.WoodPrice;
	} else if (item.Name == Items.Ore.Name) {
		return config.OrePrice;
	} else if (item.Name == Items.Stone.Name) {
		return config.StonePrice;
	}
	return item.Components.reduce((pre, cur) => {
		return pre + componentPrice(cur);
	}, 0);
};


const ItemPrices = Object.keys(Items).reduce((cur, item) => {
	cur[item] = componentPrice(Items[item]) + Math.round(Items[item].Components.length * config.Workmanship / 2);
	return cur;
}, {});

const characterWealth = (char = new Character()) => {
	let wealth = 0;
	for (let i = 0; i < char.Inventory.Items.length; i++) {
		wealth += ItemPrices[char.Inventory.Items[i].Name];
	}
	return wealth + char.Inventory.Balance;
};

module.exports = {
	componentPrice: componentPrice,
	ItemPrices: ItemPrices,
	characterWealth : characterWealth
};