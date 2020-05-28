module.exports = {
	orangeGiveInterval: 900000,
	orangeObj: 'orange',
	lenObj: 'len',
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
		let Reaction = require('../reactions/reaction.js');

		this.findOrange = new Reaction('../reactions/findOrange.json');
	},

	handler(message) {
		let emoteRegex = new RegExp(/<:\w*orange\w*:[0-9]+>/, 'gi');

		if (
			message.content.includes('orange') &&
			!emoteRegex.test(message.content) &&
			!message.author.bot &&
			this.hunger > 3
		) {
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
			if (num === 0) {
				message.channel.send('Fine, no oranges for them');
			} else if (usersArray.length === 1) {
				message.channel.send('You need to mention a user');
			} else if (message.guild.member(usersArray[1]) == null) {
				message.channel.send('They arent in the server <:rinconfuse:687276500998815813>');
			} else if (usersArray[1] == message.author.id) {
				message.channel.send('You cant give oranges to yourself!');
			} else if (usersArray.length !== 2) {
				message.channel.send('Mention only one user');
			} else if (usersArray[1] === global.client.user.id) {
				this.feedOrange(message);
			} else {
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
		let inventory = global.rinchanSQL.getInventory(user, 'orange');

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

		let userInventory;
	},

	foundOrange(message) {
		message.channel.send('Found an Orange!');
	},

	couldntFind(message) {
		message.channel.send('Couldnt find anything... <:rinyabai:635101260080480256>');
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
		global.client.guilds.cache.get('585071519638487041').setIcon(this.hungerIcon[this.hunger]);
	},
};

setInterval(function () {
	if (module.exports.getHunger < module.exports.maxHunger) {
		module.exports.changeHunger(1);
		module.exports.setIcon();
	}
}, 3600000);
