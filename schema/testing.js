// const authorizedOnly = require('../util/auth');
const { APIError, assert } = require('../util/error');
const Category = require('../models/category');
const Test = require('../models/test');
const Question = require('../models/question');
const Progress = require('../models/progress');
const Answer = require('../models/answer');

module.exports = (fastify, opts, next) => {
  fastify.get('/categories', async () => {
    const categories = await Category.query();
    return { categories };
  });
  fastify.get('/questions', async ({ query }) => {
    const questions = await Question.query().where({ test_id: query.test_id }).eager('answers');
    return { questions };
  });
  fastify.get('/tests', async ({ query }) => {
    const tests = await Test.query().where({ category_id: query.category_id }).eager('questions');
    return { tests };
  });
  fastify.get('/result', async ({ query, session }) => {
    const [test] = await Test.query().where({ id: query.test_id });
    return { result: test.getUserResult(session.userid) };
  });
  fastify.post('/answer', async ({ body, session }) => {
    const [question] = await Question.query().where({ id: body.question_id });
    assert(
      await question.validateAnswers(body.answer_ids),
      new APIError(400, 'Some of the answers is invalid')
    );
    const rows = body.answer_ids.map(id => ({ user_id: session.userid, answer_id: id }));
    await Progress.query().insertGraph(rows);
    return { answer: 'Ok' };
  });

  fastify.post('/categories/add', async ({ body }) => {
    const [categories] = await Category.query().where({ name: body.name });
    assert(!categories, new APIError(400, 'Not added category'));
    await Category.query().insert({ name: body.name });
    return { ok: true };
  });
  fastify.post('/questions/add', async ({ body }) => {
    const [verifyTest] = await Test.query().where({ id: body.test_id });
    assert(verifyTest, new APIError(400, 'Requested test does not exist'));
    await Question.query().insert({ text: body.text, test_id: body.test_id });
    return { ok: true };
  });
  fastify.post('/tests/add', async ({ body }) => {
    const [verifyCategory] = await Category.query().where({ id: body.category_id });
    assert(verifyCategory, new APIError(400, 'Requested category does not exist'));
    await Test.query().insert({ name: body.name, category_id: body.category_id });
    return { ok: true };
  });
  fastify.post('/answers/add', async ({ body }) => {
    const [verifyQuestion] = await Question.query().where({ id: body.question_id });
    assert(verifyQuestion, new APIError(400, 'Requested question does not exist'));
    await Answer.query().insert({
      text: body.text,
      correct: body.correct,
      question_id: body.question_id
    });
    return { ok: true };
  });

  fastify.post('/categories/edit', async ({ body }) => {
    const [categories] = await Category.query().where({ id: body.id });
    assert(categories, new APIError(400, 'Requested category does not exist'));
    await Category.query().where({ id: body.id }).update({ name: body.name });
    return { ok: true };
  });
  fastify.post('/questions/edit', async ({ body }) => {
    const [questions] = await Question.query().where({ id: body.id });
    assert(questions, new APIError(400, 'Requested question does not exist'));
    await Question.query().where({ id: body.id }).update({ text: body.text });
    return { ok: true };
  });
  fastify.post('/tests/edit', async ({ body }) => {
    const [tests] = await Test.query().where({ id: body.id });
    assert(tests, new APIError(400, 'Requested test does not exist'));
    await Test.query().where({ id: body.id }).update({ name: body.name });
    return { ok: true };
  });
  fastify.post('/answers/edit', async ({ body }) => {
    const [verifyAnswer] = await Answer.query().where({ id: body.id });
    assert(verifyAnswer, new APIError(400, 'Requested answer does not exist'));
    await Answer.query().where({ id: body.id }).update({ text: body.text, correct: body.correct });
    return { ok: true };
  });

  fastify.post('/categories/del', async ({ body }) => {
    const [categories] = await Category.query().where({ id: body.id });
    assert(categories, new APIError(400, 'Requested category does not exist'));
    await Category.query().delete().where({ id: body.id });
    return { ok: true };
  });
  fastify.post('/questions/del', async ({ body }) => {
    const [questions] = await Question.query().where({ id: body.id });
    assert(questions, new APIError(400, 'Requested question does not exist'));
    await Question.query().delete().where({ id: body.id });
    return { ok: true };
  });
  fastify.post('/tests/del', async ({ body }) => {
    const [tests] = await Test.query().where({ id: body.id });
    assert(tests, new APIError(400, 'Requested test does not exist'));
    await Test.query().delete().where({ id: body.id });
    return { ok: true };
  });
  next();
};
