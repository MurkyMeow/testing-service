const Fastify = require('fastify');
const cors = require('fastify-cors')
const session = require('fastify-session');
const cookie = require('fastify-cookie');
const { Model } = require('objection');
const knex = require('knex');
const env = require('./env');
const config = require('./knexfile');
const auth = require('./schema/auth');
const testing = require('./schema/testing');

Model.knex(knex(config.development));

const fastify = Fastify();
fastify.register(cors);
fastify.register(cookie);
fastify.register(session, { secret: env.secret });

fastify.register(auth, { prefix: '/auth' });
fastify.register(testing, { prefix: '/test' });

fastify.setNotFoundHandler((req, reply) => reply.status(404).send('Not found'));
fastify
  .listen(4000)
  .then(() => console.log('running on http://localhost:4000'));
