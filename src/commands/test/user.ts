import { Command } from "../../interfaces/Command";

import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";

/**
 * Test user info command
 * 
 * @returns Bot replies with username and join date
 */
export const user: Command = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	async execute(interaction:ChatInputCommandInteraction) {
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${(interaction.member as GuildMember).joinedAt}.`);
	},
};