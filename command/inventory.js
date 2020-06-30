const database = require('../utils/sql.js');
const utils = require('../utils/utils.js');

module.exports = {
  init() {},

  showInventory(message, command) {
    const user = database.getUser(message.author.id, message.guild.id);
    const inventory = database.showInventory.all(user.id);

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
