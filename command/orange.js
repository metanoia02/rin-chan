module.exports = {
	orangeGiveInterval: 900000,

	init() {
		let Reaction = require('../reactions/reaction.js');

		this.findOrange = new Reaction('../reactions/findOrange.json');
	},

	handler(message, rinchan) {
		let emoteRegex = new RegExp(/<:\w*orange\w*:[0-9]+>/, 'gi');

		if (
			message.content.includes('orange') &&
			!emoteRegex.test(message.content) &&
			!message.author.bot &&
			rinchan.getHunger() > 3
		) {
			message.channel.send('Who said orange?! Gimme!');
			return true;
		} else if (message.content.includes('🍊') && !message.author.bot && rinchan.hunger > 3) {
			message.channel.send(`That's my orange! Gimme!`);
			return true;
		}

		return false;
	},

	hungry(message, command, cmdRegex, rinchan) {
		console.log(rinchan.getHunger());
		switch (rinchan.getHunger()) {
			case 0: {
				message.channel.send('Im stuffed <:rinchill:600745019514814494>');
				return;
			}
			case rinchan.getMaxHunger(): {
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

	giveNumObjects(message, command, num, objectType) {
		let sourceUser = rinchanSQL.getUser(message.author.id, message.guild.id);
		let sourceInventory = rinchanSQL.getInventory(sourceUser, objectType);

		let object = rinchanSQL.getObject(objectType);

		let objectString = num > 1 ? object.plural : object.determiner + ' ' + object.name;
		let objectNumString = num > 1 ? num + ' ' + objectString : objectString;

		if (sourceInventory.quantity >= num) {
			const usersArray = getUserIdArr(message.content);
			if (num === 0) {
				message.channel.send('Fine, no ' + objectString + ' for them');
			} else if (usersArray.length === 1) {
				message.channel.send('You need to mention a user');
			} else if (!message.guild.member(usersArray[1])) {
				message.channel.send('They arent in the server <:rinconfuse:687276500998815813>');
			} else if (usersArray[1] == message.author.id) {
				message.channel.send('You cant give ' + objectString + ' to yourself!');
			} else if (usersArray.length !== 2) {
				message.channel.send('Mention only one user');
			} else if (usersArray[1] === message.client.user.id) {
				message.channel.send('<:rinconfuse:687276500998815813>');
				//this.feedOrange(message);
			} else if (message.guild.member(usersArray[1]).bot) {
				message.channel.send('Why would that bot need ' + objectString + '...');
			} else {
				let destUser = rinchanSQL.getUser(usersArray[1], message.guild.id);
				let destInventory = rinchanSQL.getInventory(destUser, objectType);

				sourceInventory.quantity -= num;
				destInventory.quantity += num;
				message.channel.send('Ok, you gave ' + objectNumString);

				rinchanSQL.setInventory.run(sourceInventory);
				rinchanSQL.setInventory.run(destInventory);
			}
		} else {
			message.channel.send("You don't have " + objectNumString + ' to give');
		}
	},

	getObjectType(command, cmdRegex) {
		let objects = [...command.matchAll(cmdRegex)];

		return objects[0][1];
	},

	giveObject(message, command, cmdRegex, rinchan) {
		let object = rinchanSQL.getObject(this.getObjectType(command, cmdRegex));

		if(!object) {
			message.channel.send("What is that? <:rinwha:600747717081432074>");
		} else {
			this.giveNumObjects(message, command, 1, object.name);
		}		
	},

	giveObjects(message, command, cmdRegex, rinchan) {
		let quantityRegex = new RegExp(/\s[0-9]+\s/);
		numGiveObjects = parseInt(command.match(quantityRegex));

		let object = rinchanSQL.getObject(this.getObjectType(command, cmdRegex));

		if(!object) {
			message.channel.send("What is that? <:rinwha:600747717081432074>");
		} else {
			this.giveNumObjects(message, command, numGiveObjects, object.name);
		}
	},

	checkGiveSpam(sourceUser) {
		let now = new Date();

		if (now.getTime() - sourceUser.lastGive > this.orangeGiveInterval) {
			return true;
		} else {
			return false;
		}
	},

	feedOrange(message, command, cmdRegex, rinchan) {
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let inventory = rinchanSQL.getInventory(user, 'orange');

		let currentTime = new Date();

		if (user.oranges < 1) {
			message.channel.send(`You don't have any oranges!`);
		} else {
			if (this.checkGiveSpam(user) || rinchan.getHunger() >= 4) {
				switch (rinchan.getHunger()) {
					case 0:
						message.channel.send('Im stuffed, I cant eat another one');
						break;
					case 5:
						message.channel.send(`I'm starving! What took you so long`);
						inventory.oranges--;
						user.affection++;
						rinchan.setHunger(rinchan.getHunger() - 1);
						rinchan.setLastFed(currentTime.getTime());
						user.lastGive = currentTime.getTime();
						break;
					case 1:
						message.channel.send(`Thanks, I can't eat another bite`);
						inventory.oranges--;
						user.affection++;
						user.lastGive = currentTime.getTime();
						rinchan.setHunger(rinchan.getHunger() - 1);
						rinchan.setLastFed(currentTime.getTime());
						break;
					default:
						message.channel.send(`Another delicious orange!`);
						inventory.oranges--;
						user.affection++;
						user.lastGive = currentTime.getTime();
						rinchan.setHunger(rinchan.getHunger() - 1);
						rinchan.setLastFed(currentTime.getTime());
						break;
				}
				rinchanSQL.setUser.run(user);
				rinchanSQL.setInventory.run(inventory);
			} else {
				message.channel.send("It's okay, you just gave me one");
			}
		}
	},

	feedLen(message, command, cmdRegex, rinchan) {
		//mood low, roadroller, mood normal play with + mood, mood high what i need with this
		//perfect, i've been needing practice :rindevours
	},

	harvestOrange(message) {
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let inventory = rinchanSQL.getInventory(user, 'orange');

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

		rinchanSQL.setUser.run(user);
		rinchanSQL.setInventory.run(inventory);
	},

	easterEgg(message, user) {
		let now = new Date();
		let inventory = rinchanSQL.getInventory(user, 'len');
		inventory.quantity++;
		inventory.lastGet = now.getTime();
		rinchanSQL.setInventory.run(inventory);

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

	stealLens(message) {
		message.channel.send("He's too heavy to carry!");
	},

	stealOranges(message, command, cmdRegex) {
		const chance = Math.floor(Math.random() * 100) + 1;

		const username = command.replace(cmdRegex, '');
		let user = message.client.users.cache.find((user) => user.tag == username);

		console.log(user);

		let sourceUser = rinchanSQL.getUser(message.author.id, message.guild.id);
		let sourceInventory = rinchanSQL.getInventory(sourceUser, 'orange');

		let now = new Date();

		let mentionsArray = getUserIdArr(message.content);

		if (mentionsArray[1] == message.client.user.id) {
			message.channel.send('Step back from my oranges!');
		} else if (mentionsArray[1] == message.author.id) {
			message.channel.send('Dont tempt me!');
		} else if (message.mentions.members.array().length > 1) {
			message.channel.send('They knew i was coming!');
		} else if (!user) {
			message.channel.send('Who are they? <:rinwha:600747717081432074>');
		} else if (user.id == message.author.id) {
			message.channel.send('Dont tempt me!');
		} else if (user.id === message.client.user.id) {
			message.channel.send('Step back from my oranges!');
		} else if (now.getTime() - sourceUser.lastSteal > 86400000) {
			let stealUser = rinchanSQL.getUser(user.id, message.guild.id);
			let stealInventory = rinchanSQL.getInventory(stealUser, 'orange');

			if (stealInventory.quantity < 5) {
				message.channel.send('They arent a good target');
			} else if (sourceUser.affection > stealUser.affection) {
				if (chance >= 93) {
					sourceUser.affection > 9 ? (sourceUser.affection -= 10) : (sourceUser.affection = 0);

					const stolenOranges = stealInventory.quantity / 10 > 10 ? 10 : Math.round(stealInventory.quantity / 10);

					sourceInventory.quantity += stolenOranges;
					stealInventory.quantity -= stolenOranges;

					sourceUser.lastSteal = now.getTime();

					rinchanSQL.setUser.run(stealUser);

					rinchanSQL.setInventory.run(sourceInventory);
					rinchanSQL.setInventory.run(stealInventory);

					message.channel.send(
						'I did it! Heres ' + stolenOranges + (stolenOranges === 1 ? ' orange' : ' oranges') + ' from ' + username
					);
				} else {
					message.channel.send('I got caught... <:rinbuaaa:686741811850510411>');
				}
				sourceUser.lastSteal = now.getTime();
				rinchanSQL.setUser.run(sourceUser);
			} else {
				message.channel.send("I don't think so, I like them more <:rintriumph:673972571254816824>");
			}
		} else {
			message.channel.send('Not again <:rinyabai:635101260080480256>');
		}
	},
};
