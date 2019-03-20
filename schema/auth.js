const { gql } = require('apollo-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');
const env = require('../env');
const { APIError, assert } = require('../util/error');

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
        const [user] = await db('Accounts').where({ email });
        assert(user && bcrypt.compareSync(password, user.password), new APIError(400, 'Invalid login'));
        const token = jwt.sign({ id: user.id }, env.secret, { expiresIn: '24h' });
        return token;
      },
      async signup(_, { email, password }) {
        const [user] = await db('Accounts').where({ email });
        assert(!user, new APIError(400, 'That email is busy'));
        const hash = bcrypt.hashSync(password, 8);
        await db('Accounts').insert({ email, password: hash, account_created: Date.now() });
        return 'Ok';
      }
    }
  }
};
