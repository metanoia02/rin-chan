import { Client, Events, Message } from 'discord.js';

const twitterRegex = /^https:\/\/twitter\.com\/\S+\/status\/[0-9]+\S*/gi;

function isValidMessage(message: Message): boolean {
  if (message.author.bot) return false;
  /*
  if (utils.mentionSpamDetect(message)) {
    return false;
  }*/

  return true;
}

export default (client: Client): void => {
  client.on(Events.MessageCreate, async (message: Message) => {
    if (isValidMessage(message)) {
      if (twitterRegex.test(message.content) && message.embeds.length == 0) {
        message.channel.send(message.content.replace('twitter', 'vxtwitter'));
      }
    }
  });
};

/*
  const reg = "^<@" + rinChan.getId() + ">|^<@!" + rinChan.getId() + ">";
  const rinTest = new RegExp(reg);

    if (
      message.mentions.has(client.user) &&
      message.guild &&
      rinTest.test(message.content)
    ) {
      if (message.content.length < 23 && !rinChan.getCollecting()) {
        message.channel.send("Yes?");
      } else if (message.content.length > 23) {
        if (!(await moduleManager.runCommand(message))) {
          if (!rinChan.getCollecting()) {
            message.channel.send("<:rinwha:787036890606993438>");
          }
        }
      }
    } else if (!rinChan.getCollecting()) {
      const trigger = config.triggerWords.find((element) =>
        element.test(message.content, rinChan)
      );
      if (trigger) message.channel.send(trigger.response);
    }
*/
