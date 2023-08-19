import { Reaction } from '../../types/Reaction';

export const stealOrange: Reaction = {
  images: './src/images/emotes/',

  embedColour: 0xff0000,

  default: {
    response: [
      `I found one! But I got hungry on the way back.`,
      `Hey, I'm back. I got you some oranges. Well, actually, I got you some orange peels.`,
      'I have some good news and some bad news. The good news is that I found some oranges for you. The bad news is that I ate them all on the way back.',
      'You can still use the peels for something, right? Like making jam or tea or something...',
    ],
    image: 'rintehe.png',
  },
};
