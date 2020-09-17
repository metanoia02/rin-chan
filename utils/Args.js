const User = require('./User.js');
const objectManager = require('./objectManager.js');
const CommandException = require('./CommandException.js');
const database = require('./sql');

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
    this.vocaloids = [];

    if (result.entities.length > 0) {
      result.entities.forEach((element) => {
        switch (element.entity) {
          case 'user':
            const id = element.sourceText.match(/\d+/)[0];
            this.mentions.push(new User(message, id, message.guild.id));
            break;
          case 'object':
            this.objects.push(objectManager.get(element.option));
            break;
          case 'interaction':
            this.interactions.push(element.option);
            break;
          case 'number':
            this.quantities.push(element.sourceText);
            break;
          case 'tag':
            const user = message.client.users.cache.find((user) => user.tag.includes(element.sourceText));
            if (user) {
              this.tags.push(new User(message, user.id, message.guild.id));
            } else {
              throw new CommandException('Who are they?', 'rinwha.png');
            }
            break;
          case 'vocaloid':
            this.vocaloids.push(database.getVocaloid(element.option));
            break;
          default:
          // error
        }
      });
    }
  }
};
