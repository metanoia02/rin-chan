const CommandException = require('../utils/CommandException.js');
const Discord = require('discord.js');
const database = require('../utils/sql.js');
const utils = require('../utils/utils.js');
const rinChan = require('../rinChan/rinChan.js');
const User = require('../utils/User.js');
const entityManager = require('../utils/entityManager');
const fs = require('fs');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'go shopping'},
      {locale: 'en', string: `let's go shopping`},
      {locale: 'en', string: `shopping`},
    ],

    intent: 'goShopping',
    commandName: 'Go Shopping',
    description: 'Go to the shop with Rin-chan. You can buy and exchange Entitys',

    scope: 'DM',

    phrases: {
      buy: /buy ([0-9]+) ([a-z ]+)/gi,
      sell: /sell ([0-9]+) ([a-z ]+)/gi,
      leave: /leave|finished|lets go|let's go/gi,
    },
  },

  async run(message, args) {
    message.channel.send(`Ok let's go! <:smolrin:707284808333787197>`);

    const filter = (response) => {
      return response.author.id === message.author.id;
    };

    await this.sendShopEmbed(message);

    message.author.createDM().then((dmChannel) => {
      const collector = dmChannel.createMessageCollector(filter, {time: 60000});
      rinChan.setCollecting(true);

      collector.on('collect', (collected) => {
        try {
          const buyRegex = new RegExp(this.config.phrases.buy);
          const sellRegex = new RegExp(this.config.phrases.sell);
          const leaveRegex = new RegExp(this.config.phrases.leave);

          if (buyRegex.test(collected.content)) {
            this.buyEntity(collected.content, message);
          } else if (sellRegex.test(collected.content)) {
            this.sellEntity(collected.content, message);
          } else if (leaveRegex.test(collected.content)) {
            collector.stop();
            rinChan.setCollecting(false);
          }
        } catch (err) {
          utils.handleError(err, this.config.commandName, message.author);
        }
      });

      collector.on('end', (collected) => {
        message.author.send(`I'm bored lets go`);
      });
    });
  },

  getEntityQuantity(messageContent, regex) {
    const reg = new RegExp(regex);

    const matchesArray = [...messageContent.matchAll(reg)][0];

    const entity = entityManager.find(matchesArray[2]);

    if (!entity.tradable) {
      throw new CommandException(`You can't trade that`, 'rinno.png');
    }

    const quantity = matchesArray[1];

    if (quantity < 1) throw new CommandException('You need to buy or sell at least 1', 'rinwha.png');

    return {entity: entity, quantity: quantity};
  },

  buyEntity(collectedContent, message) {
    const order = this.getEntityQuantity(collectedContent, this.config.phrases.buy);
    const user = new User(message);
    const price = order.quantity * order.entity.value;

    const entityString = order.quantity > 1 ? order.entity.plural : order.entity.name;

    if (order.entity.id === 'orange') {
      throw new CommandException(`What's the point of that?`, 'rinconfuse.png');
    }

    if (user.getEntityQuantity('orange') < price) {
      throw new CommandException(`You don't have enough oranges for that.`, 'rinwha.png');
    }

    this.shopChangeStock(order.entity.id, -order.quantity);
    this.shopChangeOranges(parseInt(price));

    user.changeEntityQuantity(order.entity.id, parseInt(order.quantity));
    user.changeEntityQuantity('orange', -parseInt(price));

    message.author.send('Ok you bought ' + order.quantity + ' ' + entityString);
    this.sendShopEmbed(message);
  },

  sellEntity(collectedContent, message) {
    const order = this.getEntityQuantity(collectedContent, this.config.phrases.sell);

    const user = new User(message);
    const price = Math.ceil(order.quantity * order.entity.value * 0.5);

    const entityString = order.quantity > 1 ? order.entity.plural : order.entity.name;

    if (user.getEntityQuantity(order.entity.id) < order.quantity) {
      throw new CommandException(`You don't have ${order.quantity} ${entity}.`, 'rinwha.png');
    }

    if (order.entity.id === 'orange') {
      throw new CommandException(`What's the point of that?`, 'rinconfuse.png');
    }

    this.shopChangeOranges(-parseInt(price));
    this.shopChangeStock(order.entity.id, order.quantity);

    user.changeEntityQuantity('orange', parseInt(price));
    user.changeEntityQuantity(order.entity.id, -parseInt(order.quantity));

    message.author.send('Ok you sold ' + order.quantity + ' ' + entityString);
    this.sendShopEmbed(message);
  },

  shopChangeOranges(modifier) {
    const shopOranges = database.getShopStock('orange');

    if (modifier < 0 && (shopOranges.quantity + modifier) < 0) {
      throw new CommandException(`The shop doesn't have enough oranges to make the purchase.`, 'rinwha.png');
    }

    shopOranges.quantity += parseInt(modifier);
    database.setShopStock.run(shopOranges);
  },

  shopChangeStock(entityId, modifier) {
    const stock = database.getShopStock(entityId);

    if (modifier < 0 && (stock.quantity + modifier) < 0) {
      throw new CommandException(`There's not enough stock`, 'rinwha.png');
    }

    stock.quantity += parseInt(modifier);
    database.setShopStock.run(stock);
  },

  async sendShopEmbed(message) {
    const stock = database.getAllShopStock();

    const shopStock = stock.reduce((acc, ele) => {
      acc.push({name: ele.name, value: entityManager.get(ele.id).value, quantity: ele.quantity});
      return acc;
    }, []);

    const htmlFile = fs.readFileSync('./commands/templates/shop.html', 'utf8');
    const template = handlebars.compile(htmlFile);
    const result = template({stock: shopStock});

    //make screenshot
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setViewport({
      width: 400,
      height: 600
    });
    await page.setContent( result );
    const inventoryImage = await page.screenshot();

    //discord
    const thumbnail = new Discord.MessageAttachment('./images/shop/thumbnail.jpg', 'thumbnail.jpg');
    const attachment = new Discord.MessageAttachment(inventoryImage, 'shop.png');
    const shopEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Orange Kingdom General Store')
      .setDescription('The best value every day for discerning Rin-chans')
      .setThumbnail('attachment://thumbnail.jpg')
      .attachFiles(attachment)
      .attachFiles(thumbnail)
      .setImage('attachment://shop.png')
      .setFooter(`Say buy or sell <quantity> <item name> eg. buy 2 lens. To leave say finished. This shop buys back items for 50% of their value.`);

    message.author.send(shopEmbed);

    await browser.close();
  },
};
