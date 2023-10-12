import { ICommand } from '../../interfaces/ICommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Item } from '../../entity/Item';
import { generateImage } from '../../util/generateImage';
import { ItemsContent, ItemsRow } from '../../types/itemsContent';
import { readFileSync, existsSync } from 'fs';

export const items: ICommand = {
  data: new SlashCommandBuilder().setName('items').setDescription('Show your inventory.'),
  async execute(interaction: ChatInputCommandInteraction) {
    const items = await Item.find();

    const content: ItemsContent = { inventorySlots: [] };

    for (const item of items) {
      if (existsSync(`./src/images/entity/${item.id}.png`)) {
        const itemImage = readFileSync(`./src/images/entity/${item.id}.png`, 'base64');
        const dataURI = 'data:image/png;base64,' + itemImage;

        const row: ItemsRow = { image: dataURI, name: item.name };
        content.inventorySlots.push(row);
      }
    }

    const inventoryImage = await generateImage('./src/templates/items.html', content, 700);

    const attachment = new AttachmentBuilder(inventoryImage, { name: 'inventory.png' });
    const inventoryEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setImage('attachment://inventory.png');

    interaction.reply({ embeds: [inventoryEmbed], files: [attachment] });
  },
};
