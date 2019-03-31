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
      tests: [Test]
      questions(test_id: Int): [Question]
      test(id: Int): Test
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
      tests: authorizedOnly(async () => {
        const tests = await db('Tests');
        assert(tests.length, new APIError(400, 'Tests not found'));
        return tests;
      }),
      test: authorizedOnly(async (_, { id }) => {
        const [test] = await db('Tests').where({ id });
        return test;
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
