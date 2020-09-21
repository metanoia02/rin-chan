const Discord = require('discord.js');
const axios = require('axios');
const CommandException = require('../utils/CommandException.js');
const xml2js = require('xml2js').parseString;

module.exports = {
  config: {
    training: [
      // rin
      {locale: 'en', string: '%vocaloid% image'},
      {locale: 'en', string: 'show %vocaloid% image'},
      {locale: 'en', string: 'image of %vocaloid%'},
      {locale: 'en', string: '%vocaloid% picture'},
      {locale: 'en', string: 'show %vocaloid% picture'},
      {locale: 'en', string: 'picture of %vocaloid%'},

      // vocaloids
      {locale: 'en', string: '%vocaloid% image'},
      {locale: 'en', string: '%vocaloid% picture'},
      {locale: 'en', string: 'image of %vocaloid%'},
      {locale: 'en', string: 'picture of %vocaloid%'},
    ],

    intent: 'safebooru',
    commandName: 'Images',
    description: 'Get a random image of Rin or any Vocaloids',

    tagBlacklist: '+-underwear+-rope+-nude+-undressing',
    apiString: 'http://safebooru.org/index.php?page=dapi&s=post&q=index&limit=1',

    scope: 'channel',
  },

  async run(message, args) {
    if (args.vocaloids.length < 1) throw new CommandException(`Who?`, 'rintehe.png');

    let imageTags = args.vocaloids.map((ele) => ele.searchString).join('+');

    if (args.vocaloids.length === 1) imageTags += '+solo';
    imageTags += this.config.tagBlacklist;

    const idResponse = await axios.get(`${this.config.apiString}&tags=${imageTags}`);
    const randomId = await this.randomPost(idResponse.data);
    const image = await axios.get(`${this.config.apiString}&pid=${randomId}&tags=${imageTags}&json=1`);

    if (!image.data[0]) throw new CommandException(`Couldn't find any images...`, 'rinded.png');

    const imageUrl = `https://safebooru.org//images/${image.data[0].directory}/${image.data[0].image}`;

    const imageEmbed = new Discord.MessageEmbed()
      .setColor('#008000')
      .setTitle(`Source`)
      .setURL(`https://safebooru.org/index.php?page=post&s=view&id=${image.data[0].id}`)
      .setImage(imageUrl)
      .setFooter(`Safebooru`, `attachment://safebooru.png`);

    message.channel.send(imageEmbed);
  },

  randomPost(string) {
    return new Promise((resolve, reject) => {
      xml2js(string, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(Math.floor(Math.random() * result.posts.$.count) + 1);
        }
      });
    });
  },
};
