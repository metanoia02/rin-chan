import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { User } from '../../entity/User';
import { RinChan } from '../../entity/RinChan';
import { AttachedEmbed } from '../../types/AttachedEmbed';
import { config } from '../../config';
import { ReactionMaker } from '../../reactions/ReactionMaker';
import { rinChanRepository } from '../../repository/rinChanRepository';
import { getCooldown, commandEmbed } from '../../util/commands';
import * as schedule from 'node-schedule';

// Reactions
import { findOrange as findOrangeReact } from '../../reactions/harvest/findOrange';
import { imTired as imTiredReact } from '../../reactions/harvest/imTired';

const lenImages = { path: './src/images/len/', quantity: 10 };

export const harvest: ICommand = {
  data: new SlashCommandBuilder()
    .setName('harvest')
    .setDescription('Try your luck to get some oranges!'),
  execute: async (interaction: CommandInteraction) => {
    const today = new Date();
    const user = await User.getUser(interaction.user.id, interaction.guildId!);
    const rinChan = await rinChanRepository.get(interaction.guildId!);
    const chance = Math.floor(Math.random() * 100) + 1;
    let response: AttachedEmbed | null = null;

    if (today.getDate() == 27 && today.getMonth() == 11) {
      response = commandEmbed('Forget that! I have cake to eat!', 'smolrin.png');
    } else if (user.harvestAttempts > 0) {
      if (0 < chance && chance <= 5) {
        response = findLen(user);
      } else if (5 < chance && chance <= 65) {
        const chanceSteal = Math.floor(Math.random() * 100) + 1;
        if (rinChan.hunger > 3 && chanceSteal > 50) {
          response = stealOrange(user, rinChan);
        } else {
          response = await findOrange(user);
        }
      } else if (65 < chance && chance <= 100) {
        response = couldntFind(user);
      }

      if (today.getTime() - user.lastHarvested > config.orangeHarvestCooldown) {
        user.lastHarvested = today.getTime();
      }
    } else {
      const duration = getCooldown(config.orangeHarvestCooldown, user.lastHarvested);
      response = await ReactionMaker.getEmbed(imTiredReact, user);
      response.embeds[0].addFields({
        name: 'You can try again in:',
        value: duration,
        inline: true,
      });
    }

    rinChanRepository.save(rinChan);
    User.save(user);
    if (response) interaction.reply(response);
    else throw new Error('Response not set in harvest.');
  },
};

function stealOrange(user: User, rinChan: RinChan): AttachedEmbed {
  rinChan.hunger = rinChan.hunger - 1;
  user.harvestAttempts = user.harvestAttempts - 1;

  const stealAttachment = new AttachmentBuilder('./src/images/emotes/rintehe.png', {
    name: 'rintehe.png',
  });
  const stealEmbed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('Harvest')
    .setDescription(`I found one! But I got hungry on the way back.`)
    .setThumbnail('attachment://rintehe.png');

  return { embeds: [stealEmbed], files: [stealAttachment] };
}

function findLen(user: User): AttachedEmbed {
  user.changeQuantity('kagamineLen', 1);
  user.harvestAttempts = 0;

  const imageName = Math.floor(Math.random() * lenImages.quantity) + 1 + '.jpg';
  const image = lenImages.path + imageName;

  const couldntFindAttachment = new AttachmentBuilder(image, { name: imageName });
  const couldntFindEmbed = new EmbedBuilder()
    .setColor('#FFFF00')
    .setTitle('Harvest')
    .setDescription('Found a Len! <:rinwao:701505851449671871>')
    .setImage(`attachment://${imageName}`);

  return { embeds: [couldntFindEmbed], files: [couldntFindAttachment] };
}

async function findOrange(user: User): Promise<AttachedEmbed> {
  user.changeQuantity('orange', 1);
  user.harvestAttempts = user.harvestAttempts - 1;

  return await ReactionMaker.getEmbed(findOrangeReact, user);
}

function couldntFind(user: User): AttachedEmbed {
  user.harvestAttempts = user.harvestAttempts - 1;

  const couldntFindAttachment = new AttachmentBuilder('./src/images/emotes/rinyabai.png', {
    name: 'rinyabai.png',
  });
  const couldntFindEmbed = new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('Harvest')
    .setDescription(`Couldn't find anything`)
    .setThumbnail('attachment://rinyabai.png');

  return { embeds: [couldntFindEmbed], files: [couldntFindAttachment] };
}

const updateTriesInterval = schedule.scheduleJob('0 * * * * *', async () => {
  const users = await User.find();
  const now = new Date();

  users.forEach((thisUser: User) => {
    const maxTries = thisUser.isBoosting ? 4 : 3;
    if (thisUser.harvestAttempts < maxTries) {
      if (now.getTime() - thisUser.lastHarvested > config.orangeHarvestCooldown) {
        thisUser.harvestAttempts = thisUser.harvestAttempts + 1;
        const now = new Date();
        thisUser.lastHarvested = now.getTime();
      }
    }
  });
});
