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

  async maxScore() {
    const rightAnswers = Question.relatedQuery('answers')
      .where({ correct: true })
      .count()
      .as('maxScore');
    const data = await Question.query()
      .where({ test_id: this.id })
      .select(rightAnswers);
    return data ? data.reduce((acc, el) => acc + el.maxScore, 0) : null;
  }

  static get relationMappings() {
    const Conclusion = require('./conclusion');
    const Category = require('./category');
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
