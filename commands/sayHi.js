module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'hi'},
      {locale: 'en', string: 'hey'},
      {locale: 'en', string: 'hello'},
      {locale: 'en', string: 'morning'},
      {locale: 'en', string: 'afternoon'},
      {locale: 'en', string: 'evening'},

      {locale: 'en', string: 'good morning'},
      {locale: 'en', string: 'good afternoon'},
      {locale: 'en', string: 'good evening'},
    ],

    intent: 'sayHi',
    commandName: 'Say Hi',
    description: 'Rin-chan responds based on the time of day(GMT).',

    scope: 'channel',
  },

  async run(message, args) {
    const d = new Date();
    const n = d.getHours();

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
};
