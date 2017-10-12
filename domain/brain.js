'use strict';
const config = require('../config');
const synaptic = require('synaptic');
const Architect = synaptic.Architect;
let Brain = new Architect.LSTM(config.BrainInputCount, 3, 3, 3, config.BrainOutputCount + 2);
//let Brain = new Architect.Perceptron(config.BrainInputCount, 5, config.BrainOutputCount);
module.exports = {
	Brain : Brain,
	Trainer : new synaptic.Trainer(Brain)
};

