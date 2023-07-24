import { ReactionConfig } from 'src/interfaces/IReaction';

export const findCarrot: ReactionConfig = {
  images: './images/gumi/findCarrot/',

  default: {
    response: [
      'What is this?',
      "It's the right colour but the wrong shape...",
      'What a strange orange!',
    ],
  },

  followUp: ["I'll keep it for later.", 'It tastes weird!', 'What should I do with it?'],
};
