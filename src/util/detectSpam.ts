import { Message } from 'discord.js';
import { Server } from '../entity/Server';

export default async function detectSpam(message: Message): Promise<boolean> {
  if (getUserIdArr(message.content).length > 10) {
    message.member?.timeout(60 * 60 * 1000, 'Timed out for mention spam');

    message.author.send({
      content: 'Go spam somewhere else!',
      files: ['./src/images/spam/spam.jpg'],
    });
    message.delete();

    const server = await Server.get(message.guildId!);

    const channel = message.guild!.channels.cache.find((ch) => ch.id === server.diaryChannel);

    if (channel?.isTextBased()) {
      channel.send(`Muted ${message.author} for mention spam.`);
    }

    return true;
  }
  return false;
}

function getUserIdArr(command: string) {
  const userIdRegex = new RegExp(/<!*@!*([0-9]+)>/, 'g');

  const result = [...command.matchAll(userIdRegex)];

  return result.map((ele) => {
    return ele[1];
  });
}
