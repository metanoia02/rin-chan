const User = require('../utils/User.js');
const CommandException = require('../utils/CommandException.js');
const database = require('../utils/sql.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'give %user% %number% %entity%'},
      {locale: 'en', string: 'give %user% an %entity%'},
      {locale: 'en', string: 'give %user% a %entity%'},
      {locale: 'en', string: 'give a %entity% to %user%'},

      {locale: 'en', string: 'give %tag% %number% %entity%'},
      {locale: 'en', string: 'give %tag% an %entity%'},
      {locale: 'en', string: 'give %tag% a %entity%'},
      {locale: 'en', string: 'give a %entity% to %tag%'},

      {locale: 'en', string: 'give %everyone% %number% %entity%'},
    ],

    intent: 'giveEntity',
    commandName: 'Give',
    description: 'Give something you have to another user.',

    scope: 'channel',
  },

  async run(message, args) {
    if (args.tradable.length === 0) {
      if(args.entities.length > 0) {
        throw new CommandException(`You can't trade that.`, `rinwha.png`);
      } else {
        throw new CommandException(`You didn't tell me what`, `rinwha.png`);
      }
    } else if (args.tradable.length !== 1) {
      throw new CommandException(`Which one?`, `rinconfuse.png`);
    }

    if(args.everyone) {
      if(message.member.roles.cache.some((role) => role.name === 'Mods')) {
        this.giveEveryone(message,args);
      } else {
        throw new CommandException('Nice try.', 'smugrin.png');
      } 
    } else {
      this.giveObject(message,args);
    }
  },

  giveEveryone(message,args) {
    const entity = args.tradable[0];
    const num = args.quantities[0] ? parseInt(args.quantities[0]) : 1;

    const entityString = num > 1 ? entity.plural : entity.determiner + ' ' + entity.name;
    const entityNumString = num > 1 ? num + ' ' + entityString : entityString;

    const users = database.getAllUsers.all();
    users.forEach((user) => {
      const thisUser = new User(undefined, user.user, user.guild);
      thisUser.changeEntityQuantity(entity.id, num);
    });

    message.channel.send('Ok, you gave everyone ' + entityNumString);
  },

  giveObject(message,args) {
    const sourceUser = new User(message);
    const destUser = args.mentions[0] || args.tags[0];
    const entity = args.tradable[0];
    const num = args.quantities[0] ? parseInt(args.quantities[0]) : 1;

    const entityString = num > 1 ? entity.plural : entity.determiner + ' ' + entity.name;
    const entityNumString = num > 1 ? num + ' ' + entityString : entityString;

    if (entity.id == 'christmasPresent') {
      throw new CommandException('Its not Christmas yet!', 'rinwha.png');
    }

    if (sourceUser.getEntityQuantity(entity.id) >= num) {
      if (num < 1) {
        throw new CommandException(`Fine, no ${entityString} for them`, 'rinsmug.png');
      } else if (destUser.getId() == message.author.id) {
        throw new CommandException(`You cant give ${entityString} to yourself!`, 'rinconfuse.png');
      } else if (
        message.client.users.cache.get(destUser.getDiscordUser().bot && message.client.user.id != destUser.getId())
      ) {
        throw new CommandException(`Why would that bot need ${entityString}...`, 'rinwha.png');
      } else {
        if (destUser.getId() == message.client.user.id) {
          if (entity.id === 'orange') {
            message.channel.send(`Thanks, I'll put them to good use`);
            sourceUser.changeEntityQuantity(entity.id, -num);
            destUser.changeEntityQuantity(entity.id, num);
          } else {
            message.channel.send('You keep that for now <:rinlove:726120311967449199>');
          }
        } else {
          message.channel.send('Ok, you gave ' + entityNumString);
          sourceUser.changeEntityQuantity(entity.id, -num);
          destUser.changeEntityQuantity(entity.id, num);
        }
      }
    } else {
      message.channel.send(`You don't have ` + entityNumString + ' to give');
    }
  },
};
