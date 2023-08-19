import { Reaction } from '../../types/Reaction';

export const findLen: Reaction = {
  images: './src/images/len/',

  embedColour: 0xffff00,

  default: {
    response: [
      'Found a Len! <:rinwao:701505851449671871>',
      `Len, you're not an orange! You're a banana!`,
      'Len, you scared me! I thought you were a giant orange!',
      'Hey, Len. How did you get here? Did you take the wrong bus?',
      `Now I have to drag you back home. You're heavier than a sack of potatoes`,
    ],
  },
};
