import { Resolver, Query, Arg, Ctx, Mutation, ID, Field, InputType } from 'type-graphql';
import { Context } from '../server';
import { Test } from '../entity/test';
import { Category } from '../entity/category';

@InputType()
class AnswerInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field()
  text: string;

  @Field()
  correct: boolean;
}

@InputType()
class QuestionInput {
  @Field(() => ID, { nullable: true })
  id?: number;

  @Field()
  text: string;

  @Field(() => [AnswerInput])
  answers: AnswerInput[];
}

@Resolver(Test)
export class TestResolver {
  @Query(() => Test)
  getTest(@Arg('id', () => ID) id: number): Promise<Test> {
    return Test.findOne(id);
  }

  @Mutation(() => Test)
  async addTest(
    @Arg('name') name: string,
    @Arg('categoryID') categoryID: number,
    @Arg('questions', () => [QuestionInput]) questions: QuestionInput[],
    @Ctx() { ctx }: Context,
  ): Promise<Test> {
    const category = await Category.findOne(categoryID)
    const test = Test.create({
      name,
      category,
      questions: questions,
      creator: ctx.session.user,
    });
    return test.save();
  }

  @Mutation(() => Test)
  async editTest(
    @Ctx() { ctx, assert }: Context,
    @Arg('id', () => ID) id: number,
    @Arg('name') name?: string,
    // @Arg('questions', () => Question) questions?: Quest/ion[],
  ): Promise<Test> {
    const test = await Test.findOne(id);
    assert(test != null, 404);
    assert(test.creator.id === ctx.session.user.id, 403);
    if (name) test.name = name;
    // if (questions) test.questions = questions;
    return test.save();
  }

  @Mutation(() => Boolean)
  async deleteTest(
    @Arg('id', () => ID) id: number,
    @Ctx() { ctx, assert }: Context,
  ): Promise<boolean> {
    const test = await Test.findOne(id);
    assert(test != null, 404);
    assert(test.creator.id === ctx.session.user.id, 403);
    await test.remove();
    return true;
  }
}
