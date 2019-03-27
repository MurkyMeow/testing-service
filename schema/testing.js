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

    type Answer {
      id: Int
      question_id: Int
      text: String
      flag: Boolean
    }

    extend type Query {
      category: [Category]
      tests: [Test]
      questions(test_id: Int): [Question]
      answers(question_id: Int): [Answer]
      test(id: Int): Test
    }
    `,
  resolvers: {
    Query: {
      category: authorizedOnly(async () => {
        const category = await db('Category');
        assert(category.length, new APIError(400, 'Category not found'));
        return category;
      }),
      tests: authorizedOnly(async () => {
        const tests = await db('Tests');
        assert(tests.length, new APIError(400, 'Tests not found'));
        return tests;
      }),
      answers: authorizedOnly(async (_, { question_id }) => {
        const answers = await db('Answers').where({ question_id });
        assert(answers.length, new APIError(400, 'Answers not found'));
        console.log(answers);
        return answers;
      }),
      test: authorizedOnly(async (_, { id }) => {
        const [test] = await db('Tests').where({ id });
        return test;
      })
    },
    Test: {
      questions: authorizedOnly(async ({ id }) => {
        const questions = await db('Questions').where({ id });
        assert(questions.length, new APIError(400, 'Questions not found'));
        return questions;
      })
    }
  }
};
