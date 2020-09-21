const CommandException = require('../utils/CommandException');
const fx = require('money');
const Discord = require('discord.js');
const request = require('request');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'what is %currency% in %inTrim%'},
      {locale: 'en', string: '%currency% in %inTrim%'},
    ],

    intent: 'currency',
    commandName: 'Currency Conversion',
    description: 'Convert any currency, ask what is something in something',

    scope: 'channel',
  },

  init(manager) {},

  async run(message, args) {
    const initialEntity = args.result.entities.find((entity) => entity.entity == 'currency');
    if (!initialEntity) throw new CommandException(`Couldn't find a currency to convert.`, 'rinconfuse.png');
    const initialValue = initialEntity.resolution.value;
    const initialUnit = initialEntity.resolution.unit;

    const conversionCurrency = args.result.entities
      .find((entity) => entity.entity == 'inTrim')
      .sourceText.replace(/\W+/gi, '');
    if (!conversionCurrency) throw new CommandException(`Couldn't find a currency to convert to.`, 'rinconfuse.png');
    if (initialUnit.length != 3 || conversionCurrency.length != 3) {
      throw new CommandException(`Please use three letter currency codes.`, 'rinwha.png');
    }

    request('https://api.exchangeratesapi.io/latest', {json: true}, (err, res, body) => {
      if (err) {
        return console.log(err);
      }

      fx.rates = body.rates;
      fx.base = body.base;

      try {
        const convertedValue = fx(initialValue)
          .from(initialUnit.toUpperCase())
          .to(conversionCurrency.toUpperCase())
          .toFixed(2);

        message.channel.send(convertedValue + ' ' + conversionCurrency);
      } catch (err) {
        console.log(err);

        const attachment = new Discord.MessageAttachment(`./images/emotes/rinded.png`, 'rinded.png');

        message.channel.send(
          new Discord.MessageEmbed()
            .setColor('#008000')
            .setTitle('Currency')
            .setDescription('Error converting the currency.')
            .attachFiles(attachment)
            .setThumbnail(`attachment://rinded.png`)
        );
      }
    });
  },
};
