import { User } from 'src/entity/User';
import { AttachedEmbed } from 'src/types/AttachedEmbed';
import { InventoryContent, InventoryRow } from 'src/types/InventoryContent';
import { generateImage } from './generateImage';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import { readFileSync } from 'fs';
import { InventoryStack } from 'src/entity/InventoryStack';

export async function getInventory(
  filter: (arg: InventoryStack) => boolean,
  user: User,
): Promise<AttachedEmbed> {
  const content: InventoryContent = { inventorySlots: [] };

  for (const inventoryItem of user.inventory) {
    if (filter(inventoryItem)) {
      const itemImage = readFileSync(`./src/images/entity/${inventoryItem.item.id}.png`, 'base64');
      const dataURI = 'data:image/png;base64,' + itemImage;

      const item: InventoryRow = { image: dataURI, quantity: inventoryItem.quantity };
      content.inventorySlots.push(item);
    }
  }

  const inventoryImage = await generateImage('./src/templates/inventory.html', content, 700);

  const attachment = new AttachmentBuilder(inventoryImage, { name: 'inventory.png' });
  const inventoryEmbed = new EmbedBuilder()
    .setColor('#0099ff')
    .setImage('attachment://inventory.png');

  return { embeds: [inventoryEmbed], files: [attachment] };
}
