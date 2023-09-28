import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  AutocompleteInteraction,
} from 'discord.js';
import { User } from '../../entity/User';
import { Item } from '../../entity/Item';
import { SlashCommandError } from '../../util/SlashCommandError';
import { commandEmbedEmote } from '../../util/commands';

export const giveEveryone: ICommand = {
  data: new SlashCommandBuilder()
    .setName('give-everyone')
    .setDescription('Give everyone some item(s).')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addNumberOption((quantityOption) =>
      quantityOption
        .setName('quantity')
        .setDescription('The number of items to give')
        .setRequired(true),
    )
    .addStringOption((itemOption) =>
      itemOption
        .setName('item')
        .setDescription('The item to give.')
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const itemId = interaction.options.getString('item');
    const quantity = interaction.options.getNumber('quantity');

    if (itemId && quantity != null) {
      if (quantity < 1) {
        interaction.reply(commandEmbedEmote('Quantity must be at least 1', 'rinno.png'));
        return;
      }

      if (!(await Item.exists(itemId))) {
        interaction.reply(commandEmbedEmote('Invalid item.', 'rinconfuse.png'));
        return;
      }

      const item = await Item.get(itemId);
      const users = await User.find();

      const entityString = quantity > 1 ? item.plural : item.determiner + ' ' + item.name;
      const entityNumString = quantity > 1 ? quantity + ' ' + entityString : entityString;

      const members = await interaction.guild?.members.fetch();

      if (members) {
        members.forEach(async (member) => {
          const user = await User.get(member.id, member.guild.id);
          user.changeQuantity(itemId, quantity);
          await user.save();
        });

        interaction.reply('Ok, you gave everyone ' + entityNumString);
      }
    } else {
      throw new SlashCommandError('Failed to get paramters from slash command', {
        itemId: itemId,
        quantity: quantity,
        sourceUser: interaction.user,
      });
    }
  },
  async autocomplete(interaction: AutocompleteInteraction) {
    const items = (await Item.find()).map((item) => ({ name: item.name, value: item.id }));
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const filtered = items.filter((choice) => choice.name.toLowerCase().includes(focusedValue));

    await interaction.respond(filtered.slice(0, 25));
  },
};
