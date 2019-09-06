import crypto from 'crypto';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, BeforeInsert } from 'typeorm';
import { Field, Int, ObjectType, registerEnumType } from 'type-graphql';
import { Category } from './category';
import { Test } from './test';
import { Result } from './result';
import env from '../env';

export enum Role {
  user,
  teacher,
  admin,
}

registerEnumType(Role, { name: 'Role' });

const getHash = (str: string): string =>
  crypto.createHmac('sha512', env.secret)
    .update(str)
    .digest('hex');

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => Role)
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
