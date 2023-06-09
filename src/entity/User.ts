import { GuildMember } from "discord.js";
import { Entity, PrimaryColumn, Column, UpdateDateColumn, OneToMany } from "typeorm"
import { UserInventoryItem } from "./UserInventoryItem";
import { UserSongBookItem } from "./UserSongBookItem";

/**
 * Represents a User.
 */
@Entity()
export class User {
  @PrimaryColumn()
  public id?: number;

  @PrimaryColumn()
  public guild?: number;

  @Column()
  public affection?: number;

  @Column()
  public harvestAttempts?: number;

  @UpdateDateColumn()
  public lastFedRinchan?: Date;

  @UpdateDateColumn()
  public lastHarvested?: Date;

  @Column()
  public booster?: boolean;

  @Column()
  public xp?: number;

  @OneToMany(() => UserInventoryItem, (inventory:UserInventoryItem) => inventory.userId)
  public inventory?: UserInventoryItem[];

  @OneToMany(() => UserSongBookItem, (inventory:UserSongBookItem) => inventory.userId)
  public songBook?: UserSongBookItem[];
};
