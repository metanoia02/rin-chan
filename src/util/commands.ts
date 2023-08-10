import { EmbedBuilder } from '@discordjs/builders';
import { AttachmentBuilder, Embed, InteractionReplyOptions } from 'discord.js';
import { AttachedEmbed } from '../types/AttachedEmbed';

export function getCooldown(cooldown: number, lastTime: number): string {
  const now = new Date();
  const duration = Math.ceil((lastTime + cooldown - now.getTime()) / 60000);
  return duration + (duration > 1 ? ' minutes.' : ' minute.');
}

export function commandEmbed(reply: string, emote: string): AttachedEmbed {
  const commandAttachment = new AttachmentBuilder(emote, { name: emote });
  const commandEmbed = new EmbedBuilder()
    .setDescription(reply)
    .setThumbnail(`attachment://${emote}`);

  return { files: [commandAttachment], embeds: [commandEmbed] };
}
