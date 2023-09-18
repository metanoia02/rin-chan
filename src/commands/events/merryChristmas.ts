import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { User } from '../../entity/User';
import arrayRandom from '../../util/arrayRandom';
import { AttachedEmbed } from '../../types/AttachedEmbed';
import { readdirSync } from 'fs';
import { commandEmbed } from '../../util/commands';

const christmasImagesPath = './src/images/christmas/';
const itemImage = 'christmasItems.png';
const christmasImages = readdirSync(christmasImagesPath).filter((file) => file.endsWith('.jpg'));

export const merrychristmas: ICommand = {
  data: new SlashCommandBuilder()
    .setName('merrychristmas')
    .setDescription('Wish Rin-chan a Merry Christmas.'),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);
    let messageStr = '';
    const today = new Date();

    if (today.getDate() == 27 && today.getMonth() == 11) {
      if ((await user.getQuantity('merryChristmasMyHero')) < 1) {
        messageStr = `I have a present for you, <@${user.id}>!`;

        let followupStr = `I added a song to your song book!
            I'll sing for you any time! And these golden oranges, 
            they will take those at the new shops in town. Let's go when they are open.`;

        if ((await user.getQuantity('songBook')) == 0) {
          followupStr = `Here's a songbook you can keep you're favourite songs in. I added a song just for you.
                I'll sing for you any time! And these golden oranges, 
                they will take those at the new shops in town. Let's go when they are open.`;

          user.giveItem('songBook');
        }

        setTimeout(async () => {
          interaction.followUp(merryChristmasReply(christmasImagesPath + itemImage, followupStr));

          await user.changeQuantity('goldenOrange', 5);
          await user.giveItem('merryChristmasMyHero');
        }, 10000);
      } else {
        messageStr = `Didn't I already give you a present? Hope you're having a good day!`;
      }

      interaction.reply(
        merryChristmasReply(`${christmasImagesPath}${arrayRandom(christmasImages)}`, messageStr),
      );
    } else {
      interaction.reply(commandEmbed(`It's not christmas.`, 'rinconfuse.png'));
    }
  },
};

function merryChristmasReply(imagePath: string, description: string): AttachedEmbed {
  const attachment = new AttachmentBuilder(imagePath, {
    name: 'image.jpg',
  });

  const embed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('Merry Christmas!')
    .setDescription(description)
    .setImage(`attachment://image.jpg`);

  return { embeds: [embed], files: [attachment] };
}
