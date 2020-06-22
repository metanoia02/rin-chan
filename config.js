const object = {
	regex: '([a-z]+)',
	string: '**object**',
};

const user = {
	regex: '<!*@!*[0-9]+>',
	string: '**@user**',
	filter: function (userMention) {
		return true;
	},
};

const quantity = {
	regex: '[0-9]+',
	string: '**quantity**',
};

const tag = {
	regex: '',
	string: '**username#1234**',
};

const percentage = {
	regex: '[0-9]+%',
	string: '**percentage**',
};

module.exports = {
	utils: {
		cmd: {
			rinImage: ['show me an image of you', 'show rin image', 'rin image'],
		},

		description: ['Get a random image of Rin']

	},

	contact: {
		cmd: {
			giveHug: [
				['hug ', user],
				['give ', user, ' a hug'],
			],
			giveHeadpat: [
				['headpat ', user],
				['give a headpat to ', user],
			],
			headpat: ['headpat', '<:rinheadpat:686915995373142028>'],
		},

		description: ['Get Rinchan to headpat a user', 'You may headpat Rin-chan.'],
	},

	help: {
		cmd: {
			help: ['help', 'commands', 'what can you do'],
		},

		description: ['Rin-chan lists her commands, you are here.'],
	},

	leaderboard: {
		cmd: {
			showLeaderboard: [[object,' scoreboard'], [object, ' leaderboard']],
			leaderboard: ['leaderboard', 'scoreboard'],
		},

		description: ['Display the ranking of any object.', 'As above.'],
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
			//feedOrange: {commands: ['have an orange', 'give orange'], tags{strict:true},/////
			feedOrange: ['have an orange', 'give orange'],
			hungry: ['are you hungry', 'hungry'],
			giveObject: [
				['give an ', object, ' to ', user],
				['give a ', object, ' to ', user],
				['give 1 ', object, ' to ', user],
				['give ', user, ' an ', object],
				['give ', user, ' a ', object],
			],
			giveObjects: [
				['give ', quantity, ' ', object, ' to ', user],
				['give ', user, ' ', quantity, ' ', object],
			],
			stealOranges: ['steal oranges from ', 'steal from ', 'steal an orange from '],
			stealLens: ['steal lens from ', 'steal a len from '],
		},

		description: [
			'Try and find an orange for Rin-chan.',
			'Give an orange to Rin-Chan.',
			'Rin-chan reports her state of hunger.',
			'Give an object to mentioned user.',
			'Give a number of objects to the mentioned user.',
			'Try and make an orange heist. Use targets username and tag eg username#1234',
			'Try to steal Lens.',
		],
	},

	inventory: {
		cmd: {
			showInventory: ['show inventory', 'inventory'],
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
	/*
	shop: {
		cmd: {
			goShopping: ["let's go shopping", "go shopping"],
		},

		cmdMod: {
			restock: [['restock ', quantity, ' ', object]],
			makeSale: [['discount ', object, ' ', percentage]],
		},

		description: ['Go to the shop with Rin-chan. You can buy and exchange objects'],
	}*/
};

/*
How are you
What do you think of
Road roller
*/
