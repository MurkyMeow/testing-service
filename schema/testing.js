const Category = require('../models/category');
const Test = require('../models/test');
const Question = require('../models/question');
const Result = require('../models/result');
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
  const { test_id } = ctx.request.query;
  const [result] = await Result.query().where({ user_id: ctx.session.user.id, test_id });
  ctx.body = {
    score: result.score,
    conclusion: await result.conclusion()
  };
});
rest.router.post('/answer', async ctx => {
  const { testId, answers } = ctx.request.body;
  const questions = await Question.query()
    .where({ test_id: testId })
    .eager('answers');
  if (answers.length > questions.length) {
    ctx.throw('The amount of answers cant exceed questions number', 400);
  }
  const correct = new Set();
  for (const [questionId, answerId] of Object.entries(answers)) {
    const question = questions.find(x => x.id === Number(questionId));
    if (question.answers.find(x => x.id === answerId).correct) {
      correct.add(answerId);
    }
  }
  const score = correct.size / questions.length;
  const opts = { user_id: ctx.session.user.id, test_id: testId };
  const [result] = await Result.query().where(opts);
  if (result) {
    await Result.query().where({ id: result.id }).update({ score });
  } else {
    await Result.query().insert({ ...opts, score });
  }
  ctx.body = { score };
});

module.exports = rest.router;
