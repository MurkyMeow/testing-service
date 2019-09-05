import { Resolver, Query, Arg, Ctx, Mutation, ID, Field, InputType, FieldResolver, Root } from 'type-graphql';
import { Context } from '../server';
import { Test } from '../entity/test';
import { Category } from '../entity/category';
import { Question } from '../entity/question';
import { User } from '../entity/user';

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

  @FieldResolver()
  creator(@Root() test: Test): Promise<User> {
    return User.findOne(test.creatorId);
  }

  @FieldResolver()
  category(@Root() test: Test): Promise<Category> {
    return Category.findOne(test.categoryId);
  }

  @FieldResolver()
  questions(@Root() test: Test): Promise<Question[]> {
    const where = { testId: test.id };
    return Question.find({ where });
  }

  @Mutation(() => Test)
  async addTest(
    @Arg('name') name: string,
    @Arg('categoryId') categoryId: number,
    @Arg('questions', () => [QuestionInput]) questions: QuestionInput[],
    @Ctx() { ctx }: Context,
  ): Promise<Test> {
    const test = Test.create({
      name,
      questions,
      creator: ctx.session.user,
      category: { id: categoryId },
    });
    return test.save();
  }

  @Mutation(() => Test)
  async editTest(
    @Ctx() { ctx, assert }: Context,
    @Arg('id', () => ID) id: number,
    @Arg('name') name: string,
    @Arg('questions', () => [QuestionInput]) questions: QuestionInput[],
  ): Promise<Test> {
    const test = await Test.findOne(id);
    assert(test != null, 404);
    assert(test.creatorId === ctx.session.user.id, 403);
    test.name = name;
    test.questions = questions.map(q => Question.create(q));
    return test.save();
  }

  @Mutation(() => Boolean)
  async deleteTest(
    @Arg('id', () => ID) id: number,
    @Ctx() { ctx, assert }: Context,
  ): Promise<boolean> {
    const test = await Test.findOne(id);
    assert(test != null, 404);
    assert(test.creatorId === ctx.session.user.id, 403);
    await test.remove();
    return true;
  }
}
