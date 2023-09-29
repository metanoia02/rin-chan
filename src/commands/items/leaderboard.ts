import { generateImage } from '../../util/generateImage';
import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  AttachmentBuilder,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from 'discord.js';
import { InventoryStack } from '../../entity/InventoryStack';
import { Item } from '../../entity/Item';
import { capitalizeFirstLetter } from '../../util/commands';
import { LeaderboardContent, LeaderboardRow } from '../../types/LeaderboardContent';
import { SlashCommandError } from '../../util/SlashCommandError';

async function getLeaderboard(itemId: string, maxEntries?: number) {
  const inventoryStacks = await InventoryStack.find({
    where: { item: { id: itemId } },
    order: { quantity: 'DESC' },
    relations: { user: true },
  });

  if (maxEntries) {
    return inventoryStacks.slice(0, maxEntries);
  } else {
    return inventoryStacks.slice(0);
  }
}

export const leaderboard: ICommand = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show a leaderboard for an item.')
    .addStringOption((option) =>
      option
        .setName('item')
        .setDescription('The item to make a leaderboard for')
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const itemId = interaction.options.getString('item');

    if (itemId) {
      const item = await Item.get(itemId);
      const board = await getLeaderboard(itemId, 20);
      const content: LeaderboardContent = {
        itemPlural: capitalizeFirstLetter(item.plural),
        users: [],
      };

      let rankIndex = 0;

      for (const entry of board) {
        if (entry.quantity > 0) {
          const member = await entry.user?.getDiscordMember();
          if (member) {
            let avatarUrl = member.user.avatarURL();
            if (!avatarUrl) avatarUrl = ''; //TODO: blank avatar image

            const row = {
              index: (rankIndex += 1),
              displayHex: member.displayHexColor,
              avatarUrl: avatarUrl,
              displayName: member.displayName,
              quantity: entry.quantity,
            };

            content.users.push(row);
          }
        }
      }

      const leaderboardImage = await generateImage(
        './src/templates/leaderboard.html',
        content,
        700,
      );

      const attachment = new AttachmentBuilder(leaderboardImage, { name: 'leaderboard.jpg' });
      const leaderboardEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setImage('attachment://leaderboard.jpg');

      interaction.reply({ embeds: [leaderboardEmbed], files: [attachment] });
    } else {
      throw new SlashCommandError('Invalid item', itemId);
    }
  },

  async autocomplete(interaction: AutocompleteInteraction) {
    const items = (await Item.find()).map((item) => ({ name: item.name, value: item.id }));
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const filtered = items.filter((choice) => choice.name.toLowerCase().includes(focusedValue));

    await interaction.respond(filtered.slice(0, 25));
  },
};
