const Discord = require('discord.js');
const fs = require('fs');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

import { ICommand } from '../../interfaces/ICommand';

import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { User } from '../../entity/User';
import { generateImage } from '../../util/generateImage';
import { InventoryContent, InventoryRow } from '../../types/InventoryContent';

export const inventory: ICommand = {
  data: new SlashCommandBuilder().setName('inventory').setDescription('Show your inventory.'),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.get(interaction.user.id, interaction.guildId!);

    const content: InventoryContent = { inventorySlots: [] };

    for (const inventoryItem of user.inventory) {
      if (inventoryItem.quantity > 0) {
        const itemImage = fs.readFileSync(
          `./src/images/entity/${inventoryItem.item.id}.png`,
          'base64',
        );
        const dataURI = 'data:image/png;base64,' + itemImage;

        const item: InventoryRow = { image: dataURI, quantity: inventoryItem.quantity };
        content.inventorySlots.push(item);
      }
    }

    const inventoryImage = await generateImage('./src/templates/inventory.html', content);

    const attachment = new AttachmentBuilder(inventoryImage, { name: 'inventory.png' });
    const inventoryEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(`Inventory`)
      .setImage('attachment://inventory.png');

    interaction.reply({ embeds: [inventoryEmbed], files: [attachment] });
  },
};
