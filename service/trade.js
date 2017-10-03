'use strict';
const arsfn = require('ars-functional');
const Character = require('./character');
const Item = require('./item');

const buy = (buyer = new Character()) => (item = new Item()) => (quantity = 0) => (price = 0) => {
	if (!item.Name || quantity === 0) {
		return buyer;
	}
	// Not enough balance. Buy failed.
	if (buyer.Inventory.Balance < (quantity * price)) {
		return buyer;
	}

	let buyerClone = new Character();
	buyerClone = arsfn.clone(buyer);
	let boughtItems = [].fill(item, 0, quantity);
	buyerClone.Inventory.Items.push(boughtItems);
	buyerClone.Inventory.Balance -= (quantity * price);
	return buyerClone;
};

const sell = (seller = new Character()) => (item = new Item()) => (quantity = 0) => (price = 0) => {
	if (!item.Name || quantity === 0) {
		return seller;
	}
	let soldItems = seller.Inventory.Items.filter(t => t.Name == item.Name);
	// Not enough items. Sell failed.
	if (soldItems.length < quantity) {
		return seller;
	}

	let sellerClone = new Character();
	sellerClone = arsfn.clone(seller);

	sellerClone.Inventory.Balance += (quantity * price);
	sellerClone.Inventory.Items = sellerClone.Inventory.Items.filter(t => soldItems.findIndex(f => f.Name == t.Name) != -1);
	return sellerClone;
};

module.exports = {
	Buy: buy,
	Sell : sell
};