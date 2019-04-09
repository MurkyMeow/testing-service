const { APIError, assert } = require('./error');

const authorizedOnly = resolver => (root, args, context) => {
  const { userid } = context.session;
  console.log(context.session);
  assert(userid, new APIError(403, 'Access denied'));
  return resolver(root, args, { ...context, userid });
};

module.exports = authorizedOnly;
