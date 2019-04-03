const { Model } = require('objection');
const Answer = require('./answer');
const Test = require('./test');

module.exports = class extends Model {
  static get tableName() {
    return 'question';
  }

  static get relationMappings() {
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
