const Discord = require('discord.js');

module.exports = {
	init() {},

	headpat(message) {
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);

		if (user.affection > 0) {
			message.channel.send('<:rincomf:634115522002419744>');
			user.affection--;
		} else {
			message.channel.send('<:rinpout:628298482616107018> You never give me oranges...');
		}

		rinchanSQL.setUser.run(user);
	},

	giveHeadpat(message, command, cmdRegex, rinchan) {
		let mentions = getUserIdArr(command);

		try {
			validateSingleUserAction(message);

			let destUser = message.guild.members.cache.get(mentions[0]);

			if (destUser.id === message.client.user.id) {
				throw new commandException('Excuse me?', 'rinwhat.png');
			}

			let sourceUser = rinchanSQL.getUser(message.author.id, message.guild.id);
			if (sourceUser.affection < 2) {
				throw new commandException('You never give me oranges...', 'rinpout.png');
			} else {
				sourceUser.affection -= 2;
				rinchanSQL.setUser.run(sourceUser);
			}

			const attachment = new Discord.MessageAttachment('./images/emotes/rinheadpat.png', 'rinheadpat.png');

			const giveHeadpatEmbed = new Discord.MessageEmbed()
				.setColor('#008000')
				.setTitle('Give Headpat')
				.setDescription(`${destUser.user} You got a headpat from ${message.client.user}!`)
				.attachFiles(attachment)
				.setThumbnail('attachment://rinheadpat.png');

			message.channel.send(giveHeadpatEmbed).catch(console.error);
		} catch (err) {
			const attachment = new Discord.MessageAttachment(`./images/emotes/${err.emote}`, err.emote);
			const giveHeadpatErrorEmbed = new Discord.MessageEmbed()
				.setColor('#FF0000')
				.setTitle('Give Headpat')
				.setDescription(err.message)
				.attachFiles(attachment)
				.setThumbnail(`attachment://${err.emote}`);

			message.channel.send(giveHeadpatErrorEmbed).catch(console.error);
		}
	},

	yourCute(message) {
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let affection = user.affection;
	},
};
