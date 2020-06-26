const CommandException = require('../utils/CommandException.js');
const Discord = require('discord.js');

module.exports = {
	giveObject(message, command, cmdRegex, rinchan) {
		let gumi = message.guild.member(gumiID);

		try {
			let object = rinchanSQL.getObject(getObjectType(command, cmdRegex));

			if(object.name === 'orange'){
				this.giveOrange(message, 1, rinchan, gumi);
			} else if(object.name === 'carrot') {
				this.giveCarrot(message, 1,rinchan, gumi);
			} else if(object.name === 'Carrot Birthday Cake') {
				this.giveCake(message, 1,rinchan, gumi);
			} else {
				message.channel.send("I don't think she wants that...")
			}
		} catch (err) {
			if (err instanceof CommandException) {
				message.channel.send(err.getEmbed('Give Object')).catch(console.error);
			} else {
				console.log(err);
			}
		}
	},

	giveObjects(message, command, cmdRegex, rinchan) {
		let quantityRegex = new RegExp(/\s[0-9]+\s/);
		numGiveObjects = parseInt(command.match(quantityRegex));

		try{
			let object = rinchanSQL.getObject(getObjectType(command, cmdRegex));
			let gumi = message.guild.member(gumiID);

			if (!object) {
				message.channel.send('What is that? <:rinwha:600747717081432074>');
			} else {
				if(object.name === 'orange') {
					this.giveOrange(message,numGiveObjects,rinchan,gumi);
				} else if(object.name === 'carrot') {
					this.giveCarrot(message, numGiveObjects,rinchan, gumi);
				} else if(object.name === 'Carrot Birthday Cake') {
					throw new CommandException("Thats too many cakes, one will be fine", 'rinconfuse.png');
				} else {
					message.channel.send("I don't think she wants those...")
				}
			}
		} catch (err) {
			if (err instanceof CommandException) {
				message.channel.send(err.getEmbed('Give Object')).catch(console.error);
			} else {
				console.log(err);
			}
		}
	},

	giveOrange(message, quantity, rinchan, gumi) {
		let orangeString = quantity > 1 ? quantity+' oranges' : 'an orange';

		const filter = (response) => {
			return response.author.id === gumiID;
		};

		let currentTime = new Date();

		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let orangeInventory = rinchanSQL.getInventory(user, 'orange');

		if(quantity > orangeInventory.quantity) {
			throw new CommandException('You dont have that many oranges', 'rinyabai.png');
		}

		message.channel.send(`Hey ${gumi}, ${message.author} sent `+ orangeString).then(() => {
			message.channel
				.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
				.then((collected) => {
					message.channel.startTyping();
					setTimeout(function () {
						message.channel.send('Thanks!!!');
						message.channel.stopTyping(true);

						if(rinchan.getHunger() > 3) {

							orangeInventory.quantity--;
							quantity--;
							user.affection++;
							rinchan.setHunger(rinchan.getHunger() - 1);
							rinchan.setLastFed(currentTime.getTime());
							user.lastGive = currentTime.getTime();

							rinchanSQL.setUser.run(user);
							rinchanSQL.setInventory.run(orangeInventory);
						}

						let userRinchan = rinchanSQL.getUser(rinchan.getId(), message.guild.id);
						let rinchanOrangeInventory = rinchanSQL.getInventory(userRinchan, 'orange');
						rinchanOrangeInventory.quantity += quantity;

						rinchanSQL.setUser.run(userRinchan);
						rinchanSQL.setInventory.run(rinchanOrangeInventory);
					}, 3000);
				})
				.catch((collected) => {
					console.log(collected);
				});
		});
	},

	giveCarrot(message, quantity, rinchan, gumi) {
		let carrotString = quantity > 1 ? quantity+' carrots' : 'a carrot';

		const filter = (response) => {
			return response.author.id === gumiID;
		};

		let currentTime = new Date();

		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let carrotInventory = rinchanSQL.getInventory(user, 'carrot');

		if(quantity > carrotInventory.quantity) {
			throw new CommandException('You dont have that many carrots', 'rinyabai.png');
		}

		message.channel.send(`Hey ${gumi}, ${message.author} sent `+ carrotString).then(() => {
			message.channel
				.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
				.then((collected) => {
					message.channel.startTyping();
					setTimeout(function () {
						message.channel.send('You really like those weird things huh...');
						message.channel.stopTyping(true);
					}, 3000);
				})
				.catch((collected) => {
					console.log(collected);
				});
		});

		carrotInventory.quantity -= quantity;
		user.carrotsGiven += quantity;

		rinchanSQL.setUser.run(user);
		rinchanSQL.setInventory.run(carrotInventory);
	},

	giveCake(message, quantity, rinchan, gumi) {
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let gumiCakeInventory = rinchanSQL.getInventory(user, 'Carrot Birthday Cake');

		const filter = (response) => {
			return response.author.id === gumiID;
		};
		
		try {
			if(gumiCakeInventory.quantity < 1) throw new CommandException("You don't have a cake",'rinconfuse.png');

			gumiCakeInventory.quantity--;
			rinchanSQL.setInventory.run(gumiCakeInventory);

			message.channel.send(`Happy Birthday ${gumi}, we baked you a cake!!!`).then(() => {
				message.channel
					.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
					.then((collected) => {
						message.channel.startTyping();
						setTimeout(function () {
							message.channel.send("Looks tasty, gimme a slice... without the carrots.");
							message.channel.stopTyping(false);
	
							setTimeout(function () {
								let fanclubInventory = rinchanSQL.getInventory(user, '1, 2 Fanclub Single');
								if(fanclubInventory.quantity < 1) {
									const attachment = new Discord.MessageAttachment('./images/gumi/fanclub.jpg', 'fanclub.jpg');
									const fanclubEmbed = new Discord.MessageEmbed()
										.setColor('#00FF00')
										.setTitle('GUMI Birthday Event')
										.setDescription(`Thanks for helping me ${message.member.displayName}, you can have this`)
										.setFooter('You recieved 1, 2 Fanclub Single')
										.attachFiles(attachment)
										.setThumbnail('attachment://fanclub.jpg');
									message.channel.send(fanclubEmbed).catch(console.error);
									message.channel.stopTyping(true);

									fanclubInventory.quantity = 1;
									rinchanSQL.setInventory.run(fanclubInventory);
								}
							}, 3000);
						}, 3000);
					})

					.catch((collected) => {
						console.log(collected);
					});
					message.channel.stopTyping(true);
			});
			message.channel.stopTyping(true);

		} catch (err) {
			if (err instanceof CommandException) {
				message.channel.send(err.getEmbed('Give Object')).catch(console.error);
			} else {
				console.log(err);
			}
		}



	},

	bakeCake(message, command, cmdRegex, rinchan) {
		//check for cake mix, lens, carrots
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let cakeMixInventory = rinchanSQL.getInventory(user, 'Cake mix');
		let lenInventory = rinchanSQL.getInventory(user, 'Len');
		let carrotInventory = rinchanSQL.getInventory(user, 'carrot');
		let gumiCakeInventory = rinchanSQL.getInventory(user, 'Carrot Birthday Cake');

		if(cakeMixInventory.quantity < 1) {
			message.channel.send('I need a cake mix');
		} else if(lenInventory.quantity < 1) {
			message.channel.send('I could really use help from Len <:rinconfuse:726124190377312337>');
		} else if(carrotInventory.quantity < 5) {
			message.channel.send('A cake for GUMI needs carrots, five should do!');
		} else {
			let chance = Math.floor(Math.random() * 100) + 1;

			if (chance > 40) {
				gumiCakeInventory.quantity++;

				const attachment = new Discord.MessageAttachment('./images/gumi/cake.jpg', 'cake.jpg');
				const bakedCakeEmbed = new Discord.MessageEmbed()
					.setColor('#00FF00')
					.setTitle('Bake A Cake')
					.setDescription("We did it!")
					.attachFiles(attachment)
					.setImage('attachment://cake.jpg');
		
				message.channel.send(bakedCakeEmbed).catch(console.error);
			} else {
				const attachment = new Discord.MessageAttachment('./images/gumi/burnt.png', 'burnt.png');
				const bakedCakeEmbed = new Discord.MessageEmbed()
					.setColor('#000000')
					.setTitle('Bake A Cake')
					.setDescription("I'm sorry... we burnt it <:rinbuaaa:726125216559923291>")
					.attachFiles(attachment)
					.setImage('attachment://burnt.png');
		
				message.channel.send(bakedCakeEmbed).catch(console.error);
			}
	
			cakeMixInventory.quantity--;
			lenInventory.quantity--;
			carrotInventory.quantity -= parseInt(5);

			rinchanSQL.setInventory.run(cakeMixInventory);
			rinchanSQL.setInventory.run(lenInventory);
			rinchanSQL.setInventory.run(carrotInventory);
			rinchanSQL.setInventory.run(gumiCakeInventory);
		}
	},
};
