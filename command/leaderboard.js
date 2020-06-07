module.exports = {
	async showLeaderboard(message) {
		let board = rinchanSQL.orangeLeaderboard.all();

		let output = '';

		board.sort((a, b) => {
			return b.quantity - a.quantity;
		});

		await board.forEach(async function (user, index) {
			if (user.quantity > 0) {
				try {
					let usr = await message.guild.members.fetch(user.userId.substr(19));
					output +=
						index +
						1 +
						'. ' +
						escapeMarkdown(usr.displayName) +
						' has ' +
						user.quantity +
						(user.quantity > 1 ? ' oranges' : ' orange') +
						'\n';
				} catch (e) {
					console.log(e);
				}
			}
		});

		output = output.replace(/\s+$/, '');

		message.channel.send(output);
	},

	getLeaderboard() {
		let board = rinchanSQL.getBoard.all();

		//return array
	},
};
