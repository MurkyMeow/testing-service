const User = require('../models/user');

module.exports = {
  typeDefs: `
    type User {
      name: String
    }

    type Query {
      signup(email: String, password: String): String
      signin(email: String, password: String): User
    }
  `,
  resolvers: {
    async signin({ email, password }, { req }) {
      const user = await User.signin(email, password);
      // eslint-disable-next-line no-param-reassign
      req.session.userid = user.id;
      return { name: user.name };
    },
    async signup({ email, password }) {
      await User.signup(email, password);
      return 'Ok';
    }
  }
};
