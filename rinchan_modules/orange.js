module.exports = {
	orangeGiveInterval: 900000,
	orangeObj: "orange",
	lenObj: "len",

	hunger: 2,
	maxHunger: 5,

	hungerIcon: {
		0: 'https://cdn.discordapp.com/emojis/697594415790686218.png', //Stuffed
		1: 'https://cdn.discordapp.com/emojis/620970346626940958.gif', //Turbo Flap
		2: 'https://cdn.discordapp.com/emojis/591970280843247616.gif', //Normal Flap
		3: 'https://cdn.discordapp.com/emojis/243272900449271808.png', //NoFlap
		4: 'https://cdn.discordapp.com/emojis/628298482616107018.png', //Pout
		5: 'https://cdn.discordapp.com/emojis/620576239224225835.png', //Angrey
	},

	init() {
		let Reaction = require("../reactions/reaction.js");

		this.findOrange = new Reaction("../reactions/findOrange.json");
	},	

	handler(message) {
		let emoteRegex = new RegExp(/<:\w*orange\w*:[0-9]+>/, 'gi');

		if (message.content.includes("orange") && !emoteRegex.test(message.content) && !message.author.bot && this.hunger > 3) {
			message.channel.send('Who said orange?! Gimme!');
			return true;
		} else if (message.content.includes('🍊') && !message.author.bot && this.hunger > 3) {
			message.channel.send(`That's my orange! Gimme!`);
			return true;
		}

		return false;
	},

	giveNumOranges(message, command, num) {
		let sourceUser = global.rinchanSQL.getUser(message.author.id, message.guild.id);
		let sourceInventory = global.rinchanSQL.getInventory(sourceUser, this.orangeObj);

		let orangeString = num > 1 ? num + ' oranges' : 'an orange';

		if (sourceInventory.quantity >= num) {
			const usersArray = global.getUserIdArr(message.content);
			if(num === 0) {
				message.channel.send('Fine, no oranges for them');
			} else if (usersArray.length === 1) {
				message.channel.send('You need to mention a user');
			} else if (!message.guild.member(usersArray[1])) {
				message.channel.send('They arent in the server <:rinconfuse:687276500998815813>');
			} else if (usersArray[1] == message.author.id) {
				message.channel.send('You cant give oranges to yourself!');
			} else if (usersArray.length !== 2) {
				message.channel.send('Mention only one user');
			} else if (usersArray[1] === global.client.user.id) {
				this.feedOrange(message);
			}else if(message.guild.member(usersArray[1]).bot) {
				message.channel.send('Why would that bot need oranges...');
			}else {
				let destUser = global.rinchanSQL.getUser(usersArray[1], message.guild.id);
				let destInventory = global.rinchanSQL.getInventory(destUser, this.orangeObj);

				sourceInventory.quantity -= num;
				destInventory.quantity += num;
				message.channel.send('Ok, you gave ' + orangeString);

				global.rinchanSQL.setInventory.run(sourceInventory);
				global.rinchanSQL.setInventory.run(destInventory);
			}
		} else {
			message.channel.send("You don't have " + orangeString + ' to give');
		}
	},

	giveOrange(message, command) {
		this.giveNumOranges(message, command, 1);
	},

	giveOranges(message, command) {
		let quantityRegex = new RegExp(/\s[0-9]+\s/);
		numGiveOranges = parseInt(command.match(quantityRegex));

		this.giveNumOranges(message, command, numGiveOranges);
	},

	checkGiveSpam(sourceUser) {
		let now = new Date();

		if (now.getTime() - sourceUser.lastGive > this.orangeGiveInterval) {
			return true;
		} else {
			return false;
		}
	},

	feedOrange(message, command) {
		let user = global.rinchanSQL.getUser(message.author.id, message.guild.id);
		let inventory = global.rinchanSQL.getInventory(user, 'orange');

		let curentTime = new Date();

		if (user.oranges < 1) {
			message.channel.send(`You don't have any oranges!`);
		} else {
			if (this.checkGiveSpam(user)) {
				switch (this.hunger) {
					case 0:
						message.channel.send('Im stuffed, I cant eat another one');
						break;
					case 5:
						message.channel.send(`I'm starving! What took you so long`);
						inventory.oranges--;
						user.affection++;
						this.hunger--;
						user.lastGive = curentTime.getTime();
						this.setIcon();
						break;
					case 1:
						message.channel.send(`Thanks, I can't eat another bite`);
						inventory.oranges--;
						user.affection++;
						user.lastGive = curentTime.getTime();
						this.hunger--;
						this.setIcon();
						break;
					default:
						message.channel.send(`Another delicious orange!`);
						inventory.oranges--;
						user.affection++;
						user.lastGive = curentTime.getTime();
						this.hunger--;
						this.setIcon();
						break;
				}
				global.rinchanSQL.setUser.run(user);
				global.rinchanSQL.setInventory.run(inventory);
			} else {
				message.channel.send("It's okay, you just gave me one");
			}
		}
	},

	harvestOrange(message) {
		let user = global.rinchanSQL.getUser(message.author.id, message.guild.id);
		let inventory = global.rinchanSQL.getInventory(user, "orange");

		let now = new Date();

		let chance = Math.random();

		if (user.tries > 0) {
			if (0 < chance && chance <= 0.05) {
				this.easterEgg(message, user);
				user.tries = 0;
			} else if (0.05 < chance && chance <= 0.6) {
				inventory.quantity++;
				inventory.lastGet = now.getTime();
				this.foundOrange(message);
				user.tries--;
			} else if (0.6 < chance && chance < 1) {
				this.couldntFind(message);
				user.tries--;
			}
		} else {
			message.channel.send(`I'm tired! <:rinded:603549269106098186>`);
		}

		global.rinchanSQL.setUser.run(user);
		global.rinchanSQL.setInventory.run(inventory);
	},

	easterEgg(message, user) {
		let now = new Date();
		let inventory = global.rinchanSQL.getInventory(user, 'len');
		inventory.quantity++;
		inventory.lastGet = now.getTime();
		global.rinchanSQL.setInventory.run(inventory);

		message.channel.send('Found a Len! <:rinwao:701505851449671871>', {
			files: [
				'https://cdn.discordapp.com/attachments/601856655873015831/703286810133921892/b5396d6cadd36f32424c4bb1b48913d30b7deb86.jpg',
			],
		});
	},

	foundOrange(message) {
		message.channel.send(this.findOrange.getReaction());
	},

	couldntFind(message) {
		message.channel.send('Couldnt find anything... <:rinyabai:635101260080480256>');
	},

	stealOranges(message, command, cmdRegex) {
		let chance = Math.floor(Math.random() * 100) + 1;

		let username = command.replace(cmdRegex, "");
		let user = global.client.users.cache.find(user => user.username == username);

		let sourceUser = global.rinchanSQL.getUser(message.author.id, message.guild.id)
		let sourceInventory = global.rinchanSQL.getInventory(sourceUser, "orange");

		let now = new Date();

		if(message.mentions.members.array().length > 1) {
			message.channel.send('They knew i was coming!');
		} else if(!user) {
			message.channel.send('Who are they? <:rinwha:600747717081432074>');
		} else if (user.id == message.author.id) {
			message.channel.send('Dont tempt me!');
		} else if (user.id === global.client.user.id) {
			message.channel.send("Step back from my oranges!");
		} else if((now.getTime() - sourceUser.lastSteal) > 1) {
			let stealUser = global.rinchanSQL.getUser(user.id,message.guild.id)
			let stealInventory = global.rinchanSQL.getInventory(stealUser, "orange");

			if(stealInventory.quantity < 5) {
				message.channel.send('They arent a good target');
			} else if(sourceUser.affection > stealUser.affection) {
				if(chance >= 90) {
					(sourceUser.affection > 9) ? sourceUser.affection -= 10 : sourceUser.affection = 0;

					const stolenOranges = (stealInventory.quantity/10 > 10) ? 10 : Math.round(stealInventory.quantity/10);

					sourceInventory.quantity += stolenOranges;
					stealInventory.quantity -= stolenOranges;

					sourceUser.lastSteal = now.getTime();

					global.rinchanSQL.setUser.run(sourceUser);
					global.rinchanSQL.setUser.run(stealUser);
					
					global.rinchanSQL.setInventory.run(sourceInventory);
					global.rinchanSQL.setInventory.run(stealInventory);

					message.channel.send('I did it! Heres ' + stolenOranges + ((stolenOranges===1) ? ' orange' : ' oranges'));
				}else {
					message.channel.send('I got caught... <:rinbuaaa:686741811850510411>');
				}
			} else {
				message.channel.send("I don't think so, I like them more <:rintriumph:673972571254816824>");
			}
		} else {
			message.channel.send("Not again <:rinyabai:635101260080480256>");
		}
	},

	hungry(message) {
		switch (this.hunger) {
			case 0: {
				message.channel.send('Im stuffed <:rinchill:600745019514814494>');
				return;
			}
			case 2: {
				message.channel.send('Im starving here! <:rinangrey:620576239224225835>');
				return;
			}
        	default: {
				message.channel.send('Dont you have one more orange? <:oharin:601107083265441849>');
				return;
			}
		}
		return;
	},
	
		setIcon() {
	//	global.client.guilds.cache.get('585071519638487041').setIcon(this.hungerIcon[this.hunger]);
	},
	

};

setInterval(function () {
	if (module.exports.hunger < module.exports.maxHunger) {
		module.exports.hunger++;
		module.exports.setIcon();
	}
}, 3600000);

/**/