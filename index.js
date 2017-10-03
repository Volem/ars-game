'use strict';
const _ = require('lodash');
const config = require('./config');
const items = require('./domain/itemcomposition');
const calcPrice = require('./service/calculatePrice');
const EventManager = require('./service/eventManager');
const LogManager = require('./service/logmanager');
const trade = require('./service/trade');
const Character = require('./domain/character');
const ai = require('./service/ai');

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
	console.log(ai.NeuralNetworkInputseuralNetworkInputs(volem));
}





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
