import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { ReactionMaker } from '../../reactions/ReactionMaker';
import { User } from '../../entity/User';
import { RinChan } from '../../entity/RinChan';
import { commandEmbed } from '../../util/commands';
import { giveHeadpat as giveHeadpatReact } from '../../reactions/interactions/giveHeadpat';

const cost = 3;

export const headpat: ICommand = {
  data: new SlashCommandBuilder()
    .setName('headpat')
    .setDescription('Heatpat another user(costs oranges) or Rin-chan(free, maybe).')
    .addUserOption((userOption) =>
      userOption.setName('user').setDescription('The user to headpat').setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser('user');

    if (targetUser) {
      const user = await User.get(interaction.user.id, interaction.guildId!);
      const rinChan = await RinChan.get(interaction.guildId!);

      if (targetUser.id == rinChan.id) {
        const currentTime = new Date();

        if (user.lastFedRinchan < currentTime.getTime() - 172800000) {
          interaction.reply(commandEmbed('You never give me oranges...', 'rinpout.png'));
          return;
        } else {
          interaction.reply('<:rincomf:634115522002419744>');
          return;
        }
      } else {
        if ((await user.getQuantity('orange')) < cost) {
          interaction.reply(
            commandEmbed(`To do that I'll need a 'donation' of ${cost} oranges`, 'rinpout.png'),
          );
          return;
        } else {
          await user.setQuantity('orange', (await user.getQuantity('orange')) - cost);
          const rinchan = await User.get(rinChan.id, interaction.guildId!);
          await user.setQuantity('orange', (await user.getQuantity('orange')) + cost);

          const embed = await ReactionMaker.getEmbed(giveHeadpatReact, user);
          embed.embeds[0].setDescription(
            (await user.getDiscordMember()) +
              embed.embeds[0].data.description! +
              (await rinchan.getDiscordMember()),
          );

          interaction.reply(embed);
          return;
        }
      }
    }
  },
};
