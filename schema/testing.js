// const authorizedOnly = require('../util/auth');
const router = require('koa-joi-router');
const { APIError, assert } = require('../util/error');
const Category = require('../models/category');
const Test = require('../models/test');
const Question = require('../models/question');
const Progress = require('../models/progress');

const testing = router();

testing.get('/categories', async ctx => {
  const categories = await Category.query();
  ctx.body = categories;
});
testing.get('/questions', async ctx => {
  const questions = await Question.query().where({ test_id: ctx.query.test_id }).eager('answers');
  ctx.body = questions;
});
testing.get('/tests', async ctx => {
  const tests = await Test.query().where({ category_id: ctx.query.category_id }).eager('questions');
  ctx.body = tests;
});
testing.get('/result', async ctx => {
  const [test] = await Test.query().where({ id: ctx.query.test_id });
  ctx.body = { result: test.getUserResult(ctx.session.userid) };
});
testing.post('/answer', async ctx => {
  const { answer_ids } = ctx.query;
  const [question] = await Question.query().where({ id: ctx.query.question_id });
  assert(
    await question.validateAnswers(answer_ids),
    new APIError(400, 'Some of the answers is invalid')
  );
  const rows = answer_ids.map(id => ({ user_id: ctx.session.userid, answer_id: id }));
  await Progress.query().insertGraph(rows);
  ctx.body = { answer: 'Ok' };
});

testing.prefix('/test');

module.exports = testing;
