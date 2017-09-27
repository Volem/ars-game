'use strict';
const Item = require('./item');

const ItemPrice = function(item = new Item(), price = 0){
	this.Item = item;
	this.Price = price; 
};

const Ore = new Item('Ore');
const Wood = new Item('Wood');
const Stick = new Item('Stick');
const Pickaxe = new Item('Pickaxe');
const OrePrice = new ItemPrice(Ore, 5);
const WoodPrice = new ItemPrice(Wood, 1);
// Requires 2 Wook
const StickPrice = new ItemPrice(Stick, 2);		
// Requires 1 Stick 5 Ore
const PickaxePrice = new ItemPrice(Pickaxe, 27); 

const ItemPrices = [OrePrice, WoodPrice, StickPrice, PickaxePrice];

module.exports = ItemPrices;