import { Column, Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryColumn({ type: 'varchar' })
  public id!: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  public email!: string | null;

  @CreateDateColumn()
  public createdAt!: Date;
}
