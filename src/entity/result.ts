import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './user';
import { Test } from './test';

@Entity()
@ObjectType()
export class Result extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  score!: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  conclusion?: string;

  @ManyToOne(() => User, user => user.results)
  user!: User;

  @Column({ nullable: true })
  userId!: number;

  @ManyToOne(() => Test, test => test.results)
  @Field(() => Test)
  test!: Test;

  @Column({ nullable: true })
  testId!: number;
}
