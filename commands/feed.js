const User = require('../utils/User.js');
const CommandException = require('../utils/CommandException.js');
const Reaction = require('../reactions/reaction.js');
const rinChan = require('../rinChan/rinChan.js');
const Discord = require('discord.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'have an %entity%'},
      {locale: 'en', string: 'give %entity%'},
      {locale: 'en', string: `here's an %entity%`},
      {locale: 'en', string: `eat an %entity%`},
      {locale: 'en', string: `consume %entity%`},
    ],

    intent: 'feed',
    commandName: 'Feed Rin-chan',
    description: 'Give an orange or other orange based foods to Rin-Chan.',

    scope: 'channel',

    orangeGiveCooldown: 300000,
  },

  init() {
    this.orangeReaction = new Reaction('../reactions/feed/orange.json', this.config.commandName);
    this.birthdayCakeReaction = new Reaction('../reactions/feed/birthdayCake.json', this.config.commandName);
  },

  async run(message, args) {
    if (args.feedable.length == 0) {
      throw new CommandException(`I don't fancy one of those right now`, 'rinlove.png');
    } else if (args.feedable.length !== 1) {
      throw new CommandException(`Which one?`, 'rinconfuse.png');
    }

    const entity = args.feedable[0];
    const user = new User(message);

    if (user.getEntityQuantity(entity.id) < 1) {
      throw new CommandException(`You don't have any ${entity.plural}!`, 'rinconfuse.png');
    }
    if (this.checkGiveSpam(user) || rinChan.getHunger() >= 4) {
      const functionName = entity.id;
      this[functionName](message, user, entity);
      await user.addXp(1, message);
    } else {
      throw new CommandException(`Hang on, I'm still eating...`, 'rinchill.png');
    }
  },

  orange(message, user, entity) {
    const currentTime = new Date();

    if (rinChan.getHunger() === 0) {
      throw new CommandException(`I'm stuffed, I cant eat another one`, 'rinstuffed.png');
    }

    /*message.channel.send(this.orangeReaction.getEmbed(user));

    user.changeEntityQuantity(entity.id, -1);
    user.changeAffection(5);
    user.setLastGive();
    rinChan.setHunger(rinChan.getHunger() - 1);
    rinChan.setLastFed(currentTime.getTime());*/

    throw new CommandException(`Don't you have something... sweeter?`, 'oharin.png');
  },

  birthdayCake(message, user, entity) {
    const currentTime = new Date();

    if (rinChan.getHunger() === 0) {
      throw new CommandException(`I'm stuffed, I cant eat another one`, 'rinstuffed.png');
    }

    const reaction = this.birthdayCakeReaction.getReaction(user);
    const attachment = new Discord.MessageAttachment(reaction.image, reaction.imageName);

    const embed = new Discord.MessageEmbed()
      .setColor('#FFD700')
      .setTitle(this.config.commandName)
      .setDescription(reaction.string)
      .attachFiles(attachment)
      .setFooter(`${user.getDiscordMember().displayName}`, user.getDiscordUser().avatarURL())
      .setImage(`attachment://${reaction.imageName}`);

    message.channel.send(embed);

    user.changeEntityQuantity(entity.id, -1);
    user.changeAffection(10);
    user.setLastGive();
    rinChan.setHunger(rinChan.getHunger() - 1);
    rinChan.setLastFed(currentTime.getTime());
    rinChan.moodUp();
    user.addXp(9, message);
  },

  checkGiveSpam(sourceUser) {
    const currentTime = new Date();

    if (currentTime.getTime() - sourceUser.getLastGive() > this.config.orangeGiveCooldown) {
      return true;
    } else {
      return false;
    }
  },
};
