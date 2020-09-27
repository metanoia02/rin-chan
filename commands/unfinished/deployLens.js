const User = require('../utils/User.js');
const CommandException = require('../utils/CommandException.js');
const Reaction = require('../reactions/reaction.js');
const rinChan = require('../rinChan/rinChan.js');
const objectManager = require('../utils/objectManager.js');
const commandUtils = require('../utils/commandUtils.js');

module.exports = {
  config: {
    training: [{locale: 'en', string: 'deploy len'}],

    intent: 'deployLens',
    commandName: 'Deploy Lens',
    description: 'Rin-chan deploys Lens into the wilds... results may vary.',

    scope: 'channel',

    feedableObjects: [{objectName: 'orange', func: 'feedOrange'}],
    orangeGiveCooldown: 300000,
  },

  init() {},

  async run(message, args) {},
};
