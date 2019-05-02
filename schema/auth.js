const router = require('koa-joi-router');
const User = require('../models/user');

const auth = router();

auth.post('/signin', async ctx => {
  const { email, password } = ctx.request.body;
  const user = await User.signin(email, password);
  ctx.assert(user, 400, 'Invalid login');
  ctx.session.user = user;
  ctx.body = { id: user.id, name: user.name, email: user.email };
});

auth.post('/signup', async ctx => {
  const { email, password } = ctx.request.body;
  try {
    const id = await User.signup(email, password);
    ctx.assert(id, 500);
  } catch (err) {
    ctx.throw(400, err);
  }
  ctx.body = { ok: true };
});

auth.get('/userinfo', async ctx => {
  if (!ctx.session.user) ctx.throw(403, 'You ane not authorized');
  ctx.body = ctx.session.user;
});

auth.prefix('/auth');

module.exports = auth;
