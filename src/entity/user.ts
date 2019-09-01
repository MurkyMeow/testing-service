import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Category } from './category';
import { Test } from './test';
import { Result } from './result';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Test, test => test.creator)
  tests: Test[];

  @OneToMany(() => Category, category => category.creator)
  categories: Category[];

  @OneToMany(() => Result, result => result.user)
  results: Result[];
}
