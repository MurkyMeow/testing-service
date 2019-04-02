const { gql } = require('apollo-server');
const User = require('../models/user');

module.exports = {
  typeDefs: gql`
    type Query {
      signup(email: String, password: String): String
      signin(email: String, password: String): String
    }
  `,
  resolvers: {
    Query: {
      async signin(_, { email, password }) {
        const token = await User.signin(email, password);
        return token;
      },
      async signup(_, { email, password }) {
        await User.signup(email, password);
        return 'Ok';
      }
    }
  }
};
