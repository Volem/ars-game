'use strict';
const arsfn = require('ars-functional');
const CharManager = require('./characterManager');
const Skills = require('../domain/skill');
const CreateMiner = CharManager.CreateCharacter(Skills.Miner);
const CreateLumberjack = CharManager.CreateCharacter(Skills.Lumberjack);
const CreateCarpenter = CharManager.CreateCharacter(Skills.Carpenter);
const CreateBlacksmith = CharManager.CreateCharacter(Skills.Blacksmith);

