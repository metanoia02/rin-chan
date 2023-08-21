import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { happyBirthday as happyBirthdayReact } from '../../reactions/events/happyBirthday';
import { ReactionMaker } from 'src/reactions/ReactionMaker';
import { User } from 'src/entity/User';

export const happybirthday: ICommand = {
  data: new SlashCommandBuilder()
    .setName('happybirthday')
    .setDescription('Wish Rin-chan a Happy Birthday.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);

    interaction.reply(await ReactionMaker.getEmbed(happyBirthdayReact, user));
  },
};
