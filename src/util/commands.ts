import { EmbedBuilder } from '@discordjs/builders';
import { AttachmentBuilder, Embed, InteractionReplyOptions } from 'discord.js';
import { AttachedEmbed } from '../types/AttachedEmbed';

/**
 * Calculate a cooldown for timed actions.
 * @param cooldown The cooldown time in ms.
 * @param lastTime Time in ms of last occurence.
 * @returns A string of the cooldown time in minutes.
 */
export function getCooldown(cooldown: number, lastTime: number): string {
  const now = new Date();
  const duration = Math.ceil((lastTime + cooldown - now.getTime()) / 60000);
  return duration + (duration > 1 ? ' minutes.' : ' minute.');
}

/**
 * Make a basic embedded response with an emote thumbnail.
 * To be used when a reaction is not necessary.
 * @param reply Embed description text.
 * @param emote Emote filename in emotes folder.
 * @returns {AttachedEmbed} Embed object.
 */
export function commandEmbed(reply: string, emote: string): AttachedEmbed {
  const commandAttachment = new AttachmentBuilder(`./src/images/emotes/${emote}`, { name: emote });
  const commandEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setDescription(reply)
    .setThumbnail(`attachment://${emote}`);

  return { files: [commandAttachment], embeds: [commandEmbed] };
}

/**
 * Capitalize the first letter of a string
 * @param {string} string
 * @return {string}
 */
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
