import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { Server } from '../../entity/Server';
import { SlashCommandError } from '../../util/SlashCommandError';

/**
 * Set the role for server boosters.
 */
export const serverConfig: ICommand = {
  data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setName('server_config')
    .setDescription('Change configuration options for this servers Rin-chan bot')

    .addSubcommand((moderatorRoleCommand) =>
      moderatorRoleCommand
        .setName('set_mod_role')
        .setDescription('Set the moderator role for this server.')
        .addRoleOption((option) =>
          option.setName('role').setRequired(true).setDescription('Select a role'),
        ),
    )

    .addSubcommand((botChannelCommand) =>
      botChannelCommand
        .setName('set_bot_channel')
        .setDescription('Set the channel Rinchan will send messages in when not answering.')
        .addChannelOption((option) =>
          option.setName('channel').setRequired(true).setDescription('Select a Channel'),
        ),
    )

    .addSubcommand((dairyChannelCommand) =>
      dairyChannelCommand
        .setName('set_diary_channel')
        .setDescription(
          'Set the channel Rinchan will send administrative messages in when not answering.',
        )
        .addChannelOption((option) =>
          option.setName('channel').setRequired(true).setDescription('Select a Channel'),
        ),
    )

    .addSubcommand((singingChannelCommand) =>
      singingChannelCommand
        .setName('set_singing_channel')
        .setDescription('Set the voice channel Rinchan will sing in.')
        .addChannelOption((option) =>
          option.setName('channel').setRequired(true).setDescription('Select a Channel'),
        ),
    )

    .addSubcommand((boosterRole) =>
      boosterRole
        .setName('set_booster_role')
        .setDescription('Set the booster role for this server.')
        .addRoleOption((option) =>
          option.setName('role').setRequired(true).setDescription('Select a role'),
        ),
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const server = await Server.get(interaction.guildId!);

    let message = 'Oops';
    const role = interaction.options.getRole('role');
    const channel = interaction.options.getChannel('channel');

    switch (interaction.options.getSubcommand()) {
      case 'set_mod_role':
        server.modRole = role!.id;

        message = 'Moderator role has been set to ' + role!.name + ' (Id:' + role!.id + ')';
        break;
      case 'set_bot_channel':
        server.botChannel = channel!.id;

        message = 'Bot channel has been set to ' + channel!.name + ' (Id:' + channel!.id + ')';
        break;
      case 'set_diary_channel':
        server.diaryChannel = channel!.id;

        message = 'Diary channel has been set to ' + channel!.name + ' (Id:' + channel!.id + ')';
        break;
      case 'set_singing_channel':
        server.singingChannel = channel!.id;

        message = 'Singing channel has been set to ' + channel!.name + ' (Id:' + channel!.id + ')';
        break;
      case 'set_booster_role':
        server.boosterRole = role!.id;

        message = 'Booster role has been set to ' + role!.name + ' (Id:' + role!.id + ')';
        break;
      default:
        throw new SlashCommandError('Subcommand not set', interaction);
    }

    await Server.save(server);
    interaction.reply(message);
  },
};
