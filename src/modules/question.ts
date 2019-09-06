import { Resolver, FieldResolver, Root } from 'type-graphql';
import { Question } from '../entity/question';
import { Answer } from '../entity/answer';

@Resolver(Question)
export class QuestionResolver {
  @FieldResolver()
  answers(@Root() question: Question): Promise<Answer[]> {
    const where = { questionId: question.id };
    return Answer.find({ where });
  }
}
