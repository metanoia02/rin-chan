import { Entity, PrimaryColumn, Column } from "typeorm"

/**
 * Represents one or more items of a single type owned by a user.
 */
@Entity()
export class ItemAlts {
  @PrimaryColumn()
  public itemId?: string;

  @Column()
  public name?: string;

  @Column()
  public language?: string;
};
