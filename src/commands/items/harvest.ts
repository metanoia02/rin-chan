import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { User } from '../../entity/User';
import { RinChan } from '../../entity/RinChan';
import { AttachedEmbed } from '../../types/AttachedEmbed';
import { config } from '../../config';
import { ReactionMaker } from '../../reactions/ReactionMaker';
import { getCooldown, commandEmbed } from '../../util/commands';
import * as schedule from 'node-schedule';

// Reactions
import { findOrange as findOrangeReact } from '../../reactions/harvest/findOrange';
import { imTired as imTiredReact } from '../../reactions/harvest/imTired';
import { couldntFind as couldntFindReact } from '../../reactions/harvest/couldntFind';
import { findLen as findLenReact } from '../../reactions/harvest/findLen';
import { stealOrange as stealOrangeReact } from '../../reactions/harvest/stealOrange';
import { SlashCommandError } from 'src/util/SlashCommandError';

export const harvest: ICommand = {
  data: new SlashCommandBuilder()
    .setName('harvest')
    .setDescription('Try your luck to get some oranges!'),
  execute: async (interaction: CommandInteraction) => {
    const today = new Date();
    const user = await User.get(interaction.user.id, interaction.guildId!);
    const rinChan = await RinChan.get(interaction.guildId!);
    const chance = Math.floor(Math.random() * 100) + 1;
    let response: AttachedEmbed | null = null;

    if (today.getDate() == 27 && today.getMonth() == 11) {
      response = commandEmbed('Forget that! I have cake to eat!', 'smolrin.png');
    } else if (user.harvestAttempts > 0) {
      if (0 < chance && chance <= 5) {
        response = await findLen(user);
      } else if (5 < chance && chance <= 65) {
        const chanceSteal = Math.floor(Math.random() * 100) + 1;
        if (rinChan.hunger > 3 && chanceSteal > 50) {
          response = await stealOrange(user, rinChan);
        } else {
          response = await findOrange(user);
        }
      } else if (65 < chance && chance <= 100) {
        response = await couldntFind(user);
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

    RinChan.save(rinChan);
    User.save(user);

    if (response) interaction.reply(response);
    else throw new SlashCommandError('Response not set in harvest.', user);
  },
};

async function stealOrange(user: User, rinChan: RinChan): Promise<AttachedEmbed> {
  rinChan.hunger = rinChan.hunger - 1;
  user.harvestAttempts = user.harvestAttempts - 1;

  return await ReactionMaker.getEmbed(stealOrangeReact, user);
}

async function findLen(user: User): Promise<AttachedEmbed> {
  await user.giveItem('kagamineLen');
  user.harvestAttempts = 0;

  return await ReactionMaker.getEmbed(findLenReact, user);
}

async function findOrange(user: User): Promise<AttachedEmbed> {
  await user.giveItem('orange');
  user.harvestAttempts = user.harvestAttempts - 1;

  return await ReactionMaker.getEmbed(findOrangeReact, user);
}

async function couldntFind(user: User): Promise<AttachedEmbed> {
  user.harvestAttempts = user.harvestAttempts - 1;

  return await ReactionMaker.getEmbed(couldntFindReact, user);
}

schedule.scheduleJob('0 * * * * *', async () => {
  const users = await User.find();
  const now = new Date();

  users.forEach(async (thisUser: User) => {
    const maxTries = (await thisUser.isBoosting()) ? 4 : 3;
    if (thisUser.harvestAttempts < maxTries) {
      if (now.getTime() - thisUser.lastHarvested > config.orangeHarvestCooldown) {
        thisUser.harvestAttempts = thisUser.harvestAttempts + 1;
        const now = new Date();
        thisUser.lastHarvested = now.getTime();
      }
    }
  });
});
