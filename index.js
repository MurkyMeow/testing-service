const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Model } = require('objection');
const knex = require('knex');
const env = require('./env');
const config = require('./knexfile');
const auth = require('./schema/auth');

Model.knex(knex(config.development));

const modules = [
  auth
].reduce((acc, el) => ({
  schema: acc.schema + el.typeDefs,
  rootValue: { ...acc.typeDefs, ...el.resolvers }
}), { schema: '', rootValue: {} });

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
app.use('/', graphqlHTTP(req => ({
  schema: buildSchema(modules.schema),
  rootValue: modules.rootValue,
  context: { req },
  graphiql: true
})));
app.listen(4000, () =>
  console.log('🚀 Server ready at http://localhost:4000'));
