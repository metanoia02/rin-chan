import { Client, Events, Interaction } from "discord.js";

export default (client: Client): void => {
  client.on(Events.GuildMemberAdd, (member) => {
    const loungeChannel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');
  
    if (loungeChannel) {
      const attachment = new Discord.MessageAttachment(`./images/welcome/welcome.gif`, 'welcome.gif');
  
      loungeChannel.send(
        new Discord.MessageEmbed()
          .setColor('#FFD700')
          .setTitle(`Welcome to my server,`)
          .setDescription(`${member.user.username}`)
          .attachFiles(attachment)
          .setImage(`attachment://welcome.gif`)
      );
    }
};
