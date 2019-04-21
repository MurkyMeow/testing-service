const User = require('../models/user');

module.exports = (fastify, opts, next) => {
  fastify.post('/signin', async ({ body, session }) => {
    const { email, password } = body;
    const user = await User.signin(email, password);
    // eslint-disable-next-line no-param-reassign
    session.userid = user.id;
    return { name: user.name };
  });
  fastify.post('/signup', async ({ body }) => {
    const { name, email, password } = body;
    await User.signup(name, email, password);
    return { signup: 'Ok' };
  });
  next();
};
