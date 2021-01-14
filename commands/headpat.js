const CommandException = require('../utils/CommandException.js');
const User = require('../utils/User.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'headpat'},
      {locale: 'en', string: '<:rinheadpat:686915995373142028>'},
      {locale: 'en', string: 'pat'},
    ],

    intent: 'headpat',
    commandName: 'Headpat',
    description: 'You may headpat Rin-chan.',

    scope: 'channel',
  },

  init() {},

  async run(message, args) {
    const user = new User(message);
    const currentTime = new Date();

    if (user.getLastGive() < currentTime.getTime() - 172800000) {
      throw new CommandException('You never give me oranges...', 'rinpout.png');
    } else {
      message.channel.send('<:rincomf:634115522002419744>');
    }
  },
};
