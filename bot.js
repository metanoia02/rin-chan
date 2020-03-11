const Discord = require('discord.js');
const SQLite = require('better-sqlite3');

const config = require('./config.json');
const token = require('./token.json');

global.client = new Discord.Client();
const sql = new SQLite('./orange.sqlite');

var catchUser;
var catching = false;
var catchMessage;
var modules = {};

global.client.login(token.login);

global.client.once('ready', () => {
	addModules();

	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'orange';").get();

	if (!table['count(*)']) {
		sql
			.prepare(
				'CREATE TABLE orange (id TEXT PRIMARY KEY, user TEXT, guild TEXT, oranges INTEGER, affection INTEGER, tries INTEGER);'
			)
			.run();

		sql.prepare('CREATE UNIQUE INDEX idx_orange_id ON orange (id);').run();
		sql.pragma('synchronous = 1');
		sql.pragma('journal_mode = wal');
	}

	global.client.getOrange = sql.prepare('SELECT * FROM orange WHERE user = ? AND guild = ?');
	global.client.trawlTable = sql.prepare('SELECT * FROM orange WHERE id = ?');
	global.client.setOrange = sql.prepare(
		'INSERT OR REPLACE INTO orange (id, user, guild, oranges, affection, tries) VALUES (@id, @user, @guild, @oranges, @affection, @tries);'
	);
	global.client.getBoard = sql.prepare('SELECT * FROM orange');

	sql.prepare('UPDATE orange SET tries = 3').run();

	console.log('Ready!');
});

global.client.on('message', message => {
	console.log(message.content);

	if (message.isMentioned(global.client.user) && message.guild) {
		var command = message.content.substring(message.content.search('>') + 2).toLowerCase();

		command = command.replace('?', '');
		command = command.replace('!', '');

		for (var k in modules) {
			if (modules.hasOwnProperty(k)) {
				for (var c in modules[k].config.cmd) {
					for (var v = 0; v < modules[k].config.cmd[c].length; v++) {
						if (modules[k].config.cmd[c][v] === command) {
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
	config.modules.forEach(function(value) {
		modules[value] = require(`./rinchan_modules/${value}/module.js`);

		if (typeof modules[value].init == 'function') {
			modules[value].init();
		}

		console.log(`Added ${value}`);
	});
}

global.client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === 'lounge');

	if (!channel) return;

	channel.send(`Welcome to my server, ${member}`);
	channel.send({
		files: [
			'https://cdn.discordapp.com/attachments/601856655873015831/601856714135830538/53954b9f34fb92120d87dd65ceca7815.gif',
		],
	});
});

global.client.on('guildMemberRemove', member => {});

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

setInterval(function() {
	sql.prepare('UPDATE orange SET tries = 3').run();
}, 14400000);
