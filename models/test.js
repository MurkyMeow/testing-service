const { Model } = require('objection');
const Question = require('./question');

module.exports = class extends Model {
  static get tableName() {
    return 'test';
  }

  static get schema() {
    return {
      name: {
        access: 'any',
      },
    };
  }

  async $afterGet() {
    const rightAnswers = Question.relatedQuery('answers')
      .where({ correct: true })
      .count()
      .as('maxScore');
    const answers = await Question.query()
      .where({ test_id: this.id })
      .select(rightAnswers);
    this.maxScore = answers.reduce((acc, el) => acc + Number(el.maxScore), 0);
  }

  static get relationMappings() {
    const Conclusion = require('./conclusion');
    const Category = require('./category');
    const Result = require('./result');
    const User = require('./user');
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'test.creator_id',
          to: 'user.id'
        }
      },
      conclusions: {
        relation: Model.HasManyRelation,
        modelClass: Conclusion,
        join: {
          from: 'test.id',
          to: 'conclusion.test_id'
        }
      },
      results: {
        relation: Model.HasManyRelation,
        modelClass: Result,
        join: {
          from: 'test.id',
          to: 'result.test_id'
        }
      },
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: 'test.id',
          to: 'question.test_id'
        }
      },
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'test.category_id',
          to: 'category.id'
        }
      }
    };
  }
};
