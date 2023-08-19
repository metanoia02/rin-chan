import { Reaction } from '../../types/Reaction';

export const couldntFind: Reaction = {
  images: './src/images/emotes/',

  embedColour: 0xff0000,

  default: {
    response: [`Couldn't find anything`, 'Bad news. All I could find was Papayas.'],
    image: 'rinyabai.png',
  },
};
