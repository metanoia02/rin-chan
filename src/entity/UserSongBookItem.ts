import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne } from "typeorm";
import { Item } from "./Item";
import { User } from "./User";

/**
 * Represents one or more items of a single type owned by a user.
 */
@Entity()
export class UserSongBookItem {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public userId?: number;

  @Column()
  public itemId?: string;

  @Column()
  public quantity?: number;

  @OneToOne(() => Item)
  public item?: Item;

  @ManyToOne(() => User)
  public user?: User;
};
