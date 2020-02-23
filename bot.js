const Discord = require('discord.js');
const client = new Discord.Client();

const SQLite = require("better-sqlite3");
const sql = new SQLite('./orange.sqlite');

var guessGame = require('./guess.js');

var maxHunger = 2;

const cmd = [
	[ "hi", "hello", "morning", "afternoon", "evening", "night" , "good morning", "good evening", "good night"],
	[ "lets play a game", "let's play a game", "play a game", "lets play", "let's play" ],
	[ "are you hungry?", "hungry?" ],
	[ "harvest oranges", "harvest" , "look for oranges", "find orange", "find oranges", "look for orange", "find an orange" ],
	[ "have an orange", "give orange"],
	[ "<:rinheadpat:650489863312769036>"],
	[ "help", "commands" ]
];

const adminCmd = [ "" ];

const config = require("./config.json");

var hunger = 1;
var catchUser;
var catching = false;
var catchMessage;

client.login(config.token);

client.once('ready', () => {
	console.log('Ready!');

	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'orange';").get();
	  
	if (!table['count(*)']) 
	{
		sql.prepare("CREATE TABLE orange (id TEXT PRIMARY KEY, user TEXT, guild TEXT, oranges INTEGER, affection INTEGER, tries INTEGER);").run();

		sql.prepare("CREATE UNIQUE INDEX idx_orange_id ON orange (id);").run();
		sql.pragma("synchronous = 1");
		sql.pragma("journal_mode = wal");
	}

	client.getOrange = sql.prepare("SELECT * FROM orange WHERE user = ? AND guild = ?");
	client.trawlTable = sql.prepare("SELECT * FROM orange WHERE id = ?");
  	client.setOrange = sql.prepare("INSERT OR REPLACE INTO orange (id, user, guild, oranges, affection, tries) VALUES (@id, @user, @guild, @oranges, @affection, @tries);");

	sql.prepare("UPDATE orange SET tries = 3").run();
});


client.on('message', message => {

	console.log(message.content);

	if(message.isMentioned(client.user) && message.guild)
	{
		if(message.content.length < 23)
		{
			message.channel.send('Yes?');
		}
		else
		{
			var command = message.content.substring(message.content.search(">")+2).toLowerCase()	
			
			switch (checkAdminCommands(message))
			{
			}

			switch (checkCommands(command))
			{
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
					switch (hunger)
					{
						case 0:
							{
								message.channel.send("Im stuffed <:rinchill:600745019514814494>");		
								return;						
							}
						case 1:
							{
								message.channel.send("Dont you have one more orange? <:oharin:601107083265441849>");
								return;
							}
						case 2:
							{
								message.channel.send("Im starving here! <:rinangrey:620576239224225835>");
								return;
							}
					}
					return;
				}
				case 3:
				{
					harvestOrange(message);
return;
				}
				case 4:
				{
					feedOrange(message);
return;
				}
				case 5:
				{	
					message.channel.send('<:rincomf:634115522002419744>');
					return;
				}
				case 6:
					{
						message.channel.send("My commands are:\nHi\nHungry?\nlook for oranges\nhave an orange\n<:rinheadpat:650489863312769036>\nhelp");
						return;
					}

				default:
					{
						message.channel.send('<:rinwha:600747717081432074>');
						return;
					}
			}
		}
	}
	else if (checkForEmote(message) && !message.author.bot && hunger > 0) 
	{
		message.channel.send('Who said orange?! Gimme!');
		return;
	}
	else if (message.content.includes('🍊') && !message.author.bot && hunger > 0) 
	{
		message.channel.send(`That's my orange! Gimme!`);
		return;
	}

});

client.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === 'lounge');

	if (!channel) return;

	channel.send(`Welcome to my server, ${member}`);
	channel.send({files:['https://cdn.discordapp.com/attachments/601856655873015831/601856714135830538/53954b9f34fb92120d87dd65ceca7815.gif']});
});

client.on('guildMemberRemove', member => {

});

function sayHi(message)
{
	var d = new Date();
	var n = d.getHours();

	if(n>6 && n<12)
	{
		message.channel.send(`Good morning ${message.author}`);
		return;
	}
	else if(n>=12 && n<18)
	{
		message.channel.send(`Good afternoon ${message.author}`);
		return;
	}
	else if(n>= 18 && n<22)
	{
		message.channel.send(`Good evening ${message.author}`);
		return;
	}
	else
	{
		message.channel.send('Why are you bothering me at this time, I need to sleep!');
		return;
	} 
};

function checkForEmote(message)
{
	var orangeTotal;

	if(message.content.match(/orange/gi) != null)
	{
		orangeTotal = message.content.match(/orange/gi).length;
	}
	else
	{
		return false;	
	}

	var orangeEmotes = 0;

	var i;

	var colon = false;
	var colonPosition;
	var emote;

	for (i = 0; i < message.content.length; i++)
	{
		if(colon == false && message.content.charAt(i) == ':')
		{
			colon = true;
			colonPosition = i;
		}
		else if(colon == true && message.content.charAt(i) == ':')
		{
			emote = message.content.slice(colonPosition, i);

			if(emote.match(/orange/gi) != null && emote.match(/orange/gi).length > 0)
			{
				orangeEmotes++;
			}

			colon = false;
		}
	}

	if((orangeTotal - orangeEmotes) > 0)
	{
		return true;
	}
	else
	{
		return false;
	}

};

function checkCommands(message)
{

	if(message === '<:rinheadpat:650489863312769036>')
	{
		return 5;
	}

	var i;
	var v;
	for (i = 0; i < cmd.length; i++) 
	{ 
  		for(v = 0; v < cmd[i].length; v++)
		{
			if(cmd[i][v] === message)
			{
				return i;
			}
		}
	}
};

function checkAdminCommands(message)
{
	if(message.member.roles.find(r => r.name === "Mods"))
	{
		var i;

		for (i = 0; i < adminCmd.length; i++) 
		{ 
			if(cmd[i] === message.content.toLowerCase())
			{
				return i;
			}
		}
	}

};

setInterval(function() {
	if(hunger < maxHunger)
	{
		hunger++;
	}

	console.log(hunger);
}, 57600000);

setInterval(function() {

	sql.prepare("UPDATE orange SET tries = 3").run();

}, 14400000);

function feedOrange(message)
{
	let orangeTry = client.getOrange.get(message.author.id, message.guild.id);

	if (!orangeTry) 
	{
		orangeTry = {
		  id: `${message.guild.id}-${message.author.id}`,
		  user: message.author.id,
		  guild: message.guild.id,
		  oranges: 0,
		  affection: 0,
		  tries: 3
		};
	}


	if(orangeTry.oranges < 1)
	{
		message.channel.send(`You don't have any oranges!`);
	}
	else
	{
		switch(hunger)
		{
			case 0:
				message.channel.send('Im stuffed, I cant eat another one');
				break;
			case 1:
				message.channel.send(`Thanks, I can't eat another bite`);
				orangeTry.oranges--;
				hunger--;
				break;
			case 2:
				message.channel.send(`I'm starving! What took you so long`);
				orangeTry.oranges--;	
				hunger--;	
				break;
		}
	}

	client.setOrange.run(orangeTry);
};

function harvestOrange(message)
{
	let orangeTry = client.getOrange.get(message.author.id, message.guild.id);

	if (!orangeTry) 
	{
		orangeTry = {
		  id: `${message.guild.id}-${message.author.id}`,
		  user: message.author.id,
		  guild: message.guild.id,
		  oranges: 0,
		  affection: 0,
		  tries: 3
		};
	}

	if(orangeTry.tries > 0)
	{
		if(Math.random() > 0.5)
		{
			orangeTry.oranges++;
			orangeTry.tries--;

			message.channel.send('Found an Orange!');
		}
		else
		{
			orangeTry.tries--;
			message.channel.send('Couldnt find anything');
		}
	}
	else
	{	
		message.channel.send(`I'm tired! <:rinded:603549269106098186>`);
	}

	client.setOrange.run(orangeTry);
}


function catchOrange(message)
{
	//check tired 

	var user = message.author;
	var catching = true;

	message.channel.send(""); //intro

	catchMessage = message.channel.send(""); //ascii art

	message.channel.send(""); //ask to pick
}

function catchChoice(message, pick)
{
	var pattern = [ 
		Math.round(Math.random()),
		Math.round(Math.random()),
		Math.round(Math.random()),
		Math.round(Math.random())
	];

	setTimeout(function(){ 	catchMessage.edit(""); }, 1000);

	setTimeout(function(){ 	catchMessage.edit(""); }, 1000);

	setTimeout(function(){ 	catchMessage.edit(""); }, 1000);

	setTimeout(function(){ 	catchMessage.edit(""); }, 1000); //Final

	let orangeTry = client.getOrange.get(message.author.id, message.guild.id);

	if (!orangeTry) 
	{
		orangeTry = {
		  id: `${message.guild.id}-${message.author.id}`,
		  user: message.author.id,
		  guild: message.guild.id,
		  oranges: 0,
		  affection: 0,
		  tries: 3
		};
	}

	if(pick == pattern[pick])
	{
		orangeTry.oranges++;
		orangeTry.tries--;

		message.channel.send('Gotcha');
	}
	else
	{
		orangeTry.tries--;
		message.channel.send('Bad luck');
	}

	client.setOrange.run(orangeTry);
	catching = false;
}