import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from './user';
import { Test } from './test';

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToOne(() => User)
  creator: User;

  @Column({ nullable: true })
  creatorId: number;

  @OneToMany(() => Test, test => test.category)
  tests: Test[];
}
