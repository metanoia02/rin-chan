import { AttachmentBuilder, Client, EmbedBuilder, Events, TextBasedChannel } from 'discord.js';
import { Server } from '../entity/Server';
import { RinChan } from '../entity/RinChan';
import { User } from '../entity/User';

export default (client: Client): void => {
  client.on(Events.GuildMemberAdd, async (member) => {
    const server = await Server.get(member.guild.id);
    const discordServer = await client.guilds.fetch(server.id);

    if (server.loungeChannel) {
      const loungeChannel = await discordServer.channels.fetch(server.loungeChannel);

      if (loungeChannel?.isTextBased) {
        const attachment = new AttachmentBuilder(`./src/images/welcome/welcome.gif`, {
          name: 'welcome.gif',
        });

        const embed = new EmbedBuilder()
          .setColor('#FFD700')
          .setTitle(`Welcome to my server!`)
          .setImage(`attachment://welcome.gif`);

        //have an orange if rinchan owns oranges
        const rinChan = await RinChan.get(member.guild.id);
        const rinChanUser = await User.get(rinChan.id, rinChan.guildId);

        if ((await rinChanUser.getQuantity('orange')) > 0) {
          embed.setDescription(`Have an orange!`);

          await rinChanUser.takeItem('orange');
          const user = await User.get(member.id, member.guild.id);
          await user.giveItem('orange');
        }

        (loungeChannel as TextBasedChannel).send({
          embeds: [embed],
          files: [attachment],
          content: `<@${member.id}>`,
        });
      }
    }
  });
};
