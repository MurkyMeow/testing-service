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
  text: string;

  @Field()
  correct: boolean;
}

@InputType()
class QuestionInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  text: string;

  @Field(() => [AnswerInput])
  answers: AnswerInput[];
}

@Resolver(Test)
export class TestResolver {
  @Query(() => Test)
  getTest(@Arg('id', () => Int) id: number): Promise<Test> {
    return Test.findOne(id);
  }

  @FieldResolver()
  creator(@Root() test: Test): Promise<User> {
    return User.findOne(test.creatorId);
  }

  @FieldResolver()
  category(@Root() test: Test): Promise<Category> {
    return Category.findOne(test.categoryId);
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
    const test = await Test.findOne(id);
    assert(test != null, 404);
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
    const test = await Test.findOne(id);
    assert(test != null, 404);
    assert(test.creatorId === session.user.id, 403);
    await test.remove();
    return true;
  }
}
