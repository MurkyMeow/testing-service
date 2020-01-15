import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Test } from './test';
import { Answer } from './answer';

@Entity()
@ObjectType()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  text!: string;

  @ManyToOne(() => Test, test => test.questions, { onDelete: 'CASCADE' })
  @Field(() => Test)
  test!: Test;

  @Column({ nullable: true })
  testId!: number;

  @OneToMany(() => Answer, answer => answer.question, { cascade: true })
  @Field(() => [Answer])
  answers!: Answer[];
}
