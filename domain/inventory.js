'use strict';

const Item = require('./item').Item;

module.exports = function (items = [new Item()])  {
	let validItems = items.filter(f => f.Name != '');
	this.Items = [...validItems];
	this.Balance = 0;
};