import { Client } from 'discord.js';
const token = require('../tokens.json');
import { AppDataSource } from '../data-source';

export default (client: Client): void => {
  client.on('ready', async () => {
    if (!client.user || !client.application) {
      return;
    }

    try {
      await AppDataSource.initialize();

      //rinChan.init("./rinChan/rinChan.json", client);
      //rinChan.setId(client.user.id);
      //client.user.setActivity("with Len", { type: "PLAYING" });
      //client.guilds.cache.first().members.cache.get(client.user.id).setNickname("Rin-chan");
    } catch (error) {
      console.log(error);
    }

    console.log(`${client.user.username} is online`);
  });
};
