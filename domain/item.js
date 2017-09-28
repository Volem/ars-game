'use strict';
const Item = function (name = '') {
	return function(durability = 0) {
		this.Name = name;
		this.Durability = durability;
	};
};

const Ore = Item('Ore');
const Wood = Item('Wood');
const Stick = Item('Stick');
const Pickaxe = Item('Pickaxe');
const Hatchet = Item('Hatchet');

module.exports = {
	Item : Item(''),
	Ore : Ore,
	Wood : Wood,
	Stick : Stick,
	Pickaxe : Pickaxe,
	Hatchet : Hatchet
};