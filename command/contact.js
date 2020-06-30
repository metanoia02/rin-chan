const CommandException = require('../utils/CommandException.js');
const Reaction = require('../reactions/reaction.js');

const Discord = require('discord.js');
const database = require('../utils/sql.js');
const utils = require('../utils/utils.js');

module.exports = {
  headpat(message) {
    const commandName = 'Headpat';
    const user = database.getUser(message.author.id, message.guild.id);

    try {
      if (user.affection < 0) {
        throw new CommandException('You never give me oranges...', 'rinpout.png');
      } else {
        message.channel.send('<:rincomf:634115522002419744>');
        user.affection--;
        database.setUser.run(user);
      }
    } catch (err) {
      message.channel.send(err.getEmbed(commandName)).catch(console.error);
    }
  },

  giveHug(message, command, cmdRegex) {
    const commandName = 'Give Hug';
    const mentions = utils.getUserIdArr(command);
    const destUser = message.guild.members.cache.get(mentions[0]);
    const reaction = new Reaction('../reactions/giveHug.json');

    this.giveUser(commandName, reaction.getReaction(), destUser, 5, message);
  },

  hugMe(message, command, cmdRegex) {},

  giveHeadpat(message, command, cmdRegex) {
    const commandName = 'Give Headpat';
    const mentions = utils.getUserIdArr(command);
    const destUser = message.guild.members.cache.get(mentions[0]);
    const reaction = new Reaction('../reactions/giveHeadpat.json');

    this.giveUser(commandName, reaction.getReaction(), destUser, 2, message, true);
  },

  giveUser(commandName, reaction, targetUser, cost, message, thumbnail = false) {
    try {
      utils.validateSingleUserAction(message, commandName);

      if (targetUser.id === message.client.user.id) {
        throw new CommandException('Excuse me?', 'rinwhat.png');
      }

      const sourceUser = database.getUser(message.author.id, message.guild.id);
      if (sourceUser.affection < cost) {
        throw new CommandException('You never give me oranges...', 'rinpout.png');
      } else {
        sourceUser.affection -= cost;
        database.setUser.run(sourceUser);
      }

      const attachment = new Discord.MessageAttachment(reaction.image, reaction.imageName);

      const giveHeadpatEmbed = new Discord.MessageEmbed()
          .setColor('#008000')
          .setTitle(commandName)
          .setDescription(`${targetUser.user}${reaction.string}${message.client.user}`)
          .attachFiles(attachment)
          .setFooter(`${message.member.displayName}`, message.author.avatarURL());

      if (thumbnail) {
        giveHeadpatEmbed.setThumbnail(`attachment://${reaction.imageName}`);
      } else {
        giveHeadpatEmbed.setImage(`attachment://${reaction.imageName}`);
      }

      message.channel.send(giveHeadpatEmbed).catch(console.error);
      message.delete().catch(console.error);
    } catch (err) {
      message.channel.send(err.getEmbed(commandName)).catch(console.error);
    }
  },

  yourCute(message) {},
};
