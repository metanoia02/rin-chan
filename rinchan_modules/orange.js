module.exports = {
	hunger: 1,
	guessing: false,
	usr: [],
		
	"maxHunger": 2,

	handler(message) {
		if (this.checkForEmote(message) && !message.author.bot && this.hunger > 0) {
			message.channel.send('Who said orange?! Gimme!');
			return true;
		} else if (message.content.includes('🍊') && !message.author.bot && this.hunger > 0) {
			message.channel.send(`That's my orange! Gimme!`);
			return true;
		}

		return false;
	},

	giveOrange(message, command) {
		let usersArray = message.mentions.users.array();

		if(usersArray.length === 1) { //Mentioned Rinchan, or mentioned nobody

			return false;
		}

		if (message.guild.member(testID) == null) {
			message.channel.send('They arent in the server <:rinconfuse:687276500998815813>');
			return false;
		}

		if (usersArray[destId].id == message.author.id) {
			message.channel.send('You cant give oranges to yourself!');
			return false;
		}

		if (usersArray.length !== 2) {
			message.channel.send('Mention only one user');
			return false;
		}

		//Passed Checks, now check oranges in inventory and 0 quantities / negatives etc

		

		if (message.content.match(test)) {
			let num = command.match(/\d+/)[0];

			if (num > 0) {
				let sourceUser = global.rinchanSQL.getUser(message.author.id, message.guild.id);
				let destUser = global.rinchanSQL.getUser(usersArray[destId].id, message.guild.id);

				if (sourceUser.oranges < num) {
					message.channel.send('You dont have ' + num + ' oranges to give');
				} else {
					sourceUser.oranges -= parseInt(num);
					destUser.oranges += parseInt(num);

					message.channel.send('Ok, you gave ' + num + ' oranges');
				}

				global.rinchanSQL.setOrange.run(sourceUser);
				global.rinchanSQL.setOrange.run(destUser);
				return;
			} else {
				message.channel.send(
					'Fine, no oranges for ' +
						message.mentions.users.get(usersArray[destId].id).username +
						' <:smugrin:674044431502016532>'
				);
				return;
			}
		} else {
			let sourceUser = global.rinchanSQL.getUser(message.author.id, message.guild.id);
			let destUser = global.rinchanSQL.getUser(usersArray[destId].id, message.guild.id);

			if (sourceUser.oranges < 1) {
				message.channel.send('You dont have an orange to give');
			} else {
				sourceUser.oranges--;
				destUser.oranges++;
				message.channel.send('Ok, you gave an orange');
			}

			global.rinchanSQL.setOrange.run(sourceUser);
			global.rinchanSQL.setOrange.run(destUser);
		}
	},

	async leaderboard(message) {
		let board = global.rinchanSQL.getBoard.all();

		let output = '';

		board.sort((a, b) => {
			return b.oranges - a.oranges;
		});

		await board.forEach(async function (user, index) {
			if (user.oranges > 0) {
				try {
					let usr = await message.guild.members.fetch(user.user);
					output +=
						index +
						1 +
						'. ' +
						usr.displayName +
						' has ' +
						user.oranges +
						(user.oranges > 1 ? ' oranges' : ' orange') +
						'\n';
				} catch (e) {
					console.log(e);
				}
			}
		});

		output = output.replace(/\s+$/, '');

		message.channel.send(output);
	},

	checkForEmote(message) {
		let orangeTotal;

		if (message.content.match(/orange/gi) != null) {
			orangeTotal = message.content.match(/orange/gi).length;
		} else {
			return false;
		}

		let orangeEmotes = 0;
		let colon = false;
		let colonPosition;
		let emote;

		for (let i = 0; i < message.content.length; i++) {
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

		return orangeTotal - orangeEmotes > 0;
	},

	feedOrange(message) {
		let user = global.rinchanSQL.getUser(message.author.id, message.guild.id);

		if (user.oranges < 1) {
			message.channel.send(`You don't have any oranges!`);
		} else {
			switch (this.hunger) {
				case 0:
					message.channel.send('Im stuffed, I cant eat another one');
					break;
				case 1:
					message.channel.send(`Thanks, I can't eat another bite`);
					user.oranges--;
					user.affection++;
					this.hunger--;
					this.setIcon();
					break;
				case 2:
					message.channel.send(`I'm starving! What took you so long`);
					user.oranges--;
					user.affection++;
					this.hunger--;
					this.setIcon();
					break;
			}
		}

		global.rinchanSQL.setOrange.run(user);
	},

	harvestOrange(message) {
		let user = global.rinchanSQL.getUser(message.author.id, message.guild.id);

		let chance = Math.random();
		console.log(chance);

		if (user.tries > 0) {
			if (0 < chance && chance < 0.05) {
				this.easterEgg(message);
				console.log('1');
			} else if (0.05 < chance && chance < 0.6) {
				user.oranges++;
				this.foundOrange(message);
				console.log('2');
			} else if (0.6 < chance && chance < 1) {
				this.couldntFind(message);
				console.log('3');
			}

			user.tries--;
		} else {
			message.channel.send(`I'm tired! <:rinded:603549269106098186>`);
		}

		global.rinchanSQL.setOrange.run(user);
	},

	easterEgg(message) {
		message.channel.send('Found a Len! <:rinwao:701505851449671871>', {
			files: [
				'https://cdn.discordapp.com/attachments/601856655873015831/703286810133921892/b5396d6cadd36f32424c4bb1b48913d30b7deb86.jpg',
			],
		});
	},

	foundOrange(message) {
		message.channel.send('Found an Orange!');
	},

	couldntFind(message) {
		message.channel.send('Couldnt find anything... <:rinyabai:635101260080480256>');
	},

	catchOrange(message) {
		//check tired

		let user = message.author;
		let catching = true;

		message.channel.send(''); //intro

		catchMessage = message.channel.send(''); //ascii art

		message.channel.send(''); //ask to pick
	},

	catchChoice(message) {
		let pattern = [
			Math.round(Math.random()),
			Math.round(Math.random()),
			Math.round(Math.random()),
			Math.round(Math.random()),
		];

		setTimeout(function () {
			catchMessage.edit('');
		}, 1000);

		setTimeout(function () {
			catchMessage.edit('');
		}, 1000);

		setTimeout(function () {
			catchMessage.edit('');
		}, 1000);

		setTimeout(function () {
			catchMessage.edit('');
		}, 1000); //Final

		let user = global.rinchanSQL.getUser(message.author.id, message.guild.id);

		if (pick == pattern[pick]) {
			user.oranges++;

			message.channel.send('Gotcha');
		} else {
			message.channel.send('Bad luck');
		}

		user.tries--;

		global.client.setOrange.run(user);
		catching = false;
	},

	hungry(message) {
		switch (this.hunger) {
			case 0: {
				message.channel.send('Im stuffed <:rinchill:600745019514814494>');
				return;
			}
			case 1: {
				message.channel.send('Dont you have one more orange? <:oharin:601107083265441849>');
				return;
			}
			case 2: {
				message.channel.send('Im starving here! <:rinangrey:620576239224225835>');
				return;
			}
		}
		return;
	},

	setIcon() {
		switch (this.hunger) {
			case 0: {
				global.client.guilds.cache
					.get('585071519638487041')
					.setIcon('https://cdn.discordapp.com/attachments/601856655873015831/693153043742457977/trubosakura.gif');
				return;
			}
			case 1: {
				global.client.guilds.cache
					.get('585071519638487041')
					.setIcon('https://cdn.discordapp.com/attachments/601856655873015831/693153034519183370/sakuraflap.gif');
				return;
			}
			case 2: {
				global.client.guilds.cache
					.get('585071519638487041')
					.setIcon('https://cdn.discordapp.com/attachments/601856655873015831/693159742608113784/sakura.png');
				return;
			}
		}
	},
};

setInterval(function () {
	if (this.hunger < this.maxHunger) {
		this.hunger++;
		this.setIcon();
	}
}, 14400000);