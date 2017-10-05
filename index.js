'use strict';
const _ = require('lodash');
const config = require('./config');
const items = require('./domain/itemcomposition');
const pricing = require('./service/pricing');
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
	let volem = await EventManager.MinerCreated('Volem');
	for (let i = 0; i < 2000; i++) {
		let decision = ai.Think(volem);
		let input = ai.ReformatInput(volem);
		console.log(`Decision : ${decision.map((t, i) => i > 0 ? t.toFixed(2): t)}`);
		let currentInventory = _.countBy(volem.Inventory.Items, t => t.Name);
		let currentWealth = pricing.characterWealth(volem);
		console.log(`Current Wealth : ${currentWealth} Current Balance : ${volem.Inventory.Balance}`);
		console.log(`Current Inventory = ${JSON.stringify(currentInventory)}`);
		let actionResult = ai.Act(volem)(decision);
		volem = actionResult.Character;
		let updatedInventory = _.countBy(volem.Inventory.Items, t => t.Name);
		let updatedWealth = pricing.characterWealth(volem);
		console.log(`Updated Wealth : ${updatedWealth} Updated Balance : ${volem.Inventory.Balance}`);
		console.log(`Updated Inventory = ${JSON.stringify(updatedInventory)}`);
		let learn = ai.Learn(volem);
		learn(input, decision, actionResult.OutputSuccess, updatedWealth > currentWealth);
		await sleep(200);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
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
