import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Item } from './Item';
import { User } from './User';
import { itemRepository } from '../repository/itemRepository';

@Entity()
export class InventoryStack extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public quantity!: number;

  @ManyToOne(() => Item, (item) => item.inventoryStacks, {
    eager: true,
  })
  public item!: Item;

  @ManyToOne(() => User, (user) => user.inventory)
  public user!: User;

  static async get(userId: string, itemId: string): Promise<InventoryStack | null> {
    const item = await this.findOne({
      where: { item: { id: itemId }, user: { id: userId } },
    });
    return item;
  }

  static async newStack(user: User, itemName: string, modifier: number): Promise<InventoryStack> {
    const inventoryStack = new InventoryStack();
    const item = await itemRepository.findOne({ where: { name: itemName } });

    if (item) {
      inventoryStack.user = user;
      inventoryStack.item = item;

      if (modifier >= 0) {
        inventoryStack.quantity = modifier;
      } else {
        throw new Error(
          'InventoryStack.newStack :  Tried to create new InventoryStack with negative quantity.',
        );
      }
    } else {
      throw new Error('InventoryStack.newStack : Invalid item.');
    }

    InventoryStack.save(inventoryStack);

    return inventoryStack;
  }
}
