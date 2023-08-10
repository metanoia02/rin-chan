import { Reaction } from '../../types/Reaction';

export const giveHeadpat: Reaction = {
  embedColour: '#FFFFFF',

  images: './src/images/emotes/',

  default: {
    response: [' You got a headpat from '],
    image: 'rinheadpat.png',
  },
};
