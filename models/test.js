const { Model } = require('objection');

module.exports = class extends Model {
  static get tableName() {
    return 'test';
  }

  static get relationMappings() {
    const Question = require('./question');
    const Category = require('./category');
    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: 'test.id',
          to: 'question.test_id'
        }
      },
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'test.category_id',
          to: 'category.id'
        }
      }
    };
  }
};
