const User = require('../utils/User.js');
const commandUtils = require('../utils/commandUtils.js');
const utils = require('../utils/utils.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'give %user% %number% %object%'},
      {locale: 'en', string: 'give %user% an %object%'},
      {locale: 'en', string: 'give %user% a %object%'},
      {locale: 'en', string: 'give a %object% to %user%'},

      {locale: 'en', string: 'give %tag% %number% %object%'},
      {locale: 'en', string: 'give %tag% an %object%'},
      {locale: 'en', string: 'give %tag% a %object%'},
      {locale: 'en', string: 'give a %object% to %tag%'},
    ],

    intent: 'giveObject',
    commandName: 'Give Object',
    description: 'Give a number of objects to the mentioned user.',

    scope: 'channel',
  },

  run(message, args) {
    commandUtils.validateSingleObjectAction(args);

    const sourceUser = new User(message);
    const destUser = args.mentions[0] || args.tags[0];
    const object = args.objects[0];
    const num = args.quantities[0] ? parseInt(args.quantities[0]) : 1;

    const objectString = num > 1 ? object.getPlural() : object.getDeterminer() + ' ' + object.getName();
    const objectNumString = num > 1 ? num + ' ' + objectString : objectString;

    if (sourceUser.getObjectQuantity(object.getName()) >= num) {
      if (num < 1) {
        message.channel.send('Fine, no ' + objectString + ' for them');
      } else if (destUser.getId() == message.author.id) {
        message.channel.send('You cant give ' + objectString + ' to yourself!');
      } else if (
        message.client.users.cache.get(destUser.getDiscordUser().bot && message.client.user.id != destUser.getId())
      ) {
        message.channel.send('Why would that bot need ' + objectString + '...');
      } else {
        if (destUser.getId() == message.client.user.id) {
          if (object.getName() === 'orange') {
            message.channel.send(`Thanks, I'll put them to good use`);
            sourceUser.changeObjectQuantity(object.getName(), -num);
            destUser.changeObjectQuantity(object.getName(), num);
          } else {
            message.channel.send('You keep that for now <:rinlove:726120311967449199>');
          }
        } else {
          message.channel.send('Ok, you gave ' + objectNumString);
          sourceUser.changeObjectQuantity(object.getName(), -num);
          destUser.changeObjectQuantity(object.getName(), num);
        }
      }
    } else {
      message.channel.send(`You don't have ` + objectNumString + ' to give');
    }
  },
};
