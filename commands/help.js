const entityManager = require('../utils/entityManager');
const fs = require('fs');
const utils = require('../utils/utils');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'help'},
      {locale: 'en', string: 'commands list'},
    ],

    intent: 'help',
    commandName: 'Help',
    description: 'Rin-chan lists her commands, you are here.',

    scope: 'DM',

    feedableEntitys: [{EntityName: 'orange', func: 'feedOrange'}],
    orangeGiveCooldown: 300000,
  },

  init() {
    this.commandList = '__**List of commands**__\n';

    const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      if (!command.config.permissions) {
        this.commandList += command.config.commandName + ': ' + command.config.description + '\n';
      }
    }
    // update for new entities
    this.entityList = '\n__**Available Entitys:**__\n';

    const entities = entityManager.getAll();

    this.entityList += entities.reduce((acc, ele) => {
      return (acc += `**${utils.capitalizeFirstLetter(ele.name)}**${Boolean(ele.feedable)?'-Feedable- ':' '}${Boolean(ele.tradable)?'-Tradable- ':' '}${Boolean(ele.searchable)?'-Searchable-':' '}\n`);
    }, '');
  },

  

  async run(message, args) { 
    message.author.send(this.commandList);
    message.author.send(this.entityList);
  },
};
