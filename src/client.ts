import { Client, GatewayIntentBits } from 'discord.js';

/**
 * Guilds, GuildMessages, MessageContent required to scan messages.
 * GuildMembers required to welcome members.
 */
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
