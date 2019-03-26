const jwt = require('jsonwebtoken');
const env = require('../env');

const authorizedOnly = resolver => (root, args, context) => {
  const { token } = context.headers;
  if (jwt.verify(token, env.secret)) {
    return resolver(root, args, context);
  }
  throw new Error('Access denied');
};

module.exports = authorizedOnly;
