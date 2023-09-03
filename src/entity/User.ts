import { Entity, Column, OneToMany, PrimaryColumn, BaseEntity } from 'typeorm';
import { InventoryStack } from './InventoryStack';
import { Guild, GuildMember, TextChannel } from 'discord.js';
import { config } from '../config';
import { Level } from '../types/Level';
import { client } from '../client';
import * as schedule from 'node-schedule';
import { commandEmbed } from '../util/commands';
import { clamp } from '../util/clamp';
import { Item } from './Item';
import { Server } from './Server';
import { SlashCommandError } from '../util/SlashCommandError';

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
  public affection!: number;

  @Column({ default: 3 })
  public harvestAttempts!: number;

  @Column({ default: 0 })
  public lastFedRinchan!: number;

  @Column({ default: 0 })
  public lastHarvested!: number;

  @Column({ default: 0 })
  public xp!: number;

  @OneToMany(() => InventoryStack, (inventoryStack) => inventoryStack.user, {
    eager: true,
    cascade: true,
  })
  public inventory!: InventoryStack[];

  async getDiscordMember(): Promise<GuildMember> {
    let guild = client.guilds.cache.get(this.guild);
    if (!guild) guild = await client.guilds.fetch(this.guild);

    let member = guild?.members.cache.get(this.id);
    if (!member) member = await guild?.members.fetch(this.id);

    if (member) {
      return member;
    } else {
      throw new SlashCommandError('Discord connection error', this);
    }
  }

  async getDiscordGuild(): Promise<Guild> {
    let guild = client.guilds.cache.get(this.guild);
    if (!guild) guild = await client.guilds.fetch(this.guild);

    if (guild) {
      return guild;
    } else {
      throw new SlashCommandError('Discord connection error', this);
    }
  }

  async isBoosting(): Promise<boolean> {
    let guild = client.guilds.cache.get(this.guild);
    if (!guild) guild = await client.guilds.fetch(this.guild);

    let member = guild?.members.cache.get(this.id);
    if (!member) member = await guild?.members.fetch(this.id);

    if (member) {
      return member.premiumSince !== null;
    } else {
      throw new SlashCommandError('Discord connection error', this);
    }
  }

  /**
   * Add a single item to the user
   * @param itemId Id of item
   */
  async giveItem(itemId: string) {
    await this.setQuantity(itemId, (await this.getQuantity(itemId)) + 1);
  }

  /**
   * Remove a single item to the user
   * @param itemId Id of item
   */
  async takeItem(itemId: string) {
    if ((await this.getQuantity(itemId)) > 0) {
      await this.setQuantity(itemId, (await this.getQuantity(itemId)) - 1);
    } else {
      throw new SlashCommandError('Tried to take item user does not have.', this);
    }
  }

  async setQuantity(itemId: string, quantity: number) {
    if (!Item.exists(itemId)) throw new SlashCommandError(`Invalid Item`, itemId);

    if (quantity < 0)
      throw new SlashCommandError(
        'User.setQuantity: Tried to set negative inventoryStack quantity',
        this,
      );

    let inventoryStack = this.inventory?.findLast((stack) => stack.item.id == itemId);

    if (inventoryStack) {
      inventoryStack.quantity = quantity;
    } else {
      inventoryStack = new InventoryStack();
      inventoryStack.user = this;
      inventoryStack.item = await Item.get(itemId);
      inventoryStack.quantity = quantity;

      this.inventory.push(inventoryStack);
    }

    await User.save(this);
  }

  async getQuantity(itemId: string): Promise<number> {
    if (!Item.exists(itemId)) throw new SlashCommandError('Invalid Item', itemId);

    const inventoryStack = this.inventory?.findLast((stack) => stack.item.id == itemId);

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

  static async get(userId: string, guildId: string): Promise<User> {
    const user = await this.findOne({ where: { id: userId, guild: guildId } });

    if (!user) {
      return await this.newUser(userId, guildId);
    } else {
      return user;
    }
  }

  private static async newUser(id: string, guild: string): Promise<User> {
    const user = new User();
    user.id = id;
    user.guild = guild;

    await this.save(user);
    return user;
  }

  async addXp(addedXp: number) {
    if (addedXp > 0) {
      const currentLevel = this.getLevel();
      this.xp += addedXp;
      User.save(this);
      const newLevel = this.getLevel();

      if (currentLevel && newLevel && currentLevel != newLevel) {
        const guild = client.guilds.cache.get(this.guild);

        if (guild) {
          const currentRole = guild.roles.cache.find((role) => role.name == currentLevel.name);
          const newRole = guild.roles.cache.find((role) => role.name == newLevel.name);

          if (currentRole && newRole) {
            await (await this.getDiscordMember()).roles.remove(currentRole, 'Level up');
            await (await this.getDiscordMember()).roles.add(newRole, 'Level up');

            const botChannel = (await Server.get(this.guild)).botChannel;

            if (botChannel) {
              const channel = guild.channels.cache.get(botChannel);

              if (channel?.isTextBased) {
                (channel as TextChannel).send(
                  commandEmbed(`${this.id} Level up!`, './src/images/emotes/rinverywow.png'),
                );
              }
            }
          }
        }
      }
    } else {
      throw new SlashCommandError('XP to add must be positive', this);
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
