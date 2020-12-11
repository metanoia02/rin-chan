const Discord = require('discord.js');
const rinChan = require('./rinChan/rinChan.js');
const database = require('./utils/sql.js');
const utils = require('./utils/utils.js');
const config = require('./config.js');
const moduleManager = require('./moduleManager.js');
const entityManager = require('./utils/entityManager.js');
const User = require('./utils/User.js');
const client = new Discord.Client();
const tokens = require('./tokens');

client.login(tokens.token);

client.once('ready', () => {
  //get roles
  config.levels.forEach((level) => {
    level.role = client.guilds.cache.first().roles.cache.find((role) => role.name == level.name).id;
  });

  database.init();
  entityManager.init();
  moduleManager.init().then(() => {
    rinChan.init('./rinChan/rinChan.json', client);
    rinChan.setId(client.user.id);
    client.user.setActivity('with Len', {type: 'PLAYING'});
    client.guilds.cache.first().members.cache.get(client.user.id).setNickname('Rin-chan');

    utils.updateBoosts(client.guilds.cache.first());

    console.log('Ready!');
  });
});

client.on('guildMemberUpdate', function(oldMember, newMember) {
  const user = new User(undefined, newMember.id, newMember.guild.id);
  user.setIsBooster(newMember.premiumSince !== null ? 1 : 0);
});

client.on('message', async (message) => {
  const reg = '^<@' + rinChan.getId() + '>|^<@!' + rinChan.getId() + '>';
  const rinTest = new RegExp(reg);

  if (!message.author.bot) {
    if (utils.mentionSpamDetect(message)) {
      return null;
    }

    if (message.mentions.has(client.user) && message.guild && rinTest.test(message.content)) {
      if (message.content.length < 23 && !rinChan.getCollecting()) {
        message.channel.send('Yes?');
      } else if (message.content.length > 23) {
        if (!(await moduleManager.runCommand(message))) {
          message.channel.send('<:rinwha:787036890606993438>');
        }
      }
    } else if (!rinChan.getCollecting()) {
      const trigger = config.triggerWords.find((element) => element.test(message.content, rinChan));
      if (trigger) message.channel.send(trigger.response);
    }
  }
});

client.on('guildMemberAdd', (member) => {
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

  const diaryChannel = member.guild.channels.cache.find((ch) => ch.name === config.diaryChannel);
  if (diaryChannel) {
    diaryChannel.send(`${member} joined the server.`);
  }
});

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
