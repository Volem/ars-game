'use strict';
const arsfn = require('ars-functional');
const Character = require('../domain/character');
const Item = require('../domain/item');
const pricing = require('./pricing');

const buy = (item = new Item()) => (buyer = new Character()) => {
	if (!item.Name) {
		return buyer;
	}
	let price = pricing.ItemPrices[item.Name];
	// Not enough balance. Buy failed.
	if (buyer.Inventory.Balance < price) {
		return buyer;
	}

	let buyerClone = new Character();
	buyerClone = arsfn.clone(buyer);
	buyerClone.Inventory.Items.push(item);
	buyerClone.Inventory.Balance -= pricing.ItemPrices[item.Name];
	return buyerClone;
};

const sell = (item = new Item()) => (seller = new Character()) => {
	if (!item.Name) {
		return seller;
	}
	let soldItems = seller.Inventory.Items.filter(t => t.Name == item.Name);

	let price = pricing.ItemPrices[item.Name];
	// Not enough items. Sell failed.
	if (soldItems.length == 0) {
		return seller;
	}

	let sellerClone = new Character();
	sellerClone = arsfn.clone(seller);

	sellerClone.Inventory.Balance += price;
	sellerClone.Inventory.Items = sellerClone.Inventory.Items.splice(seller.Inventory.Items.findIndex(t => t.Name == item.Name), 1);
	return sellerClone;
};

module.exports = {
	Buy: buy,
	Sell: sell
};