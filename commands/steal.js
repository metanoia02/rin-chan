const User = require('../utils/User.js');
const commandUtils = require('../utils/commandUtils.js');
const utils = require('../utils/utils.js');
const Discord = require('discord.js');
const CommandException = require('../utils/CommandException.js');

module.exports = {
  config: {
    training: [{locale: 'en', string: 'steal %object% from %tag%'}],

    intent: 'stealObject',
    commandName: 'Steal',
    description: 'Try and make an orange heist. Use the targets username and tag e.g. username#1234',

    scope: 'channel',

    stealableObjects: [
      {objectName: 'orange', func: 'stealOranges'},
      {objectName: 'Len', func: 'stealLens'},
    ],
    orangeStealCooldown: 86400000,
  },

  async run(message, args) {
    commandUtils.validateSingleTagAction(args);
    commandUtils.validateSingleObjectAction(args);

    const sourceUser = new User(message);
    const stealUser = args.tags[0];
    const object = args.objects[0];

    const functionName = this.config.stealableObjects.find((ele) => ele.objectName === object.getName()).func;
    this[functionName](message, sourceUser, stealUser);
  },

  stealLens(message, sourceUser, stealUser) {
    message.channel.send(`He's too heavy to carry!`);
  },

  stealOranges(message, sourceUser, stealUser) {
    const now = new Date();

    if (stealUser.getId() == message.client.user.id) {
      throw new CommandException('Step back from my oranges!', 'ringun.png');
    } else if (stealUser.getId() == message.author.id) {
      throw new CommandException(`Don't temp me!`, 'creeprin.png');
    } else if (now.getTime() - sourceUser.getLastSteal() > this.config.orangeStealCooldown) {
      if (stealUser.getObjectQuantity('orange') < 5) {
        throw new CommandException(`They aren't a good target.`, 'rinshrug.png');
      } else if (sourceUser.getAffection() > stealUser.getAffection()) {
        const chance = Math.floor(Math.random() * 100) + 1;
        if (chance >= 90) {
          sourceUser.getAffection() > 9 ? sourceUser.changeAffection(-10) : sourceUser.setAffection(0);

          const stolenOranges =
            stealUser.getObjectQuantity('orange') / 10 > 10 ?
              10 :
              Math.round(stealUser.getObjectQuantity('orange') / 10);

          sourceUser.changeObjectQuantity('orange', stolenOranges);
          stealUser.changeObjectQuantity('orange', -stolenOranges);
          sourceUser.setLastSteal();

          message.channel.send(
            `I did it! Here's ` +
              stolenOranges +
              (stolenOranges === 1 ? ' orange' : ' oranges') +
              ' from ' +
              stealUser.getNickname()
          );
        } else {
          message.channel.send('I got caught... <:rinbuaaa:686741811850510411>');
        }
        sourceUser.setLastSteal();
      } else {
        message.channel.send(`I don't think so, I like them more <:rintriumph:673972571254816824>`);
      }
    } else {
      const duration = utils.getCooldown(this.config.orangeStealCooldown, sourceUser.getLastSteal());

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
