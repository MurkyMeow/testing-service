import { gql } from 'apollo-server-koa';
import { GraphQLModule } from '@graphql-modules/core';
import { User } from '../entity/user';

export const UserModule = new GraphQLModule({
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
      profile: (_, args) => User.findOne(args.id),
    },
  },
});
