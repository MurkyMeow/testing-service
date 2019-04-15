const { Model } = require('objection');
const User = require('./user');
const Answer = require('./answer');

module.exports = class extends Model {
  static get tableName() {
    return 'progress';
  }

  static get relationMappings() {
    return {
      answers: {
        relation: Model.HasManyRelation,
        classModel: Answer,
        join: {
          from: 'progress.answer_id',
          to: 'answer.id'
        }
      },
      users: {
        relation: Model.HasManyRelation,
        classModel: User,
        join: {
          from: 'progress.user_id',
          to: 'user.id'
        }
      }
    };
  }
};
