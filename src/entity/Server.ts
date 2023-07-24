import { Entity; Column, PrimaryColumn } from 'typeorm';
import { IsInt, Min, Max } from 'class-validator';

/**
 * Represents a Server running Rin-chan.
 */
@Entity()
export class Server {
  @PrimaryColumn()
  public id!: string;

  @Column()
  public mutedRole?:string 

  @Column()
  public modRole?:string

  @Column()
  public botChannel?:string

  @Column()
  public diaryChannel?:string

  @Column()
  public singingChannel?:string

  @Column()
  public boosterRole?:string
}


/*

  mutedRole:string '620609193228894208';
  modRole:string '588521716481785859';
  botChannel:string '590205616581115918';
  diaryChannel:string '713133491373604895';
  singingChannel:string '620600040204926986';
  boosterRole:string '639753961339092993';

  */