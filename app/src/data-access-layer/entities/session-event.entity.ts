import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SessionEventType } from '@const';

@Entity({ name: 'session_events' })
export class SessionEvent {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public sessionId!: string;

  @Column({ type: 'enum', enum: SessionEventType })
  public type!: SessionEventType;

  @Column({ type: 'timestamptz' })
  public ts!: Date;

  @Column({ type: 'bool', nullable: false })
  public hit!: boolean;

  @Column({ type: 'float8', nullable: true })
  public distance!: number | null;

  @CreateDateColumn()
  public createdAt!: Date;
}
