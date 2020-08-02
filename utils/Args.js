const User = require('./User.js');
const objectManager = require('./objectManager.js');
const CommandException = require('./CommandException.js');

module.exports = class Args {
  /**
   * Container for arguments passed to module
   * @param {string} command
   * @param {object} result
   * @param {Discord.message} message
   */
  constructor(command, result, message) {
    this.command = command;
    this.result = result;
    this.mentions = [];
    this.objects = [];
    this.interactions = [];
    this.quantities = [];
    this.tags = [];

    if (result.entities.length > 0) {
      this.mentions = result.entities.reduce((acc, element) => {
        if (element.entity === 'user') {
          const id = element.sourceText.match(/\d+/)[0];
          acc.push(new User(message, id, message.guild.id));
        }
        return acc;
      }, []);

      this.objects = result.entities.reduce((acc, element) => {
        if (element.entity === 'object') {
          acc.push(objectManager.get(element.option));
        }
        return acc;
      }, []);

      this.interactions = result.entities.reduce((acc, element) => {
        if (element.entity === 'interaction') {
          acc.push(element.option);
        }
        return acc;
      }, []);

      this.quantities = result.entities.reduce((acc, element) => {
        if (element.entity === 'number') {
          acc.push(element.sourceText);
        }
        return acc;
      }, []);

      this.tags = result.entities.reduce((acc, element) => {
        if (element.entity === 'tag') {
          const user = message.client.users.cache.find((user) => user.tag.includes(element.sourceText));
          if (user) {
            acc.push(new User(message, user.id, message.guild.id));
          } else {
            throw new CommandException('Who are they?', 'rinwha.png');
          }
        }
        return acc;
      }, []);
    }
  }
};
