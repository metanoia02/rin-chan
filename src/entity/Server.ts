import { Entity, Column, PrimaryColumn, BaseEntity } from 'typeorm';

/**
 * Represents a Server running Rin-chan.
 */
@Entity()
export class Server extends BaseEntity {
  @PrimaryColumn()
  public id!: string;

  @Column({ nullable: true })
  public modRole?: string;

  @Column({ nullable: true })
  public botChannel?: string;

  @Column({ nullable: true })
  public diaryChannel?: string;

  @Column({ nullable: true })
  public singingChannel?: string;

  @Column({ nullable: true })
  public boosterRole?: string;

  async get(id: string): Promise<Server> {
    const server = await Server.findOne({ where: { id: id } });

    if (server) {
      return server;
    } else {
      return await this.newServer(id);
    }
  }

  async newServer(id: string): Promise<Server> {
    const guild = new Server();
    guild.id = id;

    await Server.save(guild);
    return guild;
  }
}
