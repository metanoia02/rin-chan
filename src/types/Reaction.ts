import { MinMax } from './MinMax';
import { ReactionResponse } from './ReactionResponse';
import { ColorResolvable } from 'discord.js';

export interface Reaction {
  embedColour: ColorResolvable;
  images: string;
  default: { response: string[]; image?: string };
  responses?: ReactionResponse[];
  followUp?: string[];
}
