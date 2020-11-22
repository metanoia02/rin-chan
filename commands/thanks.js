const Reaction = require('../reactions/reaction.js');
const User = require('../utils/User');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'thanks'},
      {locale: 'en', string: 'thank you'},

      {locale: 'en', string: 'good job'},
    ],

    intent: 'thanks',
    commandName: 'Thanks',
    description: 'Remember to praise Rin-chan for her good work!',

    scope: 'channel',
  },

  init() {
    this.thanksReaction = new Reaction('../reactions/thanks.json', this.config.commandName);
  },

  async run(message, args) {
    const embed = this.thanksReaction.getEmbed(new User(message));

    message.channel.send(embed);
  },
};
