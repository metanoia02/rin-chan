import { Client, Events, Interaction, TextBasedChannel } from 'discord.js';
import { CommandList } from '../commands/Commands';
import { SlashCommandError } from 'src/util/SlashCommandError';
import { Server } from 'src/entity/Server';

export default (client: Client): void => {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = CommandList.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        }

        if (error instanceof SlashCommandError) {
          if (interaction.guildId) {
            const server = await Server.get(interaction.guildId);

            if (server.diaryChannel) {
              const discordServer = await client.guilds.fetch(server.id);
              const channel = await discordServer.channels.fetch(server.diaryChannel);

              if (channel?.isTextBased()) {
                (channel as TextBasedChannel).send(error.getEmbed(interaction.commandName));
              }
            }
          } else {
            console.log(error.toString(interaction.commandName));
          }
        } else {
          console.log(error);
        }
      }
    } else if (interaction.isAutocomplete()) {
      const command = CommandList.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.autocomplete!(interaction);
      } catch (error) {
        if (error instanceof SlashCommandError) {
          if (interaction.guildId) {
            const server = await Server.get(interaction.guildId);

            if (server.diaryChannel) {
              const discordServer = await client.guilds.fetch(server.id);
              const channel = await discordServer.channels.fetch(server.diaryChannel);

              if (channel?.isTextBased()) {
                (channel as TextBasedChannel).send(error.getEmbed(interaction.commandName));
              }
            }
          } else {
            console.log(error.toString(interaction.commandName));
          }
      } else {
        console.log(error);
      }
    }
  });
};
