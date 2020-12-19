const User = require('../utils/User.js');
const ytdl = require('discord-ytdl-core');
const CommandException = require('../utils/CommandException');
const utils = require('../utils/utils');
const config = require('../config');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'sing %entity%'},
      {locale: 'en', string: 'sing %christmasSong%'},

      {locale: 'en', string: '%skipSong% song'},
    ],

    intent: 'sing',
    commandName: 'Sing',
    description: 'Rin-chan will sing music you own.',

    scope: 'channel',

    christmasSongs: [
      {name: 'Silent Night', url:'https://www.youtube.com/watch?v=TOCjEGxjThs'},
      {name: 'Angels We Have Heard on High', url:'https://www.youtube.com/watch?v=yRhA-aN0l-Y'},
      {name: 'O Holy Night', url:'https://www.youtube.com/watch?v=ZqR2cdIhXGE'},
      {name: 'Jingle Bells', url:'https://www.youtube.com/watch?v=a0QlvHNl4iM'},
      {name: 'Merry Christmas, My Hero', url:'https://www.youtube.com/watch?v=SUgbHJKLQBA'},
      {name: 'Santa Baby', url:'https://www.youtube.com/watch?v=0daNo64NDNE'},
      {name: 'Magical Christmas', url:'https://www.youtube.com/watch?v=pgRiOOPolEo'},
    ],
  },

  init() {
    this.queue = [];
    this.voiceConnection = {};
    this.voiceChannel = {};
  },

  async run(message, args) {
    let song = {};

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
      if (args.result.entities.find((ele) => ele.entity == 'christmasSong')) {
        song = utils.arrayRandom(this.config.christmasSongs);
      } else {
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

        song = args.singable[0];
      }

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
