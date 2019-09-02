import crypto from 'crypto';
import { gql } from 'apollo-server-koa';
import { Context } from '../server';
import { User } from '../entity/user';
import env from '../env';

type SessionInfo = {
  id: number;
  role: string;
  name: string;
  email: string;
};

const getHash = (str: string): string =>
  crypto.createHmac('sha512', env.secret)
    .update(str)
    .digest('hex');

export const UserModule = {
  typeDefs: gql`
    extend type Query {
      self: User
      signout: Boolean
      signup(email: String!, name: String!, password: String!): Boolean
      signin(email: String!, password: String!): User
    }
    enum Role {
      user
      teacher
      admin
    }
    type User {
      id: ID!
      email: String!
      name: String!
      role: Role!
    }
  `,
  resolvers: {
    Query: {
      async self({}, {}, { ctx }): Promise<SessionInfo> {
        ctx.assert(ctx.session.user, 401);
        const user = await User.findOne(ctx.session.user.id);
        return user;
      },
      signout({}, {}, { ctx }): Boolean {
        ctx.assert(ctx.session.user, 401);
        ctx.session.user = null;
        return true;
      },
      async signup({}, { email, name, password }, { ctx }: Context): Promise<boolean> {
        const user = await User.findOne({
          where: { email }
        });
        ctx.assert(!user, 409, 'That email is busy');
        const newUser = new User();
        newUser.role = 'user';
        newUser.name = name;
        newUser.email = email;
        newUser.password = getHash(password);
        await newUser.save();
        return true;
      },
      async signin({}, { email, password }, { ctx }: Context): Promise<SessionInfo> {
        const user = await User.findOne({
          where: { email }
        });
        const match = user && crypto.timingSafeEqual(
          Buffer.from(getHash(password), 'hex'),
          Buffer.from(user.password, 'hex'),
        );
        ctx.assert(match, 403, 'Invalid login');
        ctx.session.user = user;
        return user;
      },
    },
  },
};
