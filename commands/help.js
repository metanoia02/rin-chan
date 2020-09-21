const objectManager = require('../utils/objectManager.js');
const fs = require('fs');

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

    feedableObjects: [{objectName: 'orange', func: 'feedOrange'}],
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

    this.commandList += '\n__**Available objects:**__\n';

    const objects = objectManager.getAll();

    this.commandList += objects.reduce((acc, ele) => {
      return (acc += ele.getName() + '\n');
    }, '');
  },

  async run(message, args) {
    message.author.send(this.commandList);
  },
};
