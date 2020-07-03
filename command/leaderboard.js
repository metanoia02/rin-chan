const Discord = require('discord.js');
const utils = require('../utils/utils.js');
const database = require('../utils/sql.js');
const nodeHtmlToImage = require('node-html-to-image');

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
            const object = database.getObject(collected.first().content);
            if (!object) {
              message.channel.send('What is that? <:rinwha:600747717081432074>');
            } else {
              message.channel.send(this.objectLeaderboard(object, message)).catch(console.error);
            }
          })
          .catch((collected) => {
            message.channel.send('Another time perhaps');
          });
    });
  },

  objectLeaderboard(object, message) {
    const board = this.getLeaderboard(object.name);

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
        <th>${utils.capitalizeFirstLetter(object.plural)}</th>
    </tr>`;

    board.forEach((ele, index) => {
      if (ele.quantity > 0) {
        const usr = message.guild.members.cache.get(ele.userId.substr(19));
        if (usr) {
          imageHtml += `
          <tr>
            <td>${index + 1}</td>
            <td><div style="color:${usr.displayHexColor};"><img src="${usr.user.avatarURL()}" />  ${decodeURI(utils.escapeMarkdown(usr.displayName))}</div></td>
            <td>${ele.quantity}</td>
          </tr>`;
        console.log(utils.escapeMarkdown(usr.displayName));
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
          .setTitle(`${utils.capitalizeFirstLetter(object.name)} Leaderboard`)
          .attachFiles(attachment)
          .setImage('attachment://leaderboard.png');

      message.channel.send(leaderboardEmbed).catch(console.error);
    });
  },

  showLeaderboard(message, command, cmdRegex) {
    const object = database.getObject(utils.getObjectType(command, cmdRegex));

    if (!object) {
      message.channel.send('What is that? <:rinwha:600747717081432074>');
    } else {
      this.objectLeaderboard(object, message);
    }
  },

  getLeaderboard(object) {
    const board = database.objectLeaderboard.all(object);

    board.sort((a, b) => {
      return b.quantity - a.quantity;
    });

    return board.slice(0, 20);
  },
};
