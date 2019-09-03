import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Question } from './question';

@Entity()
@ObjectType()
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  text: string;

  @Column()
  @Field()
  correct: boolean;

  @ManyToOne(() => Question, question => question.answers)
  question: Question;
}
