import knex from 'knex';
import env from './env';

const db = knex({
  client: 'mysql',
  connection: {
    host: env.host,
    user: env.user,
    password: env.passwrod,
    database: env.name
  }
});

export default db;
