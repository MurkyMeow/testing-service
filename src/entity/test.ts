import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category';
import { User } from './user';
import { Question } from './question';
import { Conclusion } from './conclusion';

@Entity()
export class Test extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, user => user.tests)
  creator: User;

  @ManyToOne(() => Category, category => category.tests)
  category: Category;

  @OneToMany(() => Question, question => question.test)
  questions: Question[];

  @OneToMany(() => Conclusion, conclusion => conclusion.test)
  conclusions: Conclusion[];
}
