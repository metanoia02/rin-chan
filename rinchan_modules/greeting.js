module.exports = {
	init() {
		let Reaction = require("../reactions/reaction.js");

		this.howYou = new Reaction("../reactions/howYou.json");
	},

	sayHi(message) {
		let d = new Date();
		let n = d.getHours();

		if (n > 6 && n < 12) {
			message.channel.send(`Good morning ${message.author}`);
			return;
		} else if (n >= 12 && n < 18) {
			message.channel.send(`Good afternoon ${message.author}`);
			return;
		} else if (n >= 18 && n < 22) {
			message.channel.send(`Good evening ${message.author}`);
			return;
		} else {
			message.channel.send('Why are you bothering me at this time, I need to sleep!');
			return;
		}
	},

	howAreYou(message) {
		message.channel.send(this.howYou.getReaction());
	},

	checkAffection(message, command) {

	},

	goodNight(message) {

	},

	yourCute(message) {
//Cheer up you have me!
	},
};
