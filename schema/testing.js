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
  next();
};
