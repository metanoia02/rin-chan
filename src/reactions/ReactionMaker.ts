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
      for (const response of config.responses) {
        let moodFulfilled = true;
        let hungerFulfilled = true;
        let affectionFulfilled = true;
        let boostFulfilled = true;
        let timeFulfilled = true;

        if (response.mood != undefined) {
          moodFulfilled = this.checkFulfilled(response.mood, rinChan.mood);
        }
        if (response.hunger != undefined) {
          hungerFulfilled = this.checkFulfilled(response.hunger, rinChan.hunger);
        }
        if (response.affection != undefined && user) {
          affectionFulfilled = this.checkFulfilled(response.affection, user.affection);
        }
        if (response.boost && (await user.getDiscordMember())) {
          boostFulfilled = response.boost && (await user.isBoosting());
        }
        if (response.time != undefined) {
          timeFulfilled = this.checkFulfilled(response.time, new Date().getHours());
        }

        if (moodFulfilled && hungerFulfilled && affectionFulfilled && boostFulfilled)
          answers.push(response);
      }
    }

    let reaction: ReactionReply;

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
      reaction = { reply: defaultAnswer, imagePath: config.images, imageFilename: image };
    } else {
      const response = arrayRandom(answers);
      reaction = {
        reply: arrayRandom(response.response),
        imagePath: config.images,
        imageFilename: response.image,
      };
    }

    if (config.followUp) {
      reaction.reply += ' ' + arrayRandom(config.followUp);
    }

    return reaction;
  },

  /**
   *
   * @param {*} user
   */
  async getEmbed(config: Reaction, user: User): Promise<AttachedEmbed> {
    const reaction = await this.getReaction(config, user);

    const commandAttachment = new AttachmentBuilder(reaction.imagePath + reaction.imageFilename);
    const commandEmbed = new EmbedBuilder()
      .addFields([{ name: '\u200b', value: reaction.reply }])
      .setThumbnail(`attachment://${reaction.imageFilename}`)
      .setColor(config.embedColour);

    const attachedEmbed = { files: [commandAttachment], embeds: [commandEmbed] };

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
