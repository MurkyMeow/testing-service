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
      async signin(_, { email, password }, context) {
        const id = await User.signin(email, password);
        // eslint-disable-next-line no-param-reassign
        context.session.userid = id;
        return 'Ok';
      },
      async signup(_, { email, password }) {
        await User.signup(email, password);
        return 'Ok';
      }
    }
  }
};
