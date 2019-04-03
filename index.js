const { ApolloServer } = require('apollo-server');
const { Model } = require('objection');
const knex = require('knex');
const config = require('./knexfile');
const auth = require('./schema/auth');

Model.knex(knex(config.development));

new ApolloServer({
  context: ({ req }) => ({ headers: req.headers }),
  modules: [
    auth
  ]
})
  .listen()
  .then(({ url }) => console.log(url));
