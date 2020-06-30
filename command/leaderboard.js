const Discord = require('discord.js');
const database = require('../utils/sql.js');
const utils = require('../utils/utils.js');

module.exports = {
  leaderboard(message, command, cmdRegex) {
    // what object?
    // await messages
    // call object leaderboard

    const filter = (response) => {
      return response.author.id === message.author.id;
    };

    message.channel.send('Leaderboard for what object?').then(() => {
      message.channel
          .awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
          .then((collected) => {
            try {
              const object = database.getObject(collected.first().content);
              message.channel.send(this.objectLeaderboard(object, message)).catch(console.error);
            } catch (err) {
              message.channel.send(err.getEmbed('Leaderboard')).catch(console.error);
            }
          })
          .catch((collected) => {
            message.channel.send('Another time perhaps');
          });
    });
  },

  objectLeaderboard(object, message) {
    const board = this.getLeaderboard(object.name);

    const leaderboard = board.reduce(
        function(acc, user, index) {
          if (user.quantity > 0) {
            const usr = message.guild.members.cache.get(user.userId.substr(19));
            if (usr) {
              acc.rankEmbedString += index + 1 + '. ' + utils.escapeMarkdown(usr.displayName) + ' ' + user.quantity + '\n';
            }
          }
          return acc;
        },
        {rankEmbedString: '', nicknameEmbedString: '', objectEmbedString: ''},
    );

    return new Discord.MessageEmbed()
        .setColor('#FFA500')
        .setTitle(`${utils.capitalizeFirstLetter(object.name)} Leaderboard`)
        .addFields({name: '\u200b', value: leaderboard.rankEmbedString, inline: true});
  },

  showLeaderboard(message, command, cmdRegex) {
    try {
      const object = database.getObject(utils.getObjectType(command, cmdRegex));
      message.channel.send(this.objectLeaderboard(object, message)).catch(console.error);
    } catch (err) {
      message.channel.send(err.getEmbed('Leaderboard')).catch(console.error);
    }
  },

  getLeaderboard(object) {
    const board = database.objectLeaderboard.all(object);

    board.sort((a, b) => {
      return b.quantity - a.quantity;
    });

    return board;
  },
};
