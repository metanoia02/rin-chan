module.exports = {
	cheerUpImages: { path: './images/cheerup/' , quantity: 6 },

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
		const filter = (reaction, user) => {
			return user.id === message.author.id && reaction.emoji.name === '✅' || user.id === message.author.id && reaction.emoji.name === '❌';
		};

		message.channel.send(this.howYou.getReaction()).then(sentMessage => {
			sentMessage.react('✅')
				.then(() => sentMessage.react('❌'))
				.then(() => sentMessage.awaitReactions(filter, { max: 1, time: 15000, errors:['time']})
					.then(collected => {
						if(collected.has('❌')) { 
							const image = this.cheerUpImages.path + (Math.floor(Math.random() * this.cheerUpImages.quantity) + 1) + '.jpg';							
							
							message.channel.send('Oh no, maybe this will make you feel better', {files: [image]}); 
						}
						else if(collected.has('✅')) { message.channel.send('Thats great!'); }
					})
					.catch(() => {
						message.channel.send(`Well i hope your okay ${message.author} <:rinheart:686737672525447178>`);
			}));
		});

	},

	checkAffection(message, command) {

	},

	goodNight(message) {

	},

	yourCute(message) {
//Cheer up you have me!
	},
};
