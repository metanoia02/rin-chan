import { Entity, Column, PrimaryGeneratedColumn, OneToOne, ManyToOne } from "typeorm"
import { Item } from "./Item";

@Entity()
export class ItemAlts {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column({default: "en"})
  public language!: string;

  @ManyToOne(() => Item, (item) => item.alts)
  public item!: Item;
};