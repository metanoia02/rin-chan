import { Command } from '../../interfaces/ICommand';

import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

/**
 * Test ping command
 *
 * @returns Bot replies with Pong!
 */
export const ping: Command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply('Pong!');
  },
};
