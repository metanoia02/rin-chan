import { User } from '../entity/User';
import { Reaction } from '../types/Reaction';
import { MinMax, isMinMax } from '../types/MinMax';
import { rinChanRepository } from '../repository/rinChanRepository';
import { AttachedEmbed } from '../types/AttachedEmbed';
import { ReactionResponse } from '../types/ReactionResponse';
import { ReactionReply } from '../types/ReactionReply';
import arrayRandom from '../util/arrayRandom';
import { readdirSync } from 'fs';
import { commandEmbed } from '../util/commands';

export const ReactionMaker = {
  async getReaction(config: Reaction, user: User): Promise<ReactionReply> {
    let answers: ReactionResponse[] = [];
    const rinChan = await rinChanRepository.get(user.guild);

    if (config.responses) {
      answers = config.responses.filter((response) => {
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

    if (answers.length < 1) {
      const defaultAnswer = arrayRandom(config.default.response);
      let image = '';

      if (config.default.image) {
        image = config.default.image;
      } else {
        if (config.images) {
          image = arrayRandom(readdirSync(config.images));
        }
      }
      return { reply: defaultAnswer, image: config.images + image };
    } else {
      return arrayRandom(
        config.responses!.map((response) => ({
          reply: arrayRandom(response.response),
          image: config.images + response.image,
        })),
      );
    }
  },

  /**
   *
   * @param {*} user
   */
  async getEmbed(config: Reaction, user: User): Promise<AttachedEmbed> {
    const reaction = await this.getReaction(config, user);

    const attachedEmbed = commandEmbed(reaction.reply, reaction.image);
    attachedEmbed.embeds[0].setColor(config.embedColour);

    if (user.discordMember) {
      attachedEmbed.embeds[0].setFooter({
        text: user.discordMember.displayName,
        iconURL: user.discordMember.avatarURL()!,
      });
    }
    return attachedEmbed;
  },

  /**
   *
   * @param {*} modifier
   * @param {*} checkValue
   */
  checkFulfilled(modifier: MinMax | number, checkValue: number) {
    if (isMinMax(modifier)) {
      return checkValue >= modifier.min && checkValue <= modifier.max;
    } else {
      return modifier === checkValue;
    }
  },
};
