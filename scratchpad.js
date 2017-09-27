'use strict';
const synaptic = require('synaptic');
const Layer = synaptic.Layer;
const Network = synaptic.Network;
const Trainer = synaptic.Trainer;

let inputLayer = new Layer(3);
let hiddenLayer = new Layer(10);
let outputLayer = new Layer(1);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

let vendorNeuralNetwork = new Network({
	input: inputLayer,
	hidden: [hiddenLayer],
	output: outputLayer
});

console.log(`Output Before Train [1, 2, 3] :\t${vendorNeuralNetwork.activate([1, 2, 3])[0].toFixed(4)}`);
console.log(`Output Before Train [1, 1, 1] :\t${vendorNeuralNetwork.activate([1, 1, 1])[0].toFixed(4)}`);
for (let i = 0; i < 100000; i++) {
	vendorNeuralNetwork.activate([1, 2, 3]);	
	vendorNeuralNetwork.propagate(.3, [1]);
	vendorNeuralNetwork.activate([1, 1, 1]);
	vendorNeuralNetwork.propagate(.3, [0]);
}
console.log(`Output After Train [1, 2, 3] :\t${vendorNeuralNetwork.activate([1, 2, 3])[0].toFixed(4)} , Correct value : 1`);
console.log(`Output After Train [1, 1, 1] :\t${vendorNeuralNetwork.activate([1, 1, 1])[0].toFixed(4)} , Correct value : 0`);
