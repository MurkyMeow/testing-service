import crypto from 'crypto';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, BeforeInsert } from 'typeorm';
import { Category } from './category';
import { Test } from './test';
import { Result } from './result';
import env from '../env';

export enum Role {
  user,
  teacher,
  admin,
}

const getHash = (str: string): string =>
  crypto.createHmac('sha512', env.secret)
    .update(str)
    .digest('hex');

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @OneToMany(() => Test, test => test.creator)
  tests: Test[];

  @OneToMany(() => Category, category => category.creator)
  categories: Category[];

  @OneToMany(() => Result, result => result.user)
  results: Result[];

  @BeforeInsert()
  hashPassword() {
    this.password = getHash(this.password);
  }
  comparePassword(password: string): boolean {
    return crypto.timingSafeEqual(
      Buffer.from(getHash(password), 'hex'),
      Buffer.from(this.password, 'hex'),
    );
  }
}
