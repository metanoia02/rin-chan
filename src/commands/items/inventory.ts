const Discord = require('discord.js');
const fs = require('fs');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');

import { ICommand } from '../../interfaces/ICommand';

import { SlashCommandBuilder } from '@discordjs/builders';
import { AttachmentBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { InventoryStack } from '../../entity/InventoryStack';
import { User } from '../../entity/User';

async function generateImage(templateFile: string, content: object) {
  //compile template
  const htmlFile = fs.readFileSync(templateFile, 'utf8');
  const template = handlebars.compile(htmlFile);
  const result = template(content);

  //make screenshot
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 400,
    height: 700,
  });
  await page.setContent(result);
  const image = await page.screenshot();

  await browser.close();

  return image;
}

export const inventory: ICommand = {
  data: new SlashCommandBuilder().setName('inventory').setDescription('Show your inventory.'),
  async execute(interaction: ChatInputCommandInteraction) {
    const user = await User.getUser(interaction.user.id, interaction.guildId!);

    const content: any = {};

    const inventoryCallback = (acc: any, ele: InventoryStack) => {
      if (ele.quantity > 0) {
        const itemImage = fs.readFileSync(`./src/images/entity/${ele.item.name}.png`, 'base64');
        const dataURI = 'data:image/png;base64,' + itemImage;

        content[ele.item.id] = dataURI;

        const item: any = { image: dataURI };
        item.quantity = ele.quantity;

        acc.push(item);
      }
      return acc;
    };

    if (user.inventory) {
      content.inventorySlots = user.inventory.reduce(inventoryCallback, []);
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
