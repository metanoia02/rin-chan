import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { ReactionMaker } from 'src/reactions/ReactionMaker';
import { User } from 'src/entity/User';
import { sayHi as sayHiReact } from '../../reactions/rinchan/sayHi';

export const sayhi: ICommand = {
  data: new SlashCommandBuilder().setName('sayhi').setDescription('Say hello to Rin-chan.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);

    interaction.reply(await ReactionMaker.getEmbed(sayHiReact, user));
  },
};
