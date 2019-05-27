const { Rest } = require('../util/server');
const { guard } = require('../util/server');
const Result = require('../models/result');
const User = require('../models/user');

const rest = Rest('/stats');

rest.router.get('/tests', async ctx => {
  const userId = ctx.request.query.userId || ctx.session.user.id;
  ctx.body = await Result.query().where({ user_id: userId }).eager('test');
});

rest.router.get('/profile', async ctx => {
  const id = ctx.request.query.id || ctx.session.user.id;
  const profile = await User.query()
    .findById(id)
    .eager('[tests, results.test]');
  if (!profile) ctx.throw(404, 'Requested profile does not exist');
  // TODO: this is hacky, refactor somehow?
  for (const result of profile.results) {
    result.conclusion = await result.conclusion();
    result.maxScore = await result.test.maxScore();
  }
  ctx.body = profile;
});

rest.router.use(guard());

rest.router.post('/name', async ctx => {
  const { name } = ctx.request.body;
  await User.query()
    .findById(ctx.session.user.id)
    .update({ name });
  ctx.session.user.name = name;
  ctx.body = { ok: true };
});

module.exports = rest.router;
