module.exports.assert = (cond, error) => {
  if (!cond) throw error;
};

module.exports.APIError = class extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
};
