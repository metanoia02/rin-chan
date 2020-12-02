const CommandException = require('./CommandException.js');
const database = require('./sql.js');
const config = require('../config');

module.exports = {
  getUserIdArr(command) {
    const userIdRegex = new RegExp(/<!*@!*([0-9]+)>/, 'g');

    const result = [...command.matchAll(userIdRegex)];

    return result.map((ele) => {
      return ele[1];
    });
  },
  /**
   * Update database with boosters
   * @param {Discord.guild} guild
   */
  updateBoosts(guild) {
    const members = guild.members.cache.filter((user) => user.premiumSince !== null);

    members.reduce((acc, element) => {
      const user = database.getUser(element.id, guild.id);
      user.isBooster = 1;
      database.setUser.run(user);
    }, '');
  },

  /**
   * Capitalize the first letter of a string
   * @param {string} string
   * @return {string}
   */
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  /**
   * Add escape characters to all discord markdown
   * @param {string} string
   * @return {string} Escaped string
   */
  escapeMarkdown(string) {
    const markdownRegex = new RegExp('([*|_~`>])', 'g');
    return string.replace(markdownRegex, '\\$1');
  },

  /**
   * Checks for messages with over 10 mentions and mutes and insults author
   * @param {Discord.message} message
   * @return {boolean} is mention spam
   */
  mentionSpamDetect(message) {
    if (this.getUserIdArr(message.content).length > 10) {
      const mutedRole = message.guild.roles.cache.find((role) => role.name === config.mutedRole);

      message.member.roles.add(mutedRole, 'Muted for mention spam');
      message.author.send('Go spam somewhere else!', {
        files: ['./images/spam/spam.jpg'],
      });
      message.delete();

      const channel = message.guild.channels.cache.find((ch) => ch.name === config.diaryChannel);
      if (!channel) return true;

      channel.send(`Muted ${message.author} for mention spam.`);

      return true;
    }
    return false;
  },

  clamp(min, max, value) {
    return Math.max(min, Math.min(max, value));
  },

  /**
   * Default handler for errors, runs CommandException in channel given or logs in console
   * @param {Entity} err
   * @param {string} commandName
   * @param {Discord.channel} channel Channel or User to send errors
   */
  handleError(err, commandName, channel) {
    if (err instanceof CommandException) {
      channel.send(err.getEmbed(commandName)).catch(console.error);
    } else {
      if (channel.guild) {
        const diaryChannel = channel.guild.channels.cache.find((ch) => ch.name === config.diaryChannel);
        if (diaryChannel) {
          diaryChannel.send(err.stack);
          console.log(err);
        } else {
          console.log(err);
        }
      } else {
        console.log(err);
      }
    }
  },

  getCooldown(cooldown, lastTime) {
    const now = new Date();
    const duration = Math.ceil((lastTime + cooldown - now.getTime()) / 60000);
    return duration + (duration > 1 ? ' minutes.' : ' minute.');
  },

  /**
   * Just returns a random element from an array
   * @param {Array} array
   * @return {any} Single element from input array
   */
  arrayRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  },
};
