import { ReactionConfig } from 'src/interfaces/IReaction';

export const imTired: ReactionConfig = {
  images: './images/emotes/',

  embedColour: '#FF0000',

  default: {
    response: ["I'm tired!"],
    image: 'rinded.png',
  },

  responses: [
    {
      mood: { min: 0, max: 1 },

      response: ["That's it I'm done for now."],
      image: 'rinangrey.png',
    },
    {
      mood: { min: 0, max: 1 },

      response: ['Not now...'],
      image: 'rinsick.png',
    },
    {
      mood: { min: 2, max: 5 },

      response: ['Please wait a while.'],
      image: 'rintap.gif',
    },
    {
      mood: { min: 2, max: 5 },

      response: ['Come back later.'],
      image: 'rinded.png',
    },
    {
      boost: true,

      response: ["I need a break, next time I'll get one for sure!"],
      image: 'rincthumb.png',
    },
  ],
};
