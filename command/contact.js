const Discord = require('discord.js');
const CommandException = require('../utils/CommandException.js');
const Reaction = require('../reactions/reaction.js');

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

	giveHug(message, command, cmdRegex, rinchan) {
		let commandName = 'Give Hug';
		let mentions = getUserIdArr(command);
		let destUser = message.guild.members.cache.get(mentions[0]);
		let reaction = new Reaction('../reactions/giveHug.json');

		this.giveUser(commandName,reaction.getReaction(),destUser,5,message);
	},

	hugMe(message, command, cmdRegex, rinchan) {

	},

	giveHeadpat(message, command, cmdRegex, rinchan) {
		let commandName = 'Give Headpat';
		let mentions = getUserIdArr(command);
		let destUser = message.guild.members.cache.get(mentions[0]);
		let reaction = new Reaction('../reactions/giveHeadpat.json');

		this.giveUser(commandName,reaction.getReaction(),destUser,2,message,true);
	},

	giveUser(commandName, reaction, targetUser, cost, message, thumbnail = false) {
		try {
			validateSingleUserAction(message, commandName);

			if (targetUser.id === message.client.user.id) {
				throw new CommandException(commandName, 'Excuse me?', 'rinwhat.png');
			}

			let sourceUser = rinchanSQL.getUser(message.author.id, message.guild.id);
			if (sourceUser.affection < cost) {
				throw new CommandException(commandName, 'You never give me oranges...', 'rinpout.png');
			} else {
				sourceUser.affection -= cost;
				rinchanSQL.setUser.run(sourceUser);
			}

			const attachment = new Discord.MessageAttachment(reaction.image, reaction.imageName);

			const giveHeadpatEmbed = new Discord.MessageEmbed()
				.setColor('#008000')
				.setTitle(commandName)
				.setDescription(`${targetUser.user}${reaction.string}${message.client.user}`)
				.attachFiles(attachment)
				.setFooter(`${message.member.displayName}`,message.author.avatarURL());
				

				if(thumbnail) {
					giveHeadpatEmbed.setThumbnail(`attachment://${reaction.imageName}`);
				} else {
					giveHeadpatEmbed.setImage(`attachment://${reaction.imageName}`);
				}

			message.channel.send(giveHeadpatEmbed).catch(console.error);
			message.delete().catch(console.error);
		} catch (err) {
			message.channel.send(err.getEmbed()).catch(console.error);
		}
	},

	yourCute(message) {
		let user = rinchanSQL.getUser(message.author.id, message.guild.id);
		let affection = user.affection;
	},
};
