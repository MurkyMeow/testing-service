const router = require('koa-joi-router');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { guard } = require('../util/server');

const auth = router();

const getSessionInfo = user => ({
  id: user.id,
  role: user.role,
  name: user.name,
  email: user.email,
});

auth.post('/signin', async ctx => {
  const { email, password } = ctx.request.body;
  const [user] = await User.query().where({ email });
  const valid = user && bcrypt.compareSync(password, user.password);
  ctx.assert(valid, 400, 'Invalid login');
  ctx.session.user = user;
  ctx.body = getSessionInfo(user);
});

auth.post('/signup', async ctx => {
  const { email, password } = ctx.request.body;
  const [user] = await User.query().where({ email });
  ctx.assert(!user, 400, 'That email is busy');
  const hash = bcrypt.hashSync(password, 8);
  const newUser = await User.query().insert({ email, password: hash });
  ctx.session.user = newUser;
  ctx.body = getSessionInfo(newUser);
});

auth.use(guard());

auth.post('/signout', async ctx => {
  ctx.session = null;
  ctx.body = { ok: true };
});

auth.get('/userinfo', async ctx => {
  ctx.assert(ctx.session.user, 403, 'You are not authorized');
  ctx.body = getSessionInfo(ctx.session.user);
});

auth.prefix('/auth');

module.exports = auth;
