import { Command } from "../../interfaces/Command";

import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

/**
 * Test server info commands
 * 
 * @returns Bot replied with server name and member count
 */
export const server: Command = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.'),
	async execute(interaction:ChatInputCommandInteraction) {
		if(interaction.guild) {
			await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
		} else {
			interaction.reply('Something went wrong getting server info.');
		}
	},
};
