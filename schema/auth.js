const router = require('koa-joi-router');
const User = require('../models/user');

const auth = router();

auth.post('/signin', async ctx => {
  const { email, password } = ctx.request.body;
  const user = await User.signin(email, password);
  ctx.session.userid = user.id;
  ctx.body = { name: user.name };
});

auth.post('/signup', async ctx => {
  const { email, password } = ctx.request.body;
  await User.signup(email, password);
  ctx.body = { ok: true };
});

auth.prefix('/auth');

module.exports = auth;
