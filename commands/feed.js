const User = require('../utils/User.js');
const CommandException = require('../utils/CommandException.js');
const Reaction = require('../reactions/reaction.js');
const rinChan = require('../rinChan/rinChan.js');
const commandUtils = require('../utils/commandUtils.js');

module.exports = {
  config: {
    training: [
      {locale: 'en', string: 'have an %object%'},
      {locale: 'en', string: 'give %object%'},
      {locale: 'en', string: `here's an %object%`},
      {locale: 'en', string: `eat an %object%`},
    ],

    intent: 'feedObject',
    commandName: 'Feed Rin-chan',
    description: 'Give an orange or other orange based foods to Rin-Chan.',

    scope: 'channel',

    feedableObjects: [{objectName: 'orange', func: 'feedOrange'}],
    orangeGiveCooldown: 300000,
  },

  init() {
    this.orangeReaction = new Reaction('../reactions/feed/orange.json', this.config.commandName);
  },

  async run(message, args) {
    commandUtils.validateSingleObjectAction(args);

    const object = args.objects[0];
    if (!this.config.feedableObjects.some((obj) => obj.objectName == object.getName())) {
      throw new CommandException(`I don't fancy one of those right now`, 'rinlove.png');
    }

    const user = new User(message);
    if (user.getObjectQuantity(object.getName()) < 1) {
      throw new CommandException(`You don't have any ${object.getPlural()}!`, 'rinconfuse.png');
    }
    if (this.checkGiveSpam(user) || rinChan.getHunger() >= 4) {
      const functionName = this.config.feedableObjects.find((ele) => ele.objectName === object.getName()).func;
      this[functionName](message, user, object);
    } else {
      throw new CommandException(`Hang on, I'm still eating...`, 'rinchill.png');
    }
  },

  feedOrange(message, user, object) {
    const currentTime = new Date();

    if (rinChan.getHunger() === 0) throw new CommandException(`I'm stuffed, I cant eat another one`, 'rinstuffed.png');

    message.channel.send(this.orangeReaction.getEmbed(user));

    user.changeObjectQuantity(object.getName(), -1);
    user.changeAffection(1);
    user.setLastGive();
    rinChan.setHunger(rinChan.getHunger() - 1);
    rinChan.setLastFed(currentTime.getTime());

    user.addXp(1, message);
  },

  checkGiveSpam(sourceUser) {
    const currentTime = new Date();

    if (currentTime.getTime() - sourceUser.getLastGive() > this.config.orangeGiveCooldown) {
      return true;
    } else {
      return false;
    }
  },
};
