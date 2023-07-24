import { Config } from './types/Config';

export const config: Config = {
  orangeHarvestCooldown: 2400000,

  hungerIcon: [
    './images/hunger/0.png', // Stuffed
    './images/hunger/1.gif', // Turbo Flap
    './images/hunger/2.gif', // Normal Flap
    './images/hunger/3.png', // NoFlap
    './images/hunger/4.png', // Pout
    './images/hunger/5.png', // Angrey
  ],

  levels: [
    {
      name: 'Mandarin',
      xp: 3000,
    },
    {
      name: 'Tangerine',
      xp: 2000,
    },
    {
      name: 'Mikan',
      xp: 1500,
    },
    {
      name: 'Satsuma',
      xp: 1000,
    },
    {
      name: 'Valencia Orange',
      xp: 600,
    },
    {
      name: 'Blood Orange',
      xp: 400,
    },
    {
      name: 'Navel Orange',
      xp: 200,
    },
    {
      name: 'Clementine',
      xp: 90,
    },
    {
      name: 'Seville Orange',
      xp: 30,
    },
    {
      name: 'Orange peel',
      xp: 10,
    },
    {
      name: 'Seedling',
      xp: 0,
    },
  ],
};
