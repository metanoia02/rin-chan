const CommandException = require('../utils/CommandException.js');
const Reaction = require('../reactions/reaction.js');

const utils = require('../utils/utils.js');
const User = require('../utils/User.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'headpat'},
      {locale: 'en', string: '<:rinheadpat:686915995373142028>'},
    ],

    intent: 'headpat',
    commandName: 'Headpat',
    description: 'You may headpat Rin-chan.',

    scope: 'channel',
  },

  init() {},

  run(message, args) {
    const user = new User(message);
    const currentTime = new Date();

    if (user.getLastGive() < currentTime.getTime() - 172800000) {
      throw new CommandException('You never give me oranges...', 'rinpout.png');
    } else {
      message.channel.send('<:rincomf:634115522002419744>');
    }
  },
};
