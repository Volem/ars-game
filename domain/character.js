'use strict';
const Location = require('./location');
const Direction = require('./direction');
const Inventory = require('./inventory');
const Brain = require('./brain');
const runMultiplier = 2;

const move = (step = 0) => (direction = Direction.North) => (fromlocation = new Location()) => {
	// Change X when to East or West
	let toX = direction == Direction.East || direction == Direction.West;
	// Increament when to East or North
	let inc = (direction == Direction.East || direction == Direction.North) ? 1 : -1;
	inc *= step;

	return new Location(fromlocation.x + (toX ? inc : 0), fromlocation.y + (toX ? 0 : inc));
};

const run = (step = 0) => (direction = Direction.North) => (fromlocation = new Location()) => {
	return move(step * runMultiplier)(direction)(fromlocation);
};

module.exports = function (name = '') {
	this.Name = name;
	this.Move = move;
	this.Run = run;
	this.Inventory = new Inventory(); 
	this.Brain = Brain; 
};