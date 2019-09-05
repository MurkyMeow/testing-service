import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Category } from './category';
import { User } from './user';
import { Question } from './question';
import { Conclusion } from './conclusion';
import { MinLength } from 'class-validator';

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

  @Column({ nullable: true })
  creatorId: number;

  @ManyToOne(() => Category, category => category.tests)
  @Field(() => Category)
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @OneToMany(() => Question, question => question.test, { cascade: true })
  @Field(() => [Question])
  @MinLength(1)
  questions: Question[];

  @OneToMany(() => Conclusion, conclusion => conclusion.test)
  @Field(() => [Conclusion])
  conclusions: Conclusion[];
}
