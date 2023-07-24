import { MinMax } from './MinMax';

export interface Reaction {
  embedColour?: string;
  images?: string;
  default: { response: string[]; image?: string };
  responses?: {
    hunger?: number | MinMax;
    mood?: number | MinMax;
    affection?: number | MinMax;
    boost?: boolean;
    response: string[];
    image?: string;
  }[];
  followUp?: string[];
}
