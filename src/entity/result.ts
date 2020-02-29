import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { User } from './user';
import { Test } from './test';

@Entity()
export class Result extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  score!: number;

  @ManyToOne(() => User, user => user.results)
  user!: User;

  @Column({ nullable: true })
  userId!: number;

  @ManyToOne(() => Test, test => test.results)
  test!: Test;

  @Column({ nullable: true })
  testId!: number;
}
