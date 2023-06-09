client.on('guildMemberUpdate', function(oldMember, newMember) {
  const user = new User(undefined, newMember.id, newMember.guild.id);
  user.setIsBooster(newMember.premiumSince !== null ? 1 : 0);
});