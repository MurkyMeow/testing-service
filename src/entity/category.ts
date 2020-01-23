import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { User } from './user';
import { Test } from './test';

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  name!: string;

  @ManyToOne(() => User)
  @Field(() => User)
  creator!: User;

  @Column({ nullable: true })
  creatorId!: number;

  @OneToMany(() => Test, test => test.category)
  @Field(() => [Test])
  tests!: Test[];
}
