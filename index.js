'use strict';
const _ = require('lodash');
const arsfn = require('ars-functional');
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
const GetTrainset = async () => await ai.GetTrainset();


/* StartSimulation()
	.then(() => LogManager.info('Simulation completed'))
	.catch((reason) => LogManager.error(new Error(reason))); */
GetTrainset()
	.then((result) => {
		let volem = CharManager.CreateCharacter(Skills.Miner)('Volem');
		volem = StartTraining(volem, result);
		let firstDecision = ai.Think(volem);
		return;
	}).catch((reason) => LogManager.error(new Error(reason)));

const takeTrainingMaterials = (skill = new Skills.Skill())  => trainingSet => {
	let skillSpecificMaterials = trainingSet.find(t => t.Skill == skill.Name).Trainset;
	let produce = _.take(skillSpecificMaterials.Produce, 100);
	let sell = _.take(skillSpecificMaterials.Sell, 100);
	let buy = _.take(skillSpecificMaterials.Buy, 100);

	let allMaterials = [...produce, ...sell, ...buy];
	return allMaterials.map((val) => ({input:val.Input, output:val.Decision}));
};

function StartTraining(char = new Character(), trainingSet) {
	let trainedClone = arsfn.clone(char);
	let trainingMaterials = takeTrainingMaterials(trainedClone.Skill)(trainingSet);
	trainedClone.Brain.trainer.train(trainingMaterials, {
		rate : config.LearningRate,
		iterations : 100,
		shuffle:true
	});
	return trainedClone;
}

async function StartSimulation() {
	let volem = CharManager.CreateCharacter(Skills.Miner)('Volem');
	let decisionSaver = ai.SaveDecision(volem);
	for (let i = 0; i < 20000; i++) {
		let decision = ai.Think(volem);
		let input = ai.ReformatInput(volem);
		//console.log(`Decision : ${decision}`);

		//console.log(`Current Wealth : ${pricing.characterWealth(volem)} Current Balance : ${volem.Inventory.Balance}`);
		//getInventory(volem);
		volem = ai.Act(volem)(decision);
		//console.log(`Updated Wealth : ${pricing.characterWealth(volem)} Updated Balance : ${volem.Inventory.Balance}`);
		//getInventory(volem);
		let learner = ai.Learn(volem);
		learner(input, decision);
		await decisionSaver(input, decision);
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
