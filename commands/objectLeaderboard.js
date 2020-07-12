const Discord = require('discord.js');
const utils = require('../utils/utils.js');
const commandUtils = require('../utils/commandUtils.js');
const nodeHtmlToImage = require('node-html-to-image');
const objectManager = require('../utils/objectManager.js');
const rinChan = require('../rinChan/rinChan.js');
const CommandException = require('../utils/CommandException.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'show %object% leaderboard'},
      {locale: 'en', string: 'show leaderboard'},
    ],

    intent: 'leaderboard',
    commandName: 'Leaderboard',
    description: 'Display the ranking of any object.',

    scope: 'channel',
  },

  run(message, args) {
    if (args.objects.length != 1) {
      const filter = (response) => {
        return response.author.id === message.author.id;
      };
      rinChan.setCollecting(true);

      message.channel.send('Choose one object for the leaderboard').then(() => {
        message.channel
          .awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
          .then((collected) => {
            const object = objectManager.get(collected.first().content);
            this.objectLeaderboard(object, message);
          })
          .catch((collected) => {
            if (collected instanceof CommandException) {
              utils.handleError(collected, this.config.commandName, message.channel);
            } else {
              message.channel.send('Another time perhaps');
            }
          });
      });
    } else {
      this.objectLeaderboard(args.objects[0], message);
    }
    rinChan.setCollecting(true);
  },

  objectLeaderboard(object, message) {
    const board = commandUtils.getLeaderboard(object.getName(), 20);

    let imageHtml = `
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
      body{
          background-color: #2f3136;
          color: #d9dadb;
          width:400px;
          font-family: Whitney,Helvetica Neue,Helvetica,Arial,sans-serif;
          font-size:20px;
      }
      table {
          width:100%;
          padding:5px;
          text-align:center;
      }
      th {
          font-size:24px;
      }
      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }        
      </style>
    </head>
    <body>
    <table>
    <tr>
      <th>Rank</th>
      <th>User</th>
      <th>${utils.capitalizeFirstLetter(object.getPlural())}</th>
    </tr>`;

    board.forEach((ele, index) => {
      if (ele.quantity > 0) {
        const usr = message.guild.members.cache.get(ele.userId.substr(19));
        if (usr) {
          imageHtml += `
          <tr>
            <td>${index + 1}</td>
            <td>
              <div style="color:${usr.displayHexColor};">
                <img src="${usr.user.avatarURL()}" />  ${usr.displayName}
              </div>
            </td>
            <td>${ele.quantity}</td>
          </tr>`;
        }
      }
    });

    imageHtml += `
      </table>
      </body>
      </html>`;

    nodeHtmlToImage({
      output: './images/embeds/leaderboard.png',
      html: imageHtml,
      transparent: true,
    }).then(() => {
      const attachment = new Discord.MessageAttachment('./images/embeds/leaderboard.png', 'leaderboard.png');
      const leaderboardEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${utils.capitalizeFirstLetter(object.getName())} Leaderboard`)
        .attachFiles(attachment)
        .setImage('attachment://leaderboard.png');

      message.channel.send(leaderboardEmbed).catch(console.error);
    });
  },
};
