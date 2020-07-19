const User = require('../utils/User.js');
const CommandException = require('../utils/CommandException.js');
const Reaction = require('../reactions/reaction.js');
const rinChan = require('../rinChan/rinChan.js');
const objectManager = require('../utils/objectManager.js');
const commandUtils = require('../utils/commandUtils.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'rate %user%'},
      {locale: 'en', string: 'rate %tag%'},

      {locale: 'en', string: 'rate %user%'},
      {locale: 'en', string: 'rate %user%'},
    ],

    intent: 'feedObject',
    commandName: 'Feed Rin-chan',
    description: 'Give an orange or other orange based foods to Rin-Chan.',

    scope: 'channel',

    feedableObjects: [{objectName: 'orange', func: 'feedOrange'}],
    orangeGiveCooldown: 300000,
  },

  init() {
    this.orangeReaction = new Reaction('../reactions/feed/orange.json', this.config.commandName);
  },

  run(message, args) {},
};
