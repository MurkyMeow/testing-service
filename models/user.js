const { Model } = require('objection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../env');
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
    const { id } = this.query().insert({ email, password: hash });
    assert(id, new APIError(500, ''));
  }

  static async singin(email, password) {
    const [user] = await this.query().where({ email });
    assert(user && bcrypt.compareSync(password, user.password), new APIError(400, 'Invalid login'));
    const token = jwt.sign({ id: user.id }, env.secret, { expiresIn: '24h' });
    return token;
  }
};
