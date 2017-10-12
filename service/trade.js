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

	let boughtItem = new Item();
	boughtItem = arsfn.clone(item);
	let inventory = arsfn.clone(buyer.Inventory);
	boughtItem.Durability = 100;
	inventory.Items.push(boughtItem);
	inventory.Balance -= pricing.ItemPrices[item.Name];
	return { Inventory: inventory, Success: true };
};

const sell = (item = new Item()) => (seller = new Character()) => {
	const itemRemover = arsfn.removeBy(t => t.Name == item.Name)(1);
	if (!item.Name) {
		return { Inventory: seller.Inventory, Success: false };
	}

	let itemExist = seller.Inventory.Items.find(t => t.Name == item.Name);
	if (!itemExist) {
		return { Inventory: seller.Inventory, Success: false };
	}

	let inventory = arsfn.clone(seller.Inventory);
	inventory.Balance += pricing.ItemPrices[item.Name];
	inventory.Items = itemRemover(inventory.Items);
	return { Inventory: inventory, Success: true };
};

module.exports = {
	Buy: buy,
	Sell: sell
};