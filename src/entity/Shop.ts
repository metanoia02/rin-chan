import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
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
}
