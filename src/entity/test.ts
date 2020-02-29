import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Category } from './category';
import { User } from './user';
import { Question } from './question';
import { Conclusion } from './conclusion';
import { Result } from './result';

@Entity()
@ObjectType()
export class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id!: number;

  @Column()
  @Field()
  name!: string;

  @ManyToOne(() => User, user => user.tests)
  @Field(() => User)
  creator: User | undefined;

  @Column({ nullable: true })
  creatorId!: number;

  @ManyToOne(() => Category, category => category.tests)
  @Field(() => Category)
  category: Category | undefined;

  @Column({ nullable: true })
  categoryId!: number;

  @OneToMany(() => Question, question => question.test, { cascade: true })
  @Field(() => [Question])
  questions!: Question[];

  @OneToMany(() => Conclusion, conclusion => conclusion.test)
  @Field(() => [Conclusion])
  conclusions!: Conclusion[];

  @OneToMany(() => Result, result => result.test)
  @Field(() => [Result])
  results!: Result;

  @Field(() => Int)
  get maxScore(): number {
    return this.questions.reduce((acc, q) => acc + q.answers.reduce((acc, a) => acc + Number(a.correct), 0), 0);
  }
}
