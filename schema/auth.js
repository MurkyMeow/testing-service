const User = require('../models/user');

module.exports = {
  typeDefs: `
    type Query {
      signup(email: String, password: String): String
      signin(email: String, password: String): String
    }
  `,
  resolvers: {
    async signin({ email, password }, { req }) {
      const id = await User.signin(email, password);
      // eslint-disable-next-line no-param-reassign
      req.session.userid = id;
      return 'Ok';
    },
    async signup({ email, password }) {
      await User.signup(email, password);
      return 'Ok';
    }
  }
};
