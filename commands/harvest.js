const User = require('../utils/User.js');
const Reaction = require('../reactions/reaction.js');
const utils = require('../utils/utils.js');
const Discord = require('discord.js');
const schedule = require('node-schedule');
const database = require('../utils/sql.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'harvest'},
      {locale: 'en', string: 'look for oranges'},
    ],

    intent: 'harvest',
    commandName: 'Harvest',
    description: 'Send Rin-chan out to find oranges or... other things.',

    scope: 'channel',

    lenImages: {path: './images/len/', quantity: 10},
    orangeHarvestCooldown: 2400000,
  },

  init() {
    this.findOrangeReact = new Reaction('../reactions/findOrange.json');
  },

  run(message, args) {
    const user = new User(message);
    const chance = Math.floor(Math.random() * 100) + 1;
    const now = new Date();

    if (user.getTries() > 0) {
      if (0 < chance && chance <= 5) {
        this.easterEgg(message, user);
        user.setTries(0);
      } else if (5 < chance && chance <= 60) {
        user.changeObjectQuantity('orange', 1);
        user.setObjectLastGet('orange');
        user.changeTries(-1);
        this.foundOrange(message, user);
      } else if (60 < chance && chance <= 100) {
        user.changeTries(-1);
        this.couldntFind(message, user);
      }

      user.setLastHarvest(now.getTime());
    } else {
      const duration = utils.getCooldown(this.config.orangeHarvestCooldown, user.getLastHarvest());

      const attachment = new Discord.MessageAttachment('./images/emotes/rinded.png', 'rinded.png');
      const imTiredEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Harvest')
        .setDescription("I'm tired!")
        .attachFiles(attachment)
        .setThumbnail('attachment://rinded.png')
        .addField('You can try again in:', duration, true);

      message.channel.send(imTiredEmbed).catch(console.error);
    }
  },

  easterEgg(message, user) {
    const now = new Date();

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
    const reaction = this.findOrangeReact.getReaction(user);

    const attachment = new Discord.MessageAttachment(reaction.image, reaction.imageName);
    const foundOrangeEmbed = new Discord.MessageEmbed()
      .setColor('#FFA500')
      .setTitle('Harvest')
      .setDescription(reaction.string)
      .attachFiles(attachment)
      .setThumbnail(`attachment://${reaction.imageName}`);

    message.channel.send(foundOrangeEmbed).catch(console.error);
  },

  couldntFind(message, user) {
    const attachment = new Discord.MessageAttachment('./images/emotes/rinyabai.png', 'rinyabai.png');
    const couldntFindEmbed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Harvest')
      .setDescription("Couldn't find anything")
      .attachFiles(attachment)
      .setThumbnail('attachment://rinyabai.png');

    message.channel.send(couldntFindEmbed).catch(console.error);
  },
};

// eslint-disable-next-line no-unused-vars
const updateTriesInterval = schedule.scheduleJob('0 * * * * *', function () {
  const users = database.getAllUsers.all();
  const now = new Date();

  users.forEach((user) => {
    const thisUser = new User(undefined, user.user, user.guild);
    const maxTries = thisUser.getIsBooster() === 0 ? 3 : 4;
    if (thisUser.getTries() < maxTries) {
      if (now.getTime() - thisUser.getLastHarvest() > module.exports.config.orangeHarvestCooldown) {
        thisUser.changeTries(1);
      	const now = new Date();
      	thisUser.setLastHarvest(now.getTime());
      }
    }
  });
});
