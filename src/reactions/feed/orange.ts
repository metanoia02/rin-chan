import { Reaction } from '../../types/Reaction';

export const feedOrangeReact: Reaction = {
  images: './src/images/emotes/',

  embedColour: '#FF4500',

  default: {
    response: ['Another delicious orange!', 'Wow! This orange looks so juicy and delicious!'],
    image: 'orangebliss.png',
  },

  responses: [
    {
      hunger: 5,
      response: [`I'm starving! What took you so long`],
      image: 'rinangrey.png',
    },
    {
      hunger: 1,
      response: [`Thanks, I can't eat another bite`],
      image: 'rinstuffed.png',
    },
    {
      boost: true,
      response: [`An orange for me? You're so sweet!`],
      image: 'orangebliss.png',
    },
  ],
};
