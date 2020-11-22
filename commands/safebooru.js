const Discord = require('discord.js');
const axios = require('axios');
const CommandException = require('../utils/CommandException.js');
const xml2js = require('xml2js').parseString;
const config = require('../config');

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
    if (args.searchable.length < 1) throw new CommandException(`Who?`, 'rintehe.png');

    let imageTags = args.searchable.map((ele) => ele.searchTerm).join('+');

    if (args.searchable.length === 1) imageTags += '+solo';
    imageTags += this.config.tagBlacklist;

    let titleString = args.searchable
      .map((ele) => ele.name)
      .reduce((acc, ele, index) => {
        if (index === 0) {
          acc += `${ele}`;
        } else if (index === args.searchable.length - 1) {
          acc += ` and ${ele}`;
        } else {
          acc += `, ${ele}`;
        }
        return acc;
      }, '');
    titleString += ' Image';

    const idResponse = await axios.get(`${this.config.apiString}&tags=${imageTags}`);
    const randomId = await this.randomPost(idResponse.data);
    const image = await axios.get(`${this.config.apiString}&pid=${randomId}&tags=${imageTags}&json=1`);

    if (!image.data[0]) throw new CommandException(`Couldn't find any images...`, 'rinded.png');

    const imageUrl = `https://safebooru.org//images/${image.data[0].directory}/${image.data[0].image}`;

    const imageEmbed = new Discord.MessageEmbed()
      .setColor('#008000')
      .setTitle(titleString)
      .setURL(`https://safebooru.org/index.php?page=post&s=view&id=${image.data[0].id}`)
      .setImage(imageUrl)
      .setFooter(`Safebooru`, `attachment://safebooru.png`);

    const filter = (reaction, user) => {
      return (
        (user.id === message.author.id && reaction.emoji.name === '❌') ||
        (user.member.roles.cache.has(config.modRole) && reaction.emoji.name === '❌')
      );
    };

    message.channel.send(imageEmbed).then((sentMessage) => {
      sentMessage
        .react('❌')
        .then(() =>
          sentMessage
            .awaitReactions(filter, {max: 1, time: 30000, errors: ['time']})
            .then((collected) => {
              sentMessage.delete();
              message.delete();
              const diaryChannel = message.guild.channels.cache.find((ch) => ch.name === config.diaryChannel);
              if(diaryChannel) {
                diaryChannel.send(`${message.author} deleted the following embed:`);
                diaryChannel.send(imageEmbed);
              } else {
                throw new Error('Diary channel invalid');
              }
            })
            .catch(() => {
              if(!sentMessage.deleted) sentMessage.reactions.cache.find((reaction) => reaction.emoji.name === '❌').remove();
            })
        );
    });
  },

  randomPost(string) {
    return new Promise((resolve, reject) => {
      xml2js(string, (err, result) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(Math.floor(Math.random() * result.posts.$.count));
        }
      });
    });
  },
};
