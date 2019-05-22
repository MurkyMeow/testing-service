const { Model } = require('objection');

module.exports = class extends Model {
  static get tableName() {
    return 'test';
  }

  static get relationMappings() {
    const Question = require('./question');
    const Category = require('./category');
    const User = require('./user');
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'test.creator_id',
          to: 'user.id'
        }
      },
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
