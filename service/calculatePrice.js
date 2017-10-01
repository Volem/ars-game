'use strict';
const config = require('../config');
const Item = require('../domain/item');
const Items = require('../domain/itemcomposition');

const calculatePrice = (item = new Item()) => {
	if (item.Name == Items.Wood.Name) {
		return config.WoodPrice;
	} else if(item.Name == Items.Ore.Name){
		return config.OrePrice;
	}
	return item.Components.reduce((pre, cur) => {
		return pre + calculatePrice(cur);
	}, 0);
};
module.exports = calculatePrice;