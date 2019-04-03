const { Model } = require('objection');

module.exports = class extends Model {
  static get tableName() {
    return 'answer';
  }
};
