import { AttachmentBuilder, EmbedBuilder } from 'discord.js';

export type AttachedEmbed = {
  embeds: EmbedBuilder[];
  files: AttachmentBuilder[];
  content?: string;
};
