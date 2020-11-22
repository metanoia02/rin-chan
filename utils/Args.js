const User = require('./User.js');
const entityManager = require('./entityManager.js');
const CommandException = require('./CommandException.js');
const database = require('./sql');

module.exports = class Args {
  /**
   * Container for arguments passed to module
   * @param {string} command
   * @param {Entity} result
   * @param {Discord.message} message
   */
  constructor(command, result, message) {
    this.command = command;
    this.result = result;
    this.mentions = [];
    this.entities = [];
    this.feedable = [];
    this.searchable = [];
    this.tradable = [];
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
          case 'entity':
            const entity = entityManager.get(element.option);
            this.entities.push(entity);

            if (entity.feedable) this.feedable.push(entity);
            if (entity.searchable) this.searchable.push(entity);
            if (entity.tradable) this.tradable.push(entity);

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
