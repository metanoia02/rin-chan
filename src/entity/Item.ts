import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany, BaseEntity } from 'typeorm';
import { InventoryStack } from './InventoryStack';
import { ItemAlts } from './ItemAlts';
import { SlashCommandError } from '../util/SlashCommandError';

/**
 * Represents a single Item or song.
 */
@Entity()
export class Item extends BaseEntity {
  @PrimaryColumn()
  public id!: string;

  @Column()
  public name!: string;

  @Column()
  public determiner!: string;

  @Column()
  public plural!: string;

  @Column({ nullable: true })
  public filling?: number;

  @Column({ nullable: true })
  public searchTag?: string;

  @Column({ default: false })
  public singable!: boolean;

  @Column({ nullable: true })
  public value?: number;

  //shop that it can be sold in?

  @OneToMany(() => InventoryStack, (inventoryStack) => inventoryStack.item)
  public inventoryStacks!: InventoryStack[];

  @OneToMany(() => ItemAlts, (alts) => alts.item)
  public alts?: ItemAlts;

  static async getItem(itemId: string): Promise<Item> {
    const item = await Item.findOne({ where: { id: itemId } });
    if (item) {
      return item;
    } else {
      throw new SlashCommandError('Invalid item.', itemId);
    }
  }

  static async itemExists(itemAlt: string): Promise<boolean> {
    if (
      (await Item.findOne({ where: { id: itemAlt } })) ||
      (await Item.findOne({ where: { name: itemAlt } })) ||
      (await ItemAlts.findOne({ where: { name: itemAlt } }))
    ) {
      return true;
    } else {
      return false;
    }
  }
}
