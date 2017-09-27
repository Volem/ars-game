'use strict';
const config = require('../config');
const Items = require('./item');
const Item = Items.Item;

const ItemPrice = function(item = new Item(), price = 0){
	this.Item = item;
	this.Price = price; 
};

const OrePrice = new ItemPrice(new Items.Ore(100), 5);
const WoodPrice = new ItemPrice(new Items.Wood(100), 1);
// Requires 2 Wood + Workmanship
const StickPrice = new ItemPrice(new Items.Stick(100), WoodPrice.Price * 2 + config.Workmanship);		
// Requires 1 Stick 5 Ore + Workmanship
const PickaxePrice = new ItemPrice(new Items.Pickaxe(100), OrePrice.Price * 5 + StickPrice.Price + config.Workmanship); 
// Requires 1 Stick 5 Ore + Workmanship
const HatchetPrice = new ItemPrice(new Items.Hatchet(100), OrePrice.Price * 5 + StickPrice.Price + config.Workmanship);

const ItemPrices = [OrePrice, WoodPrice, StickPrice, PickaxePrice, HatchetPrice];

module.exports = ItemPrices;