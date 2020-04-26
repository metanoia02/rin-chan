const Discord = require('discord.js');

const config = require('./config.json');
const token = require('./token.json');

global.client = new Discord.Client();
global.rinchanSQL = require('./sql.js');

var catchUser;
var catching = false;
var catchMessage;
var modules = {};

global.client.login(token.login);

global.client.once('ready', () => {
	addModules();

	global.rinchanSQL.init();

	modules.orange.setIcon();

	console.log('Ready!');
});

global.client.on('message', (message) => {
	console.log(message.content);

	rinTest = new RegExp(/^<@601807905053736991>|^<@!601807905053736991>/);

	if (message.mentions.has(global.client.user) && message.guild && rinTest.test(message.content)) {
		var command = message.content.replace(/^<@![0-9]*>\s*|^<@[0-9]*>\s*/, '');
		command = command.replace(/\s\s+/g, ' ');

		console.log(command);

		for (var k in modules) {
			if (modules.hasOwnProperty(k)) {
				for (var c in modules[k].config.cmd) {
					for (var v = 0; v < modules[k].config.cmd[c].length; v++) {
						let cmdRegex = new RegExp(modules[k].config.cmd[c][v], 'i');
						if (cmdRegex.test(command)) {
							modules[k][c](message, command);
							return;
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
		for (var k in modules) {
			if (modules.hasOwnProperty(k)) {
				if (typeof modules[k].handler == 'function') {
					if (modules[k].handler(message)) {
						return;
					}
				}
			}
		}
	}
});

function addModules() {
	console.log('Adding modules...');
	config.modules.forEach(function (value) {
		modules[value] = require(`./rinchan_modules/${value}/module.js`);

		if (typeof modules[value].init == 'function') {
			modules[value].init();
		}

		console.log(`Added ${value}`);
	});
}

global.client.on('guildMemberAdd', (member) => {
	const channel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');

	if (!channel) return;

	channel.send(`Welcome to my server, ${member}`, {
		files: [
			'https://cdn.discordapp.com/attachments/601856655873015831/601856714135830538/53954b9f34fb92120d87dd65ceca7815.gif',
		],
	});
});

global.client.on('guildMemberRemove', (member) => {});

/*
function checkAdminCommands(message) {
    if (message.member.roles.find(r => r.name === "Mods")) {
        var i;

        for (i = 0; i < config.adminCmd.length; i++) {
            if (config.adminCmd[i] === message.content.toLowerCase()) {
                return i;
            }
        }
    }

};*/

setInterval(function () {
	global.rinchanSQL.setTries.run();
}, 14400000);

global.client.on('exit', (exitCode) => {
	global.rinchanSQL.close();
});
