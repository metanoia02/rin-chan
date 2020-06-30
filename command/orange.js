const Discord = require('discord.js');
const CommandException = require('../utils/CommandException.js');
const rinChan = require('../rinChan/rinChan.js');
const database = require('../utils/sql.js');
const utils = require('../utils/utils.js');

module.exports = {
  orangeGiveCooldown: 900000,
  orangeStealCooldown: 86400000,
  orangeHarvestCooldown: 2400000,

  lenImages: {path: './images/len/', quantity: 10},

  init() {
    const Reaction = require('../reactions/reaction.js');

    this.findOrangeReact = new Reaction('../reactions/findOrange.json');
    this.hungryReact = new Reaction('../reactions/hungry.json');

    this.findCarrotReact = new Reaction('../reactions/gumi/findCarrot.json');
  },

  handler(message) {
    // to be removed
    const emoteRegex = new RegExp(/<:\w*orange\w*:[0-9]+>/, 'gi');

    if (
      message.content.includes('orange') &&
      !emoteRegex.test(message.content) &&
      !message.author.bot &&
      rinChan.getHunger() > 3
    ) {
      message.channel.send('Who said orange?! Gimme!');
      return true;
    } else if (message.content.includes('🍊') && !message.author.bot && rinChan.getHunger() > 3) {
      message.channel.send(`That's my orange! Gimme!`);
      return true;
    }

    return false;
  },

  hungry(message, command, cmdRegex) {
    const reaction = this.hungryReact.getReaction(rinChan);

    const attachment = new Discord.MessageAttachment(reaction.image, reaction.imageName);
    const imTiredEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Hungry?')
        .setDescription(reaction.string)
        .attachFiles(attachment)
        .setThumbnail(`attachment://${reaction.imageName}`);

    message.channel.send(imTiredEmbed).catch(console.error);
  },

  giveNumObjects(message, command, num, objectType) {
    const sourceUser = database.getUser(message.author.id, message.guild.id);
    const sourceInventory = database.getInventory(sourceUser, objectType);

    const object = database.getObject(objectType);

    const objectString = num > 1 ? object.plural : object.determiner + ' ' + object.name;
    const objectNumString = num > 1 ? num + ' ' + objectString : objectString;

    if (sourceInventory.quantity >= num) {
      const usersArray = utils.getUserIdArr(message.content);
      if (num === 0) {
        message.channel.send('Fine, no ' + objectString + ' for them');
      } else if (usersArray.length === 1) {
        message.channel.send('You need to mention a user');
      } else if (!message.guild.member(usersArray[1])) {
        message.channel.send('They arent in the server <:rinconfuse:687276500998815813>');
      } else if (usersArray[1] == message.author.id) {
        message.channel.send('You cant give ' + objectString + ' to yourself!');
      } else if (usersArray.length !== 2) {
        message.channel.send('Mention only one user');
      } else if (message.client.users.cache.get(usersArray[1]).bot && message.client.user.id != usersArray[1]) {
        message.channel.send('Why would that bot need ' + objectString + '...');
      } else {
        const destUser = database.getUser(usersArray[1], message.guild.id);
        const destInventory = database.getInventory(destUser, objectType);

        if (usersArray[1] === message.client.user.id) {
          if (object.name === 'orange') {
            message.channel.send('Thanks, I\'ll put them to good use');
            sourceInventory.quantity -= num;
            destInventory.quantity += num;
          } else {
            message.channel.send('You keep that for now <:rinlove:726120311967449199>');
          }
        } else {
          message.channel.send('Ok, you gave ' + objectNumString);
          sourceInventory.quantity -= num;
          destInventory.quantity += num;
        }

        database.setInventory.run(sourceInventory);
        database.setInventory.run(destInventory);
      }
    } else {
      message.channel.send('You don\'t have ' + objectNumString + ' to give');
    }
  },

  giveObject(message, command, cmdRegex) {
    try {
      const object = database.getObject(utils.getObjectType(command, cmdRegex));
      this.giveNumObjects(message, command, 1, object.name);
    } catch (err) {
      if (err instanceof CommandException) {
        message.channel.send(err.getEmbed('Give Object')).catch(console.error);
      } else {
        console.log(err);
      }
    }
  },

  giveObjects(message, command, cmdRegex) {
    const quantityRegex = new RegExp(/\s[0-9]+\s/);
    numGiveObjects = parseInt(command.match(quantityRegex));

    const object = database.getObject(utils.getObjectType(command, cmdRegex));

    if (!object) {
      message.channel.send('What is that? <:rinwha:600747717081432074>');
    } else {
      this.giveNumObjects(message, command, numGiveObjects, object.name);
    }
  },

  checkGiveSpam(sourceUser) {
    const now = new Date();

    if (now.getTime() - sourceUser.lastGive > this.orangeGiveCooldown) {
      return true;
    } else {
      return false;
    }
  },

  feedOrange(message, command, cmdRegex) {
    const user = database.getUser(message.author.id, message.guild.id);
    const inventory = database.getInventory(user, 'orange');

    const currentTime = new Date();

    if (inventory.quantity < 1) {
      message.channel.send(`You don't have any oranges!`);
    } else {
      if (this.checkGiveSpam(user) || rinChan.getHunger() >= 4) {
        switch (rinChan.getHunger()) {
          case 0:
            message.channel.send('I\'m stuffed, I cant eat another one');
            break;
          case 5:
            message.channel.send(`I'm starving! What took you so long`);
            inventory.quantity--;
            user.affection++;
            rinChan.setHunger(rinChan.getHunger() - 1);
            rinChan.setLastFed(currentTime.getTime());
            user.lastGive = currentTime.getTime();
            break;
          case 1:
            message.channel.send(`Thanks, I can't eat another bite`);
            inventory.quantity--;
            user.affection++;
            user.lastGive = currentTime.getTime();
            rinChan.setHunger(rinChan.getHunger() - 1);
            rinChan.setLastFed(currentTime.getTime());
            break;
          default:
            message.channel.send(`Another delicious orange!`);
            inventory.quantity--;
            user.affection++;
            user.lastGive = currentTime.getTime();
            rinChan.setHunger(rinChan.getHunger() - 1);
            rinChan.setLastFed(currentTime.getTime());
            break;
        }
        database.setUser.run(user);
        database.setInventory.run(inventory);
      } else {
        message.channel.send('It\'s okay, you just gave me one');
      }
    }
  },

  feedLen(message, command, cmdRegex) {
    // mood low, roadroller, mood normal play with + mood, mood high what I need with this
    // perfect, I've been needing practice :rindevours
  },

  harvestOrange(message, command, cmdRegex) {
    const user = database.getUser(message.author.id, message.guild.id);
    const inventory = database.getInventory(user, 'orange');

    const now = new Date();
    const chance = Math.random();

    if (user.tries > 0) {
      if (0 < chance && chance <= 0.05) {
        this.easterEgg(message, user);
        user.tries = 0;
      } else if (0.05 < chance && chance <= 0.6) {
        inventory.quantity++;
        inventory.lastGet = now.getTime();
        user.tries--;
        this.foundOrange(message, user);
      } else if (0.6 < chance && chance <= 1) {
        user.tries--;
        this.couldntFind(message, user);
      }

      user.lastHarvest = now.getTime();
      database.setUser.run(user);
      database.setInventory.run(inventory);
    } else {
      const duration = utils.getCooldown(this.orangeHarvestCooldown, user.lastHarvest);

      const attachment = new Discord.MessageAttachment('./images/emotes/rinded.png', 'rinded.png');
      const imTiredEmbed = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('Harvest')
          .setDescription('I\'m tired!')
          .attachFiles(attachment)
          .setThumbnail('attachment://rinded.png')
          .addField('You can try again in:', duration, true);

      message.channel.send(imTiredEmbed).catch(console.error);
    }
  },

  easterEgg(message, user) {
    const now = new Date();
    const inventory = database.getInventory(user, 'Len');
    inventory.quantity++;
    inventory.lastGet = now.getTime();
    database.setInventory.run(inventory);

    const imageName = Math.floor(Math.random() * this.lenImages.quantity) + 1 + '.jpg';

    const image = this.lenImages.path + imageName;

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
    const reaction = this.findOrangeReact.getReaction(rinChan, user);

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
        .setDescription('Couldn\'t find anything')
        .attachFiles(attachment)
        .setThumbnail('attachment://rinyabai.png');

    message.channel.send(couldntFindEmbed).catch(console.error);
  },

  stealLens(message) {
    message.channel.send('He\'s too heavy to carry!');
  },

  stealOranges(message, command, cmdRegex) {
    const chance = Math.floor(Math.random() * 100) + 1;

    const username = command.replace(cmdRegex, '');
    const user = message.client.users.cache.find((user) => user.tag == username);

    const sourceUser = database.getUser(message.author.id, message.guild.id);
    const sourceInventory = database.getInventory(sourceUser, 'orange');

    const now = new Date();

    const mentionsArray = utils.getUserIdArr(message.content);

    if (mentionsArray[1] == message.client.user.id) {
      message.channel.send('Step back from my oranges!');
    } else if (mentionsArray[1] == message.author.id) {
      message.channel.send('Don\'t tempt me!');
    } else if (message.mentions.members.array().length > 1) {
      message.channel.send('They knew I was coming!');
    } else if (!user) {
      message.channel.send('Who are they? <:rinwha:600747717081432074>');
    } else if (user.id == message.author.id) {
      message.channel.send('Don\'t tempt me!');
    } else if (user.id === message.client.user.id) {
      message.channel.send('Step back from my oranges!');
    } else if (now.getTime() - sourceUser.lastSteal > 86400000) {
      const stealUser = database.getUser(user.id, message.guild.id);
      const stealInventory = database.getInventory(stealUser, 'orange');

      if (stealInventory.quantity < 5) {
        message.channel.send('They aren\'t a good target');
      } else if (sourceUser.affection > stealUser.affection) {
        if (chance >= 93) {
          sourceUser.affection > 9 ? (sourceUser.affection -= 10) : (sourceUser.affection = 0);

          const stolenOranges = stealInventory.quantity / 10 > 10 ? 10 : Math.round(stealInventory.quantity / 10);

          sourceInventory.quantity += stolenOranges;
          stealInventory.quantity -= stolenOranges;

          sourceUser.lastSteal = now.getTime();

          database.setUser.run(stealUser);

          database.setInventory.run(sourceInventory);
          database.setInventory.run(stealInventory);

          message.channel.send(
              'I did it! Here\'s ' + stolenOranges + (stolenOranges === 1 ? ' orange' : ' oranges') + ' from ' + username,
          );
        } else {
          message.channel.send('I got caught... <:rinbuaaa:686741811850510411>');
        }
        sourceUser.lastSteal = now.getTime();
        database.setUser.run(sourceUser);
      } else {
        message.channel.send('I don\'t think so, I like them more <:rintriumph:673972571254816824>');
      }
    } else {
      const duration = utils.getCooldown(this.orangeStealCooldown, sourceUser.lastSteal);

      const notAgainEmbed = new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setTitle('Steal Oranges')
          .setDescription('Not again')
          .setThumbnail('https://cdn.discordapp.com/emojis/635101260080480256.png')
          .addField('You can try again in:', duration, true);

      message.channel.send(notAgainEmbed);
    }
  },
};

const schedule = require('node-schedule');

// eslint-disable-next-line no-unused-vars
const updateTriesInterval = schedule.scheduleJob('0 * * * * *', function() {
  const users = database.getAllUsers.all();
  const now = new Date();

  users.forEach((user) => {
    const maxTries = user.isBooster === 0 ? 3 : 4;
    if (user.tries < maxTries) {
      if (now.getTime() - user.lastHarvest > module.exports.orangeHarvestCooldown) {
        user.tries++;
        database.setUser.run(user);
      }
    }
  });
});
