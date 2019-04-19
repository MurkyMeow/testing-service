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
  fastify.get('/questions', async ({ test_id }, res) => {
    const questions = await Question.query().where({ test_id }).eager('answers');
    res.json({ questions });
  });
  fastify.get('/tests', async ({ category_id }, res) => {
    const tests = await Test.query().where({ category_id }).eager('questions');
    res.json({ tests });
  });
  fastify.get('/result', async ({ test_id, session }, res) => {
    const [test] = await Test.query().where({ id: test_id });
    res.json({ result: test.getUserResult(session.userid) });
  });
  fastify.post('/answer', async ({ question_id, answer_ids, session }, res) => {
    const [question] = await Question.query().where({ id: question_id });
    assert(
      await question.validateAnswers(answer_ids),
      new APIError(400, 'Some of the answers is invalid')
    );
    const rows = answer_ids.map(id => ({ user_id: session.userid, answer_id: id }));
    await Progress.query().insertGraph(rows);
    res.send('Ok');
  });
  next();
};
