const Discord = require('discord.js');
const utils = require('../utils/utils.js');
const commandUtils = require('../utils/commandUtils.js');
const entityManager = require('../utils/entityManager.js');
const rinChan = require('../rinChan/rinChan.js');
const CommandException = require('../utils/CommandException.js');
const fs = require('fs');
const config = require('../config');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'show %entity% leaderboard'},
      {locale: 'en', string: 'show leaderboard'},
    ],

    intent: 'leaderboard',
    commandName: 'Leaderboard',
    description: 'Display the ranking of anything collectable.',

    scope: 'channel',
  },

  async run(message, args) {
    if (args.entities.length != 1) {
      const filter = (response) => {
        return response.author.id === message.author.id;
      };

      rinChan.setCollecting(true);

      message.channel.send('Choose one thing for the leaderboard').then(() => {
        message.channel
          .awaitMessages(filter, {max: 1, time: 30000, errors: ['time']})
          .then((collected) => {
            const entity = entityManager.get(collected.first().content);
            this.entityLeaderboard(entity, message).then(() => this.sendBoard(entity.id, message));
          })
          .catch((collected) => {
            if (collected instanceof CommandException) {
              utils.handleError(collected, this.config.commandName, message.channel);
            } else {
              message.channel.send('Another time perhaps');
            }
            rinChan.setCollecting(false);
          });
      });
    } else {
      this.entityLeaderboard(args.entities[0], message).then(() => this.sendBoard(args.entities[0].name, message));
    }
  },

  async entityLeaderboard(entity, message) {
    const board = commandUtils.getLeaderboard(entity.id, 20);

    const content = {entityPlural: entity.plural};

    content.users = board.reduce((acc, ele, index) => {
      if (ele.quantity > 0) {
        const member = message.guild.members.cache.get(ele.userId.substr(19));
        if (member) {
          acc.push({
            index: index+1,
            displayHex: member.displayHex,
            avatarUrl: member.user.avatarURL(),
            displayName: member.displayName,
            quantity:
            ele.quantity});
        }
      }
      return acc;
    }, []);

    //compile template
    const htmlFile = fs.readFileSync('./commands/leaderboard.html', 'utf8');
    const template = handlebars.compile(htmlFile);
    const result = template(content);

    //make screenshot
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 400,
      height: 600
    });
    await page.setContent( result );
    const leaderboardImage = await page.screenshot();

    //discord
    const attachment = new Discord.MessageAttachment(leaderboardImage, 'leaderboard.png');
    const leaderboardEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`${utils.capitalizeFirstLetter(entity.name)} Leaderboard`)
      .attachFiles(attachment)
      .setImage('attachment://leaderboard.png');

    message.channel.send(leaderboardEmbed);
    rinChan.setCollecting(false);

    await browser.close();
  }
};
