client.on('guildMemberRemove', (member) => {
  const channel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');
  if (channel) {
    const attachment = new Discord.MessageAttachment(`./images/leave/leave.gif`, 'leave.gif');
    const leaveEmbed = new Discord.MessageEmbed()
      .setColor('#FFD700')
      .attachFiles(attachment)
      .setImage(`attachment://leave.gif`);

    const removedUser = new User(undefined, member.id, member.guild.id);
    const orangeQuantity = removedUser.getEntityQuantity('orange');

    if (orangeQuantity > 0) {
      const orangeString = orangeQuantity > 1 ? 'those oranges.' : 'that orange.';

      removedUser.changeEntityQuantity('orange', -orangeQuantity);
      new User(undefined, rinChan.getId(), member.guild.id).changeEntityQuantity('orange', orangeQuantity);

      leaveEmbed.setDescription(`Cya ${member.user.username}, I'll be taking ${orangeString}`);
    } else {
      leaveEmbed.setDescription(`Cya ${member.user.username}`);
    }

    channel.send(leaveEmbed);
  }

  const diaryChannel = member.guild.channels.cache.find((ch) => ch.name === config.diaryChannel);
  if (diaryChannel) {
    diaryChannel.send(`${member} left the server.`);
  }
});
