import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, PermissionFlagsBits, TextBasedChannel } from 'discord.js';
import { client } from 'src/client';
import { Server } from 'src/entity/Server';
import { commandEmbedEmote } from 'src/util/commands';
const forever = require('forever');

export const sleep: ICommand = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('sleep')
    .setDescription('Go into maintenance mode.'),

  async execute(interaction: ChatInputCommandInteraction) {
    forever.startServer();

    const server = await Server.get(interaction.guildId!);
    if (server.botChannel) {
      const botChannel = client.guilds.cache.get(server.id)?.channels.cache.get(server.botChannel);
      if (botChannel?.isTextBased) {
        (botChannel as TextBasedChannel).send(
          commandEmbedEmote(`I'll be right back!`, 'rinbath.png'),
        );
      }
    }

    await forever.stopAll();
  },
};
