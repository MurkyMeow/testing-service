const { Model } = require('objection');
const Answer = require('./answer');

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
      }
    };
  }
};
