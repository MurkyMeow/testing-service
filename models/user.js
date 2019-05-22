const { Model } = require('objection');
const bcrypt = require('bcryptjs');

module.exports = class extends Model {
  static get tableName() {
    return 'user';
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

  static async signup(email, password) {
    const [user] = await this.query().where({ email });
    if (user) throw Error('That email is busy');
    const hash = bcrypt.hashSync(password, 8);
    const { id } = await this.query().insert({ email, password: hash });
    return id;
  }

  static async signin(email, password) {
    const [user] = await this.query().where({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) return null;
    return user;
  }
};
