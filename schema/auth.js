const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database');
const env = require('../env');
const { APIError, assert } = require('../util/error');

module.exports = {
  signin: async ({ email, password }) => {
    const [user] = await db('Accounts').where({ email });
    assert(user, new APIError(400, 'Invalid login'));
    assert(bcrypt.compareSync(password, user.password), new APIError(400, 'Invalid password'));
    const token = jwt.sign({ id: user.id }, env.secret, { expiresIn: '24h' });
    return token;
  },
  signup: async ({ email, password }) => {
    const [user] = await db('Accounts').where({ email });
    assert(!user, new APIError(400, 'That email is busy'));
    const hash = bcrypt.hashSync(password, 8);
    await db('Accounts').insert({ email, password: hash, account_created: Date.now() });
    return 'Ok';
  }
};
