const { Model } = require('objection');
const Conclusion = require('./conclusion');

module.exports = class extends Model {
  static get tableName() {
    return 'result';
  }

  get conclusion() {
    return Conclusion.query().where('min_score', '<', this.score).max('min_score');
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
      },
    };
  }
};
