import { Reaction } from '../../types/Reaction';

export const thanks: Reaction = {
  embedColour: '#FF4500',

  images: './src/images/emotes/',

  default: {
    response: [`You're welcome`, 'No problem'],
    image: 'rinlove.png',
  },
};
