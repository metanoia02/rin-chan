import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  AutocompleteInteraction,
  ApplicationCommandOptionChoiceData,
} from 'discord.js';
import { User } from '../../entity/User';
import { SlashCommandError } from '../../util/SlashCommandError';
import { Shop } from '../../entity/Shop';
import { ShopContent } from '../../types/ShopContent';
import { Item } from '../../entity/Item';
import { AttachedEmbed } from '../../types/AttachedEmbed';
import { generateImage } from '../../util/generateImage';
import { commandEmbed, commandEmbedEmote } from '../../util/commands';

const shopName: string = 'Supermarket';

async function getEmbed(shop: Shop): Promise<AttachedEmbed> {
  const stock = shop.stock;

  const shopContent: ShopContent = { stock: [] };

  for (const itemStack of stock) {
    shopContent.stock.push({
      name: itemStack.item.name,
      value: itemStack.item.value!,
      quantity: itemStack.quantity,
    });
  }

  const shopImage = await generateImage('./src/templates/shop.html', shopContent);
  const thumbnail = new AttachmentBuilder('./src/images/shop/thumbnail.jpg', {
    name: 'thumbnail.jpg',
  });
  const attachment = new AttachmentBuilder(shopImage, { name: 'shop.png' });

  const shopEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('Orange Kingdom General Store')
    .setDescription('The best value every day for discerning Rin-chans')
    .setThumbnail('attachment://thumbnail.jpg')
    .setImage('attachment://shop.png');

  return { embeds: [shopEmbed], files: [thumbnail, attachment] };
}

export const supermarket: ICommand = {
  data: new SlashCommandBuilder()
    .setName('supermarket')
    .setDescription('Ask Rin-chan if she is hungry.')
    .addSubcommand((viewCommand) =>
      viewCommand.setName('view').setDescription('View the shops stock.'),
    )
    .addSubcommand((buyCommand) =>
      buyCommand
        .setName('buy')
        .setDescription('Buy something from the shop.')
        .addIntegerOption((quantityOption) =>
          quantityOption
            .setName('quantity')
            .setDescription('Quantity of items to buy.')
            .setRequired(true),
        )
        .addStringOption((itemOption) =>
          itemOption
            .setName('item')
            .setDescription('The item to feed to Rin-chan.')
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .addSubcommand((sellCommand) =>
      sellCommand
        .setName('sell')
        .setDescription('Buy something from the shop.')
        .addIntegerOption((quantityOption) =>
          quantityOption
            .setName('quantity')
            .setDescription('Quantity of items to buy.')
            .setRequired(true),
        )
        .addStringOption((itemOption) =>
          itemOption
            .setName('item')
            .setDescription('The item to feed to Rin-chan.')
            .setRequired(true)
            .setAutocomplete(true),
        ),
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const shop = await Shop.findOne({ where: { name: shopName } });
    const subcommand = interaction.options.getSubcommand();

    if (shop) {
      if (interaction.options.getSubcommand() == 'view') {
        interaction.reply(await getEmbed(shop));
      } else {
        const quantity = interaction.options.getInteger('quantity');
        const itemId = interaction.options.getString('item');
        const user = await User.get(interaction.user.id, interaction.guildId!);

        if (quantity && itemId) {
          if (await Item.exists(itemId)) {
            const item = await Item.get(itemId);

            //generic checks
            //selling/buying same as currency?
            //unsellable item?
            //

            switch (subcommand) {
              case 'buy':
                interaction.reply(await buyItem(quantity, item, user, shop));
                break;
              case 'sell':
                interaction.reply(await sellItem(quantity, item, user, shop));
                break;
              default:
                throw new SlashCommandError('Subcommand not set', interaction);
            }
          } else {
            interaction.reply(commandEmbedEmote(`That's not an item`, 'rinconfuse.png'));
            return;
          }
        } else {
          throw new SlashCommandError('Arguments not set', interaction);
        }
      }
    } else {
      throw new SlashCommandError('Supermarket does not exist.', interaction);
    }
  },
  async autocomplete(interaction: AutocompleteInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);
    const shop = await Shop.findOne({ where: { name: shopName } });

    const items: ApplicationCommandOptionChoiceData[] = (await Item.find()).map((item) => ({
      name: item.name,
      value: item.id,
    }));

    const focusedValue = interaction.options.getFocused();
    let filtered: ApplicationCommandOptionChoiceData[] = [];

    switch (interaction.options.getSubcommand()) {
      case 'buy':
        if (shop) {
          for (const item of items) {
            if (
              item.name.toLowerCase().includes(focusedValue) &&
              (await shop.getQuantity(item.value.toString())) > 0
            ) {
              filtered.push(item);
            }
          }
          await interaction.respond(filtered.slice(0, 25));
        } else {
          throw new SlashCommandError('Supermarket does not exist.', interaction);
        }

        break;
      case 'sell':
        for (const item of items) {
          if (
            item.name.toLowerCase().includes(focusedValue) &&
            (await user.getQuantity(item.value.toString())) > 0
          ) {
            filtered.push(item);
          }
        }
        await interaction.respond(filtered.slice(0, 25));
        break;
      default:
        throw new SlashCommandError('Subcommand not set', interaction);
    }
  },
};

async function sellItem(
  quantity: number,
  item: Item,
  user: User,
  shop: Shop,
): Promise<AttachedEmbed> {
  const price = quantity * item.value!;
  //User has enough items to sell?
  if ((await user.getQuantity(item.id)) < quantity) {
    return commandEmbedEmote(`You don't have that many.`, 'rinded.png');
  }
  //Shop has enough currencies to buy?
  if ((await shop.getQuantity('orange')) < price) {
    return commandEmbedEmote(`The shop can't afford that.`, 'rinded.png');
  }

  await user.changeQuantity(item.id, -quantity);
  await shop.changeQuantity(item.id, quantity);

  await user.changeQuantity('orange', price);
  await shop.changeQuantity('orange', -price);

  const entityString = quantity > 1 ? item.plural : item.determiner + ' ' + item.name;
  const entityNumString = quantity > 1 ? quantity + ' ' + entityString : entityString;

  return commandEmbed(`You sold ${entityNumString}.`, `entity/${item.id}.png`);
}

async function buyItem(
  quantity: number,
  item: Item,
  user: User,
  shop: Shop,
): Promise<AttachedEmbed> {
  const price = quantity * item.value!;
  //Shop has enough items to sell
  if ((await shop.getQuantity(item.id)) < quantity) {
    return commandEmbedEmote(`The shop doesn't have that many.`, 'rinded.png');
  }
  //User has enough currencies to afford
  if ((await user.getQuantity('orange')) < price) {
    return commandEmbedEmote(`You can't afford that.`, 'rinded.png');
  }

  await user.changeQuantity(item.id, quantity);
  await shop.changeQuantity(item.id, -quantity);

  await user.changeQuantity('orange', -price);
  await shop.changeQuantity('orange', price);

  const entityString = quantity > 1 ? item.plural : item.determiner + ' ' + item.name;
  const entityNumString = quantity > 1 ? quantity + ' ' + entityString : entityString;

  return commandEmbed(`You bought ${entityNumString}.`, `entity/${item.id}.png`);
}
