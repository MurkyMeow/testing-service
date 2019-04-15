const { Model } = require('objection');
const Progress = require('./progress');

module.exports = class extends Model {
  static get tableName() {
    return 'test';
  }

  async getUserResult(user_id) {
    const questions = await this.$relatedQuery('questions')
      .eager('answers')
      .modifyEager('answers', builder => builder.where({ correct: 1 }));
    const rightAnswers = questions.reduce((acc, el) => [...acc, ...el.answers], []);
    const userAnswers = await Progress.query().where({ user_id });
    const correctAmount = rightAnswers
      .reduce((acc, el) => (userAnswers.find(x => x.id === el.id) ? acc + 1 : acc), 0);
    return correctAmount / rightAnswers.length;
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
