import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ChatInputCommandInteraction,
  Message,
  MessageReaction,
  User as DiscordUser,
  AttachmentBuilder,
  EmbedBuilder,
} from 'discord.js';
import { ReactionMaker } from '../../reactions/ReactionMaker';
import { User } from '../../entity/User';
import { howYou as howYouReact } from '../../reactions/rinchan/howYou';
import { commandEmbedEmote } from '../../util/commands';

const cheerUpImages = { path: './src/images/cheerup/', quantity: 6 };

export const howAreYou: ICommand = {
  data: new SlashCommandBuilder().setName('howareyou').setDescription('Ask Rin-chan how she is.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);

    const reactionFilter = (reaction: MessageReaction, reactionUser: DiscordUser) => {
      return ['✅', '❌'].includes(reaction.emoji.name!) && reactionUser.id === interaction.user.id;
    };

    await interaction.reply(await ReactionMaker.getEmbed(howYouReact, user));

    const sentMessage = await interaction.fetchReply();

    await sentMessage.react('✅');
    await sentMessage.react('❌');

    sentMessage
      .awaitReactions({ filter: reactionFilter, max: 1, time: 15000, errors: ['time'] })
      .then((collected) => {
        if (collected.has('❌')) {
          const imageName = Math.floor(Math.random() * cheerUpImages.quantity) + 1 + '.jpg';

          const commandAttachment = new AttachmentBuilder(cheerUpImages.path + imageName, {
            name: imageName,
          });

          const commandEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setDescription('Oh no, maybe this will make you feel better')
            .setImage(`attachment://${imageName}`);

          interaction.followUp({
            embeds: [commandEmbed],
            files: [commandAttachment],
          });
        } else if (collected.has('✅')) {
          interaction.followUp(commandEmbedEmote(`That's great!`, 'rinok.png'));
        }
      })
      .catch(() => {
        interaction.followUp(commandEmbedEmote(`Well I hope you're okay`, 'rinlove.png'));
      });
  },
};
