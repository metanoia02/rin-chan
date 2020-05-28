module.exports = {
	moodBad: ['Angry', 'Hungry', 'Tired'],
	moodGood: ['Happy'],

	init() {
		this.currentMood = global.rinchanSQL.getMood.run();
	},

	getMood() {
		return this.currentMood;
	},
};
