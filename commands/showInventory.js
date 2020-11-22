const User = require('../utils/User.js');
const Discord = require('discord.js');
const entityManager = require('../utils/entityManager.js');
const fs = require('fs');
const config = require('../config');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

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
    let content = {};

    //get inventory
    const inventory = this.getInventory(user);
    content.inventorySlots = inventory[0];
    content = {...content, ...inventory[1]};

    //xp bar
    const nextLevel = config.levels[user.getLevel()-1];
    content.barColour = user.getDiscordMember().guild.roles.cache.find((role) => role.name === nextLevel.name).hexColor;
    content.levelName = nextLevel.name;
    content.percentageFill = Math.floor((user.getXp() / nextLevel.xp) * 100);

    //compile template
    const htmlFile = fs.readFileSync('./commands/templates/inventory.html', 'utf8');
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
    const inventoryImage = await page.screenshot();

    //discord
    const attachment = new Discord.MessageAttachment(inventoryImage, 'inventory.png');
    const inventoryEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Inventory`)
      .attachFiles(attachment)
      .setImage('attachment://inventory.png');

    message.channel.send(inventoryEmbed);

    await browser.close();
  },

  getInventory(user) {
    const inventory = user.getInventory();

    const content = {};

    const inventoryCallback = (acc, ele) => {
      const obj = entityManager.get(ele.entityId);
      if (ele.quantity > 0) {
        const image = fs.readFileSync(`./images/entity/${obj.id}.png`);
        const base64Image = new Buffer.from(image).toString('base64');
        const dataURI = 'data:image/png;base64,' + base64Image;

        content[obj.id] = dataURI;

        acc.push({image: dataURI, quantity: ele.quantity});
      }
      return acc;
    };

    const inventorySlots = inventory.reduce(inventoryCallback, []);
    return [inventorySlots, content];
  },
};
