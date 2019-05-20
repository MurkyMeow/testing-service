const { Rest } = require('../util/server');
const Result = require('../models/result');
const User = require('../models/user');

const rest = Rest('/stats');
rest.router.get('/tests', async ctx => {
  const userId = ctx.request.query.userId || ctx.session.user.id;
  ctx.body = await Result.query().where({ user_id: userId }).eager('test');
});

rest.router.post('/name', async ctx => {
  const { name } = ctx.request.body;
  await User.query()
    .where({ id: ctx.session.user.id })
    .update({ name });
  ctx.session.user.name = name;
  ctx.body = { ok: true };
});

module.exports = rest.router;
