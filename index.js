const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

const app = express();

const types = mergeTypes(fileLoader(`${__dirname}/schema/*.gql`), { all: true });
const resolvers = mergeResolvers(fileLoader(`${__dirname}/schema/*.js`));

app.use('/api', graphqlHTTP({
  schema: buildSchema(types),
  rootValue: resolvers,
  graphiql: true
}));

// eslint-disable-next-line no-console
app.listen(3000, () => console.log('🚀 http://localhost:3000'));
