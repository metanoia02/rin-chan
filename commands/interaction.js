const Reaction = require('../reactions/reaction.js');
const commandUtils = require('../utils/commandUtils.js');
const utils = require('../utils/utils.js');
const User = require('../utils/User.js');
const rinChan = require('../rinChan/rinChan.js');
const Discord = require('discord.js');
const CommandException = require('../utils/CommandException.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: '%interaction% %user%'},
      {locale: 'en', string: 'give a %interaction% to %user%'},
      {locale: 'en', string: 'give %user% a %interaction%'},
    ],

    interactions: [
      {name: 'headpat', cost: 2, reaction: new Reaction('../reactions/giveHeadpat.json'), thumbnail: true},
      {name: 'hug', cost: 0, reaction: new Reaction('../reactions/giveHug.json'), thumbnail: false},
    ],

    intent: 'interaction',
    commandName: 'Interactions',
    description: 'Get Rin-chan to do various things like headpat and hug other users, perhaps in exchange for oranges.',

    scope: 'channel',
  },

  init(manager) {
    this.config.interactions.forEach((interaction) => {
      manager.addNamedEntityText('interaction', interaction.name, ['en'], [interaction.name]);
    });
  },

  async run(message, args) {
    commandUtils.validateSingleUserAction(args);
    commandUtils.validateSingleInteraction(args);

    const destUser = args.mentions[0];
    const sourceUser = new User(message);
    const interaction = this.config.interactions.find((action) => action.name === args.interactions[0]);

    const embed = this.giveUser(
      message,
      utils.capitalizeFirstLetter(interaction.name),
      interaction.reaction.getReaction(sourceUser),
      destUser,
      sourceUser,
      interaction.cost,
      interaction.thumbnail
    );

      message.channel.send(embed);

    message.delete();
  },

  giveUser(message, commandName, reaction, targetUser, sourceUser, cost, thumbnail = false) {
    if (targetUser.getId() == rinChan.getId()) {
      throw new CommandException('Excuse me?', 'rinwhat.png');
    }

    if (cost > 0) {
      if (sourceUser.getEntityQuantity('orange') < cost) {
        throw new CommandException(`To do that I'll need a 'donation' of ${cost} oranges`, 'rinpout.png');
      }
      sourceUser.changeEntityQuantity('orange', -cost);
      const rinchan = new User(message, rinChan.getId(), message.guild.id);
      rinchan.changeEntityQuantity('orange', cost);
    }

    const attachment = new Discord.MessageAttachment(reaction.image, reaction.imageName);

    const embed = new Discord.MessageEmbed()
      .setColor('#008000')
      .setTitle(commandName)
      .setDescription(`${targetUser.getDiscordUser()}${reaction.string}${rinChan.getDiscordUser()}`)
      .attachFiles(attachment)
      .setFooter(`${sourceUser.getDiscordMember().displayName}`, sourceUser.getDiscordUser().avatarURL());

    if (thumbnail) {
      embed.setThumbnail(`attachment://${reaction.imageName}`);
    } else {
      embed.setImage(`attachment://${reaction.imageName}`);
    }
    return embed;
  },
};
