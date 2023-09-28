import { AttachmentBuilder, Client, EmbedBuilder, Events, TextBasedChannel } from 'discord.js';
import { Server } from 'src/entity/Server';

export default (client: Client): void => {
  client.on(Events.GuildMemberAdd, async (member) => {
    const server = await Server.get(member.guild.id);
    const discordServer = await client.guilds.fetch(server.id);
    if (server.loungeChannel) {
      const loungeChannel = await discordServer.channels.fetch(server.loungeChannel);

      if (loungeChannel?.isTextBased) {
        const attachment = new AttachmentBuilder(`./images/welcome/welcome.gif`, {
          name: 'welcome.gif',
        });

        const embed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle(`Welcome to my server,`)
          .setDescription(`${member.user.username}`)
          .setImage(`attachment://welcome.gif`);

        (loungeChannel as TextBasedChannel).send({ embeds: [embed], files: [attachment] });
      }
    }
  });
};
