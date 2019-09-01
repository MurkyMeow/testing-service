import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Test } from './test';
import { Answer } from './answer';

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Test, test => test.questions)
  test: Test;

  @OneToMany(() => Answer, answer => answer.question)
  answers: Answer[];
}
