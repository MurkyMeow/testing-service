import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Question } from './question';

@Entity()
@ObjectType()
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  text!: string;

  @Column()
  @Field()
  correct!: boolean;

  @ManyToOne(() => Question, question => question.answers, { onDelete: 'CASCADE' })
  question: Question | undefined;

  @Column({ nullable: true })
  questionId!: number;
}
