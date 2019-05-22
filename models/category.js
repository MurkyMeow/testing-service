const { Model } = require('objection');

module.exports = class extends Model {
  static get tableName() {
    return 'category';
  }

  static get schema() {
    return {
      name: {
        access: 'any',
      },
    };
  }

  static get relationMappings() {
    const Test = require('./test');
    const User = require('./user');
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'category.creator_id',
          to: 'user.id'
        }
      },
      tests: {
        relation: Model.HasManyRelation,
        modelClass: Test,
        join: {
          from: 'category.id',
          to: 'test.category_id'
        }
      }
    };
  }
};
