const User = require('../utils/User.js');
const Discord = require('discord.js');
const config = require('../config');
const utils = require('../utils/utils');
const fs = require('fs');
const entityManager = require('../utils/entityManager');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'show inventory'},
      {locale: 'en', string: 'show my inventory'},
      {locale: 'en', string: 'inventory'},

      {locale: 'en', string: 'show level'},
      {locale: 'en', string: 'show xp'},
    ],

    intent: 'showInventory',
    commandName: 'Inventory',
    description: 'Show everything you have and character stats',

    scope: 'channel',
  },

  async run(message, args) {
    const user = new User(message);
    const content = {};
    const inventory = user.getInventory();
    content.equippedItem = true;

    const inventoryCallback = (acc, ele) => {
      const obj = entityManager.get(ele.entityId);
      if (ele.quantity > 0) {
        const image = fs.readFileSync(`./images/entity/${obj.id}.png`);
        const base64Image = new Buffer.from(image).toString('base64');
        const dataURI = 'data:image/png;base64,' + base64Image;

        content[obj.id] = dataURI;

        const item = {image: dataURI};
        item.quantity = ele.quantity;

        acc.push(item);
      }
      return acc;
    };

    content.inventorySlots = inventory.reduce(inventoryCallback, []);

    const nextLevel = config.levels[user.getLevel()-1];
    if (nextLevel) {
      content.barColour = user.getDiscordMember().guild.roles.cache
        .find((role) => role.name === nextLevel.name).hexColor;

      content.levelName = `Next Level: ${nextLevel.name}`;
      content.percentageFill = Math.floor(((user.getXp() - config.levels[user.getLevel()].xp) /
       (nextLevel.xp - config.levels[user.getLevel()].xp)) * 100);
    } else {
      content.barColour = '#D4AF37';
      content.levelName = 'Max Level';
      content.percentageFill = 100;
    }

    const equippedEntity = user.getEquipped();

    if (equippedEntity) {
      const image = fs.readFileSync(`./images/entity/${equippedEntity.id}.png`);
      const base64Image = new Buffer.from(image).toString('base64');
      const dataURI = 'data:image/png;base64,' + base64Image;

      content.equippedImage = dataURI;
    }

    const inventoryImage = await utils.generateImage('./commands/templates/inventory.html', content);

    const attachment = new Discord.MessageAttachment(inventoryImage, 'inventory.png');
    const inventoryEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Inventory`)
      .attachFiles(attachment)
      .setImage('attachment://inventory.png');

    message.channel.send(inventoryEmbed);
  },
};
