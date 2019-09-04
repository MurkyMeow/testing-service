import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Test } from './test';
import { Answer } from './answer';

@Entity()
@ObjectType()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  text: string;

  @ManyToOne(() => Test, test => test.questions)
  @Field(() => Test)
  test: Test;

  @OneToMany(() => Answer, answer => answer.question)
  @Field(() => Answer)
  answers: Answer[];
}
