import {
  Entity,
  Column,
  PrimaryColumn,
} from "typeorm";
import {
  IsInt,
  Min,
  Max,
  IsBoolean,
} from "class-validator";

import { Guild } from "discord.js";
import { clamp } from "src/util/clamp";

/**
 * Represents a Rinchan on a particular server.
 */
@Entity()
export class RinChan {
  @PrimaryColumn()
  public id!: string;

  @PrimaryColumn()
  public guildId!: string;

  @Column({ default: 5})
  @IsInt()
  @Min(0)
  @Max(5)
  public hunger!: number;

  @Column({ default: 3 })
  @IsInt()
  @Min(1)
  @Max(6)
  public mood!: number;

  @Column({default: new Date(0)})
  public lastFed!: Date;

  @Column({ default: false })
  @IsBoolean()
  public collecting!: boolean;

  changeHunger(guild:Guild, hunger:number) {
    this.hunger = clamp(1,5,hunger);

    guild.setIcon(config.icons[hunger]);
  }
}
