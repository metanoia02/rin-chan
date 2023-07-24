import { AttachmentBuilder, EmbedBuilder } from 'discord.js';

export type AttachedEmbed = {
  embed: EmbedBuilder;
  attachment: AttachmentBuilder;
};
