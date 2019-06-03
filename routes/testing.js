const Category = require('../models/category');
const Test = require('../models/test');
const Question = require('../models/question');
const Result = require('../models/result');
const Conclusion = require('../models/conclusion');
const { Rest } = require('../util/server');

const rest = Rest('/test');

rest.register('/categories', Category, {
  put: {
    verify: async ctx => {
      const { name } = ctx.request.body;
      ctx.assert(name, 400, 'Category should have a name');
      return true;
    },
  }
});

rest.register('/questions', Question, {
  put: {
    verify: async ctx => {
      const items = await Test.query().where({ id: ctx.request.body.test_id });
      return items.length > 0;
    },
  },
});

rest.register('/tests', Test, {
  patch: {
    verify: async ctx => {
      const { name, questions = [] } = ctx.request.body;
      ctx.assert(name, 400, 'Test should have a name');
      ctx.assert(questions.length, 400, 'Test cant be empty');
      ctx.assert(questions.every(x => x.text), 400, 'Every question should have a text');
      ctx.assert(questions.every(x => x.answers.every(ans => ans.text)), 400, 'Every answer should have a text');
      ctx.assert(questions.every(x => x.answers.some(ans => ans.correct)), 400, 'Every question should have at least one correct answer');
      return true;
    }
  },
});

rest.router.get('/result', async ctx => {
  const { test_id } = ctx.request.query;
  const test = await Test.query().findById(test_id)
    .eager('results')
    .modifyEager('results', m => {
      m.findOne({ user_id: ctx.session.user.id });
    });
  const [result] = test.results;
  ctx.body = {
    score: result.score,
    maxScore: test.maxScore,
    conclusion: result.conclusion,
  };
});

rest.router.patch('/result', async ctx => {
  const { test_id, conclusions } = ctx.request.body;
  ctx.assert(test_id, 400, 'Dont forget to specify test_id!');
  ctx.assert(Array.isArray(conclusions), 400, 'Conclusions should be an array');
  ctx.assert(conclusions.every(x => x.min_score >= 0), 400, 'Min score should be a positive number');
  ctx.assert(conclusions.every(x => x.text), 400, 'Every result should have a text');

  const unique = new Set(conclusions.map(x => Number(x.min_score)));
  ctx.assert(unique.size === conclusions.length, 400, 'You can not have conclusions with similar score');

  await Conclusion.query()
    .whereNotIn('id', conclusions.map(x => x.id).filter(x => x))
    .andWhere({ test_id })
    .del();
  await Conclusion.query()
    .where({ test_id })
    .upsertGraph(conclusions.map(x => ({ ...x, test_id })));

  ctx.body = { ok: true };
});

rest.router.post('/answer', async ctx => {
  const { testId, answers } = ctx.request.body;
  const questions = await Question.query()
    .where({ test_id: testId })
    .eager('answers')
    .modifyEager('answers', m => m.where({ correct: true }));
  const correct = new Set();
  const incorrect = new Set();
  for (const [questionId, answerIds] of Object.entries(answers)) {
    const question = questions.find(x => x.id === Number(questionId));
    for (const id of answerIds) {
      if (question.answers.find(x => x.id === id)) correct.add(id);
      else incorrect.add(id);
    }
  }
  const score = Math.max(correct.size - incorrect.size, 0);
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
