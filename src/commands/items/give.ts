import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Message,
} from 'discord.js';
import { Item } from '../../entity/Item';
import { commandEmbed, commandEmbedEmote } from '../../util/commands';
import { User } from '../../entity/User';
import { RinChan } from '../../entity/RinChan';
import { SlashCommandError } from '../../util/SlashCommandError';

async function giveChristmasPresent(
  sourceUser: User,
  destUser: User,
  interaction: ChatInputCommandInteraction,
) {
  await interaction.reply(
    `Hey <@${destUser.id}> theres a present for you! It's from <@${sourceUser.id}>\nDo you want to open it?`,
  );

  const openRegex = /yes|open|ok/gi;

  const messageFilter = (response: Message) => {
    return response.author.id === destUser.id && Boolean(response.content.match(openRegex));
  };

  const collector = interaction.channel!.createMessageCollector({
    filter: messageFilter,
    max: 1,
    time: 120000,
  });

  collector.on('collect', async (message) => {
    setTimeout(() => {
      message.reply('*rustle rustle*...');
    }, 4000);

    setTimeout(async () => {
      const finalEmbed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('Merry Christmas!')
        .setDescription('Inside you find a bunch of oranges! Some of them are golden.');

      await destUser.changeQuantity('orange', 20);
      await destUser.changeQuantity('goldenOrange', 20);
      await sourceUser.takeItem('christmasPresent');

      message.reply({ embeds: [finalEmbed] });
    }, 10000);
  });

  collector.on('end', () => {
    interaction.followUp(
      commandEmbedEmote(`Don't worry! Maybe they'll be here to open it later`, 'rintap.gif'),
    );
  });
}

export const give: ICommand = {
  data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('Give an item to another user.')
    .addNumberOption((quantityOption) =>
      quantityOption
        .setName('quantity')
        .setDescription('The number of items to give')
        .setRequired(true),
    )
    .addStringOption((itemOption) =>
      itemOption
        .setName('item')
        .setDescription('The item to give.')
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addUserOption((userOption) =>
      userOption.setName('user').setDescription('The user to give to').setRequired(true),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const itemId = interaction.options.getString('item');
    const quantity = interaction.options.getNumber('quantity');
    const targetDiscordUser = interaction.options.getUser('user');

    if (itemId && quantity != null && targetDiscordUser) {
      const item = await Item.get(itemId);
      const targetUser = await User.get(targetDiscordUser?.id, interaction.guildId!);
      const sourceUser = await User.get(interaction.user.id, interaction.guildId!);
      const rinChan = await RinChan.get(interaction.guildId!);
      const quantityOwned = await sourceUser.getQuantity(item.id);

      const entityString = quantity > 1 ? item.plural : item.determiner + ' ' + item.name;
      const entityNumString = quantity > 1 ? quantity + ' ' + entityString : entityString;

      if (!item.value) {
        interaction.reply(commandEmbedEmote(`You can't trade that.`, `rinwha.png`));
        return;
      }

      if (quantity < 1) {
        interaction.reply(commandEmbedEmote(`Fine, no ${entityString} for them`, 'rinsmug.png'));
        return;
      } else if (quantityOwned == 0) {
        interaction.reply(commandEmbedEmote(`You don't have any of those`, `rinwha.png`));
        return;
      } else if (quantityOwned < quantity) {
        interaction.reply(commandEmbedEmote(`You don't have enough of those`, `rinwha.png`));
        return;
      } else if (targetUser.id == sourceUser.id) {
        interaction.reply(
          commandEmbedEmote(`You cant give ${entityString} to yourself!`, 'rinconfuse.png'),
        );
        return;
      } else if (targetDiscordUser.bot && rinChan.id != targetUser.id) {
        interaction.reply(
          commandEmbedEmote(`Why would that bot need ${entityString}...`, 'rinwha.png'),
        );
        return;
      }

      if (targetUser.id == rinChan.id) {
        if (item.id === 'orange') {
          interaction.reply(`Thanks, I'll put them to good use`);
          sourceUser.changeQuantity(item.id, -quantity);
          targetUser.changeQuantity(item.id, quantity);
        } else {
          interaction.reply('You keep that for now <:rinlove:787037972330446848>');
        }
      } else {
        if (item.id == 'christmasPresent') {
          giveChristmasPresent(sourceUser, targetUser, interaction);
          return;
        } else {
          interaction.reply(
            commandEmbed(
              'Ok, you gave ' + entityNumString + ` to <@${targetUser.id}>`,
              `entity/${item.id}.png`,
            ),
          );
          sourceUser.changeQuantity(item.id, -quantity);
          targetUser.changeQuantity(item.id, quantity);
        }
      }
    } else {
      throw new SlashCommandError('Failed to get paramters from slash command', {
        itemId: itemId,
        quantity: quantity,
        targetDiscordUser: targetDiscordUser,
        sourceUser: interaction.user,
      });
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
