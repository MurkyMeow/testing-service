import { Resolver, Query, Arg, Ctx, Mutation, Int, Field, InputType, FieldResolver, Root } from 'type-graphql';
import { Context } from '../server';
import { Test } from '../entity/test';
import { Category } from '../entity/category';
import { Question } from '../entity/question';
import { User } from '../entity/user';

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
    @Ctx() { assert }: Context,
  ): Promise<Test> {
    return assert(await Test.findOne(id), 404);
  }

  @FieldResolver()
  async creator(@Root() test: Test, @Ctx() { assert }: Context): Promise<User> {
    return assert(await User.findOne(test.creatorId), 404);
  }

  @FieldResolver()
  async category(@Root() test: Test, @Ctx() { assert }: Context): Promise<Category> {
    return assert(await Category.findOne(test.categoryId), 404);
  }

  @FieldResolver()
  async questions(@Root() test: Test): Promise<Question[]> {
    const where = { testId: test.id };
    return test.questions || Question.find({ where });
  }

  @Mutation(() => Test)
  async addTest(
    @Arg('name') name: string,
    @Arg('categoryId', () => Int) categoryId: number,
    @Arg('questions', () => [QuestionInput]) questions: QuestionInput[],
    @Ctx() { session }: Context,
  ): Promise<Test> {
    const test = Test.create({
      name,
      questions,
      categoryId,
      creator: session.user,
    });
    return test.save();
  }

  @Mutation(() => Test)
  async editTest(
    @Ctx() { session, assert }: Context,
    @Arg('id', () => Int) id: number,
    @Arg('name') name: string,
    @Arg('questions', () => [QuestionInput]) questions: QuestionInput[],
  ): Promise<Test> {
    const test = assert(await Test.findOne(id), 404);
    assert(test.creatorId === session.user.id, 403);
    test.name = name;
    test.questions = questions.map(q => Question.create(q));
    return test.save();
  }

  @Mutation(() => Boolean)
  async deleteTest(
    @Arg('id', () => Int) id: number,
    @Ctx() { session, assert }: Context,
  ): Promise<boolean> {
    const test = assert(await Test.findOne(id), 404);
    assert(test.creatorId === session.user.id, 403);
    await test.remove();
    return true;
  }
}
