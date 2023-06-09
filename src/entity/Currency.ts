import { Entity, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";
import { Item } from "./Item";

/**
 * Represents one or more items of a single type owned by a user.
 */
@Entity()
export class Currency {
  @PrimaryColumn()
  public  shopId?: number;

  @PrimaryColumn()
  public  itemId?: string;

  @OneToOne(() => Item)
  @JoinColumn()
  public item?: Item;
};
