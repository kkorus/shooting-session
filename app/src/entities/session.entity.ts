import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'sessions' })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public playerId!: string;

  @Column({ type: 'varchar' })
  public mode!: string;

  @CreateDateColumn()
  public startedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  public finishedAt!: Date | null;
}
