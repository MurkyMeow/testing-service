const { Model } = require('objection');

module.exports = class extends Model {
  static get tableName() {
    return 'user';
  }

  static get schema() {
    return {
      name: {
        access: 'any',
      },
      role: {
        access: 'any',
      },
    };
  }

  static get relationMappings() {
    const Test = require('./test');
    const Result = require('./result');
    return {
      tests: {
        relation: Model.HasManyRelation,
        modelClass: Test,
        join: {
          from: 'user.id',
          to: 'test.creator_id'
        }
      },
      results: {
        relation: Model.HasManyRelation,
        modelClass: Result,
        join: {
          from: 'user.id',
          to: 'result.user_id'
        }
      },
    };
  }
};
