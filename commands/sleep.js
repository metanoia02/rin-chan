const database = require('../utils/sql.js');

module.exports = {
  config: {
    training: [{locale: 'en', string: 'time for bed'}],

    intent: 'sleep',
    commandName: 'Maintenance',
    description: 'Go into maintenance mode',
    permissions: 'Mods',

    scope: 'channel',
  },

  async run(message, args) {
    await message.guild.members.cache.get(message.client.user.id).setNickname('Maintenance-chan');
    database.close();

    const channel = message.guild.channels.cache.find((ch) => ch.name === 'bot-spam');
    if (channel) {
      await channel.send(`I'll be right back!`);
    }

    process.exit(1);
  },
};
