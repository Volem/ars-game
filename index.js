'use strict';
const _ = require('lodash');
const config = require('./config');
const items = require('./domain/itemcomposition');
const pricing = require('./service/pricing');
const EventManager = require('./service/eventManager');
const CharManager = require('./service/characterManager');
const LogManager = require('./service/logmanager');
const trade = require('./service/trade');
const Character = require('./domain/character');
const Skills = require('./domain/skill');
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
	let volem = CharManager.CreateCharacter(Skills.Miner)('Volem');
	for (let i = 0; i < 20000; i++) {
		let decision = ai.Think(volem);
		let input = ai.ReformatInput(volem);
		let decisionSaver = ai.SaveDecision(input);
//		console.log(`Decision : ${decision.map((t, i) => i > 0 ? t.toFixed(4): t)}`);
		console.log(`Decision : ${decision}`);
		let currentInventory = _.countBy(volem.Inventory.Items, t => t.Name);
		let currentWealth = pricing.characterWealth(volem);
		console.log(`Current Wealth : ${currentWealth} Current Balance : ${volem.Inventory.Balance}`);
		console.log(`Current Inventory = ${JSON.stringify(currentInventory)}`);
		volem = ai.Act(volem)(decision);
		let updatedInventory = _.countBy(volem.Inventory.Items, t => t.Name);
		let updatedWealth = pricing.characterWealth(volem);
		await decisionSaver(decision);
		console.log(`Updated Wealth : ${updatedWealth} Updated Balance : ${volem.Inventory.Balance}`);
		console.log(`Updated Inventory = ${JSON.stringify(updatedInventory)}`);
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
