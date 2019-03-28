const jwt = require('jsonwebtoken');
const env = require('../env');
const { APIError } = require('./error');

const authorizedOnly = resolver => (root, args, context) => {
  const { token } = context.headers;
  try {
    const { id } = jwt.verify(token, env.secret);
    return resolver(root, args, { ...context, userid: id });
  } catch (err) {
    throw new APIError(403, 'Access denied');
  }
};

module.exports = authorizedOnly;
