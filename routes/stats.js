const { Rest } = require('../util/server');
const { guard } = require('../util/server');
const { makeQuery } = require('../util/parser');
const Result = require('../models/result');
const User = require('../models/user');

const rest = Rest('/stats');

rest.router.get('/tests', async ctx => {
  const userId = ctx.request.query.userId || ctx.session.user.id;
  ctx.body = await Result.query().where({ user_id: userId }).eager('test');
});

rest.router.get('/profile', async ctx => {
  const userid = ctx.session.user && ctx.session.user.id;
  const id = Number(ctx.request.query.id) || userid;
  const fields = `
    name,
    tests(
      name
      ${id === userid ? ',results(score,user(name))' : ''}
    ),
    results(
      score,
      test(name)
    )
  `;
  const profile = await makeQuery(ctx, User, fields).findById(id);
  ctx.assert(profile, 404, 'Requested profile does not exist');
  ctx.body = profile;
});

rest.router.use(guard());

rest.router.get('/profiles', async ctx => {
  ctx.assert(ctx.session.user.role === 'admin', 403);
  const { role = '' } = ctx.request.query;
  ctx.body = await makeQuery(ctx, User, 'name').where({ role });
});

rest.router.post('/assign', async ctx => {
  ctx.assert(ctx.session.user.role === 'admin', 403);
  const { id, role } = ctx.request.body;
  const notSelf = Number(id) !== ctx.session.user.id;
  ctx.assert(notSelf, 400, 'Cant change your own role');
  const user = await makeQuery(ctx, User, 'name').findById(id);
  ctx.assert(user, 404);
  await user.$query().update({ role });
  ctx.body = user;
});

rest.router.post('/name', async ctx => {
  const { name } = ctx.request.body;
  await User.query()
    .findById(ctx.session.user.id)
    .update({ name });
  ctx.session.user.name = name;
  ctx.body = { ok: true };
});

module.exports = rest.router;
