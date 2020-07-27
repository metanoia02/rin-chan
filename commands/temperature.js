const CommandException = require('../utils/CommandException');
const fx = require('money');
const Discord = require('discord.js');
const request = require('request');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'convert %temperature% to %toTrim%'},
      {locale: 'en', string: '%temperature% to %toTrim%'},

      {locale: 'en', string: '%temperature% in %inTrim%'},
    ],

    intent: 'temperatureConversion',
    commandName: 'Temperature Conversion',
    description: 'Convert C/F temperature.',

    scope: 'channel',
  },

  run(message, args) {
    const initialEntity = args.result.entities.find((entity) => entity.entity == 'temperature');
    if (!initialEntity) throw new CommandException(`Couldn't find a temperature to convert.`, 'rinconfuse.png');
    const initialValue = initialEntity.resolution.value;
    const initialUnit = initialEntity.resolution.unit;

    const conversionTemperature = args.result.entities
      .find((entity) => entity.entity == 'toTrim' || entity.entity == 'inTrim')
      .sourceText.replace(/\W+/gi, '');
    if (!conversionTemperature) {
      throw new CommandException(`Couldn't find a temperature to convert to.`, 'rinconfuse.png');
    }

    if (initialUnit.toLowerCase() == 'celsius' && conversionTemperature.toLowerCase() == 'f') {
      message.channel.send((initialValue * 1.8 + 32).toFixed(1) + ' ℉');
    } else if (initialUnit.toLowerCase() == 'fahrenheit' && conversionTemperature.toLowerCase() == 'c') {
      message.channel.send(((initialValue - 32) / 1.8).toFixed(1) + ' ℃');
    } else {
      throw new CommandException('Invalid temperature unit.', 'rinnotimpressed.png');
    }
  },
};
