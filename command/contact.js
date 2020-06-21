const Discord = require('discord.js');
const CommandException = require('../utils/CommandException.js');

module.exports = {
	init() {},

	headpat(message) {
		let commandName = 'Headpat';
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);

		try {
			if (user.affection < 0) {
				throw new CommandException(commandName, 'You never give me oranges...', 'rinpout.png');
			} else {
				message.channel.send('<:rincomf:634115522002419744>');
				user.affection--;
				rinchanSQL.setUser.run(user);
			}
		} catch(err) {
			message.channel.send(err.getEmbed()).catch(console.error);
		}		
	},

	giveHeadpat(message, command, cmdRegex, rinchan) {
		let mentions = getUserIdArr(command);
		let commandName = 'Give Headpat';

		try {
			validateSingleUserAction(message, commandName);

			let destUser = message.guild.members.cache.get(mentions[0]);

			if (destUser.id === message.client.user.id) {
				throw new CommandException(commandName, 'Excuse me?', 'rinwhat.png');
			}

			let sourceUser = rinchanSQL.getUser(message.author.id, message.guild.id);
			if (sourceUser.affection < 2) {
				throw new CommandException(commandName, 'You never give me oranges...', 'rinpout.png');
			} else {
				sourceUser.affection -= 2;
				rinchanSQL.setUser.run(sourceUser);
			}

			const attachment = new Discord.MessageAttachment('./images/emotes/rinheadpat.png', 'rinheadpat.png');

			const giveHeadpatEmbed = new Discord.MessageEmbed()
				.setColor('#008000')
				.setTitle(commandName)
				.setDescription(`${destUser.user} You got a headpat from ${message.client.user}!`)
				.attachFiles(attachment)
				.setThumbnail('attachment://rinheadpat.png');

			message.channel.send(giveHeadpatEmbed).catch(console.error);
		} catch (err) {
			message.channel.send(err.getEmbed()).catch(console.error);
		}
	},

	yourCute(message) {
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let affection = user.affection;
	},
};
