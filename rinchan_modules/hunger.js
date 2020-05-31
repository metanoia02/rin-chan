module.exports = {
	maxHunger: 5,
	hunger: 2,

	hungerIcon: {
		0: 'https://cdn.discordapp.com/emojis/697594415790686218.png', //Stuffed
		1: 'https://cdn.discordapp.com/emojis/620970346626940958.gif', //Turbo Flap
		2: 'https://cdn.discordapp.com/emojis/591970280843247616.gif', //Normal Flap
		3: 'https://cdn.discordapp.com/emojis/243272900449271808.png', //NoFlap
		4: 'https://cdn.discordapp.com/emojis/628298482616107018.png', //Pout
		5: 'https://cdn.discordapp.com/emojis/620576239224225835.png', //Angrey
    },
    
    init() {
        //set hunger
        //set icon
    },

    setHunger() {

    },
    
    changeHunger(amount) {

    },

    getHunger() {

    },

	setIcon() {
		global.client.guilds.cache.get('585071519638487041').setIcon(this.hungerIcon[this.hunger]);
	},

	
	hungry(message) {
		switch (this.hunger) {
			case 0: {
				message.channel.send('Im stuffed <:rinchill:600745019514814494>');
				return;
			}
			case 2: {
				message.channel.send('Im starving here! <:rinangrey:620576239224225835>');
				return;
			}
        	default: {
				message.channel.send('Dont you have one more orange? <:oharin:601107083265441849>');
				return;
			}
		}
		return;
	},


};
/*

setInterval(function () {
	if (module.exports.hunger < module.exports.maxHunger) {
		module.exports.hunger++
		module.exports.setIcon();
	}
}, 3600000);*/