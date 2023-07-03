import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany } from "typeorm"
import { InventoryStack } from "./InventoryStack";
import { ItemAlts } from "./ItemAlts";

/**
 * Represents a single Item or song.
 */
@Entity()
export class Item {
  @PrimaryColumn()
  public id!:string;

  @Column()
  public name!:string;

  @Column()
  public determiner!:string;

  @Column()
  public plural!:string;

  @Column({nullable: true})
  public filling?:number;

  @Column({nullable: true})
  public searchUrl?:string;

  @Column({nullable: true})
  public videoUrl?:string;

  @Column({nullable: true})
  public value?:number;

  @OneToMany(() => InventoryStack, inventoryStack => inventoryStack.item)
  public inventoryStacks!: InventoryStack[];

  @OneToMany(() => ItemAlts, (alts) => alts.item)
  public alts?:ItemAlts;
};