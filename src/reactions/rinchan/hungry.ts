import { Reaction } from '../../types/Reaction';

export const hungry: Reaction = {
  embedColour: '#FFFFFF',

  images: './src/images/hungry/',

  default: {
    response: ['Dont you have one more orange?'],
    image: 'oharin.png',
  },

  responses: [
    {
      hunger: 0,

      response: ['Im stuffed'],
      image: 'rinchill.png',
    },
    {
      hunger: 5,

      response: ['Im starving here!'],
      image: 'rinangrey.png',
    },
    {
      hunger: 5,

      response: ['WHERE ARE MY ORANGES'],
      image: 'where.png',
    },
  ],
};
