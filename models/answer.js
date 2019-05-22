const { Model } = require('objection');
const Question = require('./question');

module.exports = class extends Model {
  static get tableName() {
    return 'answer';
  }

  static get schema() {
    return {
      text: {
        access: 'any',
      },
      correct: {
        access: 'creator',
      },
    };
  }

  static get relationMappings() {
    return {
      question: {
        relation: Model.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'answer.question_id',
          to: 'question.id'
        }
      }
    };
  }
};
