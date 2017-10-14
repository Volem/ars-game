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
	let volem = CharManager.CreateCharacter(Skills.Blacksmith)('Volem');
	for (let i = 0; i < 20000; i++) {
		let decision = ai.Think(volem);
		let input = ai.ReformatInput(volem);
		console.log(`Decision : ${decision}`);
		
		console.log(`Current Wealth : ${pricing.characterWealth(volem)} Current Balance : ${volem.Inventory.Balance}`);
		getInventory(volem);
		volem = ai.Act(volem)(decision);
		console.log(`Updated Wealth : ${pricing.characterWealth(volem)} Updated Balance : ${volem.Inventory.Balance}`);
		getInventory(volem);
		let learn = ai.Learn(volem);
		learn(input, decision);
		await sleep(500);
	}
	for (let i = 0; i < 2000; i++) {
		let decision = ai.Think(volem);
		console.log(`Decision : ${decision}`);
		console.log(`Current Wealth : ${pricing.characterWealth(volem)} Current Balance : ${volem.Inventory.Balance}`);
		getInventory(volem);
		volem = ai.Act(volem)(decision);
		console.log(`Updated Wealth : ${pricing.characterWealth(volem)} Updated Balance : ${volem.Inventory.Balance}`);
		getInventory(volem);
		await sleep(1000);
	}
}


function getInventory(char = new Character()) {
	let currentInventory = _.countBy(char.Inventory.Items, t => t.Name);
	console.log(`Current Inventory = ${JSON.stringify(currentInventory)}`);
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
