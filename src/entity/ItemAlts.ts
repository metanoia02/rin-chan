import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne, BaseEntity } from 'typeorm';
import { Item } from './Item';

@Entity()
export class ItemAlts extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column({ default: 'en' })
  public language!: string;

  @ManyToOne(() => Item, (item) => item.alts)
  public item!: Item;
}
