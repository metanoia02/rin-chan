const Discord = require('discord.js');
const rinChan = require('./rinChan/rinChan.js');
const database = require('./utils/sql.js');
const utils = require('./utils/utils.js');
const config = require('./config.js');
const moduleManager = require('./moduleManager.js');
const objectManager = require('./utils/objectManager.js');
const User = require('./utils/User.js');
const client = new Discord.Client();

client.login(config.token);

client.once('ready', () => {
  database.init();
  objectManager.init();
  moduleManager.init().then(() => {
    rinChan.init('./rinChan/rinChan.json', client);
    rinChan.setId(client.user.id);
    client.user.setActivity('Miku', {type: 'LISTENING'});
    client.guilds.cache.first().members.cache.get(client.user.id).setNickname('Rin-chan');

    utils.updateBoosts(client.guilds.cache.first());

    console.log('Ready!');
  });
});

client.on('guildMemberUpdate', function (oldMember, newMember) {
  const user = new User(undefined, newMember.id, newMember.guild.id);
  user.setIsBooster(newMember.premiumSince !== null ? 1 : 0);
});

client.on('message', async (message) => {
  if (utils.mentionSpamDetect(message)) {
    return null;
  }

  const reg = '^<@' + rinChan.getId() + '>|^<@!' + rinChan.getId() + '>';
  const rinTest = new RegExp(reg);

  if (!message.author.bot) {
    if (message.mentions.has(client.user) && message.guild && rinTest.test(message.content)) {
      if (message.content.length < 23 && !rinChan.getCollecting()) {
        message.channel.send('Yes?');
      } else if (message.content.length > 23) {
        if (!(await moduleManager.runCommand(message))) {
          message.channel.send('<:rinwha:600747717081432074>');
        } else {
          await new User(message).addXp(1, message);
        }
      }
    } else if (!rinChan.getCollecting()) {
      const trigger = config.triggerWords.find((element) => element.test(message.content));
      if (trigger) message.channel.send(trigger.response);
    }
  }
});

client.on('guildMemberAdd', (member) => {
  const channel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');

  if (!channel) return;

  const attachment = new Discord.MessageAttachment(`./images/welcome/welcome.gif`, 'welcome.gif');

  channel.send(
    new Discord.MessageEmbed()
      .setColor('#FFD700')
      .setTitle(`Welcome to my server,`)
      .setDescription(`${member}`)
      .attachFiles(attachment)
      .setImage(`attachment://welcome.gif`)
  );
});

client.on('guildMemberRemove', (member) => {
  const channel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');
  if (!channel) return;

  const attachment = new Discord.MessageAttachment(`./images/leave/leave.gif`, 'leave.gif');
  const leaveEmbed = new Discord.MessageEmbed()
    .setColor('#FFD700')
    .attachFiles(attachment)
    .setImage(`attachment://leave.gif`);

  const removedUser = new User(undefined, member.id, member.guild.id);
  const orangeQuantity = removedUser.getObjectQuantity('orange');

  if (orangeQuantity > 0) {
    const orangeString = orangeQuantity > 1 ? 'those oranges.' : 'that orange.';

    removedUser.changeObjectQuantity('orange', -orangeQuantity);
    new User(undefined, rinChan.getId(), member.guild.id).changeObjectQuantity('orange', orangeQuantity);

    leaveEmbed.setDescription(`Cya ${member}, I'll be taking ${orangeString}`);
  } else {
    leaveEmbed.setDescription(`Cya ${member}`);
  }

  channel.send(leaveEmbed);
});
