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
			leaderboard: ['scoreboard', 'leaderboard'],
			giveOrange: ['give an orange to <'],
			giveOranges: ['give [0-9]+ oranges to <', 'give <W*w+> [0-9]+ oranges'],
		},

		description: [
			'Try and find an orange for Rin-chan.',
			'Give an orange to Rin-Chan.',
			'Rin-chan reports her state of hunger.',
			'Display the ranking of orange hoarders.',
			'Give an orange to mentioned user.',
			'Give a number of oranges to the mentioned user.',
		],
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
