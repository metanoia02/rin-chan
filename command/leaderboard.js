const Discord = require('discord.js');
const nodeHtmlToImage = require('node-html-to-image');

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
		let board = this.getLeaderboard();

		let htmlStart = `
		<html>
			<head>
				<style>
					body {
						width: 600px;
						height: 600px;
					}
					#container {
						display: flex;
						height:100%;
					}
					#rank-box {
						width:25%;
					}
					#user-box {
						width:50%;
					}
					#quantity-box {
						width:25%;
					}
				</style>
			</head>
			<body>
					<div id="container">
		`;

		let htmlEnd = `
		</div>
		</body>
		</html>
		`;
		
		let leaderboard = board.reduce(function (acc, user, index) {
			if (user.quantity > 0) {
					let usr = message.guild.members.cache.get(user.userId.substr(19));

					acc.rankEmbedString += (index+1) + '.\n';
					acc.nicknameEmbedString += escapeMarkdown(usr.displayName) + '\n';
					acc.objectEmbedString += user.quantity +'\n';
			}
			return acc;
		},{rankEmbedString:'<div id="rank-box">Rank\n',nicknameEmbedString:'<div id="user-box">Nickname\n',objectEmbedString:`<div id="quantity-box">${capitalizeFirstLetter(object.plural)}`});

		leaderboard.rankEmbedString += `</div>`;
		leaderboard.nicknameEmbedString += `</div>`;
		leaderboard.objectEmbedString += `</div>`;

		let htmlFull = htmlStart + leaderboard.rankEmbedString + leaderboard.nicknameEmbedString + leaderboard.objectEmbedString + htmlEnd;

		nodeHtmlToImage({
			output: './leaderboard.png',
			html: htmlFull,
			transparent: true
		}).then(() => {
			const attachment = new Discord.MessageAttachment('./leaderboard.png', 'leaderboard.png');
			const leaderboardEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`${object.name} Leaderboard`)
				.attachFiles(attachment)
				.setImage('attachment://leaderboard.png');

			message.channel.send(leaderboardEmbed).catch(console.error);
		});
	},


	showLeaderboard(message, command, cmdRegex, rinchan) {
		let object = rinchanSQL.getObject(getObjectType(command, cmdRegex));

		if (!object) {
			message.channel.send('What is that? <:rinwha:600747717081432074>');
		} else {
			this.objectLeaderboard(object,message);
		}		
	},

	getLeaderboard() {
		let board = rinchanSQL.orangeLeaderboard.all();

		board.sort((a, b) => {
			return b.quantity - a.quantity;
		});

		return board;
	},
};
