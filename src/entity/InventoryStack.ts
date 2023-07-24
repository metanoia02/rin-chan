import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './Item';
import { User } from './User';

@Entity()
export class InventoryStack {
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
}
