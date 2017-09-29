'use strict';

const items = require('./domain/itemcomposition');
const produce = require('./domain/skill').Produce;
const CharManager = require('./service/characterManager');
const skills = require('./domain/skill');

let volemsOres = Array(10).fill(items.Ore);
let volemsWoods = Array(10).fill(items.Wood);

let createCarpenter = CharManager.CreateCharacter(skills.Carpenter);
let createBlacksmith = CharManager.CreateCharacter(skills.Blacksmith);

let volem = createCarpenter('Volem');
volem.Inventory.Items = [...volemsOres, ...volemsWoods];
const produceStick = produce(items.Stick);
console.log(produceStick(volem));

volem = createBlacksmith('Volem');
volem.Inventory.Items = [...volemsOres, items.Stick];
const producePickaxe = produce(items.Pickaxe);
let volemsNewInventoryItems = producePickaxe(volem);
console.log(`Updated Inventory : ${JSON.stringify(volemsNewInventoryItems)}`);
// produce is pure function
console.log(`Original Inventory : ${JSON.stringify(volem.Inventory)}`);

