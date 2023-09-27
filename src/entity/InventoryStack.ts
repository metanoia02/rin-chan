import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { Item } from './Item';
import { User } from './User';
import { Shop } from './Shop';

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
  public user?: User;

  @ManyToOne(() => Shop, (shop) => shop.stock)
  public shop?: Shop;
}
