const Discord = require('discord.js');

module.exports = {
	leaderboard(message, command, cmdRegex, rinchan) {
		//what object?
		//await messages
		//call object leaderboard

		const filter = response => {
			return response.author.id === message.author.id;
		};

		message.channel.send('Leaderboard for what object?').then(() => {
			message.channel.awaitMessages(filter, {max:1, time:30000, errors: ['time']})
			.then(collected => {
				let object = rinchanSQL.getObject(collected.first().content);
				if (!object) {
					message.channel.send('What is that? <:rinwha:600747717081432074>');
				} else {
					message.channel.send(this.objectLeaderboard(object,message)).catch(console.error);
				}	
			})
			.catch(collected => {
				message.channel.send('Another time perhaps');
			});
		});
	},
	 
	objectLeaderboard(object,message) {
		let board = this.getLeaderboard(object.name);
		
		let leaderboard = board.reduce(function (acc, user, index) {
			if (user.quantity > 0) {
					let usr = message.guild.members.cache.get(user.userId.substr(19));
					console.log(usr);
            if(usr) {
					acc.rankEmbedString += (index+1) + '.\n';
					acc.nicknameEmbedString += escapeMarkdown(usr.displayName) + '\n';
					acc.objectEmbedString += user.quantity +'\n';
            }
			}
			return acc;
		},{rankEmbedString:"",nicknameEmbedString:"",objectEmbedString:""});

		return new Discord.MessageEmbed()
        .setColor('#FFA500')
        .setTitle(`${capitalizeFirstLetter(object.name)} Leaderboard`)
        .addFields(
            { name: 'Rank', value:leaderboard.rankEmbedString, inline: true },
            { name: 'Nickname', value:leaderboard.nicknameEmbedString, inline: true },
            { name: capitalizeFirstLetter(object.plural), value:leaderboard.objectEmbedString, inline: true }
        );
	},

	showLeaderboard(message, command, cmdRegex, rinchan) {
		let object = rinchanSQL.getObject(getObjectType(command, cmdRegex));

		if (!object) {
			message.channel.send('What is that? <:rinwha:600747717081432074>');
		} else {
			message.channel.send(this.objectLeaderboard(object,message)).catch(console.error);
		}		
	},

	getLeaderboard(object) {
		let board = rinchanSQL.objectLeaderboard.all(object);

		board.sort((a, b) => {
			return b.quantity - a.quantity;
		});

		return board;
	},
};