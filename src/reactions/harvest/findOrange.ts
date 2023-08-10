import { Reaction } from '../../types/Reaction';

export const findOrange: Reaction = {
  images: './src/images/findOrange/',

  embedColour: 0xff4500,

  default: {
    response: [
      'Found an orange!',
      'I got one!',
      'There it is! An orange.',
      'I almost got lost, but here it is!',
    ],
  },
};
