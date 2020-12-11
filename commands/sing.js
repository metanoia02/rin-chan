const User = require('../utils/User.js');
const ytdl = require('ytdl-core');
const CommandException = require('../utils/CommandException');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'sing %entity%'},
    ],

    intent: 'sing',
    commandName: 'Sing',
    description: 'Rin-chan will sing music you own.',

    scope: 'channel',
  },

  init() {
  },

  async run(message, args) {
    if (args.entities.length > 0 && args.singable.length === 0) {
      throw new CommandException(`Are you sure that's a song...`, 'rinwha.png');
    }
    if (args.singable.length === 0) {
      throw new CommandException('Pick a song', 'rinwha.png');
    }
    if (args.singable.length > 1) {
      throw new CommandException('One at a time please', 'rinconfuse.png');
    }
    const user = new User(message);
    if (user.getEntityQuantity(args.singable[0].id) < 1) {
      throw new CommandException(`You don't have that track`, 'rinded.png');
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) throw new CommandException('Please join a voice channel first.', 'rintehe.png');

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      throw new Error('Insufficient permissions CONNECT or SPEAK');
    }

    const songEntity = args.singable[0];

    const dispatcher = await voiceChannel.join();

    dispatcher.play(ytdl(songEntity.url), {filter: 'audioonly' })
    .on("finish", () => {
        voiceChannel.leave();
    })
    .on("error", error => console.error(error));

    message.channel.send(`🎵🍊🎵 Ok listen up! The next song is **${songEntity.name}** 🎵🍊🎵`);
  },
};
