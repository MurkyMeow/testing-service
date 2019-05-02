// const authorizedOnly = require('../util/auth');
const router = require('koa-joi-router');
const { APIError, assert } = require('../util/error');
const Category = require('../models/category');
const Test = require('../models/test');
const Question = require('../models/question');
const Progress = require('../models/progress');
const Answer = require('../models/answer');

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
testing.post('/categories/add', async ctx => {
  const { name } = ctx.request.body;
  const [categories] = await Category.query().where({ name });
  assert(!categories, new APIError(400, 'Not added category'));
  await Category.query().insert({ name });
  ctx.body = { ok: true };
});
testing.post('/questions/add', async ctx => {
  const { test_id, text } = ctx.request.body;
  const [verifyTest] = await Test.query().where({ id: test_id });
  assert(verifyTest, new APIError(400, 'Requested test does not exist'));
  await Question.query().insert({ text: text, test_id: test_id });
  ctx.body = { ok: true };
});
testing.post('/tests/add', async ctx => {
  const { category_id, name } = ctx.request.body;
  const [verifyCategory] = await Category.query().where({ id: category_id });
  assert(verifyCategory, new APIError(400, 'Requested category does not exist'));
  await Test.query().insert({ name: name, category_id: category_id });
  ctx.body = { ok: true };
});
testing.post('/answers/add', async ctx => {
  const { question_id, text, correct } = ctx.request.body;
  const [verifyQuestion] = await Question.query().where({ id: question_id });
  assert(verifyQuestion, new APIError(400, 'Requested question does not exist'));
  await Answer.query().insert({
    text: text,
    correct: correct,
    question_id: question_id
  });
  ctx.body = { ok: true };
});
testing.post('/categories/edit', async ctx => {
  const { id, name } = ctx.request.body;
  const [categories] = await Category.query().where({ id });
  assert(categories, new APIError(400, 'Requested category does not exist'));
  await Category.query().where({ id }).update({ name });
  ctx.body = { ok: true };
});
testing.post('/questions/edit', async ctx => {
  const { id, text } = ctx.request.body;
  const [questions] = await Question.query().where({ id });
  assert(questions, new APIError(400, 'Requested question does not exist'));
  await Question.query().where({ id }).update({ text });
  ctx.body = { ok: true };
});
testing.post('/tests/edit', async ctx => {
  const { id, name } = ctx.request.body;
  const [tests] = await Test.query().where({ id });
  assert(tests, new APIError(400, 'Requested test does not exist'));
  await Test.query().where({ id: id }).update({ name });
  ctx.body = { ok: true };
});
testing.post('/answers/edit', async ctx => {
  const { id, correct, text } = ctx.request.body;
  const [verifyAnswer] = await Answer.query().where({ id });
  assert(verifyAnswer, new APIError(400, 'Requested answer does not exist'));
  await Answer.query().where({ id }).update({ text: text, correct: correct });
  ctx.body = { ok: true };
});
testing.post('/categories/del', async ctx => {
  const { id } = ctx.request.body;
  const [categories] = await Category.query().where({ id });
  assert(categories, new APIError(400, 'Requested category does not exist'));
  await Category.query().delete().where({ id });
  ctx.body = { ok: true };
});
testing.post('/questions/del', async ctx => {
  const { id } = ctx.request.body;
  const [questions] = await Question.query().where({ id });
  assert(questions, new APIError(400, 'Requested question does not exist'));
  await Question.query().delete().where({ id });
  ctx.body = { ok: true };
});
testing.post('/tests/del', async ctx => {
  const { id } = ctx.request.body;
  const [tests] = await Test.query().where({ id });
  assert(tests, new APIError(400, 'Requested test does not exist'));
  await Test.query().delete().where({ id });
  ctx.body = { ok: true };
});
testing.post('/answers/del', async ctx => {
  const { id } = ctx.request.body;
  const [verifyAnswer] = await Answer.query().where({ id });
  assert(verifyAnswer, new APIError(400, 'Requested answer does not exist'));
  await Answer.query().delete().where({ id });
  ctx.body = { ok: true };
});

testing.prefix('/test');

module.exports = testing;
