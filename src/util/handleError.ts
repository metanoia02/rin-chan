import { Guild, TextBasedChannel } from 'discord.js';
import { Server } from '../entity/Server';
import { SlashCommandError } from './SlashCommandError';

export default async function handleError(error: Error, discordGuild: Guild) {
  const server = await Server.get(discordGuild.id);

  if (server.diaryChannel) {
    const channel = await discordGuild.channels.fetch(server.diaryChannel);

    if (channel?.isTextBased()) {
      if (error instanceof SlashCommandError) {
        (channel as TextBasedChannel).send(error.getEmbed());
      } else {
        (channel as TextBasedChannel).send(
          new SlashCommandError(error.name, error.message).getEmbed(),
        );
      }
    }
  }

  console.log(error);
}
