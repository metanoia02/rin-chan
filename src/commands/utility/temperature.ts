import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
import { commandEmbedEmote } from '../../util/commands';

const unitOptions = [
  { name: '℃', value: '℃' },
  { name: '℉', value: '℉' },
  //{ name: 'K', value: 'kelvin' },
];

function fahrenheitToCelsius(initialValue: number): string {
  let celsius = (initialValue - 32) / 1.8;
  if (celsius < -273.15) celsius = -273.15;
  return celsius.toFixed(1);
}
//function kelvinToCelsius() {}
function celsiusToFahrenheit(initialValue: number): string {
  let fahrenheit = initialValue * 1.8 + 32;
  if (fahrenheit < -459.67) fahrenheit = -459.67;
  return fahrenheit.toFixed(1);
}
//function celsiusToKelvin() {}

export const temperature: ICommand = {
  data: new SlashCommandBuilder()
    .setName('temperature')
    .setDescription('Convert various temperature units.')
    .addIntegerOption((temperatureOption) =>
      temperatureOption
        .setName('valuefrom')
        .setDescription('Temperature to convert from')
        .setRequired(true),
    )
    .addStringOption((unitOption) =>
      unitOption
        .setName('unitfrom')
        .setDescription('Unit to convert from')
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((unitOption) =>
      unitOption
        .setName('unitto')
        .setDescription('Unit to convert to')
        .setRequired(true)
        .setAutocomplete(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const unitFrom = interaction.options.getString('unitfrom');
    const unitTo = interaction.options.getString('unitto');
    const valueFrom = interaction.options.getInteger('valuefrom');

    if (
      !(
        unitOptions.find((unit) => unit.value == unitFrom) &&
        unitOptions.find((unit) => unit.value == unitTo)
      )
    ) {
      interaction.reply(commandEmbedEmote('Invalid temperature unit.', 'rinwha.png'));
      return;
    }

    let result;

    if (valueFrom) {
      if (unitTo == '℃') {
        result = fahrenheitToCelsius(valueFrom);
      } else if (unitTo == '℉') {
        result = celsiusToFahrenheit(valueFrom);
      }

      interaction.reply(
        commandEmbedEmote(`${valueFrom}${unitFrom} is ${result}${unitTo}.`, 'rinchill.png'),
      );
    } else {
      interaction.reply(commandEmbedEmote(`Couldn't find a temperature to convert.`, 'rinwha.png'));
    }
  },

  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();

    const unitTo = interaction.options.getString('unitto');
    const unitFrom = interaction.options.getString('unitfrom');

    if (unitTo && unitFrom) {
      await interaction.respond(unitOptions);
    } else {
      const filtered = unitOptions.filter(
        (unit) => unit['value'] != unitTo && unit['value'] != unitFrom,
      );

      await interaction.respond(filtered);
    }
  },
};
