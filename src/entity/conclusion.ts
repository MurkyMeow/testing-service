import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { Test } from './test';

@Entity()
@ObjectType()
export class Conclusion extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  text!: string;

  @Column()
  @Field()
  minScore!: number;

  @ManyToOne(() => Test, test => test.conclusions)
  @Field(() => Test)
  test: Test | undefined;
}
