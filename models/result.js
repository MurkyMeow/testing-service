const { Model } = require('objection');
const Conclusion = require('./conclusion');

module.exports = class extends Model {
  static get tableName() {
    return 'result';
  }

  async conclusion() {
    const items = await Conclusion.query().where('min_score', '<', this.score);
    const [conclusion] = items.sort((a, b) => b.min_score - a.min_score);
    return conclusion ? conclusion.text : '';
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
