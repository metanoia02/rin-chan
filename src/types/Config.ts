import { Level } from './Level';

export interface Config {
  orangeHarvestCooldown: number;

  levels: Level[];

  hungerIcon: string[];
}
