'use strict';
const config = require('../config');
const synaptic = require('synaptic');
const Architect = synaptic.Architect;
module.exports = new Architect.LSTM(config.BrainInputCount, 4, 4, 4, config.BrainOutputCount);


