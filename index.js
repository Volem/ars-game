'use strict';

const items = require('./domain/itemcomposition');
const produce = require('./domain/skill').Produce;
const Character = require('./domain/character');
const CharManager = require('./service/characterManager');
const Skills = require('./domain/skill');

console.log(items.CalculatePrice(items.Hatchet));
console.log(items.CalculatePrice(items.Wood));
console.log(items.CalculatePrice(items.Ore));
console.log(items.CalculatePrice(items.Pickaxe));
console.log(items.CalculatePrice(items.Stick));


let volem = new Character('Volem');

let volemsOres = Array(10).fill(items.Ore);
let volemsWoods = Array(10).fill(items.Wood);

let createCarpenter = CharManager.CreateCharacter(Skills.Carpenter);
let createBlacksmith = CharManager.CreateCharacter(Skills.Blacksmith);

volem = createCarpenter('Volem');
volem.Inventory.Items = [...volemsOres, ...volemsWoods];

const produceStick = produce(items.Stick);

produceStick(volem);