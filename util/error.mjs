export const assert = (cond, error) => {
  if (!cond) throw error;
};

export class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
