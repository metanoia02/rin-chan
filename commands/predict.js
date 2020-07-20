const User = require('../utils/User.js');
const CommandException = require('../utils/CommandException.js');
const Reaction = require('../reactions/reaction.js');
const rinChan = require('../rinChan/rinChan.js');
const objectManager = require('../utils/objectManager.js');
const commandUtils = require('../utils/commandUtils.js');
const utils = require('../utils/utils.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'make a prediction'},
      {locale: 'en', string: '8ball'},
      {locale: 'en', string: 'I seek wisdom'},
    ],

    intent: 'predict',
    commandName: 'Make a prediction',
    description: 'Seek Rin-chans wisdom on something.',

    scope: 'channel',

    responses: [
      'It is certain',
      'Without a doubt',
      'You may rely on it',
      'Yes definitely',
      'It is decidedly so',
      'As I see it, yes',
      'Most likely',
      'Yes',
      'Outlook good',
      'Signs point to yes',
      'Reply hazy try again',
      'Better not tell you now',
      'Ask again later',
      'Cannot predict now',
      'Concentrate and ask again',
      `Don't count on it`,
      'Outlook not so good',
      'My sources say no',
      'Very doubtful',
      'My reply is no',
    ],

    price: 3,
  },

  init() {},

  run(message, args) {
    const filter = (response) => {
      return response.author.id === message.author.id;
    };

    message.channel
      .send(
        `You may seek my wisdom for a small fee of ${this.config.price} oranges. If that's okay ask your question now:`
      )
      .then(() => {
        message.channel
          .awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
          .then((collected) => {
            const user = new User(message);
            if (user.getObjectQuantity('orange') < this.config.price) {
              throw new CommandException(`You don't have enough oranges.`, 'rinpls.png');
            }

            user.changeObjectQuantity('orange', -this.config.price);
            const rinchan = new User(message, rinChan.getId(), message.guild.id);
            rinchan.changeObjectQuantity('orange', this.config.price);

            message.channel.send(utils.arrayRandom(this.config.responses));
          })
          .catch((collected) => {
            if (collected instanceof CommandException) {
              utils.handleError(collected, this.config.commandName, message.channel);
            } else {
              message.channel.send('Another time perhaps');
            }
          });
      });
  },
};
