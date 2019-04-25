// const authorizedOnly = require('../util/auth');
const { APIError, assert } = require('../util/error');
const Category = require('../models/category');
const Test = require('../models/test');
const Question = require('../models/question');
const Progress = require('../models/progress');

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

  fastify.post('/categories/add', async ({ body, session }) => {
    const [categories] = await Category.query().where({ name: body.name });
    assert(!categories, new APIError(400, 'Not added test'));
    await Category.query().insert({ name: body.name });
    return 'OK';
  });
  fastify.post('/questions/add', async ({ body, session }) => {
    const [questions] = await Question.query().where({ text: body.text });
    assert(!questions, new APIError(400, 'Not added question'));
    await Question.query().insert({ text: body.text, test_id: body.test_id });
    return 'OK';
  });

  fastify.post('/categories/edit', async ({ body, session }) => {
    const [categories] = await Category.query().where({ id: body.id });
    assert(categories, new APIError(400, 'Not edit test'));
    await Category.query().where({ id: body.id }).update({ name: body.name });
    return 'OK';
  });

  fastify.post('/categories/del', async ({ body, session }) => {
    const [categories] = await Category.query().where({ id: body.id });
    assert(categories, new APIError(400, 'Not deleted test'));
    await Category.query().delete().where({ id: body.id });
    return 'OK';
  });


  next();
};
