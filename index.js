const { ApolloServer } = require('apollo-server');
const test = require('./schema/auth');

new ApolloServer({
  modules: [
    test
  ]
})
  .listen()
  .then(({ url }) => console.log(url));
