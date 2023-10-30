import { Message } from 'discord.js';
import { RinChan } from 'src/entity/RinChan';

export type TriggerWord = {
  test(messageContent: string, rinChan: RinChan): boolean;
  response: string[];
  regex?: RegExp;
  active?: boolean;
};
