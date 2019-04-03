const { gql } = require('apollo-server');
const authorizedOnly = require('../util/auth');
const db = require('../database');
const { APIError, assert } = require('../util/error');

module.exports = {
  typeDefs: gql`
    type Category {
      id: Int
      name: String
    }

    type Test {
      id: Int
      category_id: Int
      name: String
      questions: [Question]
    }

    type Question {
      id: Int
      test_id: Int
      text: String
    }

    extend type Query {
      categories: [Category]
      tests(category_id: Int): [Test]
      questions(test_id: Int): [Question]
      test(id: Int): Test
      result(test_id: Int): Float
    }

    extend type Mutation {
      answer(question_id: Int, answer_ids: [Int]): String
    }
    `,
  resolvers: {
    Query: {
      categories: authorizedOnly(async () => {
        const categories = await db('Category');
        assert(categories.length, new APIError(400, 'Category not found'));
        return categories;
      }),
      tests: authorizedOnly(async (_, { category_id }) => {
        const tests = await db('Tests').where({ category_id });
        assert(tests.length, new APIError(400, 'Tests not found'));
        return tests;
      }),
      test: authorizedOnly(async (_, { id }) => {
        const [test] = await db('Tests').where({ id });
        assert(test, new APIError(400, 'Test does not exist'));
        return test;
      }),
      result: authorizedOnly(async (_, { test_id }, context) => {
        const amount = await db('Answers')
          .innerJoin('Questions', 'Questions.id', '=', 'question_id')
          .innerJoin('Tests', 'Tests.id', '=', 'Questions.test_id')
          .where({ 'Questions.test_id': test_id, 'Answers.flag': 1 })
          .count('flag');
        console.log(amount);
        const answered = await db('Accounts_progress')
          .join('Answers', 'Answers.id', '=', 'Accounts_progress.answer_id')
          .join('Questions', 'Questions.id', '=', 'Accounts_progress.question_id')
          .where({ 'Accounts_progress.account_id': context.userid, 'Questions.test_id': test_id, 'Answers.flag': 1 })
          .countDistinct('Accounts_progress.answer_id');
        console.log(answered);
        console.log(answered[0]['count(distinct `Accounts_progress`.`answer_id`)']);
        console.log(amount[0]['count(`flag`)']);
        const precents = ((answered[0]['count(distinct `Accounts_progress`.`answer_id`)']) / (amount[0]['count(`flag`)']));
        console.log(precents);

        // const result = await db('Results').
        return precents;
      })
    },
    Test: {
      questions: authorizedOnly(async ({ id }) => {
        const questions = await db('Questions').where({ test_id: id });
        assert(questions.length, new APIError(400, 'Questions not found'));
        return questions;
      })
    },
    Mutation: {
      answer: authorizedOnly(async (_, { question_id, answer_ids }, context) => {
        const check = await db('Answers').whereIn('id', answer_ids).where({ question_id });
        assert(check.length === answer_ids.length, new APIError(400, 'No matching answer for this question'));
        const rows = answer_ids.map(id => ({
          account_id: context.userid,
          question_id,
          answer_id: id,
          time_answer: Date.now()
        }));
        await db('Accounts_progress').insert(rows);
        return 'OK';
      })
    }
  }
};
