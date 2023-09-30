import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { User } from '../../entity/User';
import { InventoryStack } from '../../entity/InventoryStack';
import { getInventory } from '../../util/getInventory';

function filterInventory(inventoryItem: InventoryStack): boolean {
  return inventoryItem.quantity > 0 && !inventoryItem.item.singable;
}

export const inventory: ICommand = {
  data: new SlashCommandBuilder().setName('inventory').setDescription('Show your inventory.'),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);

    interaction.reply(await getInventory(filterInventory, user));
  },
};
