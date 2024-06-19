import { Entity, Column, OneToMany, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { InventoryStack } from './InventoryStack';
import { Guild, GuildMember, TextChannel } from 'discord.js';
import { config } from '../config';
import { Level } from '../types/Level';
import { client } from '../client';
import * as schedule from 'node-schedule';
import { commandEmbedEmote } from '../util/commands';
import { clamp } from '../util/clamp';
import { Item } from './Item';
import { Server } from './Server';
import { SlashCommandError } from '../util/SlashCommandError';
import { Currency } from './Currency';

/**
 * Represents a shop that trades in a related currency item
 */
@Entity()
export class Shop extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @ManyToOne(() => Currency, (currency) => currency.shops)
  public currency!: Currency;

  @OneToMany(() => InventoryStack, (inventoryStack) => inventoryStack.shop, {
    eager: true,
    cascade: true,
  })
  public stock!: InventoryStack[];

  async setQuantity(itemId: string, quantity: number) {
    if (!Item.itemExists(itemId)) throw new SlashCommandError(`Invalid Item`, itemId);

    if (quantity < 0)
      throw new SlashCommandError(
        'User.setQuantity: Tried to set negative inventoryStack quantity',
        this,
      );

    let inventoryStack = this.stock?.findLast((stack) => stack.item.id == itemId);

    if (inventoryStack) {
      inventoryStack.quantity = quantity;
    } else {
      inventoryStack = new InventoryStack();
      inventoryStack.shop = this;
      inventoryStack.item = await Item.getItem(itemId);
      inventoryStack.quantity = quantity;

      this.stock.push(inventoryStack);
    }

    await Shop.save(this);
  }

  async changeQuantity(itemId: string, modifier: number) {
    await this.setQuantity(itemId, (await this.getQuantity(itemId)) + modifier);
  }

  async getQuantity(itemId: string): Promise<number> {
    if (!Item.itemExists(itemId)) throw new SlashCommandError('Invalid Item', itemId);

    const inventoryStack = this.stock?.findLast((stack) => stack.item.id == itemId);

    if (inventoryStack) {
      return inventoryStack.quantity;
    } else {
      return 0;
    }
  }
}
