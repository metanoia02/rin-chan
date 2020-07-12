const rinChan = require('./rinChan/rinChan.js');

module.exports = {
  triggerWords: [
    {
      test: function (message) {
        return (
          message.includes('orange') && !this.regex.test(message) && rinChan.getHunger() > rinChan.getMaxHunger() - 2
        );
      },
      regex: /<:\w*orange\w*:[0-9]+>/gi,
      response: 'Who said orange?! Gimme!',
    },
    {
      test: function (message) {
        return message.includes('🍊') && rinChan.getMaxHunger() - 2 > 3;
      },
      response: `That's my orange! Gimme!`,
    },
  ],
  token: 'Njg3MDUwMTgyNTA4MDE5NzQy.XmgIFg.Fag695gNm6hAt_04eludbA3XW_8',
};
