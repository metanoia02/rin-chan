import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm"
import { ItemAlts } from "./ItemAlts";
import { UserInventoryItem } from "./UserInventoryItem";
import { UserSongBookItem } from "./UserSongBookItem";

/**
 * Represents a single Item or song.
 */
@Entity()
export class Item {
  @PrimaryColumn()
  public id?:string;

  @Column()
  public name?:string;

  @Column()
  public determiner?:string;

  @Column()
  public plural?:string;

  @Column({nullable: true})
  public filling?:number;

  @Column({nullable: true})
  public searchUrl?:string;

  @Column({nullable: true})
  public videoUrl?:string;

  @Column({nullable: true})
  public value?:number;

  @OneToMany(() => ItemAlts, (alt) => alt.itemId)
  public alts?: ItemAlts[];

  @OneToMany(() => UserInventoryItem, userInventoryItem => userInventoryItem.itemId)
  public userInventoryItems?: UserInventoryItem[];

  @OneToMany(() => UserSongBookItem, userSongBookItem => userSongBookItem.itemId)
  public userSongBookItems?: UserSongBookItem[];
};