const User = require('../utils/User.js');
const CommandException = require('../utils/CommandException.js');
const rinChan = require('../rinChan/rinChan.js');
const random = require('../utils/random.js');
const database = require('../utils/sql.js');
const utils = require('../utils/utils.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'rate'},
      {locale: 'en', string: 'rate %user%'},
      {locale: 'en', string: 'rate %tag%'},
    ],

    intent: 'rate',
    commandName: 'Rating',
    description: 'Rate a user or anything else.',

    scope: 'channel',
  },

  run(message, args) {
    if (args.mentions.length === 1) {
      this.rateUser(args.mentions[0].getDiscordMember(), message);
    } else if (args.tags.length === 1) {
      this.rateUser(args.tags[0].getDiscordMember(), message);
    } else {
      const filter = (response) => {
        return response.author.id === message.author.id;
      };

      rinChan.setCollecting(true);

      message.channel.send(`What or who should I rate?`).then(() => {
        message.channel
          .awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
          .then((collected) => {
            if (collected.first().mentions.members.size === 1) {
              this.rateUser(collected.first().mentions.members.first(), message);
            } else {
              this.rateRandom(collected.first().content, message);
            }
            rinChan.setCollecting(false);
          })
          .catch((collected) => {
            rinChan.setCollecting(false);
            if (collected instanceof CommandException || collected instanceof Error) {
              utils.handleError(collected, this.config.commandName, message.channel);
            } else {
              message.channel.send('Another time perhaps');
            }
          });
      });
    }
  },

  rateUser(member, message) {
    if (member.id == rinChan.getId()) {
      throw new CommandException(`Probably about 1000%`, 'rintriumph.png');
    }
    // get leaderboard
    const topUserId = database.getTopAffection.all()[0];

    const topUser = new User(message, topUserId.user, message.guild.id);
    const thisUser = new User(message, member.id, message.guild.id);

    let rating = 0;

    if (topUser.getId() === thisUser.getId()) {
      rating = 100.0;
    } else {
      rating = (thisUser.getAffection() / topUser.getAffection()) * 100;
    }

    message.channel.send(`I would rate ${thisUser.getDiscordMember().displayName} ${rating.toFixed(2)}%`);
  },

  rateRandom(toRate, message) {
    //check if object
    if (toRate.toLowerCase().includes('orange')) {
      message.channel.send(`I would rate '${toRate.trim()}' 100.00%`);
    } else if (toRate.toLowerCase().includes('len')) {
      message.channel.send(`I would rate '${toRate.trim()}' roadroller%`);
    } else {
      random.generateIntegers({min: 1, max: 10000, n: 1}).then(function (result) {
        message.channel.send(`I would rate '${toRate.trim()}' ${(result.random.data[0] / 100).toFixed(2)}%`);
      });
    }
  },
};
