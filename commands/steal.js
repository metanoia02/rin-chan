const User = require('../utils/User.js');
const commandUtils = require('../utils/commandUtils.js');
const utils = require('../utils/utils.js');
const Discord = require('discord.js');
const CommandException = require('../utils/CommandException.js');
const rinChan = require('../rinChan/rinChan.js');
const Reaction = require('../reactions/reaction');

module.exports = {
  config: {
    training: [{locale: 'en', string: 'steal %Entity% from %tag%'}],

    intent: 'steal',
    commandName: 'Steal',
    description: 'Try and make an orange heist. Use the targets username and tag e.g. username#1234',

    scope: 'channel',

    stealableEntitys: [
      {entityId: 'orange', func: 'stealOranges'},
      {entityId: 'kagamineLen', func: 'stealLens'},
    ],
    orangeStealCooldown: 86400000,
  },

  init() {
    this.passStealReact = new Reaction('../reactions/steal/passSteal.json', this.config.commandName);
    this.failStealReact = new Reaction('../reactions/steal/failSteal.json', this.config.commandName);
    this.notAgainReact = new Reaction('../reactions/steal/notAgain.json', this.config.commandName);
  },

  async run(message, args) {
    commandUtils.validateSingleTagAction(args);

    if (args.tradable.length === 0) {
      throw new CommandException(`You didn't tell me what`, `rinwha.png`);
    } else if (args.tradable.length !== 1) {
      throw new CommandException(`Which one?`, `rinconfuse.png`);
    }

    const sourceUser = new User(message);
    const stealUser = args.tags[0];
    const entity = args.entities[0];

    const functionName = this.config.stealableEntitys.find((ele) => ele.entityId === entity.id).func;
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
      if (stealUser.getEntityQuantity('orange') < 10) {
        throw new CommandException(`They aren't a good target.`, 'rinshrug.png');
      } else if (sourceUser.getAffection() > stealUser.getAffection()) {
        const chance = Math.floor(Math.random() * 100) + 1;
        if (chance >= 50) {
          sourceUser.changeAffection(20);
          rinChan.changeMood(1);

          const stolenOranges = Math.min(50, Math.round(stealUser.getEntityQuantity('orange') / 10));

          sourceUser.changeEntityQuantity('orange', stolenOranges);
          stealUser.changeEntityQuantity('orange', -stolenOranges);
          sourceUser.setLastSteal();

          const orangePlural = stolenOranges === 1 ? 'orange' : 'oranges';
          const stealString = `${stolenOranges} ${orangePlural}`;

          const passedStealEmbed = this.passStealReact.getEmbed(sourceUser)
            .addField('You got:', stealString, true);

          message.channel.send(passedStealEmbed);
        } else {
          const failStealEmbed = this.failStealReact.getEmbed(sourceUser);

          sourceUser.changeAffection(-40);
          rinChan.changeMood(-1);

          message.channel.send(failStealEmbed);
        }
        sourceUser.setLastSteal();
      } else {
        message.channel.send(`I don't think so, I like them more <:rintriumph:673972571254816824>`);
      }
    } else {
      const duration = utils.getCooldown(this.config.orangeStealCooldown, sourceUser.getLastSteal());

      const notAgainEmbed = this.notAgainReact.getEmbed(sourceUser)
        .addField('You can try again in:', duration, true);

      message.channel.send(notAgainEmbed);
    }
  },
};
