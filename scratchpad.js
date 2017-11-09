'use strict';
const synaptic = require('synaptic');
const Layer = synaptic.Layer;
const Network = synaptic.Network;
const Architect = synaptic.Architect;

let inputLayer = new Layer(1);
let hiddenLayer = new Layer(10);
let outputLayer = new Layer(1);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

let vendorNeuralNetwork = new Network({
	input: inputLayer,
	hidden: [hiddenLayer],
	output: outputLayer
});

vendorNeuralNetwork = new Architect.LSTM(1, 4, 4, 4, 1);

//Test();

function Test() {
	console.log(`Output Before Train [0] :\t${vendorNeuralNetwork.activate([0])}`);
	for (let i = 0; i < 10000; i++) {
		vendorNeuralNetwork.activate([0]);
		vendorNeuralNetwork.propagate(.2, [1]);
		vendorNeuralNetwork.activate([1]);
		vendorNeuralNetwork.propagate(.2, [0]);
		vendorNeuralNetwork.activate([2]);
		vendorNeuralNetwork.propagate(.2, [0]);
		vendorNeuralNetwork.activate([-1]);
		vendorNeuralNetwork.propagate(.2, [0]);
	}
	console.log(`Output After Train [0] :\t${vendorNeuralNetwork.activate([0])} , Correct value : 1`);
	console.log(`Output After Train [1] :\t${vendorNeuralNetwork.activate([1])} , Correct value : 0`);
	console.log(`Output After Train [2] :\t${vendorNeuralNetwork.activate([2])[0].toFixed(8)} , Correct value : 0`);
	console.log(`Output After Train [3] :\t${vendorNeuralNetwork.activate([3])[0].toFixed(8)} , Correct value : 0`);
}

require('./service/initMongo');
let mongoose = require('mongoose');
require('mongoose-long')(mongoose);

let Schema = mongoose.Schema;

const FactCollection = (subdocument) => new Schema({
	MachineId: Number,
	Hourly: [subdocument],
	Daily: [subdocument],
	Monthly: [subdocument]
});

const FactAvailability = new Schema({
	MachineId: Number,
	Timestamp: Schema.Types.Long,
	HRDate: Date,
	DownTime: Number,
	PauseTime: Number,
	RunTime: Number
});

const FactBypass = new Schema({
	MachineId: Number,
	Timestamp: Schema.Types.Long,
	HRDate: Date,
	BypassCount : Number,
	TotalEgg : Number
});

const MachineDatesSchema = new Schema({
	MachineId: Number,
	Time: Schema.Types.Long,
	ServerTime: Date
});

let models = {
	FactAvailability: mongoose.model('FactAvailabilityCollection', FactCollection(FactAvailability), 'FactAvailabilityCollection'),
	FactBypass: mongoose.model('FactBypassCollection', FactCollection(FactBypass), 'FactBypassCollection'),
	MachineDate: mongoose.model('MachineDates', MachineDatesSchema, 'MachineDates')
};

async function testMongo() {
	let object = {};
	try {
		object.availability = await models.FactAvailability.find({ MachineId: 700002 });
		object.bypass = await models.FactBypass.find({ MachineId: 700002 });
		object.machinedates = await models.MachineDate.find();
		return object;
	} catch (ex) {
		throw ex;
	}

}

testMongo().then((result) => {
	console.log(result);
	console.log(result.availability[0].Hourly[0]);
}).catch((err) => console.log(err));
