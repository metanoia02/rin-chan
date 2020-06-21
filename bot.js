const Discord = require('discord.js');
const RinChan = require('./rinchan/rinchan.js');
global.rinchanSQL = require('./sql.js');

const config = require('./config.js');
const token = require('./token.json');

const client = new Discord.Client();

let modules = {};

client.login(token.login);

client.once('ready', () => {
	rinchanSQL.init();
	modules = addModules();

	RinChan.init('./rinchan/rinchan.json', client);
	RinChan.setId(client.user.id);
	updateBoosts(client.guilds.cache.first());

	client.user.setActivity('GUMI', { type: 'LISTENING' });

	console.log('Ready!');
});

global.commandException = function (message, emote = 'rinyabai.png') {
	this.message = message;
	this.emote = emote;
};

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

global.validateSingleUserAction = function (message) {
	//check if user exists, check if self, check if bot, check if rinchan
	let usersArray = getUserIdArr(message.content);

	if (usersArray.length === 1) {
		throw new commandException('You need to mention a user', 'rinwha.png');
	} else if (!message.guild.member(usersArray[1])) {
		throw new commandException('They arent in the server', 'rinconfuse.png');
	} else if (usersArray.length !== 2) {
		throw new commandException('Mention only one user', 'rinwha.png');
	}

	return true;
};

global.getCooldown = function (cooldown, lastTime) {
	let now = new Date();
	let duration = Math.floor((lastTime + cooldown - now.getTime()) / 3600000) + ' hours';
	if (duration === '0 hours') {
		duration = Math.round((lastTime + cooldown - now.getTime()) / 60000) + ' minutes';
	}
	let regex = new RegExp(/^1\s/);
	if (regex.test(duration)) {
		duration = duration.substr(0, duration.length - 1);
	}

	return duration;
};

global.arrayRandom = function (array) {
	return array[Math.floor(Math.random() * array.length)];
};

global.convertCommand = function (commandArr, regex) {
	if (typeof commandArr === 'string') {
		return commandArr;
	} else {
		return commandArr.reduce((acc, ele) => {
			if (typeof ele === 'string') {
				return (acc += ele);
			} else {
				if (regex === true) {
					return (acc += ele.regex);
				} else {
					return (acc += ele.string);
				}
			}
		}, '');
	}
};

function mentionSpamDetect(message) {
	if (getUserIdArr(message.content).length > 10) {
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

client.on('messageDelete', function (message) {
	const channel = message.guild.channels.cache.find((ch) => ch.name === 'rinchans-diary');
	if (!channel) return true;
	channel.send(`Message by ${message.author} deleted.\n${message}`);
});

client.on('guildMemberUpdate', function (oldMember, newMember) {
	let user = rinchanSQL.getUser(newMember.id, newMember.guild.id);
	user.isBooster = newMember.premiumSince !== null ? 1 : 0;
	rinchanSQL.setUser.run(user);
});

function updateBoosts(guild) {
	let members = guild.members.cache.filter((user) => user.premiumSince !== null);

	members.reduce((acc, element) => {
		let user = rinchanSQL.getUser(element.id, guild.id);
		user.isBooster = 1;
		rinchanSQL.setUser.run(user);
	}, '');
}

client.on('message', (message) => {
	console.log(message.author.username + ': ' + message.content);

	if (mentionSpamDetect(message)) {
		return null;
	}

	const reg = '^<@' + RinChan.getId() + '>|^<@!' + RinChan.getId() + '>';
	let rinTest = new RegExp(reg);

	if (message.mentions.has(client.user) && message.guild && rinTest.test(message.content)) {
		let command = message.content.replace(/^<@![0-9]*>\s*|^<@[0-9]*>\s*/, '');
		command = command.replace(/\s\s+/g, ' ');

		for (let k in config) {
			if (config.hasOwnProperty(k)) {
				for (let c in config[k].cmd) {
					for (let v = 0; v < config[k].cmd[c].length; v++) {
						let cmdRegex = new RegExp(convertCommand(config[k].cmd[c][v], true), 'i');
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
	rinchanSQL.close();

	const channel = client.guild.channels.cache.find((ch) => ch.name === 'bot-spam');

	if (!channel) return;

	channel.send(`I'll be right back!`);
});
