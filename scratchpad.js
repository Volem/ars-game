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

Test();

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

