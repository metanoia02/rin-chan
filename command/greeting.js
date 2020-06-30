const rinChan = require('../rinChan/rinChan.js');

module.exports = {
  cheerUpImages: {path: './images/cheerup/', quantity: 6},

  init() {
    const Reaction = require('../reactions/reaction.js');

    this.howYou = new Reaction('../reactions/howYou.json');
    this.cute = new Reaction('../reactions/yourCute.json');
  },

  sayHi(message) {
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

  howAreYou(message, command, cmdRegex) {
    const filter = (reaction, user) => {
      return (
        (user.id === message.author.id && reaction.emoji.name === '✅') ||
        (user.id === message.author.id && reaction.emoji.name === '❌')
      );
    };

    message.channel.send(this.howYou.getReaction(rinChan).string).then((sentMessage) => {
      sentMessage
          .react('✅')
          .then(() => sentMessage.react('❌'))
          .then(() =>
            sentMessage
                .awaitReactions(filter, {max: 1, time: 15000, errors: ['time']})
                .then((collected) => {
                  if (collected.has('❌')) {
                    const image =
                  this.cheerUpImages.path + (Math.floor(Math.random() * this.cheerUpImages.quantity) + 1) + '.jpg';

                    message.channel.send('Oh no, maybe this will make you feel better', {files: [image]});
                  } else if (collected.has('✅')) {
                    message.channel.send('That\'s great!');
                  }
                })
                .catch(() => {
                  message.channel.send(`Well I hope you're okay ${message.author} <:rinheart:686737672525447178>`);
                }),
          );
    });
  },

  getUserAffection(userId) {},

  checkSelfAffection(message, command) {},

  checkAffection(message, command) {},

  goodNight(message) {
    // goodnight, want me to wake you up in the morning?
    // yes
    // in how many hours?
    // ok see you in the morning
  },

  yourCute(message) {
    const image = this.cheerUpImages.path + (Math.floor(Math.random() * this.cheerUpImages.quantity) + 1) + '.jpg';

    message.channel.send('Oh no, maybe this will make you feel better', {files: [image]});
  },
};
