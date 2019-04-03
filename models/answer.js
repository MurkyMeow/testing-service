const { Model } = require('objection');
const Test = require('./test');

module.exports = class extends Model {
  static get tableName() {
    return 'answer';
  }

  static get relationMappings() {
    return {
      test: {
        relation: Model.BelongsToOneRelation,
        modelClass: Test,
        join: {
          from: 'answer.test_id',
          to: 'test.id'
        }
      }
    };
  }
};
