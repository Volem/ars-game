'use strict';
const Item = function (name = '') {
	return function () {
		this.Components = [];
		this.Name = name;
		this.Durability = 100;
	};
};

const Ore = Item('Ore');
const Wood = Item('Wood');
const Stick = Item('Stick');
const Pickaxe = Item('Pickaxe');
const Hatchet = Item('Hatchet');

module.exports = {
	Item: Item(''),
	Ore: Ore,
	Wood: Wood,
	Stick: Stick,
	Pickaxe: Pickaxe,
	Hatchet: Hatchet
};