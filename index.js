const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const session = require('express-session');
const { Model } = require('objection');
const knex = require('knex');
const env = require('./env');
const config = require('./knexfile');
const auth = require('./schema/auth');

Model.knex(knex(config.development));

const server = new ApolloServer({
  context: ({ req }) => ({
    session: req.session
  }),
  modules: [
    auth
  ]
});

const app = express();

app.use(session({
  secret: env.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true
  }
}));

server.applyMiddleware({ app });

app.listen(4000, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
