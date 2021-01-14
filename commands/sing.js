const User = require('../utils/User.js');
const ytdl = require('discord-ytdl-core');
const CommandException = require('../utils/CommandException');
const config = require('../config');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'sing %entity%'},

      {locale: 'en', string: '%skipSong% song'},
    ],

    intent: 'sing',
    commandName: 'Sing',
    description: 'Rin-chan will sing music you own.',

    scope: 'channel',
  },

  init() {
    this.queue = [];
    this.voiceConnection = {};
    this.voiceChannel = {};
  },

  async run(message, args) {
    let song = {};
    const user = new User(message);

    this.voiceChannel = message.guild.channels.cache.get(config.singingChannel);

    const permissions = this.voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      throw new Error('Insufficient permissions CONNECT or SPEAK');
    }

    if (args.result.entities.find((ele) => ele.entity == 'skipSong')) {
      if (this.queue.length <= 1) {
        throw new CommandException('Skip to what?', 'rinconfuse.png');
      } else {
        this.voiceConnection.dispatcher.destroy();
        this.queue.shift();
        this.play(this.queue[0], message);
      }
    } else {
        if (user.getEntityQuantity('songBook') < 1) {
          throw new CommandException('You need a song book for that', 'rinconfuse.png');
        }
        if (args.entities.length > 0 && args.singable.length === 0) {
          throw new CommandException(`Are you sure that's a song...`, 'rinwha.png');
        }
        if (args.singable.length === 0) {
          throw new CommandException('Pick a song', 'rinwha.png');
        }
        if (args.singable.length > 1) {
          throw new CommandException('One at a time please', 'rinconfuse.png');
        }
        if (user.isInSongbook(args.singable[0].id) < 1) {
          throw new CommandException(`You don't have that track`, 'rinded.png');
        }

        song = args.singable[0];

      if (this.queue.length == 0) {
        this.voiceConnection = await this.voiceChannel.join();
        this.queue.push(song);
        this.play(song, message);
      } else {
        this.queue.push(song);
        message.channel.send(`Ok I'll sing ${song.name} later`);
      }
    }
  },

  async play(song, message) {
    if (!song) {
      this.voiceChannel.leave();
      this.queue = [];
      message.channel.send('Thank you for listening!');
      return;
    }

    let stream = ytdl(song.url, {
      filter: "audioonly",
      opusEncoded: true,
      encoderArgs: ['-af', 'dynaudnorm=f=200']
    });

    this.voiceConnection.play(stream, {type: "opus" })
    .on("finish", () => {
      this.queue.shift();
      this.play(this.queue[0], message);
    })
    .on("error", error => console.error(error));

    message.channel.send(`🎵🍊🎵 Ok listen up! The next song is **${song.name}** 🎵🍊🎵`);
  }
};
