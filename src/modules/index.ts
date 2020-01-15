import { buildSchema } from 'type-graphql';
import { UserResolver } from './user';
import { CategoryResolver } from './category';
import { TestResolver } from './test';

export const getSchema = () => buildSchema({
  resolvers: [
    UserResolver,
    CategoryResolver,
    TestResolver,
  ],
  validate: false, // dont use the class-validator module
});
