const CommandException = require('./CommandException.js');
const database = require('./sql.js');

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
      message.member.roles.remove('588677338007601163');
      message.member.roles.add('620609193228894208');
      message.author.send('Go spam somewhere else!', {
        files: ['./images/spam/spam.jpg'],
      });
      message.delete();

      const channel = message.guild.channels.cache.find((ch) => ch.name === 'rinchans-diary');
      if (!channel) return true;

      channel.send(`<@&588521716481785859> Muted ${message.author} for mention spam.`);

      return true;
    }
    return false;
  },

  /**
   * Default handler for errors, runs CommandException in channel given or logs in console
   * @param {Object} err
   * @param {string} commandName
   * @param {Discord.channel} channel Channel or User to send errors
   */
  handleError(err, commandName, channel) {
    if (err instanceof CommandException) {
      channel.send(err.getEmbed(commandName)).catch(console.error);
    } else {
      if (channel.guild) {
        const diaryChannel = channel.guild.channels.cache.find((ch) => ch.name === 'rinchans-diary');
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
    // less than a minute / seconds
    const now = new Date();
    let duration = Math.floor((lastTime + cooldown - now.getTime()) / 3600000) + ' hours';
    if (duration === '0 hours') {
      duration = Math.round((lastTime + cooldown - now.getTime()) / 60000) + ' minutes';
    }
    const regex = new RegExp(/^1\s/);
    if (regex.test(duration)) {
      duration = duration.substr(0, duration.length - 1);
    }

    return duration;
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
