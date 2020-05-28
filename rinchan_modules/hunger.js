module.exports = {
	maxHunger: 5,

	hungerIcon: {
		0: 'https://cdn.discordapp.com/emojis/697594415790686218.png', //Stuffed
		1: 'https://cdn.discordapp.com/emojis/620970346626940958.gif', //Turbo Flap
		2: 'https://cdn.discordapp.com/emojis/591970280843247616.gif', //Normal Flap
		3: 'https://cdn.discordapp.com/emojis/243272900449271808.png', //NoFlap
		4: 'https://cdn.discordapp.com/emojis/628298482616107018.png', //Pout
		5: 'https://cdn.discordapp.com/emojis/620576239224225835.png', //Angrey
    },
    
    init() {
		  this.hungerLevel = global.rinchanSQL.getHunger.run();
		  this.setIcon();
    }

    setHunger() {

    },
    
    changeHunger(amount) {

    },

    getHunger() {

    },

	setIcon() {
		global.client.guilds.cache.get('585071519638487041').setIcon(this.hungerIcon[this.getHunger()]);
	},


};

