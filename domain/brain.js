'use strict';
const config = require('../config');
const synaptic = require('synaptic');
const Architect = synaptic.Architect;
let Brain = new Architect.LSTM(config.BrainInputCount, 4, 4, 4, config.BrainOutputCount + 2);
Brain.trainer = new synaptic.Trainer(Brain);
//let Brain = new Architect.Perceptron(config.BrainInputCount, 5, config.BrainOutputCount);
module.exports = Brain;

