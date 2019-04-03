const { Model } = require('objection');
const Test = require('./test');

module.exports = class extends Model {
  static get tableName() {
    return 'category';
  }

  static get relationMappings() {
    return {
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
