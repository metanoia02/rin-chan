import { Reaction } from '../../types/Reaction';

export const howYou: Reaction = {
  embedColour: '#FFFFFF',

  default: {
    response: ["I'm pretty good."],
  },

  responses: [
    {
      mood: 0,
      response: ['Len stole my oranges!'],
    },
    {
      mood: 1,
      response: ['I miss singing at concerts...'],
    },
    {
      mood: 2,
      response: ["I'm Okay."],
    },
    {
      mood: 3,
      response: ["I'm pretty good."],
    },
    {
      mood: 4,
      response: ['Im happy.'],
    },
    {
      mood: 5,
      response: ['I feel amazing!'],
    },
  ],

  followUp: ['How are you?', 'How you doing?', 'What about you?'],
};
