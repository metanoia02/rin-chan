import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { User } from '../../entity/User';
import { InventoryStack } from '../../entity/InventoryStack';
import { getInventory } from '../../util/getInventory';
import { commandEmbed } from '../../util/commands';

function filterSongBook(inventoryItem: InventoryStack): boolean {
  return inventoryItem.quantity > 0 && inventoryItem.item.videoUrl != null;
}

export const showSongBook: ICommand = {
  data: new SlashCommandBuilder().setName('songbook').setDescription('Show your songbook.'),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);

    if ((await user.getQuantity('songBook')) > 0) {
      interaction.reply(await getInventory(filterSongBook, user));
    } else {
      interaction.reply(commandEmbed(`You don't have a song book.`, 'rinwha.png'));
    }
  },
};
