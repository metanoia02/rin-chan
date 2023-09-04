import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction } from 'discord.js';
import { User } from '../../entity/User';
import { RinChan } from '../../entity/RinChan';
import { AttachedEmbed } from '../../types/AttachedEmbed';
import { commandEmbed } from '../../util/commands';

async function rateUser(user: User, rinChan: RinChan): Promise<AttachedEmbed> {
  if (user.id == rinChan.id) {
    return commandEmbed(`Probably about 1000%`, 'rintriumph.png');
  } else {
    return commandEmbed(
      `I would rate <@${(await user.getDiscordMember()).id}> ${user.affection}%`,
      'oharin.png',
    );
  }
}

function rateRandom(toRate: string): AttachedEmbed {
  const replyStart = 'I would rate';

  if (toRate.toLowerCase().includes('orange')) {
    return commandEmbed(`${replyStart} '${toRate.trim()}' 100%`, 'rinchill.png');
  } else if (toRate.toLowerCase().includes('len')) {
    return commandEmbed(`${replyStart} '${toRate.trim()}' roadroller%`, 'rinchill.png');
  } else {
    const randomRating = Math.floor(Math.random() * 99) + 1;
    return commandEmbed(`${replyStart} '${toRate.trim()}' ${randomRating}%`, 'rinchill.png');
  }
}

export const rate: ICommand = {
  data: new SlashCommandBuilder()
    .setName('rate')
    .setDescription('Ask Rin-chan to rate an object or player.')
    .addUserOption((userOption) =>
      userOption.setName('user').setDescription('Pick a user to rate').setRequired(false),
    )
    .addStringOption((stringOption) =>
      stringOption.setName('thing').setDescription('Enter a thing to rate').setRequired(false),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const discordUserToRate = interaction.options.getUser('user');
    const thingToRate = interaction.options.getString('thing');

    const rinChan = await RinChan.get(interaction.guildId!);

    if (discordUserToRate) {
      const userToRate = await User.get(discordUserToRate.id, interaction.guildId!);
      interaction.reply(await rateUser(userToRate, rinChan));
    } else if (thingToRate) {
      interaction.reply(rateRandom(thingToRate.trim()));
    } else {
      interaction.reply(commandEmbed('What should I rate?', 'rinwha.png'));
    }
  },
};
