const CommandException = require('./CommandException.js');
const database = require('./sql.js');

module.exports = {
  /**
   * Get an array of discord user ID from a string
   * @param {string} command Command string
   * @return {array} User ID array
   */
  getUserIdArr(command) {
    const userIdRegex = new RegExp(/<!*@!*([0-9]+)>/, 'g');

    const result = [...command.matchAll(userIdRegex)];

    return result.map((ele) => {
      return ele[1];
    });
  },

  /**
   * Capitalize the first letter of a string
   * @param {string} string
   * @return {string}
   */
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  getObjectType(command, cmdRegex) {
    const objects = cmdRegex.exec(command);
    return objects[1];
  },

  getObjectQuantity(messageContent, regex) {
    const reg = new RegExp(regex);

    const matchesArray = [...messageContent.matchAll(reg)][0];

    const object = database.getObject(matchesArray[2]);
    const quantity = matchesArray[1];

    return {object: object, quantity: quantity};
  },
  // validate
  // command object
  // preloaded with objects quantities etc

  escapeMarkdown(string) {
    const markdownRegex = new RegExp('([*|_~`>])', 'g');
    return string.replace(markdownRegex, '\\$1');
  },

  validateSingleUserAction(message, commandName) {
    // check if user exists, check if self, check if bot, check if rinChan
    const usersArray = this.getUserIdArr(message.content);

    if (usersArray.length === 1) {
      throw new CommandException('You need to mention a user', 'rinwha.png');
    } else if (!message.guild.member(usersArray[1])) {
      throw new CommandException('They aren\'t in the server', 'rinconfuse.png');
    } else if (usersArray.length !== 2) {
      throw new CommandException('Mention only one user', 'rinwha.png');
    }

    return true;
  },

  /**
   *
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

  arrayRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  convertCommand(commandArr, regex) {
    if (typeof commandArr === 'string') {
      return commandArr;
    } else {
      return commandArr.reduce((acc, ele) => {
        if (typeof ele === 'string') {
          return (acc += ele);
        } else {
          if (regex === true) {
            return (acc += ele.regex);
          } else {
            return (acc += ele.string);
          }
        }
      }, '');
    }
  },
};
