module.exports = {
  triggerWords: [
    {
      test: function (message, rinChan) {
        return (
          message.includes('orange') && !this.regex.test(message) && rinChan.getHunger() > rinChan.getMaxHunger() - 2
        );
      },
      regex: /<:\w*orange\w*:[0-9]+>/gi,
      response: 'Who said orange?! Gimme!',
    },
    {
      test: function (message, rinChan) {
        return message.includes('🍊') && rinChan.getMaxHunger() - 2 > 3;
      },
      response: `That's my orange! Gimme!`,
    },
    {
      test: function (message, rinChan) {
        if (
          (this.active && message.toLowerCase().includes('good night')) ||
          (this.active && message.toLowerCase().includes('goodnight'))
        ) {
          this.active = false;
          setTimeout(function () {
            module.exports.triggerWords[2].active = true;
          }, 6000000);
          return true;
        }
      },
      response: `Good night, sleep well!`,
      active: true,
    },
  ],

  levels: [
    {name: 'Mandarin', role: '', xp: 3000},
    {name: 'Tangerine', role: '', xp: 2000},
    {name: 'Mikan', role: '', xp: 1500},
    {name: 'Satsuma', role: '', xp: 1000},
    {name: 'Valencia Orange', role: '', xp: 600},
    {name: 'Blood Orange', role: '', xp: 400},
    {name: 'Navel Orange', role: '', xp: 200},
    {name: 'Clementine', role: '', xp: 90},
    {name: 'Seville Orange', role: '', xp: 30},
    {name: 'Orange peel', role: '', xp: 10},
    {name: 'Seedling', role: '', xp: 0},
  ],

  mutedRole: '620609193228894208',
  botChannel: '590205616581115918',
  modRole: '588521716481785859',
  diaryChannel: 'rinchans-diary'
};
