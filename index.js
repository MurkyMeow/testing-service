const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Model } = require('objection');
const knex = require('knex');
const env = require('./env');
const config = require('./knexfile');
const auth = require('./schema/auth');
const testing = require('./schema/testing');

Model.knex(knex(config.development));

const server = new ApolloServer({
  context: ({ req }) => ({
    session: req.session
  }),
  modules: [
    auth,
    testing
  ]
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: env.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: true
  }
}));
server.applyMiddleware({ app });
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
