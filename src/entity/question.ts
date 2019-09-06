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

  @Column({ nullable: true })
  testId: number;

  @OneToMany(() => Answer, answer => answer.question, { cascade: true })
  @Field(() => [Answer])
  answers: Answer[];
}
