import { AttachmentBuilder, Client, EmbedBuilder, Events, TextBasedChannel } from 'discord.js';
import { RinChan } from 'src/entity/RinChan';
import { Server } from 'src/entity/Server';
import { User } from 'src/entity/User';

export default (client: Client): void => {
  client.on('guildMemberRemove', async (member) => {
    const server = await Server.get(member.guild.id);
    const discordServer = await client.guilds.fetch(server.id);
    if (server.loungeChannel) {
      const loungeChannel = await discordServer.channels.fetch(server.loungeChannel);

      if (loungeChannel?.isTextBased) {
        const attachment = new AttachmentBuilder(`./images/leave/leave.gif`, {
          name: 'leave.gif',
        });
        const embed = new EmbedBuilder().setColor('#FFD700').setImage(`attachment://leave.gif`);

        const removedUser = await User.get(member.id, member.guild.id);
        const orangeQuantity = await removedUser.getQuantity('orange');

        if (orangeQuantity > 0) {
          const orangeString = orangeQuantity > 1 ? 'those oranges.' : 'that orange.';

          removedUser.changeQuantity('orange', -orangeQuantity);

          const rinChan = await RinChan.get(member.guild.id);
          const rinChanUser = await User.get(rinChan.id, member.guild.id);

          await rinChanUser.changeQuantity('orange', orangeQuantity);

          embed.setDescription(`Cya ${member.user.username}, I'll be taking ${orangeString}`);
        } else {
          embed.setDescription(`Cya ${member.user.username}`);
        }

        (loungeChannel as TextBasedChannel).send({ embeds: [embed], files: [attachment] });
      }
    }

    if (server.diaryChannel) {
      const diaryChannel = await discordServer.channels.fetch(server.diaryChannel);
      if (diaryChannel?.isTextBased) {
        (diaryChannel as TextBasedChannel).send(`${member} left the server.`);
      }
    }
  });
};
