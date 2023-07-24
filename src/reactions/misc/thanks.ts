import { ReactionConfig } from 'src/interfaces/IReaction';

export const thanks: ReactionConfig = {
  embedColour: '#FF4500',

  images: './images/emotes/',

  default: {
    response: [`You're welcome`, 'No problem'],
    image: 'rinlove.png',
  },
};
