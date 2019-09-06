import { buildSchema } from 'type-graphql';
import { UserResolver } from './user';
import { CategoryResolver } from './category';
import { TestResolver } from './test';
import { QuestionResolver } from './question';

export const getSchema = () => buildSchema({
  resolvers: [
    UserResolver,
    CategoryResolver,
    TestResolver,
    QuestionResolver
  ]
});
