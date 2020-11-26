const Reaction = require('../reactions/reaction.js');
const User = require('../utils/User.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'hungry'},
      {locale: 'en', string: 'are you hungry'},
    ],

    intent: 'hungry',
    commandName: 'Hungry?',
    description: 'Rin-chan says how hungry she is.',

    scope: 'channel',
  },

  init() {
    this.reaction = new Reaction('../reactions/hungry.json', this.config.commandName);
  },

  async run(message, args) {
    const embed = this.reaction.getEmbed(new User(message));

    message.channel.send(embed);
  },
};
