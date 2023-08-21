import { MinMax } from './MinMax';

export type ReactionResponse = {
  hunger?: number | MinMax;
  mood?: number | MinMax;
  affection?: number | MinMax;
  boost?: boolean;
  response: string[];
  image?: string;
  time?: MinMax;
};
