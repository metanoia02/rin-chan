import { Entity, PrimaryColumn, OneToOne, JoinColumn, OneToMany, BaseEntity } from 'typeorm';
import { Item } from './Item';
import { Shop } from './Shop';

@Entity()
export class Currency extends BaseEntity {
  @PrimaryColumn()
  public shopId!: number;

  @PrimaryColumn()
  public itemId!: string;

  @OneToMany(() => Shop, (shop) => shop.currency)
  public shops?: Shop[];

  @OneToOne(() => Item)
  @JoinColumn()
  public item?: Item;
}
