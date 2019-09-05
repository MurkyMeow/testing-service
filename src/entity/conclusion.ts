import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { Test } from './test';

@Entity()
@ObjectType()
export class Conclusion extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  text: string;

  @Column()
  @Field()
  minScore: number;

  @ManyToOne(() => Test, test => test.conclusions)
  @Field(() => Test)
  test: Test;
}
