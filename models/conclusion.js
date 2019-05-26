const { Model } = require('objection');

module.exports = class extends Model {
  static get tableName() {
    return 'conclusion';
  }

  static get schema() {
    return {
      text: {
        access: 'any',
      },
      min_score: {
        access: 'any',
      },
    };
  }

  static get relationMappings() {
    const Test = require('./test');
    const User = require('./user');
    return {
      test: {
        relation: Model.BelongsToOneRelation,
        modelClass: Test,
        join: {
          from: 'conclusion.test_id',
          to: 'test.id',
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'conclusion.user_id',
          to: 'user.id',
        }
      },
    };
  }
};
