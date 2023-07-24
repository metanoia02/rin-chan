import { ReactionConfig } from 'src/interfaces/IReaction';

export const findOrange: ReactionConfig = {
  images: './images/findOrange/',

  embedColour: '#FF4500',

  default: {
    response: [
      'Found an orange!',
      'I got one!',
      'There it is! An orange.',
      'I almost got lost, but here it is!',
    ],
  },
};
