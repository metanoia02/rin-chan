import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Guild } from 'discord.js';
import { clamp } from '../util/clamp';
import { config } from '../config';
import * as schedule from 'node-schedule';
import { client } from '../client';

/**
 * Represents a Rinchan on a particular server.
 */
@Entity()
export class RinChan extends BaseEntity {
  @PrimaryColumn()
  public id!: string;

  @PrimaryColumn()
  public guildId!: string;

  @Column({ default: 5 })
  public hunger!: number;

  @Column({ default: 3 })
  public mood!: number;

  @Column({ default: 0 })
  public lastFed!: number;

  @Column({ default: false })
  public collecting!: boolean;

  changeHunger(guild: Guild, hunger: number) {
    this.hunger = clamp(1, 5, hunger);

    guild.setIcon(config.hungerIcon[hunger]);
  }

  static async get(guildId: string): Promise<RinChan> {
    const rinChan = await RinChan.findOne({ where: { guildId: guildId } });

    if (rinChan) {
      return rinChan;
    } else {
      return await RinChan.newRinchan(guildId);
    }
  }

  private static async newRinchan(guild: string): Promise<RinChan> {
    const rinChan = new RinChan();
    rinChan.id = client.user!.id;
    rinChan.guildId = guild;
    await RinChan.save(rinChan);
    return rinChan;
  }

  async feed() {}

  async moodUp() {}
}

/**
 * Run once an hour
 */
schedule.scheduleJob('0 * * * *', async function () {
  const rinChans = await RinChan.find();
  rinChans.forEach((rinChan: RinChan) => {
    const randomDelay = Math.floor(Math.random() * 3600000) + 1;

    setTimeout(async () => {
      rinChan.hunger = clamp(0, 5, rinChan.hunger + 1);
      await rinChan.save();
    }, randomDelay);
  });
});

/**
 * Run once a day.
 */
schedule.scheduleJob('0 0 * * *', async function () {
  // Set Random moods for RinChans
  const rinChans = await RinChan.find();
  rinChans.forEach(async (rinChan: RinChan) => {
    const modifier = Math.floor((4 - 1) / 2);
    let newMood = Math.floor(Math.random() * 4) - modifier;
    newMood = clamp(0, 5, newMood);
    rinChan.mood = newMood;
    await rinChan.save();
  });
});
