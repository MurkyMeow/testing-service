const { ApolloServer } = require('apollo-server');
const test = require('./schema/auth');

new ApolloServer({
  context: ({ req }) => ({ headers: req.headers }),
  modules: [
    test
  ]
})
  .listen()
  .then(({ url }) => console.log(url));
