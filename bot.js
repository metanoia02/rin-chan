const Discord = require('discord.js');
const rinChan = require('./rinChan/rinChan.js');
const database = require('./utils/sql.js');
const utils = require('./utils/utils.js');

const config = require('./config.js');
const token = require('./token.json');

const client = new Discord.Client();

let modules = {};

client.login(token.login);

client.once('ready', () => {
  database.init();
  modules = addModules();

  rinChan.init('./rinChan/rinChan.json', client);
  rinChan.setId(client.user.id);
  updateBoosts(client.guilds.cache.first());

  client.user.setActivity('GUMI', {type: 'LISTENING'});

  console.log('Ready!');
});

/*
event listener
const triggerWords = ['orange'];
const filter some=>etc
*/

client.on('guildMemberUpdate', function(oldMember, newMember) {
  const user = database.getUser(newMember.id, newMember.guild.id);
  user.isBooster = newMember.premiumSince !== null ? 1 : 0;
  database.setUser.run(user);
});

/**
 * Update database with boosters
 * @param {Discord.guild} guild
 */
function updateBoosts(guild) {
  const members = guild.members.cache.filter((user) => user.premiumSince !== null);

  members.reduce((acc, element) => {
    const user = database.getUser(element.id, guild.id);
    user.isBooster = 1;
    database.setUser.run(user);
  }, '');
}

client.on('message', (message) => {
  if (utils.mentionSpamDetect(message)) {
    return null;
  }

  const reg = '^<@' + rinChan.getId() + '>|^<@!' + rinChan.getId() + '>';
  const rinTest = new RegExp(reg);

  if (message.mentions.has(client.user) && message.guild && rinTest.test(message.content)) {
    let command = message.content.replace(/^<@![0-9]*>\s*|^<@[0-9]*>\s*/, '');
    command = command.replace(/\s\s+/g, ' ');

    for (const k in config) {
      if (config.hasOwnProperty(k)) {
        for (const c in config[k].cmd) {
          if (config[k].cmd.hasOwnProperty(c)) {
            for (let v = 0; v < config[k].cmd[c].length; v++) {
              const cmdRegex = new RegExp(utils.convertCommand(config[k].cmd[c][v], true), 'i');
              if (cmdRegex.test(command)) {
                modules[k][c](message, command, cmdRegex);
                return;
              }
            }
          }
        }
      }
    }

    if (message.content.length < 23) {
      message.channel.send('Yes?');
      return;
    } else {
      message.channel.send('<:rinwha:600747717081432074>');
      return;
    }
  } else {
    for (const k in modules) {
      if (modules.hasOwnProperty(k)) {
        if (typeof modules[k].handler == 'function' && rinChan.getCollecting() === false) {
          if (modules[k].handler(message, rinChan)) {
            return;
          }
        }
      }
    }
  }
});

/**
 * @return {object} Modules from command folder
 */
function addModules() {
  console.log('Adding modules...');

  const modules = {};

  for (const mod in config) {
    if (config.hasOwnProperty(mod)) {
      modules[mod] = require(`./command/${mod}.js`);
      console.log(`Added ${mod}`);

      if (typeof modules[mod].init == 'function') {
        if (modules[mod].init()) {
          return;
        }
      }
    }
  }
  return modules;
}

client.on('guildMemberAdd', (member) => {
  const channel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');

  if (!channel) return;

  channel.send(`Welcome to my server, ${member.user.username}`, {
    files: ['./images/welcome/welcome.gif'],
  });
});

client.on('guildMemberRemove', (member) => {
  const channel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');
  if (!channel) return;

  channel.send(`Cya ${member.user.username}`, {files: ['./images/leave/leave.gif']});
});

client.on('exit', (exitCode) => {
  database.close();

  const channel = client.guild.channels.cache.find((ch) => ch.name === 'bot-spam');

  if (!channel) return;

  channel.send(`I'll be right back!`);
});
