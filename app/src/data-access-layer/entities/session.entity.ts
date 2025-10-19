import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SessionMode } from '@const';

@Entity({ name: 'sessions' })
export class Session {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar' })
  public playerId!: string;

  @Column({ type: 'enum', enum: SessionMode })
  public mode!: SessionMode;

  @CreateDateColumn()
  public startedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  public finishedAt!: Date | null;

  @Column({ type: 'int', nullable: true })
  public score!: number | null;
}
