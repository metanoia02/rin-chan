const Discord = require('discord.js');
const SQLite = require("better-sqlite3");

const config = require("./config.json");
const token = require("./token.json");

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
        sql.prepare("CREATE TABLE orange (id TEXT PRIMARY KEY, user TEXT, guild TEXT, oranges INTEGER, affection INTEGER, tries INTEGER);").run();

        sql.prepare("CREATE UNIQUE INDEX idx_orange_id ON orange (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }

    global.client.getOrange = sql.prepare("SELECT * FROM orange WHERE user = ? AND guild = ?");
    global.client.trawlTable = sql.prepare("SELECT * FROM orange WHERE id = ?");
    global.client.setOrange = sql.prepare("INSERT OR REPLACE INTO orange (id, user, guild, oranges, affection, tries) VALUES (@id, @user, @guild, @oranges, @affection, @tries);");

    sql.prepare("UPDATE orange SET tries = 3").run();

    console.log('Ready!');
});

global.client.on('message', message => {

    console.log(message.content);

    if (message.isMentioned(global.client.user) && message.guild) {
  
        var command = message.content.substring(message.content.search(">") + 2).toLowerCase()

        for (var k in modules) {
            if (modules.hasOwnProperty(k)) {
            for (var i = 0; i < modules[k].config.cmd.length; i++) {
                    for (var v = 0; v < modules[k].config.cmd[i].length; v++) {
                        if (modules[k].config.cmd[i][v] === command) {
                            modules[k][modules[k].config.function[i]](message);
                            return;
                        }
                    }
                }
            }
        }

        if (message.content.length < 23) {
            message.channel.send('Yes?');
        } else if (checkForEmote(message) && !message.author.bot && hunger > 0) {
            message.channel.send('Who said orange?! Gimme!');
            return;
        } else if (message.content.includes('🍊') && !message.author.bot && hunger > 0) {
            message.channel.send(`That's my orange! Gimme!`);
            return;
        } else {
            message.channel.send('<:rinwha:600747717081432074>');
        }
    }
});

function addModules() {
    console.log("Adding modules...")
    config.modules.forEach(function(value) {
        modules[value] = require(`./rinchan_modules/${value}/module.js`);
        console.log(`Added ${value}`);
    });
};

global.client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.find(ch => ch.name === 'lounge');

    if (!channel) return;

    channel.send(`Welcome to my server, ${member}`);
    channel.send({
        files: ['https://cdn.discordapp.com/attachments/601856655873015831/601856714135830538/53954b9f34fb92120d87dd65ceca7815.gif']
    });
});

global.client.on('guildMemberRemove', member => {

});

function checkForEmote(message) {
    var orangeTotal;

    if (message.content.match(/orange/gi) != null) {
        orangeTotal = message.content.match(/orange/gi).length;
    } else {
        return false;
    }

    var orangeEmotes = 0;
    var colon = false;
    var colonPosition;
    var emote;

    for (var i = 0; i < message.content.length; i++) {
        if (colon == false && message.content.charAt(i) == ':') {
            colon = true;
            colonPosition = i;
        } else if (colon == true && message.content.charAt(i) == ':') {
            emote = message.content.slice(colonPosition, i);

            if (emote.match(/orange/gi) != null && emote.match(/orange/gi).length > 0) {
                orangeEmotes++;
            }

            colon = false;
        }
    }

    return (orangeTotal - orangeEmotes) > 0;
};

function checkAdminCommands(message) {
    if (message.member.roles.find(r => r.name === "Mods")) {
        var i;

        for (i = 0; i < config.adminCmd.length; i++) {
            if (config.adminCmd[i] === message.content.toLowerCase()) {
                return i;
            }
        }
    }

};

setInterval(function() {
    if (modules.orange.hunger < config.maxHunger) {
        modules.orange.hunger++;
    }
}, 57600000);

setInterval(function() {

    sql.prepare("UPDATE orange SET tries = 3").run();

}, 14400000);

