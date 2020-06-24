module.exports = {
	moods: ['Angry', 'Sad', 'Neutral', 'Ok', 'Good', 'Amazing'],
	moodSwing: 5,

	randomMood(mood) {
		let modifier = Math.floor((swing-1)/2);
		let newMood = (Math.floor(Math.random() * (5) )) - modifier ;
		
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
