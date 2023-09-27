import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Item } from '../../entity/Item';
import { commandEmbedEmote } from '../../util/commands';
import { User } from '../../entity/User';
import { feedOrange as feedOrangeReact } from '../../reactions/feed/orange';
import { feedBirthdayCake as feedBirthdayCakeReact } from '../../reactions/feed/birthdayCake';
import { AttachedEmbed } from '../../types/AttachedEmbed';
import { RinChan } from '../../entity/RinChan';
import { ReactionMaker } from '../../reactions/ReactionMaker';
import { clamp } from '../../util/clamp';
import { config } from '../../config';
import { SlashCommandError } from '../../util/SlashCommandError';

const orangeGiveCooldown = 300000; //move to config

async function feedRinchan(user: User, item: Item): Promise<AttachedEmbed> {
  const currentTime = new Date();
  const rinChan = await RinChan.get(user.guild);
  let embed: AttachedEmbed;

  if (rinChan.hunger === 0) {
    return commandEmbedEmote(`I'm stuffed, I cant eat another one`, 'rinstuffed.png');
  }

  switch (item.id) {
    case 'orange':
      await user.takeItem(item.id);
      user.affection = clamp(0, 100, user.affection + 5);
      user.lastFedRinchan = currentTime.getTime();
      await user.addXp(1);

      rinChan.hunger = clamp(0, config.hungerIcon.length + 1, rinChan.hunger - 1);
      rinChan.lastFed = currentTime.getTime();

      embed = await ReactionMaker.getEmbed(feedOrangeReact, user);
      break;
    case 'birthdayCake':
      await user.takeItem(item.id);
      user.affection = clamp(0, 100, user.affection + 10);
      user.lastFedRinchan = currentTime.getTime();
      await user.addXp(10);

      rinChan.hunger = clamp(0, config.hungerIcon.length + 1, rinChan.hunger - 1);
      rinChan.lastFed = currentTime.getTime();
      rinChan.mood = clamp(0, 5, rinChan.mood + 1);

      embed = await ReactionMaker.getEmbed(feedBirthdayCakeReact, user);
      break;
    default:
      throw new SlashCommandError('No handler to feed item', item);
  }

  User.save(user);
  RinChan.save(rinChan);

  return embed;
}

function checkGiveSpam(user: User) {
  const currentTime = new Date();

  if (currentTime.getTime() - user.lastFedRinchan > orangeGiveCooldown) {
    return true;
  } else {
    return false;
  }
}

export const feed: ICommand = {
  data: new SlashCommandBuilder()
    .setName('feed')
    .setDescription('Feed Rin-chan.')
    .addStringOption((option) =>
      option
        .setName('item')
        .setDescription('The item to feed to Rin-chan.')
        .setRequired(true)
        .setAutocomplete(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const itemId = interaction.options.getString('item');

    if (itemId && (await Item.exists(itemId))) {
      const item = await Item.get(itemId);
      const user = await User.get(interaction.user.id, interaction.guildId!);
      const rinChan = await RinChan.get(interaction.guildId!);

      if ((await user.getQuantity(itemId)) < 1) {
        interaction.reply(commandEmbedEmote(`You dont't have any of those`, 'rinconfuse.png'));
        return;
      }

      if (!item.filling) {
        interaction.reply(commandEmbedEmote(`I don't fancy one of those right now`, 'rinlove.png'));
        return;
      }

      if (checkGiveSpam(user) || rinChan.hunger >= 4) {
        interaction.reply(await feedRinchan(user, item));
        return;
      } else {
        interaction.reply(commandEmbedEmote(`Hang on, I'm still eating...`, 'rinchill.png'));
        return;
      }
    }
  },

  async autocomplete(interaction: AutocompleteInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);
    const items: ApplicationCommandOptionChoiceData[] = (await Item.find()).map((item) => ({
      name: item.name,
      value: item.id,
    }));

    const focusedValue = interaction.options.getFocused();

    let filtered: ApplicationCommandOptionChoiceData[] = [];

    for (const item of items) {
      if (
        item.name.toLowerCase().includes(focusedValue) &&
        (await user.getQuantity(item.value.toString())) > 0
      ) {
        filtered.push(item);
      }
    }

    await interaction.respond(filtered.slice(0, 25));
  },
};
