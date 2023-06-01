import { Command } from "../../interfaces/Command";

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

/**
 * Test ping command
 */
export const ping: Command = {
	data: new SlashCommandBuilder()
    	.setName("ping")
    	.setDescription("Replies with Pong!"),
	execute: async (interaction:CommandInteraction) => {
		await interaction.reply('Pong!');
	},
};