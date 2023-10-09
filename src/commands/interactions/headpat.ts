import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { ReactionMaker } from '../../reactions/ReactionMaker';
import { User } from '../../entity/User';
import { RinChan } from '../../entity/RinChan';
import { commandEmbedEmote } from '../../util/commands';
import { giveHeadpat as giveHeadpatReact } from '../../reactions/interactions/giveHeadpat';

const cost = 1;

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
          interaction.reply(commandEmbedEmote('You never give me oranges...', 'rinpout.png'));
          return;
        } else {
          interaction.reply('<:rincomf:634115522002419744>');
          return;
        }
      } else {
        if ((await user.getQuantity('orange')) < cost) {
          interaction.reply(
            commandEmbedEmote(
              `To do that I'll need a 'donation' of ${cost} oranges`,
              'rinpout.png',
            ),
          );
          return;
        } else {
          await user.setQuantity('orange', (await user.getQuantity('orange')) - cost);
          const rinchan = await User.get(rinChan.id, interaction.guildId!);
          await rinchan.setQuantity('orange', (await user.getQuantity('orange')) + cost);

          const embed = await ReactionMaker.getEmbed(giveHeadpatReact, user);
          embed.content = `<@${targetUser.id}>`;

          interaction.reply(embed);
          return;
        }
      }
    }
  },
};
