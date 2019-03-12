const knex = require('knex');
const env = require('./env');

const db = knex({
  client: 'mysql',
  connection: {
    host: env.host,
    user: env.user,
    password: env.passwrod,
    database: env.name
  }
});

module.exports = db;
