import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Currency } from "./Currency";

/**
 * Represents a shop that trades in a related currency item
 */
@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public name?: string;

  @OneToOne(() => Currency)
  @JoinColumn()
  public currency?:Currency;
};
