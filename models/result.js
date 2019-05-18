const { Model } = require('objection');

module.exports = class extends Model {
  static get tableName() {
    return 'result';
  }

  static get relationMappings() {
    const User = require('./user');
    const Test = require('./test');
    return {
      user: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'result.user_id',
          to: 'user.id',
        },
      },
      test: {
        relation: Model.BelongsToOneRelation,
        modelClass: Test,
        join: {
          from: 'result.test_id',
          to: 'test.id'
        }
      }
    };
  }
};
