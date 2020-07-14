const CommandException = require('../utils/CommandException.js');
const nodeHtmlToImage = require('node-html-to-image');
const Discord = require('discord.js');
const database = require('../utils/sql.js');
const utils = require('../utils/utils.js');
const rinChan = require('../rinChan/rinChan.js');
const User = require('../utils/User.js');
const objectManager = require('../utils/objectManager.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'go shopping'},
      {locale: 'en', string: `let's go shopping`},
    ],

    intent: 'goShopping',
    commandName: 'Go Shopping',
    description: 'Go to the shop with Rin-chan. You can buy and exchange objects',

    scope: 'DM',

    phrases: {
      buy: /buy ([0-9]+) ([a-z ]+)/gi,
      sell: /sell ([0-9]+) ([a-z ]+)/gi,
      leave: /leave|finished|lets go|let's go/gi,
    },
  },

  run(message, args) {
    message.channel.send(`Ok let's go! <:smolrin:707284808333787197>`);

    const filter = (response) => {
      return response.author.id === message.author.id;
    };

    this.sendShopEmbed(message).then(() => {
      message.author.createDM().then((dmChannel) => {
        const collector = dmChannel.createMessageCollector(filter, {time: 60000});
        rinChan.setCollecting(true);

        collector.on('collect', (collected) => {
          try {
            const buyRegex = new RegExp(this.config.phrases.buy);
            const sellRegex = new RegExp(this.config.phrases.sell);
            const leaveRegex = new RegExp(this.config.phrases.leave);

            if (buyRegex.test(collected.content)) {
              this.buyObject(collected.content, message);
            } else if (sellRegex.test(collected.content)) {
              this.sellObject(collected.content, message);
            } else if (leaveRegex.test(collected.content)) {
              collector.stop();
              rinChan.setCollecting(false);
            }
          } catch (err) {
            utils.handleError(err, this.config.commandName, message.author);
          }
        });

        collector.on('end', (collected) => {
          message.author.send("I'm bored lets go");
        });
      });
    });
  },

  getObjectQuantity(messageContent, regex) {
    const reg = new RegExp(regex);

    const matchesArray = [...messageContent.matchAll(reg)][0];

    const object = objectManager.get(matchesArray[2]);
    const quantity = matchesArray[1];

    return {object: object, quantity: quantity};
  },

  buyObject(collectedContent, message) {
    const order = this.getObjectQuantity(collectedContent, this.config.phrases.buy);
    const user = new User(message);
    const price = order.quantity * order.object.getValue();

    const objectString = order.quantity > 1 ? order.object.getPlural() : order.object.getName();

    if (order.object.getName() === 'orange') {
      throw new CommandException("What's the point of that?", 'rinconfuse.png');
    }

    if (user.getObjectQuantity('orange') < price) {
      throw new CommandException("You don't have enough oranges for that.", 'rinwha.png');
    }

    this.shopChangeObject(order.object, -order.quantity);

    user.changeObjectQuantity(order.object.getName(), parseInt(order.quantity));
    user.changeObjectQuantity('orange', -parseInt(price));

    message.author.send('Ok you bought ' + order.quantity + ' ' + objectString);
    this.sendShopEmbed(message);
  },

  sellObject(collectedContent, message) {
    const order = this.getObjectQuantity(collectedContent, this.config.phrases.sell);

    const user = new User(message);
    // const orangeInventory = database.getInventory(user, 'orange');
    // const sellInventory = database.getInventory(user, order.object.name);
    const price = order.quantity * order.object.getValue();

    const objectString = order.quantity > 1 ? order.object.getPlural() : order.object.getName();

    if (user.getObjectQuantity(order.object.getName()) < order.quantity) {
      throw new CommandException(`You don't have ${order.quantity} ${objectString}.`, 'rinwha.png');
    }

    if (order.object.getName() === 'orange') {
      throw new CommandException("What's the point of that?", 'rinconfuse.png');
    }

    this.shopChangeObject(order.object, order.quantity);

    user.changeObjectQuantity('orange', parseInt(price));
    user.changeObjectQuantity(order.object.getName(), -parseInt(order.quantity));

    message.author.send('Ok you sold ' + order.quantity + ' ' + objectString);
    this.sendShopEmbed(message);
  },

  shopChangeObject(object, modifier) {
    const shop = database.getShopStock(object.getName());
    const shopOranges = database.getShopStock('orange');

    if (shop.quantity < modifier * -1 && modifier < 0) {
      throw new CommandException("There's not enough stock", 'rinwha.png');
    }
    if (modifier > 0 && shopOranges.quantity < modifier * object.getValue()) {
      throw new CommandException("The shop doesn't have enough oranges to make the purchase.", 'rinwha.png');
    }

    shop.quantity += parseInt(modifier);
    shopOranges.quantity += parseInt(object.getValue() * (modifier * -1));

    database.setShopStock.run(shopOranges);
    database.setShopStock.run(shop);
  },
  restock(message, command, cmdRegex) {},

  makeSale() {},

  async sendShopEmbed(message) {
    let embedString = `
      <html>
      <head>
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
          </style>
      </head>
      <body>
      <table>
      <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
      </tr>`;

    const stock = database.getStock.all();

    stock.forEach((ele) => {
      embedString += `
          <tr>
              <td>${utils.capitalizeFirstLetter(ele.objectName)}</td>
              <td>${database.getObject(ele.objectName).value}</td>
              <td>${ele.quantity}</td>
          </tr>`;
    });

    embedString += `
      </table>
      </body>
      </html>`;

    nodeHtmlToImage({
      output: './images/embeds/shop.png',
      html: embedString,
      transparent: false,
    }).then(() => {
      const attachment = new Discord.MessageAttachment('./images/embeds/shop.png', 'shop.png');
      const thumbnail = new Discord.MessageAttachment('./images/shop/thumbnail.jpg', 'thumbnail.jpg');

      const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Orange Kingdom General Store')
        .setDescription('The best value every day for discerning Rin-chans')
        .setThumbnail('attachment://thumbnail.jpg')
        .attachFiles(attachment)
        .attachFiles(thumbnail)
        .setImage('attachment://shop.png')
        .setFooter(`Say buy or sell <quantity> <item name> eg. buy 2 lens. To leave say finished.`);

      message.author.send(embed);
    });
  },
};
