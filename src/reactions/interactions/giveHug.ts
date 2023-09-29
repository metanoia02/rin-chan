import { Reaction } from '../../types/Reaction';

export const giveHug: Reaction = {
  embedColour: '#FFFFFF',

  images: './src/images/hug/',

  default: {
    response: [
      ' you got a hug from ',
      ` you’re such a good hugger!`,
      ' you look like you need a hug! You got a hug from ',
      ` don’t worry, I’m here for you!`,
      ' everything will be okay, I promise!',
    ],
  },
};
