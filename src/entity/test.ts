import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { MinLength } from 'class-validator';
import { Category } from './category';
import { User } from './user';
import { Question } from './question';
import { Conclusion } from './conclusion';

@Entity()
@ObjectType()
export class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToOne(() => User, user => user.tests)
  @Field(() => User)
  creator: User;

  @ManyToOne(() => Category, category => category.tests)
  @Field(() => Category)
  category: Category;

  @OneToMany(() => Question, question => question.test)
  @Field(() => [Question])
  @MinLength(1)
  questions: Question[];

  @OneToMany(() => Conclusion, conclusion => conclusion.test)
  @Field(() => [Conclusion])
  conclusions: Conclusion[];
}
