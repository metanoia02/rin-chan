import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { thanks as thanksReact } from '../../reactions/misc/thanks';
import { ReactionMaker } from '../../reactions/ReactionMaker';
import { User } from '../../entity/User';

export const thanks: ICommand = {
  data: new SlashCommandBuilder().setName('thanks').setDescription('Thank Rin-chan.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);

    interaction.reply(await ReactionMaker.getEmbed(thanksReact, user));
  },
};
