const Discord = require('discord.js');
const axios = require('axios');
const xml2js = require('xml2js');
const CommandException = require('../utils/CommandException.js');

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

    scope: 'channel',
  },

  run(message, args) {
    if (args.vocaloids.length < 1) throw new CommandException(`Who?`, 'rintehe.png');

    let imageTags = args.vocaloids.reduce((acc, ele) => {
      return (acc += ele.searchString + '+');
    }, '');

    if (args.vocaloids.length === 1) imageTags += 'solo';
    imageTags += this.config.tagBlacklist;

    axios
      .get(`http://safebooru.org/index.php?page=dapi&s=post&q=index&limit=1&tags=${imageTags}`)
      .then((response) => {
        xml2js.parseString(response.data, (err, result) => {
          const randomId = Math.floor(Math.random() * result.posts.$.count) + 1;
          axios
            .get(`http://safebooru.org/index.php?page=dapi&s=post&q=index&limit=1&pid=${randomId}&tags=${imageTags}`)
            .then((response) => {
              xml2js.parseString(response.data, (err, result) => {
                const imageUrl = result.posts.post[0].$.file_url;
                console.log(response);

                const imageEmbed = new Discord.MessageEmbed()
                  .setColor('#008000')
                  .setTitle(`Image`)
                  .setURL(`https://safebooru.org/index.php?page=post&s=view&id=${result.posts.post[0].$.id}`)
                  .setImage(imageUrl)
                  .setFooter(`Safebooru`, `attachment://safebooru.png`);

                message.channel.send(imageEmbed);
              });
            })
            .catch((error) => {
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(args);
  },
};
