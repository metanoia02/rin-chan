import { Client, Events, Message } from 'discord.js';
import { RinChan } from '../entity/RinChan';
import { TriggerWord } from '../types/TriggerWords';
import arrayRandom from '../util/arrayRandom';
import detectSpam from '../util/detectSpam';
import handleError from '../util/handleError';

const triggerWords: TriggerWord[] = [
  {
    test: function (messageContent, rinChan) {
      return (
        messageContent.includes('orange') && !this.regex!.test(messageContent) && rinChan.hunger > 3
      );
    },
    regex: /<:\w*orange\w*:[0-9]+>/gi,
    response: ['Who said orange?! Gimme!'],
  },
  {
    test: function (messageContent, rinChan) {
      return messageContent.includes('🍊') && rinChan.hunger > 3;
    },
    response: [`That's my orange! Gimme!`],
  },
  {
    test: function (messageContent, rinChan) {
      if (
        (this.active && messageContent.toLowerCase().includes('good night')) ||
        (this.active && messageContent.toLowerCase().includes('goodnight'))
      ) {
        this.active = false;
        setTimeout(function () {
          module.exports.triggerWords[2].active = true;
        }, 600000);
        return true;
      } else {
        return false;
      }
    },
    response: [`Good night, sleep well!`],
    active: true,
  },
];

async function isValidMessage(message: Message): Promise<boolean> {
  if (message.author.bot) return false;
  if (await detectSpam(message)) return false;

  return true;
}

/*
function handleX(message: Message): boolean {
  const xRegex = /^https:\/\/x\.com\/\S+\/status\/[0-9]+\S*/ /*gi;

  if (xRegex.test(message.content)) {
    message.channel.send(message.content.replace('x.com', 'Fixupx.com'));
    return true;
  } else {
    return false;
  }
}*/

async function handleTriggerWords(message: Message): Promise<boolean> {
  const rinChan = await RinChan.get(message.guild!.id);

  const trigger = triggerWords.find((element) => element.test(message.content, rinChan));
  if (trigger) {
    message.channel.send(arrayRandom(trigger.response));
    return true;
  } else {
    return false;
  }
}

export default (client: Client): void => {
  client.on(Events.MessageCreate, async (message: Message) => {
    try {
      if (await isValidMessage(message)) {
        //Lowest priority
        if (await handleTriggerWords(message)) return;

        if (message.mentions.has(client.user!))
          message.channel.send('<:rinwha:787036890606993438>');
      } else {
        // No message Caught
      }
    } catch (error) {
      if (error instanceof Error) {
        handleError(error, message.guild!);
      }
    }
  });
};
