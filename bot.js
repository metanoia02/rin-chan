const Discord = require('discord.js');
const SQLite = require("better-sqlite3");

const config = require("./config.json");
const token = require("./token.json");
var orangeModule = require("./orange.js");

global.client = new Discord.Client();
const sql = new SQLite('./orange.sqlite');

var hunger = 1;
var catchUser;
var catching = false;
var catchMessage;

global.client.login(token.login);

global.client.once('ready', () => {
    console.log('Ready!');

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
});

global.client.on('message', message => {

    console.log(message.content);

    if (message.isMentioned(global.client.user) && message.guild) {
        if (message.content.length < 23) {
            message.channel.send('Yes?');
        } else {
            var command = message.content.substring(message.content.search(">") + 2).toLowerCase()

            switch (checkAdminCommands(message)) {}

            switch (checkCommands(command)) {
                case 0: //hi
                {
                    sayHi(message);
                    return;
                }
                case 1: //game
                {
                    //guessGame.startPlaying(message);
                    return;
                }
                case 2: //hungry?
                {
                    switch (hunger) {
                        case 0: {
                            message.channel.send("Im stuffed <:rinchill:600745019514814494>");
                            return;
                        }
                        case 1: {
                            message.channel.send("Dont you have one more orange? <:oharin:601107083265441849>");
                            return;
                        }
                        case 2: {
                            message.channel.send("Im starving here! <:rinangrey:620576239224225835>");
                            return;
                        }
                    }
                    return;
                }
                case 3: {
                    orangeModule.harvestOrange(message);
                    return;
                }
                case 4: {
                    orangeModule.feedOrange(message);
                    return;
                }
                case 5: {
                    message.channel.send('<:rincomf:634115522002419744>');
                    return;
                }
                case 6: {
                    message.channel.send("My commands are:\nHi\nHungry?\nlook for oranges\nhave an orange\n<:rinheadpat:650489863312769036>\nhelp");
                    return;
                }

                default: {
                    message.channel.send('<:rinwha:600747717081432074>');
                    return;
                }
            }
        }
    } else if (checkForEmote(message) && !message.author.bot && hunger > 0) {
        message.channel.send('Who said orange?! Gimme!');
        return;
    } else if (message.content.includes('🍊') && !message.author.bot && hunger > 0) {
        message.channel.send(`That's my orange! Gimme!`);
        return;
    }

});

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

function sayHi(message) {
    var d = new Date();
    var n = d.getHours();

    if (n > 6 && n < 12) {
        message.channel.send(`Good morning ${message.author}`);
        return;
    } else if (n >= 12 && n < 18) {
        message.channel.send(`Good afternoon ${message.author}`);
        return;
    } else if (n >= 18 && n < 22) {
        message.channel.send(`Good evening ${message.author}`);
        return;
    } else {
        message.channel.send('Why are you bothering me at this time, I need to sleep!');
        return;
    }
};

function checkForEmote(message) {
    var orangeTotal;

    if (message.content.match(/orange/gi) != null) {
        orangeTotal = message.content.match(/orange/gi).length;
    } else {
        return false;
    }

    var orangeEmotes = 0;

    var i;

    var colon = false;
    var colonPosition;
    var emote;

    for (i = 0; i < message.content.length; i++) {
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

function checkCommands(message) {

    if (message === '<:rinheadpat:650489863312769036>') {
        return 5;
    }

    var i;
    var v;
    for (i = 0; i < config.cmd.length; i++) {
        for (v = 0; v < config.cmd[i].length; v++) {
            if (config.cmd[i][v] === message) {
                return i;
            }
        }
    }
};

function checkAdminCommands(message) {
    if (message.member.roles.find(r => r.name === "Mods")) {
        var i;

        for (i = 0; i < adminCmd.length; i++) {
            if (config.adminCmd[i] === message.content.toLowerCase()) {
                return i;
            }
        }
    }

};

setInterval(function() {
    if (hunger < config.maxHunger) {
        hunger++;
    }

    console.log(hunger);
}, 57600000);

setInterval(function() {

    sql.prepare("UPDATE orange SET tries = 3").run();

}, 14400000);
