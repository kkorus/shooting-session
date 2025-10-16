import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'session_events' })
export class SessionEvent {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public sessionId!: string;

  @Column({ type: 'varchar' })
  public type!: string;

  @Column({ type: 'timestamptz' })
  public ts!: Date;

  @Column({ type: 'bool', nullable: true })
  public hit!: boolean | null;

  @Column({ type: 'float8', nullable: true })
  public distance!: number | null;

  @CreateDateColumn()
  public createdAt!: Date;
}
