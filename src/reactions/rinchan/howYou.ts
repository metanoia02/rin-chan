import { Reaction } from '../../types/Reaction';

export const howYou: Reaction = {
  embedColour: '#FFFFFF',

  default: {
    response: ["I'm pretty good."],
  },

  images: './src/images/emotes/',

  responses: [
    {
      mood: 0,
      response: ['Len stole my oranges!'],
      image: 'rinno.png',
    },
    {
      mood: 1,
      response: ['I miss singing at concerts...'],
      image: 'rinbuaaa.png',
    },
    {
      mood: 2,
      response: ["I'm Okay."],
      image: 'rinchill.png',
    },
    {
      mood: 3,
      response: ["I'm pretty good."],
      image: 'rinchill.png',
    },
    {
      mood: 4,
      response: ['Im happy.'],
      image: 'rintriumph.png',
    },
    {
      mood: 5,
      response: ['I feel amazing!'],
      image: 'rinlove.png',
    },
  ],

  followUp: ['How are you?', 'How you doing?', 'What about you?'],
};
