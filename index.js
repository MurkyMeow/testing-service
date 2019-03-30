const { ApolloServer } = require('apollo-server');
const auth = require('./schema/auth');

new ApolloServer({
  context: ({ req }) => ({ headers: req.headers }),
  modules: [
    auth
  ]
})
  .listen()
  .then(({ url }) => console.log(url));
