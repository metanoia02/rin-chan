import { Reaction } from '../../types/Reaction';

export const giveHug: Reaction = {
  embedColour: '#FFFFFF',

  images: './src/images/hug/',

  default: {
    response: [
      'You got a hug.',
      `You’re such a good hugger!`,
      'You look like you need a hug!',
      `Don’t worry, I’m here for you!`,
      'Everything will be okay, I promise!',
    ],
  },
  largeImage: true,
};
