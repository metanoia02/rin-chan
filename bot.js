const Discord = require('discord.js');

const config = require('./config.js');
const token = require('./token.json');

global.client = new Discord.Client();
global.rinchanSQL = require('./sql.js');

let modules = {};

global.client.login(token.login);

global.client.once('ready', () => {
	modules = addModules();

	global.rinchanSQL.init();

	modules.orange.setIcon();

	console.log('Ready!');
});

const me = "687050182508019742";
const memain = "601807905053736991";

global.client.on('message', (message) => {
	console.log(message.content);

	let reg = "^<@"+me+">|^<@!"+me+">";
	rinTest = new RegExp(reg);

	if (message.mentions.has(global.client.user) && message.guild && rinTest.test(message.content)) {
		let command = message.content.replace(/^<@![0-9]*>\s*|^<@[0-9]*>\s*/, '');
		command = command.replace(/\s\s+/g, ' ');

		console.log(command);

		for (let k in config) {
			if (config.hasOwnProperty(k)) {
				for (let c in config[k].cmd) {
					for (let v = 0; v < config[k].cmd[c].length; v++) {
						let cmdRegex = new RegExp(config[k].cmd[c][v], 'i');
						if (cmdRegex.test(command)) {
							modules[k][c](message);
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
		for (let k in modules) {
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

	let modules = {}

	for(let mod in config) {
		modules[mod] = require(`./rinchan_modules/${mod}.js`);
		console.log(`Added ${mod}`);
	}

	return modules;
}

global.client.on('guildMemberAdd', (member) => {
	const channel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');

	if (!channel) return;

	channel.send(`Welcome to my server, ${member.user.username}`, {
		files: [
			'https://cdn.discordapp.com/attachments/601856655873015831/601856714135830538/53954b9f34fb92120d87dd65ceca7815.gif',
		],
	});
});

global.client.on('guildMemberRemove', (member) => {
	const channel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');
	if (!channel) return;

	channel.send(`Cya ${member.user.username}`, {
		files: ['https://cdn.discordapp.com/attachments/601856655873015831/707227730441142342/ezgif-6-719c4a54c38b.gif'],
	});
});

setInterval(function () {
	global.rinchanSQL.setTries.run();
}, 7200000);

global.client.on('exit', (exitCode) => {
	global.rinchanSQL.close();
});
