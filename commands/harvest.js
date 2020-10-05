const User = require('../utils/User.js');
const Reaction = require('../reactions/reaction.js');
const utils = require('../utils/utils.js');
const Discord = require('discord.js');
const schedule = require('node-schedule');
const database = require('../utils/sql.js');
const rinChan = require('../rinChan/rinChan.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'harvest'},
      {locale: 'en', string: 'look for %object%'},
      {locale: 'en', string: 'find an %object%'},
      {locale: 'en', string: 'locate an %object%'},
    ],

    intent: 'harvest',
    commandName: 'Harvest',
    description: 'Send Rin-chan out to find oranges or... other things.',

    scope: 'channel',

    lenImages: {path: './images/len/', quantity: 10},
    orangeHarvestCooldown: 2400000,
  },

  init() {
    this.findOrangeReact = new Reaction('../reactions/harvest/findOrange.json', this.config.commandName);
    this.imTiredReact = new Reaction('../reactions/harvest/imTired.json', this.config.commandName);
  },

  async run(message, args) {
    const user = new User(message);
    const chance = Math.floor(Math.random() * 100) + 1;
    const now = new Date();

    if (user.getTries() > 0) {
      if (0 < chance && chance <= 5) {
        this.easterEgg(message, user);
        user.setTries(0);
      } else if (5 < chance && chance <= 60) {
        const chanceSteal = Math.floor(Math.random() * 100) + 1;
        if (rinChan.getHunger() > 3 && chanceSteal > 50) {
          this.stealOrange(message, user);
        } else {
          user.changeObjectQuantity('orange', 1);
          user.setObjectLastGet('orange');
          user.changeTries(-1);
          this.foundOrange(message, user);
        }
      } else if (60 < chance && chance <= 100) {
        user.changeTries(-1);
        this.couldntFind(message, user);
      }

      if (now.getTime() - user.getLastHarvest() > this.config.orangeHarvestCooldown) {
        user.setLastHarvest(now.getTime());
      }
    } else {
      const duration = utils.getCooldown(this.config.orangeHarvestCooldown, user.getLastHarvest());
      const imTiredEmbed = this.imTiredReact.getEmbed(user).addField('You can try again in:', duration, true);
      message.channel.send(imTiredEmbed);
    }
  },

  stealOrange(message, user) {
    rinChan.setHunger(rinChan.getHunger() - 1);
    user.changeTries(-1);

    const attachment = new Discord.MessageAttachment('./images/emotes/rintehe.png', 'rintehe.png');
    const stealEmbed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Harvest')
      .setDescription(`I found one! But I got hungry on the way back.`)
      .attachFiles(attachment)
      .setThumbnail('attachment://rintehe.png');

    message.channel.send(stealEmbed).catch(console.error);
  },

  easterEgg(message, user) {
    user.changeObjectQuantity('Len', 1);
    user.setObjectLastGet('Len');

    const imageName = Math.floor(Math.random() * this.config.lenImages.quantity) + 1 + '.jpg';

    const image = this.config.lenImages.path + imageName;

    const attachment = new Discord.MessageAttachment(image, imageName);
    const couldntFindEmbed = new Discord.MessageEmbed()
      .setColor('#FFFF00')
      .setTitle('Harvest')
      .setDescription('Found a Len! <:rinwao:701505851449671871>')
      .attachFiles(attachment)
      .setImage(`attachment://${imageName}`);

    message.channel.send(couldntFindEmbed).catch(console.error);
  },

  foundOrange(message, user) {
    message.channel.send(this.findOrangeReact.getEmbed(user));
  },

  couldntFind(message, user) {
    const attachment = new Discord.MessageAttachment('./images/emotes/rinyabai.png', 'rinyabai.png');
    const couldntFindEmbed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Harvest')
      .setDescription(`Couldn't find anything`)
      .attachFiles(attachment)
      .setThumbnail('attachment://rinyabai.png');

    message.channel.send(couldntFindEmbed);
  },
};

// eslint-disable-next-line no-unused-vars
const updateTriesInterval = schedule.scheduleJob('0 * * * * *', function () {
  const users = database.getAllUsers.all();
  const now = new Date();

  users.forEach((user) => {
    const thisUser = new User(undefined, user.user, user.guild);
    const maxTries = thisUser.getIsBooster() ? 4 : 3;
    if (thisUser.getTries() < maxTries) {
      if (now.getTime() - thisUser.getLastHarvest() > module.exports.config.orangeHarvestCooldown) {
        thisUser.changeTries(1);
        const now = new Date();
        thisUser.setLastHarvest(now.getTime());
      }
    }
  });
});
