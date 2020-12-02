const User = require('../utils/User.js');
const CommandException = require('../utils/CommandException.js');
const rinChan = require('../rinChan/rinChan.js');
const utils = require('../utils/utils.js');

module.exports = {
  config: {
    training: [{locale: 'en', string: 'debug'}],

    intent: 'debug',
    commandName: 'Debug',
    description: 'Debug and moderator commands',
    permissions: 'Mods',

    scope: 'DM',

    commands: [
      {functionName: 'moodUp', command: 'moodup'},
      {functionName: 'moodDown', command: 'moodown'},
      {functionName: 'getRinchan', command: 'rininfo'},
    ],
  },

  async run(message, args) {
    const filter = (response) => response.author.id === message.author.id;


    rinChan.setCollecting(true);
    await message.author.send('Enter command:');

    message.author.createDM().then((dmChannel) => {
      const collector = dmChannel.createMessageCollector(filter, {time: 60000});
      rinChan.setCollecting(true);

      collector.on('collect', (collected) => {
        try {
          const command = this.config.commands.find((ele) => collected.content == ele.command);
          if (command) {
            this[command.functionName](dmChannel);
            rinChan.setCollecting(false);
          } else if (collected.content == 'quit') {
            collector.stop();
            rinChan.setCollecting(false);
          } else {
            dmChannel.send('Invalid command.');
          }
        } catch (err) {
          rinChan.setCollecting(false);
          if (collected instanceof CommandException || collected instanceof Error) {
            utils.handleError(collected, this.config.commandName, message.channel);
          }
        }
      });

      collector.on('end', (collected) => {
        rinChan.setCollecting(false);
        dmChannel.send('Collector stopped');
      });
    });
  },

  moodUp(dmChannel) {
    rinChan.moodUp();
  },

  moodDown(dmChannel) {
    rinChan.moodDown();
  },

  getRinchan(dmChannel) {
    dmChannel.send(JSON.stringify(rinChan._config));
  },
};
