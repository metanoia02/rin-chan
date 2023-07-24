import { EmbedBuilder } from '@discordjs/builders';
import { AttachmentBuilder } from 'discord.js';
import { AttachedEmbed } from 'src/types/AttachedEmbed';

export function getCooldown(cooldown: number, lastTime: number): string {
  const now = new Date();
  const duration = Math.ceil((lastTime + cooldown - now.getTime()) / 60000);
  return duration + (duration > 1 ? ' minutes.' : ' minute.');
}

export function commandEmbed(reply: string, emote: string): AttachedEmbed {
  const commandAttachment = new AttachmentBuilder(`./images/emotes/${emote}`, { name: emote });
  const commandEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle('Harvest')
    .setDescription(reply)
    .setThumbnail(`attachment://${emote}`);

  return { attachment: commandAttachment, embed: commandEmbed };
}
