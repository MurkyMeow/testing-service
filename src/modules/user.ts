import { gql } from 'apollo-server-koa';
import { User } from '../entity/user';

export const UserModule = {
  typeDefs: gql`
    type Query {
      profile: User
    }
    type User {
      id: ID!
      name: String!
    }
  `,
  resolvers: {
    Query: {
      profile: (): Promise<User> => User.findOne(),
    },
  },
};
