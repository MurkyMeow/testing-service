import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { Field, Int, ObjectType, registerEnumType } from 'type-graphql';
import { Category } from './category';
import { Test } from './test';
import { Result } from './result';

export enum Role {
  user = "user",
  teacher = "teacher",
  admin = "admin",
}

registerEnumType(Role, { name: 'Role' });

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  name!: string;

  @Column()
  @Field()
  email!: string;

  @Column()
  password!: string;

  @Column()
  @Field(() => Role)
  role!: Role;

  @OneToMany(() => Test, test => test.creator)
  @Field(() => [Test])
  tests!: Test[];

  @OneToMany(() => Category, category => category.creator)
  @Field(() => [Category])
  categories!: Category[];

  @OneToMany(() => Result, result => result.user)
  @Field(() => [Result])
  results!: Result[];
}
