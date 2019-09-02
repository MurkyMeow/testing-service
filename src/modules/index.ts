import { buildSchema } from 'type-graphql';
import { UserResolver } from './user';
import { CategoryResolver } from './category';

export const getSchema = () => buildSchema({
  resolvers: [
    UserResolver,
    CategoryResolver,
  ]
});
