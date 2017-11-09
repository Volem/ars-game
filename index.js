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


/* StartTrainingDataSimulation()
	.then(() => LogManager.info('Simulation completed'))
	.catch((reason) => LogManager.error(new Error(reason)));  */


GetTrainset()
	.then((result) => {
		let volem = CharManager.CreateCharacter(Skills.Miner)('Volem');
		volem = StartTraining(volem, result);
		return Promise.resolve(volem);
	}).then(async (trainedChar) => {
		await StartTrainedSimulation(trainedChar);
	})
	.catch((reason) => LogManager.error(new Error(reason)));

const takeTrainingMaterials = (skill = new Skills.Skill()) => trainingSet => {
	let skillSpecificMaterials = trainingSet.find(t => t.Skill == skill.Name).Trainset;
	let produce = _.take(skillSpecificMaterials.Produce, 10);
	let sell = _.take(skillSpecificMaterials.Sell, 10);
	let buy = _.take(skillSpecificMaterials.Buy, 10);

	let allMaterials = [...produce, ...sell, ...buy].sort((a,b) => a.Datetime - b.Datetime);
	return allMaterials.map((val) => ({ input: val.Input, output: val.Decision }));
};

function StartTraining(char = new Character(), trainingSet) {
	let trainedClone = arsfn.clone(char);
	let trainingMaterials = takeTrainingMaterials(trainedClone.Skill)(trainingSet);
	trainedClone.Brain.trainer.train(trainingMaterials, {
		rate: 0.1,
		iterations: 1000,
		shuffle: false
	});
	return trainedClone;
}



async function StartTrainingDataSimulation(char = new Character()) {
	let decisionSaver = ai.SaveDecision(char);
	for(let i = 0; i < 20000; i++){
		let decision = ai.Think(char);
		let input = ai.ReformatInput(char);
		char = ai.Act(char)(decision);
		let learner = ai.Learn(char);
		learner(input, decision);
		await decisionSaver(input, decision);
	}
}

async function StartTrainedSimulation(char = new Character()) {
	for (let i = 0; i < 20000; i++) {
		let decision = ai.Think(char);
		console.log(`Decision : ${decision}`);
		console.log(`Current Wealth : ${pricing.characterWealth(char)} Current Balance : ${char.Inventory.Balance}`);
		getInventory(char);
		char = ai.Act(char)(decision);
		console.log(`Updated Wealth : ${pricing.characterWealth(char)} Updated Balance : ${char.Inventory.Balance}`);
		getInventory(char);
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
