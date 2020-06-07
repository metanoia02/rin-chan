module.exports = {
	hungerIcon: {
		0: 'https://cdn.discordapp.com/emojis/697594415790686218.png', //Stuffed
		1: 'https://cdn.discordapp.com/emojis/620970346626940958.gif', //Turbo Flap
		2: 'https://cdn.discordapp.com/emojis/591970280843247616.gif', //Normal Flap
		3: 'https://cdn.discordapp.com/emojis/243272900449271808.png', //NoFlap
		4: 'https://cdn.discordapp.com/emojis/628298482616107018.png', //Pout
		5: 'https://cdn.discordapp.com/emojis/620576239224225835.png', //Angrey
	},

	setIcon(client, hunger) {
		client.guilds.cache.first().setIcon(this.hungerIcon[hunger]);
	},

	changeHunger(client, hunger, maxHunger) {
		if (hunger < maxHunger) {
			this.setIcon(client, hunger);
			return hunger;
		} else {
			this.setIcon(client, maxHunger);
			return maxHunger;
		}
	},
};
