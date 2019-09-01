import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { Test } from './test';

@Entity()
export class Conclusion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  minScore: number;

  @ManyToOne(() => Test, test => test.conclusions)
  test: Test;
}
