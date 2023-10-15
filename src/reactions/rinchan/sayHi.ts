import { Reaction } from '../../types/Reaction';

export const sayHi: Reaction = {
  embedColour: '#FFFFFF',

  images: './src/images/emotes/',

  default: {
    response: ['Why are you bothering me at this time, I need to sleep!'],
    image: 'rinangrey.png',
  },

  responses: [
    {
      time: { min: 5, max: 11 },

      response: ['Good morning'],
      image: 'oharin.png',
    },
    {
      time: { min: 12, max: 17 },

      response: ['Good afternoon'],
      image: 'rintap.gif',
    },
    {
      time: { min: 18, max: 23 },

      response: ['Good evening'],
      image: 'rinlove.png',
    },
  ],
};
