const database = require('../utils/sql.js');
const utils = require('../utils/utils.js');
const configs = require('../config.js');

module.exports = {
  commandList: '',

  init() {
    for (const k in configs) {
      if (configs.hasOwnProperty(k)) {
        let x = 0;
        for (const c in configs[k].cmd) {
          if (configs[k].cmd.hasOwnProperty(c)) {
            this.commandList += '**' + configs[k].description[x] + ' Keywords:**\n';

            for (let v = 0; v < configs[k].cmd[c].length; v++) {
              this.commandList += utils.convertCommand(configs[k].cmd[c][v], false) + '\n';
            }
            x++;

            this.commandList += '\n';
          }
        }
      }
    }

    this.commandList += '**Available objects:**\n';

    const objects = database.getAllObjects.all();

    this.commandList += objects.reduce((acc, ele) => {
      return (acc += ele.name + '\n');
    }, '');
  },

  help(message) {
    message.author.send(this.commandList);
  },
};
