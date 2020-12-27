const Reaction = require('../reactions/reaction.js');
const User = require('../utils/User');
const Discord = require('discord.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'happy birthday'},
    ],

    intent: 'happyBirthday',
    commandName: 'Happy Birthday',
    description: 'Remember to wish Rin-chan a happy birthday!',

    scope: 'channel',
  },

  init() {
    this.thanksReaction = new Reaction('../reactions/birthday.json', this.config.commandName);
  },

  async run(message, args) {
    const user = new User(message);
    const reaction = this.thanksReaction.getReaction(user);

    const attachment = new Discord.MessageAttachment(reaction.image, reaction.imageName);

    const embed = new Discord.MessageEmbed()
      .setColor('#FFD700')
      .setTitle(this.config.commandName)
      .setDescription(reaction.string)
      .attachFiles(attachment)
      .setFooter(`${user.getDiscordMember().displayName}`, user.getDiscordUser().avatarURL())
      .setImage(`attachment://${reaction.imageName}`);

    message.channel.send(embed);
  },
};
