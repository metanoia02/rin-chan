const rinChan = require('../rinChan/rinChan.js');
const utils = require('../utils/utils.js');
const Discord = require('discord.js');

module.exports = class Reaction {
  /**
   *
   * @param {*} filePath
   */
  constructor(filePath, commandName) {
    this.config = require(filePath);
    this.commandName = commandName;
  }

  /**
   *
   * @param {*} user
   */
  getReaction(user) {
    let answers = [];

    if (this.config.hasOwnProperty('responses')) {
      answers = this.config.responses.filter((response) => {
        let moodFulfilled = true;
        let hungerFulfilled = true;
        let affectionFulfilled = true;
        let boostFulfilled = true;

        if (response.hasOwnProperty('mood')) {
          moodFulfilled = this.checkFulfilled(response.mood, rinChan.getMood().value);
        }
        if (response.hasOwnProperty('hunger')) {
          hungerFulfilled = this.checkFulfilled(response.hunger, rinChan.getHunger());
        }
        if (response.hasOwnProperty('affection') && user) {
          affectionFulfilled = this.checkFulfilled(response.affection, user.getAffection());
        }
        if (response.hasOwnProperty('boost') === true && user) {
          boostFulfilled = response.boost && user.getIsBooster();
        }

        return moodFulfilled && hungerFulfilled && affectionFulfilled && boostFulfilled;
      });
    }

    let answer = {};
    const reaction = {}; 

    if (answers.length === 0) {
      reaction.string = utils.arrayRandom(this.config.default);
    } else {
      answer = utils.arrayRandom(answers);

      reaction.string = utils.arrayRandom(answer.response);
    }

    if (this.config.hasOwnProperty('followUp')) {
      reaction.string += ' ' + utils.arrayRandom(this.config.followUp);
    }

    if (answer.hasOwnProperty('image')) {
      reaction.image = this.config.images.path + answer.image;
      reaction.imageName = answer.image;
    } else if (this.config.hasOwnProperty('images')) {
      reaction.imageName = Math.floor(Math.random() * this.config.images.quantity) + 1 + '.jpg';
      reaction.image = this.config.images.path + reaction.imageName;
    }
    return reaction;
  }

  /**
   *
   * @param {*} user
   */
  getEmbed(user) {
    const reaction = this.getReaction(user);

    const attachment = new Discord.MessageAttachment(reaction.image, reaction.imageName);
    const embed = new Discord.MessageEmbed()
      .setColor(this.config.embedColour)
      .setTitle(this.commandName)
      .setDescription(reaction.string)
      .attachFiles(attachment)
      .setThumbnail(`attachment://${reaction.imageName}`);

    if (user.hasDiscordMember()) {
      embed.setFooter(`${user.getDiscordMember().displayName}`, user.getDiscordUser().avatarURL());
    }
    return embed;
  }

  /**
   *
   * @param {*} modifier
   * @param {*} checkValue
   */
  checkFulfilled(modifier, checkValue) {
    if (typeof modifier === 'object') {
      return checkValue >= modifier.min && checkValue <= modifier.max;
    } else {
      return modifier === checkValue;
    }
  }
};

// todo max min from rinChan

/*
mood 0-5
    angrey
    sad
    neutral
    ok
    good
    amazing
hunger 0-5
    rinangrey
    rinpout
    flap
    flapflap
    turboflap
    stuffed
affection 0-5
    0
    20
    40
    60
    80
    100


*/

/*
mood 0-5
    angrey
    sad
    neutral
    ok
    good
    amazing*/

// modifier = [mood,hunger,affection]

// midnight random mood
// hunger level decrease mood by 1 each hour less than 3
