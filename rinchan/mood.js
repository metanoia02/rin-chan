module.exports = {
	moods: ['Angry', 'Sad', 'Neutral', 'Ok', 'Good', 'Amazing'],
	moodSwing: {max:2, min:-2},

	randomMood(mood) {
		let newMood = mood.value + (Math.floor(Math.random() * (this.moodSwing.max - this.moodSwing.min) ) + this.moodSwing.min);
		
		if(newMood < 0) {
			newMood = 0;
		} else if(newMood > 5) {
			newMood = 5;
		}
		console.log({value:newMood, moodString:this.moods[newMood]});

		return {value:newMood, moodString:this.moods[newMood]};
	},

	newMood(mood) {
		return {value:mood, moodString:this.moods[mood]};
	},
};
