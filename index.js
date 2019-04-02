const { ApolloServer } = require('apollo-server');
const { Model } = require('objection');
const knex = require('./knexfile');
const auth = require('./schema/auth');

Model.knex(knex);

new ApolloServer({
  context: ({ req }) => ({ headers: req.headers }),
  modules: [
    auth
  ]
})
  .listen()
  .then(({ url }) => console.log(url));
