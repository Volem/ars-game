'use strict';
let start = new Date();
console.log(start);
const _ = require('lodash');
const items = require('./domain/itemcomposition');
const produce = require('./service/produce');
const calcPrice = require('./service/calculatePrice');
const CharManager = require('./service/characterManager');
const skills = require('./domain/skill');

let volemsOres = Array(10).fill(items.Ore);
let volemsWoods = Array(10).fill(items.Wood);

let createCarpenter = CharManager.CreateCharacter(skills.Carpenter);
let createBlacksmith = CharManager.CreateCharacter(skills.Blacksmith);

const produceStick = produce(items.Stick);
const produceHatchet = produce(items.Hatchet);

let volem = createCarpenter('Volem');
volem.Inventory.Items = [...volemsOres, ...volemsWoods];
console.log(`Produced Item : ${_.difference(produceStick(volem), volem.Inventory.Items)[0].Name}`);

volem = createBlacksmith('Volem');
volem.Inventory.Items = [...volemsOres, ...volemsWoods, items.Stick];
console.log(`Produced Item : ${_.difference(produceHatchet(volem), volem.Inventory.Items)[0].Name}`);

for(let a of Object.keys(items)){
	console.log(`Price of ${a} : ${calcPrice(items[a])}`);
}

let end = new Date();
console.log(end);
console.log(end-start);
