'use strict';
const _ = require('lodash');
const config = require('./config');
const items = require('./domain/itemcomposition');
const calcPrice = require('./service/calculatePrice');
const EventManager = require('./service/eventManager');
const LogManager = require('./service/logmanager');
const trade = require('./service/trade');
const Character = require('./domain/character');

/*
EventManager.CarpenterCreated('Volem').then((volem) => {
	volem.Inventory.Items = [...volemsOres, ...volemsWoods];
	EventManager.StickProduced(volem).then((newInventory) => {
		LogManager.info(`Produced Item : ${_.difference(newInventory, volem.Inventory.Items)[0].Name}`);
	}).catch((reason) => LogManager.error(new Error(reason)));
}).catch((reason) => LogManager.error(new Error(reason)));

EventManager.MinerCreated('VolemMiner').then((volem) => {
	EventManager.OreProduced(volem).then((newInventory) => {
		LogManager.info(`Produced Item : ${_.difference(newInventory, volem.Inventory.Items)[0].Name}`);
	}).catch((reason) => LogManager.error(new Error(reason)));
}).catch((reason) => LogManager.error(new Error(reason)));
*/

StartSimulation()
	.then(() => LogManager.info('Simulation completed'))
	.catch((reason) => LogManager.error(new Error(reason)));


async function StartSimulation() {
	let volem = await EventManager.BlacksmithCreated('Volem');
	volem.Inventory.Items = [...Array(10).fill(items.Ore), ...Array(10).fill(items.Wood), items.Furnace];
	getInputs(volem);
}



const getInputs = (char = new Character()) => {
	let input = [];
	let itemCounts = _.countBy(char.Inventory.Items, t => t.Name);
	let itemDurabilities = _.sumBy(char.Inventory.Items, t => t.Durability);
	console.log('Item Dur : ' + itemDurabilities);
	for (let prop of Object.keys(items)) {
		input.push(itemCounts.hasOwnProperty(prop) ? itemCounts[prop] : 0);
	}
	console.log(input);
};



/*
EventManager.MinerCreated('MinerVolem').then(function (minerVolem) {
		EventManager.
});

/*
volem = createBlacksmith('Volem');
volem.Inventory.Items = [...volemsOres, ...volemsWoods, items.Stick];
console.log(`Produced Item : ${_.difference(produceHatchet(volem), volem.Inventory.Items)[0].Name}`);
*/
for (let a of Object.keys(items)) {
	console.log(`Price of ${a} : ${calcPrice(items[a])}`);
}
