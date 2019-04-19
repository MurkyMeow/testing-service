const User = require('../models/user');

module.exports = (fastify, opts, next) => {
  fastify.post('/signin', async req => {
    const { email, password } = req.body;
    const user = await User.signin(email, password);
    // eslint-disable-next-line no-param-reassign
    req.session.userid = user.id;
    return { name: user.name };
  });
  fastify.post('/signup', async ({ name, email, password }) => {
    await User.signup(name, email, password);
    return 'Ok';
  });
  next();
};
