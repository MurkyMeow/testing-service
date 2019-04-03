const { Model } = require('objection');
const Question = require('./question');

module.exports = class extends Model {
  static get tableName() {
    return 'test';
  }

  static get relationMappings() {
    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: 'test.id',
          to: 'questions.test_id'
        }
      }
    };
  }
};
