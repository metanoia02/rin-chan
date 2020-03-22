var orange = {
	hunger: 1,
	config: require('./config.json'),
	guessing: false,
	usr: [],

	handler(message) {
		if (orange.checkForEmote(message) && !message.author.bot && orange.hunger > 0) {
			message.channel.send('Who said orange?! Gimme!');
			return true;
		} else if (message.content.includes('🍊') && !message.author.bot && orange.hunger > 0) {
			message.channel.send(`That's my orange! Gimme!`);
			return true;
		}

		return false;
	},

	giveOrange(message) {
		let usersArray = message.mentions.users.array();

		if (usersArray.length == 1 && usersArray[0].id == global.client.user.id) {
			orange.feedOrange(message);
			return;
		} else if (usersArray.length !== 2) {
			message.channel.send('Mention only one user');
			return;
		}

		let destId = usersArray[0].id == global.client.user.id ? 1 : 0;

		if (usersArray[destId].id == message.author.id) {
			message.channel.send('You cant give oranges to yourself!');
			return;
		}

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
	},

	leaderboard(message) {
		var board = global.rinchanSQL.getBoard.all();

		var output = '';

		board.sort((a, b) => {
			return b.oranges - a.oranges;
		});

		board.forEach(async function(user, index) {
			if (user.oranges > 0) {
				try {
					let usr = await global.client.fetchUser(user.user);
					let output =
						index + 1 + '. ' + usr['username'] + ' has ' + user.oranges + (user.oranges > 1 ? ' oranges' : ' orange');
					message.channel.send(output);
				} catch (e) {
					console.log(e);
				}
			}
		});
	},

	checkForEmote(message) {
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

		return orangeTotal - orangeEmotes > 0;
	},

	feedOrange(message) {
		let user = global.rinchanSQL.getUser(message.author.id, message.guild.id);

		if (user.oranges < 1) {
			message.channel.send(`You don't have any oranges!`);
		} else {
			switch (orange.hunger) {
				case 0:
					message.channel.send('Im stuffed, I cant eat another one');
					break;
				case 1:
					message.channel.send(`Thanks, I can't eat another bite`);
					user.oranges--;
					user.affection++;
					orange.hunger--;
					break;
				case 2:
					message.channel.send(`I'm starving! What took you so long`);
					user.oranges--;
					user.affection++;
					orange.hunger--;
					break;
			}
		}

		global.rinchanSQL.setOrange.run(user);
	},

	harvestOrange(message) {
		let user = global.rinchanSQL.getUser(message.author.id, message.guild.id);

		if (user.tries > 0) {
			if (Math.random() > 0.5) {
				user.oranges++;
				message.channel.send('Found an Orange!');
			} else {
				message.channel.send('Couldnt find anything');
			}

			user.tries--;
		} else {
			message.channel.send(`I'm tired! <:rinded:603549269106098186>`);
		}

		global.rinchanSQL.setOrange.run(user);
	},

	catchOrange(message) {
		//check tired

		var user = message.author;
		var catching = true;

		message.channel.send(''); //intro

		catchMessage = message.channel.send(''); //ascii art

		message.channel.send(''); //ask to pick
	},

	catchChoice: function(message) {
		var pattern = [
			Math.round(Math.random()),
			Math.round(Math.random()),
			Math.round(Math.random()),
			Math.round(Math.random()),
		];

		setTimeout(function() {
			catchMessage.edit('');
		}, 1000);

		setTimeout(function() {
			catchMessage.edit('');
		}, 1000);

		setTimeout(function() {
			catchMessage.edit('');
		}, 1000);

		setTimeout(function() {
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

	hungry: function(message) {
		switch (orange.hunger) {
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
};

setInterval(function() {
	if (orange.hunger < orange.config.maxHunger) {
		orange.hunger++;
	}
}, 57600000);

module.exports = orange;
