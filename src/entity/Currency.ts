import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Item } from './Item';
import { Shop } from './Shop';

@Entity()
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @OneToMany(() => Shop, (shop) => shop.currency)
  public shops?: Shop[];

  @OneToOne(() => Item)
  @JoinColumn()
  public item?: Item;
}
