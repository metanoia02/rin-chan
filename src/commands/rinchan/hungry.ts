import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { hungry as hungryReact } from '../../reactions/rinchan/hungry';
import { ReactionMaker } from '../../reactions/ReactionMaker';
import { User } from '../../entity/User';

export const hungry: ICommand = {
  data: new SlashCommandBuilder()
    .setName('hungry')
    .setDescription('Ask Rin-chan if she is hungry.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);

    interaction.reply(await ReactionMaker.getEmbed(hungryReact, user));
  },
};
