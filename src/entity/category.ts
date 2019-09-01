import { Entity, PrimaryGeneratedColumn, Column, OneToOne, BaseEntity, ManyToOne } from 'typeorm';
import { User } from './user';
import { Test } from './test';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => User)
  creator: User;

  @ManyToOne(() => Test, test => test.category)
  tests: Test[];
}
