'use strict';
const Location = require('./location');
const Direction = require('./direction');

const move = (step = 0) => (direction = Direction.North) => (fromlocation = new Location()) => {
	// Change X when to East or West
	let toX = direction == Direction.East || direction == Direction.West;
	// Increament when to East or North
	let inc = (direction == Direction.East || direction == Direction.North) ? 1 : -1;
	inc *= step;

	return new Location(fromlocation.x + (toX ? inc : 0), fromlocation.y + (toX ? 0 : inc));
};

module.exports = function(name = ''){
	this.name = name;
	this.Move = move;
};