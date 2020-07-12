const database = require('../utils/sql.js');
const utils = require('../utils/utils.js');
const User = require('../utils/User.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'show inventory'},
      {locale: 'en', string: 'show my inventory'},
      {locale: 'en', string: 'inventory'},
    ],

    intent: 'showInventory',
    commandName: 'Inventory',
    description: 'Show everything you have',

    scope: 'channel',
  },

  run(message, args) {
    const user = new User(message);
    const inventory = user.getInventory();

    let output = 'Sure, you currently have\n';

    for (const obj in inventory) {
      if (inventory[obj].quantity > 0) {
        output += utils.capitalizeFirstLetter(inventory[obj].objectName) + ': ' + inventory[obj].quantity + '\n';
      }
    }

    if (output === 'Sure, you currently have\n') {
      output = 'Your inventory is empty.';
    }

    message.channel.send(output);
  },
};
