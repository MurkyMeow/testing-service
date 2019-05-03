const Category = require('../models/category');
const Test = require('../models/test');
const Question = require('../models/question');
const Progress = require('../models/progress');
const { Rest } = require('../util/server');

const rest = Rest('/test');
rest.register('/categories', Category);
rest.register('/questions', Question, {
  get: {
    where: query => ({ test_id: query.test_id }),
  },
  put: {
    verify: async body => {
      const items = await Test.query().where({ id: body.test_id });
      return items.length > 0;
    },
  },
});
rest.register('/tests', Test, {
  get: {
    where: query => ({ category_id: query.category_id }),
  },
});
rest.router.get('/result', async ctx => {
  const [test] = await Test.query().where({ id: ctx.query.test_id });
  ctx.body = { result: test.getUserResult(ctx.session.user.id) };
});
rest.router.post('/answer', async ctx => {
  const { answer_ids } = ctx.query;
  const [question] = await Question.query().where({ id: ctx.query.question_id });
  ctx.assert(await question.validateAnswers(answer_ids), 400, 'Some of the answers are invalid');
  const rows = answer_ids.map(id => ({ user_id: ctx.session.user.id, answer_id: id }));
  await Progress.query().insertGraph(rows);
  ctx.body = { answer: 'Ok' };
});

module.exports = rest.router;
