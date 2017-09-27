'use strict';
const synaptic = require('synaptic');
const Architect = synaptic.Architect;
module.exports = new Architect.LSTM(2, 4, 4, 4, 1);


