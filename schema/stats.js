const { Rest } = require('../util/server');
const Result = require('../models/result');

const rest = Rest('/stats');
rest.router.get('/tests', async ctx => {
  const userId = ctx.request.query.userId || ctx.session.user.id;
  ctx.body = await Result.query().where({ user_id: userId }).eager('test');
});

module.exports = rest.router;
