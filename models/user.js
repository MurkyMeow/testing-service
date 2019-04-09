const { Model } = require('objection');
const bcrypt = require('bcryptjs');
const Answer = require('./answer');
const { APIError, assert } = require('../util/error');

module.exports = class extends Model {
  static get tableName() {
    return 'user';
  }

  static get relationMappings() {
    return {
      answers: {
        relation: Model.HasManyRelation,
        classModel: Answer,
        join: {
          from: 'user.id',
          to: 'answer.user_id'
        }
      }
    };
  }

  static async signup(email, password) {
    const [user] = await this.query().where({ email });
    assert(!user, new APIError(400, 'That email is busy'));
    const hash = bcrypt.hashSync(password, 8);
    const { id } = await this.query().insert({ email, password: hash });
    assert(id, new APIError(500, ''));
  }

  static async signin(email, password) {
    const [user] = await this.query().where({ email });
    assert(user && bcrypt.compareSync(password, user.password), new APIError(400, 'Invalid login'));
    return user.id;
  }
};
