import { Resolver, Query, Arg, Ctx, Mutation, Int, Field, InputType } from 'type-graphql';
import { Context, assert } from '../server';
import { Test } from '../entity/test';
import { Question } from '../entity/question';

@InputType()
class AnswerInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  text!: string;

  @Field()
  correct!: boolean;
}

@InputType()
class QuestionInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  text!: string;

  @Field(() => [AnswerInput])
  answers!: AnswerInput[];
}

@Resolver(Test)
export class TestResolver {
  @Query(() => Test)
  async getTest(
    @Arg('id', () => Int) id: number,
  ): Promise<Test> {
    return assert(await Test.findOne(id), 404);
  }

  @Mutation(() => Test)
  async addTest(
    @Arg('name') name: string,
    @Arg('categoryId', () => Int) categoryId: number,
    @Arg('questions', () => [QuestionInput]) questions: QuestionInput[],
    @Ctx() { session }: Context,
  ): Promise<Test> {
    const creator = assert(session.user, 401);
    assert(questions.length > 0, 400);
    return Test.create({ name, questions, categoryId, creator }).save();
  }

  @Mutation(() => Test)
  async editTest(
    @Ctx() { session }: Context,
    @Arg('id', () => Int) id: number,
    @Arg('name') name: string,
    @Arg('questions', () => [QuestionInput]) questions: QuestionInput[],
  ): Promise<Test> {
    const user = assert(session.user, 401);
    const test = assert(await Test.findOne(id), 404);
    assert(test.creatorId === user.id, 403);
    assert(questions.length > 0, 400);
    test.name = name;
    test.questions = questions.map(q => Question.create(q));
    return test.save();
  }

  @Mutation(() => Boolean)
  async deleteTest(
    @Arg('id', () => Int) id: number,
    @Ctx() { session }: Context,
  ): Promise<boolean> {
    const user = assert(session.user, 401);
    const test = assert(await Test.findOne(id), 404);
    assert(test.creatorId === user.id, 403);
    await test.remove();
    return true;
  }
}
