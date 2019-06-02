const { Model } = require('objection');
const Conclusion = require('./conclusion');

module.exports = class extends Model {
  static get tableName() {
    return 'result';
  }

  static get schema() {
    return {
      score: {
        access: 'any',
      },
    };
  }

  async $afterGet() {
    if (this.test_id || this.test) {
      const test_id = this.test_id || this.test.id;
      const [conclusion] = await Conclusion.query()
        .where({ test_id })
        .where('min_score', '<=', this.score)
        .orderBy('min_score', 'DESC');
      this.conclusion = conclusion ? conclusion.text : '';
    } else {
      this.conclusion = '';
    }
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
