'use strict';

const items = require('./domain/itemcomposition');

console.log(items.CalculatePrice(items.Hatchet));
console.log(items.CalculatePrice(items.Wood));
console.log(items.CalculatePrice(items.Ore));
console.log(items.CalculatePrice(items.Pickaxe));
console.log(items.CalculatePrice(items.Stick));
