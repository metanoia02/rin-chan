const Reaction = require('../reactions/reaction.js');
const rinChan = require('../rinChan/rinChan.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'how are you'},
      {locale: 'en', string: 'how are you doing'},
      {locale: 'en', string: 'how do you feel'},
    ],

    intent: 'howAreYou',
    commandName: 'How Are You',
    description: `Rin-chan tells you how she's feeling`,

    scope: 'channel',
  },

  init() {
    this.howYou = new Reaction('../reactions/howYou.json');
    this.cheerUpImages = {path: './images/cheerup/', quantity: 6};
  },

  async run(message, args) {
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
                message.channel.send(`That's great!`);
              }
            })
            .catch(() => {
              message.channel.send(`Well I hope you're okay ${message.author} <:rinheart:686737672525447178>`);
            })
        );
    });
  },
};
