import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
  TextBasedChannel,
  VoiceChannel,
} from 'discord.js';
import { Item } from '../../entity/Item';
import { Server } from '../../entity/Server';
import { User } from '../../entity/User';
import { SlashCommandError } from '../../util/SlashCommandError';
import { commandEmbedEmote } from '../../util/commands';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} from '@discordjs/voice';

let queue: Item[] = [];
let connection: any = {};
let player: any = createAudioPlayer();

async function connectToChannel(channel: VoiceChannel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    return connection;
  } catch (error) {
    connection.destroy();
    throw error;
  }
}

function playSong(song: Item, channel: TextBasedChannel) {
  if (!song) {
    connection.destroy();
    channel.send('Thank you for listening!');
    return;
  }

  const resource = createAudioResource(`./src/music/${song.id}.mp3`, {
    inputType: StreamType.Arbitrary,
  });

  player.play(resource);
  channel.send(`🎵🍊🎵 Ok listen up! The next song is **${song.name}** 🎵🍊🎵`);

  player.on(AudioPlayerStatus.Idle, () => {
    queue.shift();
    playSong(queue[0], channel);
  });
}

export const sing: ICommand = {
  data: new SlashCommandBuilder()
    .setName('sing')
    .setDescription('Ask Rin-chan to sing a song.')
    .addStringOption((itemOption) =>
      itemOption
        .setName('song')
        .setDescription('The song to sing.')
        .setRequired(true)
        .setAutocomplete(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);
    const songId = interaction.options.getString('song');

    if (!songId || !(await Item.itemExists(songId))) {
      interaction.reply(commandEmbedEmote(`Are you sure that's a song...`, 'rinwha.png'));
      return;
    }

    if ((await user.getQuantity('songBook')) < 1) {
      interaction.reply(commandEmbedEmote('You need a song book for that', 'rinconfuse.png'));
      return;
    }
    if ((await user.getQuantity(songId)) < 1) {
      interaction.reply(commandEmbedEmote(`You don't have that track`, 'rinded.png'));
      return;
    }

    const song = await Item.getItem(songId);
    const server = await Server.get(interaction.guildId!);
    const discordServer = await interaction.client.guilds.fetch(server.id);

    if (server.singingChannel && server.botChannel) {
      const voiceChannel = await discordServer.channels.fetch(server.singingChannel);
      const botChannel = await discordServer.channels.fetch(server.botChannel);

      if (voiceChannel?.isVoiceBased && botChannel?.isTextBased) {
        const permissions = voiceChannel.permissionsFor(interaction.client.user);

        if (
          !permissions?.has(PermissionFlagsBits.Connect) ||
          !permissions?.has(PermissionFlagsBits.Speak)
        ) {
          throw new SlashCommandError('Insufficient permissions CONNECT or SPEAK', permissions);
        }

        if (queue.length == 0) {
          connection = await connectToChannel(voiceChannel as VoiceChannel);
          connection.subscribe(player);
          interaction.reply(`Let's go!`);

          queue.push(song);
          playSong(song, botChannel as TextBasedChannel);
        } else {
          queue.push(song);
          interaction.reply(`Ok I'll sing ${song.name} later`);
        }
      } else {
        //config error
      }
    } else {
      throw new SlashCommandError('Singing and bot channel must be configured', server);
    }
  },
  async autocomplete(interaction: AutocompleteInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);
    const items: ApplicationCommandOptionChoiceData[] = (await Item.find())
      .filter((item) => item.singable)
      .map((item) => ({
        name: item.name,
        value: item.id,
      }));

    const focusedValue = interaction.options.getFocused();

    let filtered: ApplicationCommandOptionChoiceData[] = [];

    for (const item of items) {
      if (
        item.name.toLowerCase().includes(focusedValue) &&
        (await user.getQuantity(item.value.toString())) > 0
      ) {
        filtered.push(item);
      }
    }

    await interaction.respond(filtered.slice(0, 25));
  },
};
