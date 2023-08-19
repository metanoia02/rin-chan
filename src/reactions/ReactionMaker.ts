import { User } from '../entity/User';
import { Reaction } from '../types/Reaction';
import { MinMax, isMinMax } from '../types/MinMax';
import { AttachedEmbed } from '../types/AttachedEmbed';
import { ReactionResponse } from '../types/ReactionResponse';
import { ReactionReply } from '../types/ReactionReply';
import arrayRandom from '../util/arrayRandom';
import { readdirSync } from 'fs';
import { RinChan } from '../entity/RinChan';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';

export const ReactionMaker = {
  async getReaction(config: Reaction, user: User): Promise<ReactionReply> {
    let answers: ReactionResponse[] = [];
    const rinChan = await RinChan.get(user.guild);

    if (config.responses) {
      answers = config.responses.filter(async (response) => {
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
        if (response.boost && (await user.getDiscordMember())) {
          boostFulfilled = response.boost && (await user.isBoosting());
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
      return { reply: defaultAnswer, imagePath: config.images, imageFilename: image };
    } else {
      const response = arrayRandom(config.responses!);
      return {
        reply: arrayRandom(response.response),
        imagePath: config.images,
        imageFilename: response.image,
      };
    }
  },

  /**
   *
   * @param {*} user
   */
  async getEmbed(config: Reaction, user: User): Promise<AttachedEmbed> {
    const reaction = await this.getReaction(config, user);

    const commandAttachment = new AttachmentBuilder(reaction.imagePath + reaction.imageFilename);
    const commandEmbed = new EmbedBuilder()
      .setDescription(reaction.reply)
      .setThumbnail(`attachment://${reaction.imageFilename}`);

    const attachedEmbed = { files: [commandAttachment], embeds: [commandEmbed] };

    attachedEmbed.embeds[0].setColor(config.embedColour);

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
