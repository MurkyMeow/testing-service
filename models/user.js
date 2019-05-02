const { Model } = require('objection');
const bcrypt = require('bcryptjs');
const Answer = require('./answer');

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
