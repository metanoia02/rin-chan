const User = require('../utils/User.js');
const Discord = require('discord.js');
const utils = require('../utils/utils');
const CommandException = require('../utils/CommandException');
const entityManager = require('../utils/entityManager');
const fs = require('fs');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'show song book'},
      {locale: 'en', string: 'check my music'},
      {locale: 'en', string: 'song book'},
    ],

    intent: 'showSongBook',
    commandName: 'Song Book',
    description: 'Show the songs in your song book, if you have one',

    scope: 'channel',
  },

  async run(message, args) {
    const user = new User(message);

    if (user.getEntityQuantity('songBook') > 0) {
      const songBook = user.getSongBook();
      let content = {};

      const inventoryCallback = (acc, ele) => {
        const obj = entityManager.get(ele.entityId);

        const image = fs.readFileSync(`./images/entity/${obj.id}.png`);
        const base64Image = new Buffer.from(image).toString('base64');
        const dataURI = 'data:image/png;base64,' + base64Image;

        content[obj.id] = dataURI;
        const item = {image: dataURI};

        acc.push(item);
        return acc;
      };

      content.inventorySlots = songBook.reduce(inventoryCallback, []);

      const inventoryImage = await utils.generateImage('./commands/templates/inventory.html', content);

      const attachment = new Discord.MessageAttachment(inventoryImage, 'inventory.png');
      const inventoryEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Inventory`)
        .attachFiles(attachment)
        .setImage('attachment://inventory.png');

      message.channel.send(inventoryEmbed);
    } else {
      throw new CommandException(`You don't have a song book`, 'rinwha.png');
    }
  },


};
