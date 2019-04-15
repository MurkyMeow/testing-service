const { Model } = require('objection');

module.exports = class extends Model {
  static get tableName() {
    return 'question';
  }

  async validateAnswers(ids) {
    const questionAnswers = await this.$relatedQuery('answers');
    return ids.every(id => questionAnswers.find(x => x.id === id));
  }

  static get relationMappings() {
    const Answer = require('./answer');
    const Test = require('./test');
    return {
      answers: {
        relation: Model.HasManyRelation,
        modelClass: Answer,
        join: {
          from: 'question.id',
          to: 'answer.question_id'
        }
      },
      test: {
        relation: Model.BelongsToOneRelation,
        modelClass: Test,
        join: {
          from: 'question.test_id',
          to: 'test.id'
        }
      }
    };
  }
};
