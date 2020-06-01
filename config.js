const user = {
	desc: "@user",
	regex: "<!*@!*[0-9]+>"
};

module.exports = {
	headpat: {
		cmd: {
			headpat: ['headpat', '<:rinheadpat:686915995373142028>'],
		},

		description: ['You may headpat Rin-chan.'],
	},

	help: {
		cmd: {
			help: ['help', 'commands', 'what can you do'],
		},

		description: ['Rin-chan lists her commands, you are here.'],
	},

	leaderboard: {
		cmd: {
			showLeaderboard: ['scoreboard', 'leaderboard'],
		},

		description: [
			'Display the ranking of orange hoarders.',
		],
	},

	orange: {
		cmd: {
			harvestOrange: [
				'harvest oranges',
				'harvest',
				'look for oranges',
				'find orange',
				'find oranges',
				'look for orange',
				'find an orange',
			],
			feedOrange: ['have an orange', 'give orange'],
			hungry: ['are you hungry', 'hungry'],
			giveOrange: ['give an orange to <!*@!*[0-9]+>', 'give 1 orange to <!*@!*[0-9]+>', 'give <!*@!*[0-9]+> an orange'],
			giveOranges: ['give [0-9]+ oranges to <!*@!*[0-9]+>', 'give <!*@!*[0-9]+> [0-9]+ oranges'],
			stealOranges: ['steal oranges from ', 'steal from ', 'steal an orange from '],
		},

		description: [
			'Try and find an orange for Rin-chan.',
			'Give an orange to Rin-Chan.',
			'Rin-chan reports her state of hunger.',
			'Give an orange to mentioned user.',
			'Give a number of oranges to the mentioned user.',
			'Try and make an orange heist. Use targets username and tag eg username#1234',
		],
	},

	inventory: {
		cmd: {
			showInventory: ['show inventory'],
		},

		description: ['Show everything you have'],
	},

	greeting: {
		cmd: {
			sayHi: ['hi', 'hello', 'morning', 'afternoon', 'evening', 'night', 'good morning', 'good evening', 'good night'],
			howAreYou: ['how are you'],
		},

		description: ['Rin-chan responds based on the time of day(GMT).', 'Ask how Rinchans doing.'],
	},
};

/*
How are you
What do you think of
Road roller
*/
