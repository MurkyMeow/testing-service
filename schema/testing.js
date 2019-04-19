const { gql } = require('apollo-server-express');
const authorizedOnly = require('../util/auth');
const { APIError, assert } = require('../util/error');
const Category = require('../models/category');
const Test = require('../models/test');
const Question = require('../models/question');
const Progress = require('../models/progress');

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

    type Mutation {
      answer(question_id: Int, answer_ids: [Int]): String
    }
  `,
  resolvers: {
    Query: {
      categories: authorizedOnly(async () => {
        const categories = await Category.query();
        return categories;
      }),
      tests: authorizedOnly(async (_, { category_id }) => {
        const tests = await Test.query().where({ category_id }).eager('questions');
        return tests;
      }),
      test: authorizedOnly(async (_, { id }) => {
        const [test] = await Test.query().where({ id }).eager('questions');
        return test;
      }),
      result: authorizedOnly(async (_, { test_id }, context) => {
        const [test] = await Test.query().where({ id: test_id });
        return test.getUserResult(context.userid);
      })
    },
    Mutation: {
      answer: authorizedOnly(async (_, { question_id, answer_ids }, context) => {
        const [question] = await Question.query().where({ id: question_id });
        assert(
          await question.validateAnswers(answer_ids),
          new APIError(400, 'Some of the answers is invalid')
        );
        const rows = answer_ids.map(id => ({ user_id: context.userid, answer_id: id }));
        await Progress.query().insertGraph(rows);
        return 'Ok';
      })
    }
  }
};
