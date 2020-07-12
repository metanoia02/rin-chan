module.exports = {
  moods: ['Angry', 'Sad', 'Neutral', 'Ok', 'Good', 'Amazing'],
  moodSwing: 5,

  randomMood(mood) {
    const modifier = Math.floor((this.moodSwing - 1) / 2);
    let newMood = Math.floor(Math.random() * this.moodSwing) - modifier;

    if (newMood < 0) {
      newMood = 0;
    } else if (newMood > 5) {
      newMood = 5;
    }

    return {value: newMood, moodString: this.moods[newMood]};
  },

  newMood(mood) {
    return {value: mood, moodString: this.moods[mood]};
  },
};
