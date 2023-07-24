import { ReactionConfig } from 'src/interfaces/IReaction';

export const giveHeadpat: ReactionConfig = {
  images: './images/emotes/',

  default: {
    response: [' You got a headpat from '],
    image: 'rinheadpat.png',
  },
};
