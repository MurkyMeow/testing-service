const jwt = require('jsonwebtoken');
const env = require('../env');

const authorizedOnly = resolver => (root, args, context) => {
  const { token } = context.headers;
  if (jwt.verufy(token, env.secret)) {
    return resolver(root, args, context);
  } throw new Error('Frobidden');
};

module.exports = authorizedOnly;
