import { User } from 'src/entity/User';
import { Reaction } from 'src/types/Reaction';
import { MinMax } from 'src/types/MinMax';
import { rinChanRepository } from 'src/repository/rinChanRepository';
import { AttachedEmbed } from 'src/types/AttachedEmbed';

export const ReactionManager = {
  getReaction(config: Reaction, user: User) {
    let answers = [];
    const rinChan = rinChanRepository.get(user.guild);

    if (this.config.responses) {
      answers = this.config.responses.filter((response) => {
        let moodFulfilled = true;
        let hungerFulfilled = true;
        let affectionFulfilled = true;
        let boostFulfilled = true;

        if (response.mood) {
          moodFulfilled = this.checkFulfilled(response.mood, rinChan.mood);
        }
        if (response.hunger) {
          hungerFulfilled = this.checkFulfilled(response.hunger, rinChan.hunger);
        }
        if (response.affection && user) {
          affectionFulfilled = this.checkFulfilled(response.affection, user.affection);
        }
        if (response.boost && user.discordMember) {
          boostFulfilled = response.boost && user.isBoosting;
        }

        return moodFulfilled && hungerFulfilled && affectionFulfilled && boostFulfilled;
      });
    }

    let answer = {};
    const reaction = {};

    if (answers.length === 0) {
      if (!this.config.default) {
        throw new Error(
          'Reactions with no default responses must have a response for every condition',
        );
      }
      reaction.string = utils.arrayRandom(this.config.default);
    } else {
      answer = utils.arrayRandom(answers);

      reaction.string = utils.arrayRandom(answer.response);
    }

    if (this.config.followUp) {
      reaction.string += ' ' + utils.arrayRandom(this.config.followUp);
    }

    if (answer.image) {
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
  getEmbed(config: Reaction, user: User):AttachedEmbed {
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

  isMinMax(value: MinMax | number): value is MinMax {
    return (value as MinMax).min !== undefined;
  }

  /**
   *
   * @param {*} modifier
   * @param {*} checkValue
   */
  checkFulfilled(modifier: MinMax | number, checkValue: number) {
    if (this.isMinMax(modifier)) {
      return checkValue >= modifier.min && checkValue <= modifier.max;
    } else {
      return modifier === checkValue;
    }
  }
}
