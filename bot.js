const Discord = require('discord.js');
const RinChan = require('./rinchan/rinchan.js');
global.rinchanSQL = require('./sql.js');

const config = require('./config.js');
const token = require('./token.json');

const client = new Discord.Client();

let modules = {};

client.login(token.login);

client.once('ready', () => {
	modules = addModules();
	global.rinchanSQL.init();

	RinChan.init('./rinchan/rinchan.json', client);
	RinChan.setId(client.user.id);

	client.user.setActivity('Miku', { type: 'LISTENING' });

	console.log('Ready!');
});

global.getUserIdArr = function (command) {
	let userIdRegex = new RegExp(/<!*@!*([0-9]+)>/, 'g');

	let result = [...command.matchAll(userIdRegex)];

	return result.map((ele) => {
		return ele[1];
	});
};

global.escapeMarkdown = function (string) {
	let markdownRegex = new RegExp('([*|_~`>])', 'g');
	return string.replace(markdownRegex, '\\$1');
};

global.validateUser = function (userId) {
	//check if user exists, check if self, check if bot, check if rinchan
	return true;
};

client.on('message', (message) => {
	console.log(message.author.username + ': ' + message.content);

	if (mentionSpamDetect(message)) {
		return null;
	}

	let reg = '^<@' + RinChan.getId() + '>|^<@!' + RinChan.getId() + '>';
	rinTest = new RegExp(reg);

	if (message.mentions.has(client.user) && message.guild && rinTest.test(message.content)) {
		let command = message.content.replace(/^<@![0-9]*>\s*|^<@[0-9]*>\s*/, '');
		command = command.replace(/\s\s+/g, ' ');

		for (let k in config) {
			if (config.hasOwnProperty(k)) {
				for (let c in config[k].cmd) {
					for (let v = 0; v < config[k].cmd[c].length; v++) {
						let cmdRegex = new RegExp(config[k].cmd[c][v], 'i');
						if (cmdRegex.test(command)) {
							modules[k][c](message, command, cmdRegex, RinChan);
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
					if (modules[k].handler(message, RinChan)) {
						return;
					}
				}
			}
		}
	}
});

function addModules() {
	console.log('Adding modules...');

	let modules = {};

	for (let mod in config) {
		modules[mod] = require(`./command/${mod}.js`);
		console.log(`Added ${mod}`);

		if (typeof modules[mod].init == 'function') {
			if (modules[mod].init()) {
				return;
			}
		}
	}

	return modules;
}

function mentionSpamDetect(message) {
	if (global.getUserIdArr(message.content).length > 10) {
		message.member.roles.remove('588677338007601163');
		message.member.roles.add('620609193228894208');
		message.author.send('Go spam somewhere else!', {
			files: [
				'https://cdn.discordapp.com/attachments/601814319990046738/713124422881640579/bbf22a157ab6fabc0a7510b4ce0ad59e.jpg',
			],
		});
		message.delete();

		const channel = message.guild.channels.cache.find((ch) => ch.name === 'rinchans-diary');
		if (!channel) return true;

		channel.send(`<@&588521716481785859> Muted ${message.author} for mention spam.`);

		return true;
	}
	return false;
}

client.on('guildMemberAdd', (member) => {
	const channel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');

	if (!channel) return;

	channel.send(`Welcome to my server, ${member.user.username}`, {
		files: [
			'https://cdn.discordapp.com/attachments/601856655873015831/601856714135830538/53954b9f34fb92120d87dd65ceca7815.gif',
		],
	});
});

client.on('guildMemberRemove', (member) => {
	const channel = member.guild.channels.cache.find((ch) => ch.name === 'lounge');
	if (!channel) return;

	channel.send(`Cya ${member.user.username}`, {
		files: ['https://cdn.discordapp.com/attachments/601856655873015831/707227730441142342/ezgif-6-719c4a54c38b.gif'],
	});
});

client.on('exit', (exitCode) => {
	global.rinchanSQL.close();

	const channel = client.guild.channels.cache.find((ch) => ch.name === 'bot-spam');

	if (!channel) return;

	channel.send(`I'll be right back!`);
});
