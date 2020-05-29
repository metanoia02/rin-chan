module.exports = {
	headpat(message) {
		let user = global.rinchanSQL.getUser(message.author.id, message.guild.id);

		if (user.affection > 0) {
			message.channel.send('<:rincomf:634115522002419744>');
			user.affection--;
		} else {
			message.channel.send('<:rinpout:628298482616107018> You never give me oranges...');
		}

		global.rinchanSQL.setUser.run(user);
	},
};
