const CommandException = require('../utils/CommandException');
const Discord = require('discord.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'convert %temperature% to %toTrim%'},
      {locale: 'en', string: '%temperature% to %toTrim%'},

      {locale: 'en', string: '%temperature% in %inTrim%'},

      {locale: 'en', string: 'what is %temperature% in %inTrim%'},
      {locale: 'en', string: ' %temperature%%currency% in %inTrim%'},
    ],

    intent: 'temperatureConversion',
    commandName: 'Temperature Conversion',
    description: 'Convert C/F temperature.',

    scope: 'channel',
  },

  init() {
    this.config.units = new Discord.Collection();
    this.config.units.set('f', 'f');
    this.config.units.set('c', 'c');
    this.config.units.set('celsius', 'c');
    this.config.units.set('fahrenheit', 'f');
    this.config.units.set('℃', 'c');
    this.config.units.set('℉', 'f');
  },

  async run(message, args) {
    const initialEntity = args.result.entities.find((entity) => entity.entity == 'temperature');
    if (!initialEntity) throw new CommandException(`Couldn't find a temperature to convert.`, 'rinconfuse.png');

    if (!args.result.entities.find((entity) => entity.entity == 'toTrim' || entity.entity == 'inTrim')) {
        throw new CommandException(`Couldn't find a unit to convert to.`, 'rinconfuse.png');
    }

    const initialValue = initialEntity.resolution.value;
    const initialUnit = initialEntity.resolution.unit;

    const conversionTemperature = this.config.units.get(
      args.result.entities
        .find((entity) => entity.entity == 'toTrim' || entity.entity == 'inTrim')
        .sourceText.replace(/\W+/gi, '')
        .toLowerCase()
    );

    if (initialUnit.toLowerCase() == 'celsius' && conversionTemperature.toLowerCase() == 'f') {
      let fahrenheit = (initialValue * 1.8 + 32).toFixed(1);
      if (fahrenheit < -459.67) fahrenheit = -459.67;
      message.channel.send(fahrenheit + ' ℉');
    } else if (initialUnit.toLowerCase() == 'fahrenheit' && conversionTemperature.toLowerCase() == 'c') {
      let celsius = ((initialValue - 32) / 1.8).toFixed(1);
      if (celsius < -273.15) celsius = -273.15;
      message.channel.send(celsius + ' ℃');
    } else {
      throw new CommandException('Invalid temperature unit.', 'rinnotimpressed.png');
    }
  },
};
