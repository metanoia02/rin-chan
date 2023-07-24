import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { IsInt, Min, Max } from 'class-validator';
import { InventoryStack } from './InventoryStack';
import { GuildMember } from 'discord.js';

/**
 * Represents a User.
 */
@Entity()
export class User {
  @PrimaryColumn()
  public id!: string;

  @PrimaryColumn()
  public guild!: string;

  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  @Max(100)
  public affection!: number;

  @Column({ default: 3 })
  public harvestAttempts!: number;

  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  public lastFedRinchan!: number;

  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  public lastHarvested!: number;

  @Column({ default: 0 })
  @IsInt()
  @Min(0)
  public xp!: number;

  @OneToMany(() => InventoryStack, (inventoryStack) => inventoryStack.user, {
    eager: true,
  })
  public inventory?: InventoryStack[];

  public discordMember!: GuildMember;

  public isBoosting!: boolean;
}
