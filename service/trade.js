'use strict';
const arsfn = require('ars-functional');
const Character = require('../domain/character');
const Item = require('../domain/item');
const pricing = require('./pricing');

const buy = (item = new Item()) => (buyer = new Character()) => {
	if (!item.Name) {
		return { Inventory: buyer.Inventory, Success: false };
	}
	let price = pricing.ItemPrices[item.Name];
	// Not enough balance. Buy failed.
	if (buyer.Inventory.Balance < price) {
		return { Inventory: buyer.Inventory, Success: false };
	}

	let inventory = arsfn.clone(buyer.Inventory);
	inventory.Items.push(item);
	inventory.Balance -= pricing.ItemPrices[item.Name];
	return { Inventory: inventory, Success: true };
};

const sell = (item = new Item()) => (seller = new Character()) => {
	if (!item.Name) {
		return { Inventory: seller.Inventory, Success: false };
	}

	let soldItems = seller.Inventory.Items.filter(t => t.Name == item.Name);
	let price = pricing.ItemPrices[item.Name];
	// Not enough items. Sell failed.
	if (soldItems.length == 0) {
		return { Inventory: seller.Inventory, Success: false };
	}

	let inventory = arsfn.clone(seller.Inventory);
	inventory.Balance += price;
	inventory.Items = inventory.Items.splice(inventory.Items.findIndex(t => t.Name == item.Name), 1);
	return { Inventory: inventory, Success: true };
};

module.exports = {
	Buy: buy,
	Sell: sell
};