import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { happyBirthday as happyBirthdayReact } from '../../reactions/events/happyBirthday';
import { ReactionMaker } from '../../reactions/ReactionMaker';
import { User } from '../../entity/User';
import { commandEmbedEmote } from 'src/util/commands';

export const happybirthday: ICommand = {
  data: new SlashCommandBuilder()
    .setName('happybirthday')
    .setDescription('Wish Rin-chan a Happy Birthday.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const today = new Date();

    if (today.getDate() > 25 && today.getDate() < 30 && today.getMonth() == 11) {
      const user = await User.get(interaction.user.id, interaction.guildId!);

      const reaction = await ReactionMaker.getEmbed(happyBirthdayReact, user);
      reaction.embeds[0].setTitle('Happy Birthday');

      interaction.reply(reaction);
    } else {
      interaction.reply(commandEmbedEmote(`It's not my birthday.`, 'rinconfuse.png'));
    }
  },
};
