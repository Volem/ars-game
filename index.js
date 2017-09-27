'use strict';

const Character = require('./domain/character');
const Location = require('./domain/location');
const Direction = require('./domain/direction');
const Inventory = require('./domain/inventory');

let Volem = new Character('Volem');
let currentLocation = new Location();
let volemsInventory = new Inventory();

const mobileVolem = Volem.Move(7);
const runningVolem = Volem.Run(7);

const VolemMovesEast = mobileVolem(Direction.East);
const VolemMovesWest = mobileVolem(Direction.West);
const VolemMovesNorth = mobileVolem(Direction.North);
const VolemMovesSouth = mobileVolem(Direction.South);
const VolemRunsSouth = runningVolem(Direction.South);

currentLocation = VolemMovesEast(currentLocation);
console.log(`${Volem.Name}'s new Location : ${JSON.stringify(currentLocation)}`);
currentLocation = VolemMovesWest(currentLocation);
console.log(`${Volem.Name}'s new Location : ${JSON.stringify(currentLocation)}`);
currentLocation = VolemMovesSouth(currentLocation);
console.log(`${Volem.Name}'s new Location : ${JSON.stringify(currentLocation)}`);
currentLocation = VolemMovesNorth(currentLocation);
console.log(`${Volem.Name}'s new Location : ${JSON.stringify(currentLocation)}`);
currentLocation = VolemRunsSouth(currentLocation);
console.log(`${Volem.Name}'s new Location : ${JSON.stringify(currentLocation)}`);
