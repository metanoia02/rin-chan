import { Entity, Column, OneToMany, PrimaryColumn, BaseEntity } from 'typeorm';
import { IsInt, Min, Max } from 'class-validator';
import { InventoryStack } from './InventoryStack';
import { Guild, GuildMember, TextChannel } from 'discord.js';
import { itemRepository } from '../repository/itemRepository';
import { config } from '../config';
import { Level } from '../types/Level';
import { serverRepository } from '../repository/serverRepository';
import { client } from '../client';
import * as schedule from 'node-schedule';
import { commandEmbed } from '../util/commands';
import { clamp } from '../util/clamp';
import { AppDataSource } from '../data-source';

/**
 * Represents a User.
 */
@Entity()
export class User extends BaseEntity {
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

  @Column({ default: Date.now() })
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
  public inventory!: InventoryStack[];

  public discordMember!: GuildMember;
  public discordGuild!: Guild;

  public isBoosting!: boolean;

  async changeQuantity(itemName: string, modifier: number) {
    if (!itemRepository.findOne({ where: { name: itemName } }))
      throw new Error(`Invalid Item: ${itemName}`);

    let inventoryStack = this.inventory?.findLast((stack) => stack.item.name == itemName);

    if (inventoryStack) {
      inventoryStack.quantity += modifier;
      if (inventoryStack.quantity < 0) {
        throw new Error('User.changeQuantity: Tried to set negative inventoryStack quantity');
      }
    } else {
      inventoryStack = await InventoryStack.newStack(this, itemName, modifier);
    }

    this.inventory.push(inventoryStack);
    await User.save(this);
  }

  async getQuantity(itemName: string): Promise<number> {
    if (!itemRepository.findOne({ where: { name: itemName } }))
      throw new Error(`Invalid Item: ${itemName}`);

    const inventoryStack = this.inventory?.findLast((stack) => stack.item.name == itemName);

    if (inventoryStack) {
      return inventoryStack.quantity;
    } else {
      return 0;
    }
  }

  getLevel(): Level | undefined {
    return config.levels.findLast((ele: Level) => this.xp >= ele.xp);
  } /*

  /**
   *Static methods
   */

  static async getUser(userId: string, guildId: string): Promise<User> {
    const user = await this.findOne({ where: { id: userId, guild: guildId } });

    if (!user) {
      return await this.newUser(userId, guildId);
    } else {
      user.discordMember = client.guilds.cache.get(guildId)!.members.cache.get(userId)!;
      const server = await serverRepository.get(guildId);

      if (server.boosterRole) {
        user.isBoosting = user.discordMember?.roles.cache.has(server.boosterRole);
      }

      return user;
    }
  }

  private static async newUser(id: string, guild: string): Promise<User> {
    const user = new User();
    user.id = id;
    user.guild = guild;
    //setup booster and member
    this.save(user);
    return user;
  }

  static async addXp(user: User, addedXp: number) {
    if (addedXp > 0) {
      const currentLevel = user.getLevel();
      user.xp += addedXp;
      User.save(user);
      const newLevel = user.getLevel();

      if (currentLevel && newLevel && currentLevel != newLevel) {
        const guild = client.guilds.cache.get(user.guild);

        if (guild) {
          const currentRole = guild.roles.cache.find((role) => role.name == currentLevel.name);
          const newRole = guild.roles.cache.find((role) => role.name == newLevel.name);

          if (currentRole && newRole) {
            await user.discordMember.roles.remove(currentRole, 'Level up');
            await user.discordMember.roles.add(newRole, 'Level up');

            const botChannel = (await serverRepository.get(user.guild)).botChannel;

            if (botChannel) {
              const channel = guild.channels.cache.get(botChannel);

              if (channel?.isTextBased) {
                (channel as TextChannel).send(
                  commandEmbed(`${user.id} Level up!`, './src/images/emotes/rinverywow.png'),
                );
              }
            }
          }
        }
      }
    } else {
      throw new Error('XP to add must be positive');
    }
  }
}

/**
 * Run once a day.
 */
schedule.scheduleJob('0 0 * * *', async function () {
  // Reduce users affection by 10
  const users = await User.find();
  users.forEach((user: User) => {
    user.affection = clamp(0, 100, user.affection - 10);
    User.save(user);
  });
});
