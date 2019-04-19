const { gql } = require('apollo-server-express');
const User = require('../models/user');

module.exports = {
  typeDefs: gql`
    type User {
      name: String
    }

    type Query {
      signup(name: String, email: String, password: String): String
      signin(email: String, password: String): User
    }
  `,
  resolvers: {
    Query: {
      async signin(_, { email, password }, { session }) {
        const user = await User.signin(email, password);
        // eslint-disable-next-line no-param-reassign
        session.userid = user.id;
        return { name: user.name };
      },
      async signup(_, { name, email, password }) {
        await User.signup(name, email, password);
        return 'Ok';
      }
    }
  }
};
