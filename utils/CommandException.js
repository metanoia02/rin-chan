const Discord = require('discord.js');

module.exports = class CommandException {
  /**
   *
   * @param {string} message Message to display in embed.
   * @param {string} emote Name of emote for embed. Located in ./images/reactions/
   * @param {Discord.channel} channel to send error in
   */
  constructor(message, emote = 'rinyabai.png') {
    this.message = message;
    this.emote = emote;
  }

  /**
   * Returns a Discord embed.
   * @param {string} commandName Command name for title of embed.
   * @return {Discord.MessageEmbed} Embed Entity.
   */
  getEmbed(commandName) {
    const attachment = new Discord.MessageAttachment(`./images/emotes/${this.emote}`, this.emote);

    return new Discord.MessageEmbed()
      .setColor('#008000')
      .setTitle(commandName)
      .setDescription(this.message)
      .attachFiles(attachment)
      .setThumbnail(`attachment://${this.emote}`);
  }
};
