import { Reaction } from 'src/types/Reaction';

export const birthdayReact: Reaction = {
  embedColour: '#FF8C00',

  images: './images/birthday/',

  default: {
    response: [
      `Thanks, I'm having so much fun!`,
      'This is the best birthday ever!',
      'Did you see any cake around here?',
      `Thank you! Let's have fun!`,
    ],
  },
};
